import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, FileText, MessageSquare, CheckCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

// -------------------------
// Types
// -------------------------
type Stats = {
  users: number;
  products: number;
  quotes: number;
  consultations: number;
  pendingReviews: number;
};

type Review = {
  id: number;
  name: string;
  role?: string;
  comment: string;
  rating: number;
  is_approved: boolean;
};

// -------------------------
// Component
// -------------------------
const Admin = () => {
  const [stats, setStats] = useState<Stats>({
    users: 0,
    products: 0,
    quotes: 0,
    consultations: 0,
    pendingReviews: 0,
  });

  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Users count
        const { count: usersCount, error: usersError } = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true });
        if (usersError) throw usersError;

        // Products count
        const { count: productsCount, error: productsError } = await supabase
          .from("products")
          .select("id", { count: "exact", head: true });
        if (productsError) throw productsError;

        // Quote requests count
        const { count: quotesCount, error: quotesError } = await supabase
          .from("quote_requests")
          .select("id", { count: "exact", head: true });
        if (quotesError) throw quotesError;

        // Pre-consultations count
        const { count: consultationsCount, error: consultationsError } = await supabase
          .from("pre_consultations")
          .select("id", { count: "exact", head: true });
        if (consultationsError) throw consultationsError;

        // Pending reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from<Review>("reviews")
          .select("*")
          .eq("is_approved", false);
        if (reviewsError) throw reviewsError;

        setStats({
          users: usersCount || 0,
          products: productsCount || 0,
          quotes: quotesCount || 0,
          consultations: consultationsCount || 0,
          pendingReviews: reviewsData?.length || 0,
        });

        setPendingReviews(reviewsData || []);
      } catch (error: any) {
        console.error("Error fetching admin data:", error);
        toast.error(error.message || "Failed to fetch admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // -------------------------
  // Handlers
  // -------------------------
  const handleApproveReview = async (id: number) => {
    try {
      const { error } = await supabase.from("reviews").update({ is_approved: true }).eq("id", id);
      if (error) throw error;

      toast.success("Review approved!");
      setPendingReviews(prev => prev.filter(r => r.id !== id));
      setStats(prev => ({ ...prev, pendingReviews: prev.pendingReviews - 1 }));
    } catch (error: any) {
      toast.error(error.message || "Failed to approve review");
    }
  };

  const handleDeleteReview = async (id: number) => {
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;

      toast.success("Review deleted!");
      setPendingReviews(prev => prev.filter(r => r.id !== id));
      setStats(prev => ({ ...prev, pendingReviews: prev.pendingReviews - 1 }));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete review");
    }
  };

  // -------------------------
  // Loading state
  // -------------------------
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  // -------------------------
  // JSX
  // -------------------------
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Dashboard header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Manage all your business operations</p>
        </div>

        {/* Stats cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
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

        {/* Pending reviews list */}
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
    </AdminLayout>
  );
};

export default Admin;
