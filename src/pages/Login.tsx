import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Implement Firebase Auth login when Supabase is connected
    console.log("Login attempt:", { email, password });
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      alert("Please connect Supabase to enable authentication");
    }, 1000);
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

        {/* Supabase Notice */}
        <div className="mt-6 p-4 prophecy-reveal rounded-lg">
          <p className="text-sm text-center">
            <strong className="divine-text">Oracle's Notice:</strong> Authentication requires Supabase integration. 
            Connect via the green Supabase button to enable login functionality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;