import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-bg to-marble-white flex items-center justify-center p-4">
      <Card className="temple-column max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          <div className="text-8xl mb-4">🏛️</div>
          
          <div className="space-y-4">
            <h1 className="font-athena text-4xl font-bold wisdom-text">
              Path Not Found
            </h1>
            <p className="text-xl divine-text font-athena">
              The Oracle Cannot Divine This Path
            </p>
            <p className="text-muted-foreground">
              Even Athena's wisdom cannot illuminate a path that does not exist. 
              Return to the sacred temple and choose your journey anew.
            </p>
          </div>

          <div className="pt-4">
            <Link to="/">
              <Button variant="oracle" size="lg" className="text-lg px-8 py-4">
                Return to Temple
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            Lost path: <code className="bg-muted px-2 py-1 rounded">{location.pathname}</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
