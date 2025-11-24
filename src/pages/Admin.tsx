import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, FileText, MessageSquare, CheckCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Admin = () => {
  const [stats, setStats] = useState({ users: 0, products: 0, quotes: 0, consultations: 0, pendingReviews: 0 });
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profilesRes, productsRes, quotesRes, consultationsRes, reviewsRes] = await Promise.all([
          (supabase as any).from("profiles").select("id", { count: "exact", head: true }),
          supabase.from("products").select("id", { count: "exact", head: true }),
          supabase.from("quote_requests").select("id", { count: "exact", head: true }),
          supabase.from("pre_consultations").select("id", { count: "exact", head: true }),
          (supabase as any).from("reviews").select("*").eq("is_approved", false),
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

    fetchData();
  }, []);

  const handleApproveReview = async (id: number) => {
    try {
      const { error } = await (supabase as any).from("reviews").update({ is_approved: true }).eq("id", id);
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
      const { error } = await (supabase as any).from("reviews").delete().eq("id", id);
      if (error) throw error;
      toast.success("Review deleted!");
      setPendingReviews(pendingReviews.filter(r => r.id !== id));
      setStats(prev => ({ ...prev, pendingReviews: prev.pendingReviews - 1 }));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete review");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Manage all your business operations</p>
        </div>

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
