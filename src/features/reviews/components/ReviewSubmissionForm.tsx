import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { reviewsService } from "../services/reviews.service";

const ReviewSubmissionForm = () => {
  const { toast } = useToast();
  const { user, isAuthenticated, setIsAuthModalOpen } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    rating: 5,
    comment: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a review.",
        variant: "destructive",
      });
      setIsAuthModalOpen(true);
      return;
    }

    setSubmitting(true);

    try {
      await reviewsService.create({
        user_id: user.id,
        name: formData.name,
        role: formData.role,
        rating: formData.rating,
        comment: formData.comment,
        is_approved: false,
      });

      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback. Your review will be published after approval.",
      });

      setFormData({
        name: "",
        role: "",
        rating: 5,
        comment: "",
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="mb-4 text-muted-foreground">
            Please sign in to leave a review
          </p>
          <Button onClick={() => setIsAuthModalOpen(true)}>Sign In</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Role / Position (Optional)
            </label>
            <Input
              type="text"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= formData.rating
                        ? "fill-primary text-primary"
                        : "text-muted"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Comment</label>
            <Textarea
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              rows={4}
              required
            />
          </div>
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewSubmissionForm;
