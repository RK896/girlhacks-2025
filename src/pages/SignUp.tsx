import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    
    // TODO: Implement Firebase Auth signup when Supabase is connected
    console.log("Signup attempt:", formData);
    
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
            Begin Your Journey to Wisdom
          </p>
        </div>

        {/* SignUp Form */}
        <Card className="temple-column">
          <CardHeader>
            <CardTitle className="font-athena text-2xl text-center wisdom-text">
              Join the Circle of Wisdom
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Create your account to access Athena's guidance
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Athena"
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Goddess"
                    required
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="wisdom@olympus.com"
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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a strong password"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                {loading ? "Awakening Wisdom..." : "Begin My Journey"}
              </Button>
            </form>

            <div className="mt-8 text-center space-y-4">
              <p className="text-muted-foreground">
                Already possess wisdom?{" "}
                <Link to="/login" className="divine-text font-medium hover:underline">
                  Enter the oracle
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
            Connect via the green Supabase button to enable account creation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;