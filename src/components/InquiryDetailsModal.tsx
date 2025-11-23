import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Phone, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import type { Inquiry } from "@/features/inquiries/services/inquiries.service";

interface InquiryDetailsModalProps {
  inquiry: Inquiry | null;
  isOpen: boolean;
  onClose: () => void;
}

const InquiryDetailsModal = ({ inquiry, isOpen, onClose }: InquiryDetailsModalProps) => {
  if (!inquiry) return null;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      "in progress": "default",
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
          <DialogTitle>Inquiry Details</DialogTitle>
          <DialogDescription>
            View the details of your inquiry submission.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Submitted on {format(new Date(inquiry.submittedat), "PPP")}
              </span>
            </div>
            {getStatusBadge(inquiry.status)}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Inquiry Information</h3>
              <div className="p-4 border rounded-lg space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Inquiry Type</p>
                  <p className="font-medium">{inquiry.inquirytype}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Service Type</p>
                  <p className="font-medium">{inquiry.servicetype}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Contact Information</h3>
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{inquiry.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{inquiry.countrycode} {inquiry.mobilenumber}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Your Message
              </h3>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{inquiry.message}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Our team will review your inquiry and contact you shortly.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InquiryDetailsModal;
