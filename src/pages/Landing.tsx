import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowRight, Sparkles, MapPin, Users, Zap } from "lucide-react";

export default function Landing() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.endsWith("@ucdavis.edu")) {
      setError("Please use your @ucdavis.edu email address");
      return;
    }
    
    // For now, just navigate to dashboard (auth will be added later)
    navigate("/dashboard");
  };

  const features = [
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Live Bar Map",
      description: "See what's popping in Davis right now",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Crowd Levels",
      description: "Know how packed each spot is before you go",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Real-time Updates",
      description: "Crowd data updated every few minutes",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-neon-purple/20 via-transparent to-transparent blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-neon-cyan/20 via-transparent to-transparent blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-neon-cyan/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-center pt-8 pb-4 px-4">
          <Logo size="lg" />
        </header>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div className="w-full max-w-md space-y-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass animate-fade-in">
              <Sparkles className="h-4 w-4 text-neon-purple" />
              <span className="text-sm font-medium text-foreground">Exclusive for UC Davis</span>
            </div>

            {/* Headline */}
            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                <span className="text-foreground">What's</span>
                <br />
                <span className="text-gradient-neon">The Move?</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-sm mx-auto">
                Find the best bars in Davis. See live crowd levels. Go where your friends are.
              </p>
            </div>

            {/* Email Form */}
            <form 
              onSubmit={handleSubmit} 
              className="space-y-4 animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Mail className="h-5 w-5" />
                </div>
                <Input
                  type="email"
                  placeholder="you@ucdavis.edu"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  className="pl-12 h-14 text-base"
                />
              </div>
              
              {error && (
                <p className="text-sm text-destructive animate-fade-in">{error}</p>
              )}
              
              <Button 
                type="submit" 
                variant="neon" 
                size="xl" 
                className="w-full group"
              >
                Get Started
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <p className="text-xs text-muted-foreground">
                Only available to students with a @ucdavis.edu email
              </p>
            </form>

            {/* Features */}
            <div 
              className="grid gap-4 pt-8 animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="flex items-center gap-4 p-4 rounded-xl glass text-left transition-all hover:bg-card/80"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 text-neon-purple">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 text-center">
          <p className="text-sm text-muted-foreground">
            Made for Aggies 🐮
          </p>
        </footer>
      </div>
    </div>
  );
}
