import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface PreConsultationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultService?: string;
}

const PreConsultationModal = ({ open, onOpenChange, defaultService }: PreConsultationModalProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: defaultService || "",
    facility: "",
    surface: "",
    finishing: "",
    finishingOther: "",
    length: "",
    width: "",
    depth: "",
    filtration: "",
    filtrationOther: "",
    name: "",
    email: "",
    phone: "",
    countryCode: "+971",
    contactMethod: "",
  });

  const totalSteps = 7;

  const services = [
    { value: "maintenance", label: "Maintenance Cleaning" },
    { value: "renovation", label: "Renovation" },
    { value: "design-build", label: "Design & Build" },
  ];

  const facilities = [
    { value: "swimming-pool", label: "Swimming Pool" },
    { value: "fountain", label: "Fountain" },
    { value: "jacuzzi", label: "Jacuzzi" },
    { value: "ready-made-jacuzzi", label: "Ready-Made Jacuzzi" },
    { value: "steam-room", label: "Steam Room" },
    { value: "sauna-room", label: "Sauna Room" },
  ];

  const surfaces = [
    { value: "skimmer", label: "Skimmer" },
    { value: "overflow", label: "Overflow" },
    { value: "infinity", label: "Infinity" },
  ];

  const finishings = [
    { value: "tiles", label: "Tiles" },
    { value: "liner", label: "Liner" },
    { value: "others", label: "Others" },
  ];

  const filtrations = [
    { value: "sand-filter", label: "Sand Filter" },
    { value: "compact-filter", label: "Compact Filter" },
    { value: "others", label: "Others" },
  ];

  const contactMethods = [
    { value: "call", label: "Call" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "email", label: "Email" },
  ];

  const countryCodes = [
    { value: "+971", label: "+971 (UAE)" },
    { value: "+966", label: "+966 (Saudi Arabia)" },
    { value: "+965", label: "+965 (Kuwait)" },
    { value: "+974", label: "+974 (Qatar)" },
    { value: "+973", label: "+973 (Bahrain)" },
    { value: "+968", label: "+968 (Oman)" },
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.service || !formData.facility || !formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Show confirmation
    toast.success("Pre-Consultation Form Submitted!", {
      description: "We'll get back to you soon.",
    });

    // Reset and close
    onOpenChange(false);
    setTimeout(() => {
      setStep(1);
      setFormData({
        service: defaultService || "",
        facility: "",
        surface: "",
        finishing: "",
        finishingOther: "",
        length: "",
        width: "",
        depth: "",
        filtration: "",
        filtrationOther: "",
        name: "",
        email: "",
        phone: "",
        countryCode: "+971",
        contactMethod: "",
      });
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Pre-Consultation Form</DialogTitle>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm text-muted-foreground">
              Step {step} of {totalSteps}
            </span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step 1: Service Required */}
          {step === 1 && (
            <div className="space-y-4">
              <Label>Service Required *</Label>
              <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.value} value={service.value}>
                      {service.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Step 2: Type of Facility */}
          {step === 2 && (
            <div className="space-y-4">
              <Label>Type of Facility *</Label>
              <Select value={formData.facility} onValueChange={(value) => setFormData({ ...formData, facility: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select facility type" />
                </SelectTrigger>
                <SelectContent>
                  {facilities.map((facility) => (
                    <SelectItem key={facility.value} value={facility.value}>
                      {facility.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Step 3: Surface Type */}
          {step === 3 && (
            <div className="space-y-4">
              <Label>Surface Type *</Label>
              <Select value={formData.surface} onValueChange={(value) => setFormData({ ...formData, surface: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select surface type" />
                </SelectTrigger>
                <SelectContent>
                  {surfaces.map((surface) => (
                    <SelectItem key={surface.value} value={surface.value}>
                      {surface.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Step 4: Finishing */}
          {step === 4 && (
            <div className="space-y-4">
              <Label>Finishing *</Label>
              <Select value={formData.finishing} onValueChange={(value) => setFormData({ ...formData, finishing: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select finishing type" />
                </SelectTrigger>
                <SelectContent>
                  {finishings.map((finishing) => (
                    <SelectItem key={finishing.value} value={finishing.value}>
                      {finishing.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.finishing === "others" && (
                <Input
                  placeholder="Please specify"
                  value={formData.finishingOther}
                  onChange={(e) => setFormData({ ...formData, finishingOther: e.target.value })}
                />
              )}
            </div>
          )}

          {/* Step 5: Desired Size */}
          {step === 5 && (
            <div className="space-y-4">
              <Label>Desired Size (Optional)</Label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Length (m)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Width (m)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Depth (m)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.depth}
                    onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Filtration System */}
          {step === 6 && (
            <div className="space-y-4">
              <Label>Filtration System (Optional)</Label>
              <Select value={formData.filtration} onValueChange={(value) => setFormData({ ...formData, filtration: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select filtration system" />
                </SelectTrigger>
                <SelectContent>
                  {filtrations.map((filtration) => (
                    <SelectItem key={filtration.value} value={filtration.value}>
                      {filtration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.filtration === "others" && (
                <Input
                  placeholder="Please specify"
                  value={formData.filtrationOther}
                  onChange={(e) => setFormData({ ...formData, filtrationOther: e.target.value })}
                />
              )}
            </div>
          )}

          {/* Step 7: Contact Details */}
          {step === 7 && (
            <div className="space-y-4">
              <div>
                <Label>Name *</Label>
                <Input
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label>Phone *</Label>
                <div className="flex gap-2">
                  <Select value={formData.countryCode} onValueChange={(value) => setFormData({ ...formData, countryCode: value })}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countryCodes.map((code) => (
                        <SelectItem key={code.value} value={code.value}>
                          {code.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="tel"
                    placeholder="50 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label>Preferred Contact Method *</Label>
                <Select value={formData.contactMethod} onValueChange={(value) => setFormData({ ...formData, contactMethod: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contact method" />
                  </SelectTrigger>
                  <SelectContent>
                    {contactMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between gap-4">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          {step < totalSteps ? (
            <Button onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit}>Submit</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreConsultationModal;
