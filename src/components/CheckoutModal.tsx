import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useQuote } from "@/features/quotes/contexts/QuoteContext";
import { ChevronLeft, ChevronRight, Check, Package } from "lucide-react";
import { toast } from "sonner";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CheckoutModal = ({ open, onOpenChange }: CheckoutModalProps) => {
  const { items, submitQuote } = useQuote();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Contact info state
  const [fullName, setFullName] = useState(user?.name || "");
  const [phone, setPhone] = useState("");

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!fullName.trim()) {
        toast.error("Please enter your full name");
        return;
      }
      if (!phone.trim()) {
        toast.error("Please enter your phone number");
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitQuote({ fullName, phone });
      toast.success("Quote request submitted successfully!");
      onOpenChange(false);
      setStep(1);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit quote request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Checkout - Step {step} of 3
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          {/* Step 1: Review Items */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-3">
                {items.map((item) => {
                  const Icon = item.icon || Package;
                  return (
                    <div
                      key={item.id}
                      className="border border-border rounded-lg p-4 flex gap-4"
                    >
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-8 h-8 text-primary/40" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.category}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm font-medium">
                            Quantity: {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Items</span>
                  <span>{totalItems}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Info */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  type="tel"
                />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  We'll use this information to contact you about your quote request.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-lg space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Check className="w-5 h-5" />
                  <h3 className="font-semibold">Review Your Quote Request</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Items</p>
                    <div className="space-y-1 mt-1">
                      {items.map((item) => (
                        <p key={item.id} className="text-sm font-medium">
                          {item.name} × {item.quantity}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border pt-3">
                    <p className="text-sm text-muted-foreground">Contact Information</p>
                    <p className="text-sm font-medium">{fullName}</p>
                    <p className="text-sm font-medium">{phone}</p>
                  </div>

                  <div className="border-t border-border pt-3">
                    <p className="text-sm text-muted-foreground">Total Items</p>
                    <p className="text-lg font-bold">{totalItems}</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                By submitting, you agree to receive a quote from Metro Pools.
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex gap-3 pt-4 border-t border-border">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}

          {step < 3 ? (
            <Button onClick={handleNext} className="flex-1">
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : "Submit Quote Request"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
