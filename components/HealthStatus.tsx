'use client';

import { useState, useEffect } from 'react';

interface HealthData {
  status: string;
  services: {
    azureAI: {
      configured: boolean;
      status: string;
    };
    geminiAI: {
      configured: boolean;
      status: string;
    };
    database: {
      status: string;
    };
  };
}

export default function HealthStatus() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealth();
    // Refresh health status every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchHealth = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealth(data);
    } catch (error) {
      console.error('Error fetching health status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-600">Checking...</span>
      </div>
    );
  }

  if (!health) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
        <span className="text-sm text-red-600">Offline</span>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-400';
      case 'mock_mode':
        return 'bg-yellow-400';
      case 'not_configured':
        return 'bg-gray-400';
      default:
        return 'bg-red-400';
    }
  };

  const getStatusText = (service: string, status: string) => {
    switch (status) {
      case 'ready':
        return 'Ready';
      case 'mock_mode':
        return 'Mock';
      case 'not_configured':
        return 'Not configured';
      default:
        return 'Error';
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Overall Status */}
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${
          health.status === 'healthy' ? 'bg-green-400' : 'bg-red-400'
        }`}></div>
        <span className="text-sm text-gray-600">
          {health.status === 'healthy' ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* Service Status */}
      <div className="hidden md:flex items-center space-x-3 text-xs">
        <div className="flex items-center space-x-1">
          <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(health.services.azureAI.status)}`}></div>
          <span className="text-gray-500">Azure</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(health.services.geminiAI.status)}`}></div>
          <span className="text-gray-500">Gemini</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(health.services.database.status)}`}></div>
          <span className="text-gray-500">DB</span>
        </div>
      </div>

      {/* Detailed Status Tooltip */}
      <div className="relative group">
        <button className="text-gray-400 hover:text-gray-600 text-sm">
          ⓘ
        </button>
        <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          <div className="text-xs space-y-1">
            <div className="font-medium text-gray-700 mb-2">Service Status</div>
            <div className="flex justify-between">
              <span>Azure AI:</span>
              <span className={health.services.azureAI.configured ? 'text-green-600' : 'text-gray-500'}>
                {getStatusText('azureAI', health.services.azureAI.status)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Gemini AI:</span>
              <span className={health.services.geminiAI.configured ? 'text-green-600' : 'text-gray-500'}>
                {getStatusText('geminiAI', health.services.geminiAI.status)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Database:</span>
              <span className="text-green-600">
                {getStatusText('database', health.services.database.status)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

