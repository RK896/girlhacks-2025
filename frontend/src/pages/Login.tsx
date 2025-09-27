import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    // Client-side validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        
        // Store token and user data
        localStorage.setItem('athena_token', data.data.token);
        localStorage.setItem('athena_user', JSON.stringify(data.data.user));
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          navigate('/journal');
        }, 2000);
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Unable to connect to Athena\'s Oracle. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-bg to-marble-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="font-athena text-4xl font-bold wisdom-text mb-2">
              🏛️ Athena's Journal
            </h1>
          </Link>
          <p className="divine-text font-athena text-lg">
            Enter the Oracle's Chamber
          </p>
        </div>

        {/* Login Form */}
        <Card className="temple-column">
          <CardHeader>
            <CardTitle className="font-athena text-2xl text-center wisdom-text">
              Welcome Back, Seeker
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Sign in to access your wisdom archive
            </p>
          </CardHeader>
          
          <CardContent>
            {/* Error Alert */}
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                variant="oracle" 
                size="lg" 
                className="w-full text-lg py-6"
                disabled={loading}
              >
                {loading ? "Entering..." : "Enter the Oracle"}
              </Button>
            </form>

            <div className="mt-8 text-center space-y-4">
              <p className="text-muted-foreground">
                New to Athena's wisdom?{" "}
                <Link to="/signup" className="divine-text font-medium hover:underline">
                  Begin your journey
                </Link>
              </p>
              
              <Link to="/" className="block text-sm text-muted-foreground hover:text-wisdom-blue">
                ← Return to temple entrance
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Backend Notice */}
        <div className="mt-6 p-4 prophecy-reveal rounded-lg">
          <p className="text-sm text-center">
            <strong className="divine-text">Oracle's Notice:</strong> Athena's backend server must be running 
            on port 5000 for login to work. Start the server with <code className="bg-muted px-1 rounded">npm run dev</code> in the backend folder.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;