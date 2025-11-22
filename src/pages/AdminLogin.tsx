import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, LogIn, Shield } from "lucide-react";
import { z } from "zod";
import { RateLimiter, logSecurityEvent } from "@/lib/security";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [rateLimiter] = useState(() => new RateLimiter("admin_login"));
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check rate limit status on mount and update timer
  useEffect(() => {
    const checkRateLimit = () => {
      const blocked = rateLimiter.isBlocked();
      setIsBlocked(blocked);
      if (blocked) {
        setBlockTimeRemaining(rateLimiter.getRemainingBlockTime());
      }
    };

    checkRateLimit();
    const interval = setInterval(checkRateLimit, 1000);
    return () => clearInterval(interval);
  }, [rateLimiter]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if user is admin
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        
        if (profile?.role === "admin") {
          navigate("/admin");
        }
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Check rate limiting
    if (rateLimiter.isBlocked()) {
      const remaining = rateLimiter.getRemainingBlockTime();
      toast({
        title: "Too Many Attempts",
        description: `Please wait ${Math.ceil(remaining / 60)} minutes before trying again.`,
        variant: "destructive",
      });
      
      await logSecurityEvent({
        eventType: 'login_blocked',
        email,
        details: `Blocked for ${remaining} seconds`,
      });
      
      return;
    }

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as "email" | "password"] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        rateLimiter.recordAttempt();
        
        await logSecurityEvent({
          eventType: 'login_failed',
          email,
          details: error.message,
        });
        
        throw error;
      }

      if (data.session) {
        // Check if user is admin using secure has_role function
        const { data: isAdmin } = await supabase
          .rpc('has_role', { _user_id: data.session.user.id, _role: 'admin' });

        if (!isAdmin) {
          await supabase.auth.signOut();
          
          await logSecurityEvent({
            eventType: 'admin_access_denied',
            userId: data.session.user.id,
            email,
            details: 'Non-admin user attempted to access admin panel',
          });
          
          throw new Error("Access denied. Admin privileges required.");
        }

        // Success - reset rate limiter and log event
        rateLimiter.reset();
        
        await logSecurityEvent({
          eventType: 'login_success',
          userId: data.session.user.id,
          email,
        });

        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard!",
        });
        navigate("/admin");
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Admin Login</CardTitle>
          <CardDescription>
            Access the Metro Pools admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@metropools.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className={errors.password ? "border-destructive" : ""}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {isBlocked && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
                <Shield className="h-5 w-5 text-destructive mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-destructive">Account Temporarily Locked</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Too many failed attempts. Please wait {Math.ceil(blockTimeRemaining / 60)} minute(s) before trying again.
                  </p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isBlocked}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground mt-4">
              <Button
                type="button"
                variant="link"
                onClick={() => navigate("/")}
                className="text-muted-foreground"
              >
                Back to Home
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
