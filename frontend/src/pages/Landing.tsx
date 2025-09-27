import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import heroImage from "@/assets/athena-hero.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-bg to-marble-white">
      {/* Header */}
      <header className="border-b-4 border-divine-gold bg-marble-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-athena text-4xl font-bold wisdom-text">
                🏛️ Athena's Journal
              </h1>
              <p className="divine-text font-athena text-lg">
                Wisdom Through Professional Reflection
              </p>
            </div>
            <nav className="space-x-4">
              <Link to="/login">
                <Button variant="temple" size="lg">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="oracle" size="lg">
                  Sign Up
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Text */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="font-athena text-6xl font-bold leading-tight">
                <span className="wisdom-text">Harness Ancient</span>
                <br />
                <span className="divine-text">Wisdom for Modern</span>
                <br />
                <span className="wisdom-text">Professional Growth</span>
              </h2>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Channel the wisdom of Athena, goddess of strategic thinking and professional mastery. 
                Transform your daily experiences into profound insights for career advancement through 
                AI-powered reflection and mythological guidance.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-divine-gold rounded-full"></div>
                <span className="text-lg">AI-powered sentiment analysis reveals hidden patterns</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-divine-gold rounded-full"></div>
                <span className="text-lg">Personalized Athena prophecies guide your journey</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-divine-gold rounded-full"></div>
                <span className="text-lg">Build a comprehensive archive of professional wisdom</span>
              </div>
            </div>

            <div className="pt-8 space-x-6">
              <Link to="/signup">
                <Button variant="oracle" size="lg" className="text-lg px-8 py-4">
                  Begin Your Journey
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="wisdom" size="lg" className="text-lg px-8 py-4">
                  Access the Oracle
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <Card className="temple-column p-8 overflow-hidden">
              <img
                src={heroImage}
                alt="Ancient Greek temple of Athena with marble columns and golden accents, representing wisdom and professional development"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-wisdom-blue/20 to-transparent rounded-lg"></div>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <section className="mt-24 grid md:grid-cols-3 gap-8">
          <Card className="temple-column p-8 text-center space-y-4">
            <div className="text-6xl mb-4">🦉</div>
            <h3 className="font-athena text-2xl font-bold wisdom-text">
              Wisdom Analysis
            </h3>
            <p className="text-muted-foreground">
              Advanced AI sentiment analysis reveals the emotional patterns in your professional experiences, 
              uncovering insights you might have missed.
            </p>
          </Card>

          <Card className="temple-column p-8 text-center space-y-4">
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="font-athena text-2xl font-bold wisdom-text">
              Divine Prophecy
            </h3>
            <p className="text-muted-foreground">
              Receive personalized guidance from Athena herself, transforming your journal entries 
              into strategic prophecies for professional growth.
            </p>
          </Card>

          <Card className="temple-column p-8 text-center space-y-4">
            <div className="text-6xl mb-4">📜</div>
            <h3 className="font-athena text-2xl font-bold wisdom-text">
              Sacred Archive
            </h3>
            <p className="text-muted-foreground">
              Build a comprehensive library of your professional development journey, 
              tracking patterns and growth over time.
            </p>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t-4 border-divine-gold bg-marble-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="divine-text font-athena text-lg">
              "The unexamined life is not worth living" - Socrates
            </p>
            <p className="text-muted-foreground mt-2">
              Transform your professional journey with the wisdom of ancient Greece
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;