import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: number;
  name: string;
  role: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
}

const ReviewsList = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("id, name, role, rating, comment, created_at")
          .eq("is_approved", true)
          .order("created_at", { ascending: false }) as any;

        if (error) throw error;
        setReviews(data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="hover:shadow-medium transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold">{review.name}</h4>
                {review.role && (
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                )}
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>
            {review.comment && (
              <p className="text-muted-foreground">{review.comment}</p>
            )}
            <p className="text-xs text-muted-foreground mt-3">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReviewsList;
