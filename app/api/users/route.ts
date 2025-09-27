import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/database-mock';
import { User } from '@/types';

// POST /api/users - Create or update a user
export async function POST(request: NextRequest) {
  try {
    const user: User = await request.json();

    // Validate input
    if (!user.uid || !user.email) {
      return NextResponse.json(
        { success: false, error: 'User ID and email are required' },
        { status: 400 }
      );
    }

    await UserService.createOrUpdateUser(user);

    return NextResponse.json({
      success: true,
      message: 'User created/updated successfully',
    });

  } catch (error) {
    console.error('Error creating/updating user:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// GET /api/users/[userId] - Get user by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await UserService.getUser(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

