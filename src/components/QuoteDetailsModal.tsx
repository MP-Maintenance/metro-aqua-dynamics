import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface QuoteRequest {
  id: string;
  created_at: string;
  items: any;
  status: string;
}

interface QuoteDetailsModalProps {
  quote: QuoteRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuoteDetailsModal = ({ quote, isOpen, onClose }: QuoteDetailsModalProps) => {
  if (!quote) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Quote Request Details</DialogTitle>
          <DialogDescription>
            View the details of your quote request. Once submitted, requests cannot be edited or deleted.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Submitted on {format(new Date(quote.created_at), "PPP")}
              </span>
            </div>
            {getStatusBadge(quote.status)}
          </div>

          <div>
            <h3 className="font-semibold mb-3">Requested Items</h3>
            {Array.isArray(quote.items) && quote.items.length > 0 ? (
              <div className="space-y-3">
                {quote.items.map((item: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <p className="font-medium">{item.name}</p>
                    {item.category && (
                      <p className="text-sm text-muted-foreground">Category: {item.category}</p>
                    )}
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No items found</p>
            )}
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Our team will review your request and contact you shortly with a detailed quote.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteDetailsModal;
