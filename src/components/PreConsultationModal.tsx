import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronLeft, ChevronRight, Upload, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import ImageCarousel from "./ImageCarousel";

interface PreConsultationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultService?: string;
}

const PreConsultationModal = ({ open, onOpenChange, defaultService }: PreConsultationModalProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    service: defaultService || "",
    facility: "",
    surface: "",
    finishing: "",
    length: "",
    width: "",
    depth: "",
    filtration: "",
    name: "",
    email: "",
    phone: "",
    contactMethod: "",
  });

  const totalSteps = 8;

  // Auto-fill contact details from profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || formData.name) return;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', user.id)
        .single();

      if (profile) {
        setFormData(prev => ({
          ...prev,
          name: profile.full_name || "",
          phone: profile.phone || "",
          email: user.email || "",
        }));
      }
    };

    fetchProfile();
  }, [user, open]);

  // Step configurations with carousel images
  const stepConfig: Record<number, {
    title: string;
    isOptional?: boolean;
    options?: { value: string; label: string; images: string[] }[];
  }> = {
    1: {
      title: "Service Required",
      options: [
        { value: "maintenance", label: "Maintenance Cleaning", images: ["/placeholder.svg"] },
        { value: "renovation", label: "Renovation", images: ["/placeholder.svg"] },
        { value: "design-build", label: "Design & Build", images: ["/placeholder.svg"] },
      ]
    },
    2: {
      title: "Type of Facility",
      options: [
        { value: "swimming-pool", label: "Swimming Pool", images: ["/placeholder.svg"] },
        { value: "fountain", label: "Fountain", images: ["/placeholder.svg"] },
        { value: "jacuzzi", label: "Jacuzzi", images: ["/placeholder.svg"] },
        { value: "ready-made-jacuzzi", label: "Ready-Made Jacuzzi", images: ["/placeholder.svg"] },
        { value: "steam-room", label: "Steam Room", images: ["/placeholder.svg"] },
        { value: "sauna-room", label: "Sauna Room", images: ["/placeholder.svg"] },
      ]
    },
    3: {
      title: "Surface Type",
      options: [
        { value: "skimmer", label: "Skimmer", images: ["/placeholder.svg"] },
        { value: "overflow", label: "Overflow", images: ["/placeholder.svg"] },
        { value: "infinity", label: "Infinity", images: ["/placeholder.svg"] },
      ]
    },
    4: {
      title: "Finishing",
      options: [
        { value: "tiles", label: "Tiles", images: ["/placeholder.svg"] },
        { value: "liner", label: "Liner", images: ["/placeholder.svg"] },
        { value: "others", label: "Others", images: ["/placeholder.svg"] },
      ]
    },
    5: {
      title: "Desired Size (Optional)",
      isOptional: true,
    },
    6: {
      title: "Filtration System (Optional)",
      isOptional: true,
      options: [
        { value: "sand-filter", label: "Sand Filter", images: ["/placeholder.svg"] },
        { value: "compact-filter", label: "Compact Filter", images: ["/placeholder.svg"] },
        { value: "others", label: "Others", images: ["/placeholder.svg"] },
      ]
    },
  };

  const handleNext = () => {
    // Validation for required steps
    if (step === 1 && !formData.service) {
      toast.error("Please select a service");
      return;
    }
    if (step === 2 && !formData.facility) {
      toast.error("Please select a facility type");
      return;
    }
    if (step === 7) {
      if (!formData.name || !formData.email || !formData.phone || !formData.contactMethod) {
        toast.error("Please fill in all contact details");
        return;
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Please enter a valid email address");
        return;
      }
    }

    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (1MB = 1048576 bytes)
    if (file.size > 1048576) {
      toast.error("File size must be less than 1MB");
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, or PDF files are allowed");
      return;
    }

    setUploadedFile(file);
    toast.success("File selected successfully");
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('pre-consultation-files')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('pre-consultation-files')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to submit the form");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload file if exists
      let fileUrl = null;
      let fileName = null;
      if (uploadedFile) {
        fileUrl = await uploadFile(uploadedFile);
        fileName = uploadedFile.name;
        
        if (!fileUrl) {
          toast.error("Failed to upload file. Please try again.");
          setIsSubmitting(false);
          return;
        }
      }

      // Insert into database
      const { error } = await supabase
        .from('pre_consultations')
        .insert({
          user_id: user.id,
          service_required: formData.service,
          facility_type: formData.facility,
          surface_type: formData.surface,
          finishing: formData.finishing,
          length: formData.length ? parseFloat(formData.length) : null,
          width: formData.width ? parseFloat(formData.width) : null,
          depth: formData.depth ? parseFloat(formData.depth) : null,
          filtration_system: formData.filtration,
          contact_name: formData.name,
          contact_email: formData.email,
          contact_phone: formData.phone,
          preferred_contact_method: formData.contactMethod,
          reference_file_url: fileUrl,
          reference_file_name: fileName,
          status: 'pending',
        });

      if (error) throw error;

      setShowSuccess(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        onOpenChange(false);
        setStep(1);
        setUploadedFile(null);
        setFormData({
          service: defaultService || "",
          facility: "",
          surface: "",
          finishing: "",
          length: "",
          width: "",
          depth: "",
          filtration: "",
          name: "",
          email: "",
          phone: "",
          contactMethod: "",
        });
      }, 2000);

    } catch (error) {
      console.error('Submission error:', error);
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Success!</h2>
            <p className="text-muted-foreground">
              Your pre-consultation form has been submitted successfully.
              We'll get back to you soon!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Pre-Consultation Form</DialogTitle>
          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <Progress value={(step / totalSteps) * 100} />
          </div>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Steps 1-4 & 6: Option selection with carousels */}
          {(step >= 1 && step <= 4 || step === 6) && stepConfig[step as keyof typeof stepConfig] && (
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                {stepConfig[step as keyof typeof stepConfig].title}
                {stepConfig[step as keyof typeof stepConfig].isOptional && " (Optional)"}
              </Label>
              <RadioGroup
                value={
                  step === 1 ? formData.service :
                  step === 2 ? formData.facility :
                  step === 3 ? formData.surface :
                  step === 4 ? formData.finishing :
                  step === 6 ? formData.filtration : ""
                }
                onValueChange={(value) => {
                  if (step === 1) setFormData({ ...formData, service: value });
                  else if (step === 2) setFormData({ ...formData, facility: value });
                  else if (step === 3) setFormData({ ...formData, surface: value });
                  else if (step === 4) setFormData({ ...formData, finishing: value });
                  else if (step === 6) setFormData({ ...formData, filtration: value });
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {stepConfig[step as keyof typeof stepConfig].options?.map((option) => (
                  <div key={option.value} className="relative">
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={option.value}
                      className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                    >
                      <ImageCarousel images={option.images} alt={option.label} />
                      <span className="mt-3 font-medium">{option.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Step 5: Desired Size */}
          {step === 5 && (
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Desired Size (Optional)</Label>
              <p className="text-sm text-muted-foreground">Enter dimensions in meters</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm">Length (m)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-sm">Width (m)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-sm">Depth (m)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0"
                    value={formData.depth}
                    onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Contact Details */}
          {step === 7 && (
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Contact Details</Label>
              <div>
                <Label>Name *</Label>
                <Input
                  placeholder="Your full name"
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
                <Input
                  type="tel"
                  placeholder="+971 50 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label>Preferred Contact Method *</Label>
                <RadioGroup
                  value={formData.contactMethod}
                  onValueChange={(value) => setFormData({ ...formData, contactMethod: value })}
                  className="flex gap-4"
                >
                  {['call', 'whatsapp', 'email'].map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <RadioGroupItem value={method} id={method} />
                      <Label htmlFor={method} className="capitalize cursor-pointer">
                        {method}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Step 8: File Upload */}
          {step === 8 && (
            <div className="space-y-4">
              <Label className="text-lg font-semibold">Upload Reference Files (Optional)</Label>
              <p className="text-sm text-muted-foreground">
                Upload photos or PDFs for reference (max 1MB)
              </p>
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:border-primary transition-colors">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-primary font-medium">Click to upload</span>
                  <span className="text-muted-foreground"> or drag and drop</span>
                </Label>
                <p className="text-xs text-muted-foreground mt-2">
                  JPG, PNG or PDF (max 1MB)
                </p>
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              {uploadedFile && (
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="text-sm">{uploadedFile.name}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between gap-4 border-t pt-4">
          <Button variant="outline" onClick={handleBack} disabled={step === 1 || isSubmitting}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          {step < totalSteps ? (
            <Button onClick={handleNext} disabled={isSubmitting}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreConsultationModal;
