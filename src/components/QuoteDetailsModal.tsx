import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface QuoteRequest {
  id: string;
  created_at: string;
  items: any;
  status: string;
}

interface QuoteRequestLine {
  id: number;
  product_id: string;
  product_name: string;
  quantity: number;
}

interface QuoteDetailsModalProps {
  quote: QuoteRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuoteDetailsModal = ({ quote, isOpen, onClose }: QuoteDetailsModalProps) => {
  const [quoteLines, setQuoteLines] = useState<QuoteRequestLine[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuoteLines = async () => {
      if (!quote?.id) return;
      
      setLoading(true);
      try {
        const { data, error } = await (supabase as any)
          .from("quote_request_lines")
          .select("id, product_id, product_name, quantity")
          .eq("quote_request_id", quote.id)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setQuoteLines(data || []);
      } catch (error) {
        console.error("Error fetching quote lines:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchQuoteLines();
    }
  }, [quote?.id, isOpen]);

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
            {loading ? (
              <p className="text-muted-foreground">Loading items...</p>
            ) : quoteLines.length > 0 ? (
              <div className="space-y-3">
                {quoteLines.map((line) => (
                  <div key={line.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{line.product_name}</p>
                        <p className="text-sm text-muted-foreground">Product ID: {line.product_id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Qty: {line.quantity}</p>
                      </div>
                    </div>
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
