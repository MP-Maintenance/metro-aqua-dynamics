import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useReviews } from "../hooks/useReviews";

const ReviewsList = () => {
  const { reviews, loading } = useReviews(true);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="animate-pulse space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </div>
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
        <CardContent className="pt-6 text-center text-muted-foreground">
          No reviews yet. Be the first to share your experience!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review.id} className="hover:shadow-medium transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">{review.name}</h3>
                {review.role && (
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                )}
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < (review.rating || 0)
                        ? "fill-primary text-primary"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
            {review.comment && (
              <p className="text-muted-foreground">{review.comment}</p>
            )}
            {review.created_at && (
              <p className="text-xs text-muted-foreground mt-3">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReviewsList;
