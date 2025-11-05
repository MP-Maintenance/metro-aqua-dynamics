import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface PreConsultation {
  id: string;
  created_at: string;
  service_required: string;
  status: string;
  facility_type?: string | null;
  surface_type?: string | null;
  length?: number | null;
  width?: number | null;
  depth?: number | null;
  finishing?: string | null;
  filtration_system?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  preferred_contact_method?: string | null;
  reference_file_name?: string | null;
  reference_file_url?: string | null;
}

interface ConsultationDetailsModalProps {
  consultation: PreConsultation | null;
  isOpen: boolean;
  onClose: () => void;
}

const ConsultationDetailsModal = ({ consultation, isOpen, onClose }: ConsultationDetailsModalProps) => {
  if (!consultation) return null;

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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pre-Consultation Details</DialogTitle>
          <DialogDescription>
            View the details of your consultation request. Once submitted, requests cannot be edited or deleted.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Submitted on {format(new Date(consultation.created_at), "PPP")}
              </span>
            </div>
            {getStatusBadge(consultation.status)}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Service Information</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Service Required</p>
                  <p className="font-medium">{consultation.service_required}</p>
                </div>
                {consultation.facility_type && (
                  <div>
                    <p className="text-sm text-muted-foreground">Facility Type</p>
                    <p className="font-medium">{consultation.facility_type}</p>
                  </div>
                )}
                {consultation.surface_type && (
                  <div>
                    <p className="text-sm text-muted-foreground">Surface Type</p>
                    <p className="font-medium">{consultation.surface_type}</p>
                  </div>
                )}
                {consultation.finishing && (
                  <div>
                    <p className="text-sm text-muted-foreground">Finishing</p>
                    <p className="font-medium">{consultation.finishing}</p>
                  </div>
                )}
                {consultation.filtration_system && (
                  <div>
                    <p className="text-sm text-muted-foreground">Filtration System</p>
                    <p className="font-medium">{consultation.filtration_system}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Dimensions</h3>
              <div className="space-y-2">
                {consultation.length && (
                  <div>
                    <p className="text-sm text-muted-foreground">Length</p>
                    <p className="font-medium">{consultation.length}m</p>
                  </div>
                )}
                {consultation.width && (
                  <div>
                    <p className="text-sm text-muted-foreground">Width</p>
                    <p className="font-medium">{consultation.width}m</p>
                  </div>
                )}
                {consultation.depth && (
                  <div>
                    <p className="text-sm text-muted-foreground">Depth</p>
                    <p className="font-medium">{consultation.depth}m</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Contact Information</h3>
            <div className="space-y-2">
              {consultation.contact_name && (
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{consultation.contact_name}</p>
                </div>
              )}
              {consultation.contact_email && (
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{consultation.contact_email}</p>
                </div>
              )}
              {consultation.contact_phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{consultation.contact_phone}</p>
                </div>
              )}
              {consultation.preferred_contact_method && (
                <div>
                  <p className="text-sm text-muted-foreground">Preferred Contact Method</p>
                  <p className="font-medium capitalize">{consultation.preferred_contact_method}</p>
                </div>
              )}
            </div>
          </div>

          {consultation.reference_file_url && (
            <div>
              <h3 className="font-semibold mb-3">Attached File</h3>
              <a
                href={consultation.reference_file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {consultation.reference_file_name || "View Attachment"}
              </a>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Our team will review your consultation request and contact you shortly to schedule a consultation.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationDetailsModal;
