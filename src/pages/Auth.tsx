import { useState, useEffect } from "react";
import { useNavigate, Navigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Calendar, Users, Star, CheckCircle, Eye, EyeOff, UserCheck, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = loginSchema.extend({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  userType: z.enum(["regular", "vendor"], { required_error: "Please select your account type" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const updatePasswordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showPasswords, setShowPasswords] = useState({
    login: false,
    signupPassword: false,
    signupConfirm: false,
    updatePassword: false,
    updateConfirm: false
  });
  const { user, signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };


  useEffect(() => {
    const checkForResetToken = async () => {
      const hash = location.hash;
      const query = new URLSearchParams(location.search);
      const type = query.get('type');
      const tab = query.get('tab');
      
      // Check for recovery token in hash (from Supabase redirect)
      if (hash && hash.includes('access_token')) {
        console.log("Access token detected in hash, processing...");
        
        // Parse the hash to extract tokens
        const hashParams = new URLSearchParams(hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const tokenType = hashParams.get('type');
        
        if (accessToken && refreshToken) {
          try {
            // Set the session using the tokens from the URL
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (error) {
              console.error("Error setting session from recovery token:", error);
              toast({
                title: "Session Error",
                description: "Unable to verify your identity. Please request a new password reset link.",
                variant: "destructive",
              });
              setActiveTab('forgot');
              return;
            }
            
            if (data.session) {
              console.log("Session established from recovery token");
              // Clean up the URL
              window.history.replaceState(null, '', window.location.pathname + '?type=recovery');
              setActiveTab('updatePassword');
              toast({
                title: "Update your password",
                description: "Please enter a new password below.",
              });
              return;
            }
          } catch (err) {
            console.error("Error processing recovery token:", err);
          }
        }
        
        // If it's a recovery type, still show the update password form
        if (tokenType === 'recovery' || hash.includes('type=recovery')) {
          setActiveTab('updatePassword');
          toast({
            title: "Update your password",
            description: "Please enter a new password below.",
          });
          return;
        }
      }
      
      // Check for recovery type in query params (after redirect cleanup)
      if (type === 'recovery') {
        console.log("Recovery mode detected in query params");
        // Verify we have an active session before showing update form
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Active session found, showing password update form");
          setActiveTab('updatePassword');
          toast({
            title: "Update your password",
            description: "Please enter a new password below.",
          });
        } else {
          console.log("No active session for password recovery");
          toast({
            title: "Session Expired",
            description: "Your password reset link has expired. Please request a new one.",
            variant: "destructive",
          });
          setActiveTab('forgot');
        }
      } else if (tab === 'signup') {
        setActiveTab('signup');
      }
    };
    
    checkForResetToken();
  }, [location, toast]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      userType: "regular",
    },
  });

  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const updatePasswordForm = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signIn(values.email, values.password);
      navigate("/profile");
    } finally {
      setIsLoading(false);
    }
  };

  const onSignupSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    try {
      await signUp(values.email, values.password, { 
        full_name: values.fullName
      });
      
      signupForm.reset();
      setActiveTab("login");
      
      // Navigate to vendor onboarding if they selected vendor
      if (values.userType === 'vendor') {
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account, then complete your vendor profile.",
        });
      } else {
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onForgotPasswordSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      await resetPassword(values.email);
      forgotPasswordForm.reset();
      setActiveTab("login");
    } catch (error: any) {
      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdatePasswordSubmit = async (values: UpdatePasswordFormValues) => {
    setIsLoading(true);
    try {
      // First verify we have a valid session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Session Expired",
          description: "Your password reset session has expired. Please request a new reset link.",
          variant: "destructive",
        });
        setActiveTab('forgot');
        setIsLoading(false);
        return;
      }
      
      const { error } = await supabase.auth.updateUser({
        password: values.password
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Password updated successfully",
        description: "You can now log in with your new password.",
      });
      updatePasswordForm.reset();
      
      // Sign out after password update so user logs in fresh
      await supabase.auth.signOut();
      setActiveTab("login");
      
      window.history.replaceState(null, '', window.location.pathname);
    } catch (error: any) {
      console.error("Password update error:", error);
      toast({
        title: "Error updating password",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Side - Hero Image and Content */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/90 to-accent/90">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
          }}
        />
        
        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Plan Your Perfect <span className="text-yellow-300">Nigerian Events</span>
            </h1>
            
            <p className="text-lg opacity-90 mb-8">
              Join thousands of event planners who trust TPEC to create unforgettable experiences.
            </p>
            
            {/* Feature highlights */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-yellow-300" />
                <span>Access to 500+ verified vendors</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-yellow-300" />
                <span>AI-powered event planning assistant</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-yellow-300" />
                <span>Budget tracking and management</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-yellow-300" />
                <span>Guest management tools</span>
              </div>
            </div>
            
            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-sm opacity-80">Events Planned</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm opacity-80">Vendors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4.9★</div>
                <div className="text-sm opacity-80">User Rating</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-yellow-300/20 rounded-full animate-bounce"></div>
      </div>
      
      {/* Right Side - Authentication Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome to TPEC
            </h2>
            <p className="text-gray-600">
              Your journey to perfect events starts here
            </p>
          </div>

          {/* Back to Home Button */}
          <div className="flex justify-center">
            <Button variant="outline" asChild className="flex items-center gap-2 hover:bg-gray-50 transition-colors">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Authentication Tabs */}
          <Tabs defaultValue="login" value={activeTab} onValueChange={(value) => {
            setActiveTab(value);
          }} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Sign Up
              </TabsTrigger>
              <TabsTrigger 
                value="forgot"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Reset
              </TabsTrigger>
            </TabsList>

            {/* Update Password Tab */}
            <TabsContent value="updatePassword">
              <Card className="border-0 shadow-lg">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">Update Password</CardTitle>
                  <CardDescription>
                    Please enter your new password below
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...updatePasswordForm}>
                    <form onSubmit={updatePasswordForm.handleSubmit(onUpdatePasswordSubmit)} className="space-y-4">
                      <FormField
                        control={updatePasswordForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showPasswords.updatePassword ? "text" : "password"} 
                                  placeholder="Enter new password" 
                                  className="h-11 transition-all focus:ring-2 focus:ring-primary/20 pr-10"
                                  {...field} 
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => togglePasswordVisibility('updatePassword')}
                                >
                                  {showPasswords.updatePassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-gray-500" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={updatePasswordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showPasswords.updateConfirm ? "text" : "password"} 
                                  placeholder="Confirm new password" 
                                  className="h-11 transition-all focus:ring-2 focus:ring-primary/20 pr-10"
                                  {...field} 
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => togglePasswordVisibility('updateConfirm')}
                                >
                                  {showPasswords.updateConfirm ? (
                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-gray-500" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full h-11 bg-primary hover:bg-primary/90 transition-all transform hover:scale-[1.02]" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Updating..." : "Update Password"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Login Tab */}
            <TabsContent value="login">
              <Card className="border-0 shadow-lg">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to continue planning amazing events
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Social Auth Buttons */}
                  <SocialAuthButtons mode="login" />
                  
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your email" 
                                className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showPasswords.login ? "text" : "password"} 
                                  placeholder="Enter your password" 
                                  className="h-11 transition-all focus:ring-2 focus:ring-primary/20 pr-10"
                                  {...field} 
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => togglePasswordVisibility('login')}
                                >
                                  {showPasswords.login ? (
                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-gray-500" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full h-11 bg-primary hover:bg-primary/90 transition-all transform hover:scale-[1.02]" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in..." : "Sign in"}
                      </Button>
                    </form>
                  </Form>
                  <div className="mt-4 text-center">
                    <Button 
                      variant="link" 
                      onClick={() => setActiveTab("forgot")}
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot your password?
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup">
              <Card className="border-0 shadow-lg">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">Create Account</CardTitle>
                  <CardDescription>
                    Join the TPEC community and start planning
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Social Auth Buttons */}
                  <SocialAuthButtons mode="signup" />
                  
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                      <FormField
                        control={signupForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your full name" 
                                className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your email" 
                                className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="userType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Type</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value} 
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Select account type" />
                                </SelectTrigger>
                                <SelectContent className="bg-white z-50">
                                  <SelectItem value="regular">
                                    <div className="flex items-center space-x-2">
                                      <UserCheck className="h-4 w-4" />
                                      <div>
                                        <div className="font-medium">Regular User</div>
                                        <div className="text-xs text-muted-foreground">Plan and manage events</div>
                                      </div>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="vendor">
                                    <div className="flex items-center space-x-2">
                                      <Store className="h-4 w-4" />
                                      <div>
                                        <div className="font-medium">Vendor</div>
                                        <div className="text-xs text-muted-foreground">Offer services to event planners</div>
                                      </div>
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showPasswords.signupPassword ? "text" : "password"} 
                                  placeholder="Create a password" 
                                  className="h-11 transition-all focus:ring-2 focus:ring-primary/20 pr-10"
                                  {...field} 
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => togglePasswordVisibility('signupPassword')}
                                >
                                  {showPasswords.signupPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showPasswords.signupConfirm ? "text" : "password"} 
                                  placeholder="Confirm your password" 
                                  className="h-11 transition-all focus:ring-2 focus:ring-primary/20 pr-10"
                                  {...field} 
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => togglePasswordVisibility('signupConfirm')}
                                >
                                  {showPasswords.signupConfirm ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full h-11 bg-primary hover:bg-primary/90 transition-all transform hover:scale-[1.02]" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating account..." : "Create account"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Forgot Password Tab */}
            <TabsContent value="forgot">
              <Card className="border-0 shadow-lg">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">Reset Password</CardTitle>
                  <CardDescription>
                    Enter your email to receive a password reset link
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...forgotPasswordForm}>
                    <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
                      <FormField
                        control={forgotPasswordForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your email" 
                                className="h-11 transition-all focus:ring-2 focus:ring-primary/20"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full h-11 bg-primary hover:bg-primary/90 transition-all transform hover:scale-[1.02]" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Trust indicators */}
          <div className="text-center text-sm text-gray-500 mt-6">
            <p>Trusted by 10,000+ event planners across Nigeria</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
