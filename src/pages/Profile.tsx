import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Mail, Phone, Calendar, Package } from "lucide-react";
import { format } from "date-fns";

interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
}

interface QuoteRequest {
  id: string;
  created_at: string;
  items: any;
  status: string;
}

interface PreConsultation {
  id: string;
  created_at: string;
  service_required: string;
  status: string;
}

const Profile = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [preConsultations, setPreConsultations] = useState<PreConsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch quote requests
        const { data: quotesData, error: quotesError } = await supabase
          .from("quote_requests")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (quotesError) throw quotesError;
        setQuoteRequests(quotesData || []);

        // Fetch pre-consultations
        const { data: consultationsData, error: consultationsError } = await supabase
          .from("pre_consultations")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (consultationsError) throw consultationsError;
        setPreConsultations(consultationsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      "in review": "default",
      completed: "default",
    };
    
    return (
      <Badge variant={variants[status.toLowerCase()] || "secondary"}>
        {status}
      </Badge>
    );
  };

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <Skeleton className="h-12 w-48 mb-8" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!isAuthenticated || !profile) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">My Profile</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile Info</TabsTrigger>
              <TabsTrigger value="quotes">My Quote Requests</TabsTrigger>
              <TabsTrigger value="consultations">Pre-Consultations</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-2xl">
                        {profile.full_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{profile.full_name}</h3>
                      <p className="text-sm text-muted-foreground">Account Member</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-foreground">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{profile.full_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-foreground">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>

                    {profile.phone && (
                      <div className="flex items-center gap-3 text-foreground">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{profile.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button disabled className="w-full sm:w-auto">
                    Edit Profile (Coming Soon)
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quotes" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quote Requests</CardTitle>
                  <CardDescription>
                    Your quote request history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {quoteRequests.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No quote requests yet</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => navigate("/products")}
                      >
                        Browse Products
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {quoteRequests.map((quote) => (
                        <Card key={quote.id} className="border-border">
                          <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    {format(new Date(quote.created_at), "PPP")}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {Array.isArray(quote.items) ? quote.items.length : 0} item(s) requested
                                  </p>
                                  {Array.isArray(quote.items) && (
                                    <p className="text-sm text-muted-foreground">
                                      {quote.items.map((item: any) => item.name).join(", ")}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {getStatusBadge(quote.status)}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="consultations" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pre-Consultations</CardTitle>
                  <CardDescription>
                    Your consultation request history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {preConsultations.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No pre-consultations yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {preConsultations.map((consultation) => (
                        <Card key={consultation.id} className="border-border">
                          <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    {format(new Date(consultation.created_at), "PPP")}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium">{consultation.service_required}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {getStatusBadge(consultation.status)}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
