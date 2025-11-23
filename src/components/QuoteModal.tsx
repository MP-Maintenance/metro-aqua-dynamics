import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useQuote } from "@/features/quotes/contexts/QuoteContext";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { toast } from "sonner";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id?: string;
    name: string;
    description: string | null;
    icon?: any;
    category: string;
    availability: string | null;
  } | null;
}

const QuoteModal = ({ isOpen, onClose, product }: QuoteModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useQuote();
  const { isAuthenticated, setIsAuthModalOpen } = useAuth();

  const handleAddToQuote = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      onClose();
      return;
    }

    if (product) {
      addItem({
        id: product.id || `${product.category}-${product.name}`,
        name: product.name,
        description: product.description || "",
        category: product.category,
        icon: product.icon,
        availability: (product.availability as "available" | "not-available") || "available",
      });
      
      toast.success("Added to Quote Cart", {
        description: `${product.name} has been added to your quote request.`,
      });
      
      setQuantity(1);
      onClose();
    }
  };

  if (!product) return null;

  // Import Package icon as fallback
  const Icon = product.icon || (() => {
    const { Package } = require("lucide-react");
    return Package;
  })();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Image Section */}
          <div className="flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-8 min-h-[300px]">
            <Icon className="w-32 h-32 text-primary/40" />
          </div>
          
          {/* Details Section */}
          <div className="flex flex-col space-y-4">
            <div>
              <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">
                {product.category}
              </p>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  product.availability === "available" || product.availability === "in_stock"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              />
              <span className="text-sm font-medium">
                {product.availability === "available" || product.availability === "in_stock"
                  ? "Available"
                  : "Currently Unavailable"}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-lg font-semibold w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Add to Quote Button */}
            <Button
              onClick={handleAddToQuote}
              size="lg"
              className="w-full mt-4"
            >
              Add to Quote Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteModal;
