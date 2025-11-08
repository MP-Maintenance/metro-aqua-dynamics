import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Package, FileText, MessageSquare, CheckCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Admin = () => {
  const { isAdmin, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, products: 0, quotes: 0, consultations: 0, pendingReviews: 0 });
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profilesRes, productsRes, quotesRes, consultationsRes, reviewsRes] = await Promise.all([
          supabase.from("profiles").select("id", { count: "exact", head: true }) as any,
          supabase.from("products").select("id", { count: "exact", head: true }) as any,
          supabase.from("quote_requests").select("id", { count: "exact", head: true }) as any,
          supabase.from("pre_consultations").select("id", { count: "exact", head: true }) as any,
          supabase.from("reviews").select("*").eq("is_approved", false) as any,
        ]);

        setStats({
          users: profilesRes.count || 0,
          products: productsRes.count || 0,
          quotes: quotesRes.count || 0,
          consultations: consultationsRes.count || 0,
          pendingReviews: reviewsRes.data?.length || 0,
        });

        setPendingReviews(reviewsRes.data || []);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const handleApproveReview = async (id: number) => {
    try {
      const { error } = await supabase.from("reviews").update({ is_approved: true }).eq("id", id) as any;
      if (error) throw error;
      toast.success("Review approved!");
      setPendingReviews(pendingReviews.filter(r => r.id !== id));
      setStats(prev => ({ ...prev, pendingReviews: prev.pendingReviews - 1 }));
    } catch (error: any) {
      toast.error(error.message || "Failed to approve review");
    }
  };

  const handleDeleteReview = async (id: number) => {
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id) as any;
      if (error) throw error;
      toast.success("Review deleted!");
      setPendingReviews(pendingReviews.filter(r => r.id !== id));
      setStats(prev => ({ ...prev, pendingReviews: prev.pendingReviews - 1 }));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete review");
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-7xl">
            <Skeleton className="h-12 w-48 mb-8" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
              {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-32" />)}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!isAdmin) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-12">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats.users}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats.products}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quote Requests</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats.quotes}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Consultations</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats.consultations}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats.pendingReviews}</div></CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Pending Reviews</CardTitle></CardHeader>
            <CardContent>
              {pendingReviews.length === 0 ? (
                <p className="text-muted-foreground">No pending reviews</p>
              ) : (
                <div className="space-y-4">
                  {pendingReviews.map((review) => (
                    <div key={review.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold">{review.name}</p>
                        {review.role && <p className="text-sm text-muted-foreground">{review.role}</p>}
                        <p className="text-sm mt-2">{review.comment}</p>
                        <p className="text-xs text-muted-foreground mt-1">Rating: {review.rating}/5</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" onClick={() => handleApproveReview(review.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteReview(review.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Admin;
