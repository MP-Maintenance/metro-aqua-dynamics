import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronLeft, ChevronRight, Upload, CheckCircle, Sparkles, Wrench, Hammer, Waves, Droplet, Bath, Cloud, Flame, Layers, Grid, Brush, Filter, LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface PreConsultationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultService?: string;
}

const PreConsultationModal = ({ open, onOpenChange, defaultService }: PreConsultationModalProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
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

  // Load user profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .single();
      
      if (profile) {
        setFormData(prev => ({
          ...prev,
          name: profile.full_name || "",
          phone: profile.phone || "",
        }));
      }
    };
    if (open) loadProfile();
  }, [user, open]);

  const services: { value: string; label: string; icon: LucideIcon; description: string }[] = [
    { value: "maintenance", label: "Maintenance / Cleaning", icon: Sparkles, description: "Regular pool maintenance and cleaning services" },
    { value: "inspection", label: "Inspection / Repairs", icon: Wrench, description: "Professional inspection and repair work" },
    { value: "renovation", label: "Renovation", icon: Hammer, description: "Complete pool renovation and upgrades" },
  ];

  const facilities: { value: string; label: string; icon: LucideIcon; description: string }[] = [
    { value: "swimming-pool", label: "Swimming Pool", icon: Waves, description: "Standard swimming pools" },
    { value: "fountain", label: "Fountain", icon: Droplet, description: "Decorative water fountains" },
    { value: "jacuzzi", label: "Jacuzzi", icon: Bath, description: "Custom built jacuzzis" },
    { value: "ready-made-jacuzzi", label: "Ready-Made Jacuzzi", icon: Bath, description: "Pre-fabricated jacuzzi units" },
    { value: "steam-room", label: "Steam Room", icon: Cloud, description: "Steam room installations" },
    { value: "sauna-room", label: "Sauna Room", icon: Flame, description: "Sauna room setups" },
  ];

  const surfaces: { value: string; label: string; icon: LucideIcon; description: string }[] = [
    { value: "skimmer", label: "Skimmer", icon: Layers, description: "Traditional skimmer design" },
    { value: "overflow", label: "Overflow", icon: Layers, description: "Overflow edge system" },
    { value: "infinity", label: "Infinity", icon: Layers, description: "Infinity edge design" },
  ];

  const finishings: { value: string; label: string; icon: LucideIcon; description: string }[] = [
    { value: "tiles", label: "Tiles", icon: Grid, description: "Ceramic or porcelain tiles" },
    { value: "liner", label: "Liner", icon: Grid, description: "Vinyl liner finish" },
    { value: "mosaic", label: "Mosaic", icon: Brush, description: "Glass mosaic tiles" },
  ];

  const filtrations: { value: string; label: string; icon: LucideIcon; description: string }[] = [
    { value: "sand-filter", label: "Sand Filter", icon: Filter, description: "Traditional sand filtration" },
    { value: "compact-filter", label: "Compact Filter", icon: Filter, description: "Space-saving compact filters" },
    { value: "cartridge-filter", label: "Cartridge Filter", icon: Filter, description: "Easy-maintenance cartridge system" },
  ];

  const contactMethods = [
    { value: "call", label: "Call" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "email", label: "Email" },
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1048576) {
      toast.error("File size must be less than 1 MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, or PDF files are allowed");
      return;
    }

    setSelectedFile(file);
  };

  const uploadFile = async (): Promise<{ url: string; name: string } | null> => {
    if (!selectedFile || !user) return null;

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("pre-consultation-files")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("pre-consultation-files")
        .getPublicUrl(fileName);

      return { url: publicUrl, name: selectedFile.name };
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to submit the form");
      return;
    }

    if (!formData.service || !formData.facility || !formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      let fileData = null;
      if (selectedFile) {
        fileData = await uploadFile();
        if (!fileData) return;
      }

      const { error } = await supabase
        .from("pre_consultations")
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
          reference_file_url: fileData?.url || null,
          reference_file_name: fileData?.name || null,
        });

      if (error) throw error;

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onOpenChange(false);
        setTimeout(() => {
          setStep(1);
          setSelectedFile(null);
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
        }, 300);
      }, 2000);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit form. Please try again.");
    }
  };

  if (showSuccess) {
    return (
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md text-center">
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold">Form Submitted Successfully!</DialogTitle>
            <p className="text-muted-foreground">
              Thank you for your submission. Our team will review your request and contact you soon.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Pre-Consultation Form</DialogTitle>
          <DialogDescription className="text-base mt-2">
            We offer <span className="font-semibold text-primary">Renovation</span> services including <span className="font-semibold">Design & Build</span>. Let us know your project details.
          </DialogDescription>
          <div className="space-y-2 mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Step {step} of {totalSteps}</span>
              <span className="text-muted-foreground">{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <Progress value={(step / totalSteps) * 100} />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-6">
          {/* Step 1: Service Required */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">What service do you need?</h3>
                <p className="text-sm text-muted-foreground">Select the service that best fits your needs</p>
              </div>
              <Carousel className="w-full max-w-2xl mx-auto">
                <CarouselContent>
                  {services.map((service) => {
                    const Icon = service.icon;
                    const isSelected = formData.service === service.value;
                    return (
                      <CarouselItem key={service.value} className="basis-full md:basis-1/2 lg:basis-1/3">
                        <Card 
                          className={`cursor-pointer transition-all bg-[#0D2D44] h-full ${
                            isSelected
                              ? "ring-2 ring-primary shadow-[0_0_10px_rgba(140,198,63,0.2)]" 
                              : "hover:shadow-md"
                          }`}
                          onClick={() => setFormData({ ...formData, service: service.value })}
                        >
                          <CardContent className="p-6 text-center flex flex-col items-center justify-center min-h-[180px]">
                            <Icon className={`w-10 h-10 mb-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                            <p className="font-bold text-[#E0F7FA] mb-2">{service.label}</p>
                            <p className="text-xs text-[#587C88]">{service.description}</p>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}

          {/* Step 2: Facility Type */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">What type of facility?</h3>
                <p className="text-sm text-muted-foreground">Choose the facility you want to work on</p>
              </div>
              <Carousel className="w-full max-w-2xl mx-auto">
                <CarouselContent>
                  {facilities.map((facility) => {
                    const Icon = facility.icon;
                    const isSelected = formData.facility === facility.value;
                    return (
                      <CarouselItem key={facility.value} className="basis-full md:basis-1/2 lg:basis-1/3">
                        <Card 
                          className={`cursor-pointer transition-all bg-[#0D2D44] h-full ${
                            isSelected
                              ? "ring-2 ring-primary shadow-[0_0_10px_rgba(140,198,63,0.2)]" 
                              : "hover:shadow-md"
                          }`}
                          onClick={() => setFormData({ ...formData, facility: facility.value })}
                        >
                          <CardContent className="p-6 text-center flex flex-col items-center justify-center min-h-[180px]">
                            <Icon className={`w-10 h-10 mb-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                            <p className="font-bold text-[#E0F7FA] mb-2">{facility.label}</p>
                            <p className="text-xs text-[#587C88]">{facility.description}</p>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}

          {/* Step 3: Surface Type */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">What surface type?</h3>
                <p className="text-sm text-muted-foreground">Select your preferred pool surface style</p>
              </div>
              <Carousel className="w-full max-w-2xl mx-auto">
                <CarouselContent>
                  {surfaces.map((surface) => {
                    const Icon = surface.icon;
                    const isSelected = formData.surface === surface.value;
                    return (
                      <CarouselItem key={surface.value} className="basis-full md:basis-1/2">
                        <Card 
                          className={`cursor-pointer transition-all bg-[#0D2D44] h-full ${
                            isSelected
                              ? "ring-2 ring-primary shadow-[0_0_10px_rgba(140,198,63,0.2)]" 
                              : "hover:shadow-md"
                          }`}
                          onClick={() => setFormData({ ...formData, surface: surface.value })}
                        >
                          <CardContent className="p-6 text-center flex flex-col items-center justify-center min-h-[180px]">
                            <Icon className={`w-10 h-10 mb-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                            <p className="font-bold text-[#E0F7FA] mb-2">{surface.label}</p>
                            <p className="text-xs text-[#587C88]">{surface.description}</p>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}

          {/* Step 4: Finishing */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Choose your finishing</h3>
                <p className="text-sm text-muted-foreground">Select the material for your pool finish</p>
              </div>
              <Carousel className="w-full max-w-2xl mx-auto">
                <CarouselContent>
                  {finishings.map((finishing) => {
                    const Icon = finishing.icon;
                    const isSelected = formData.finishing === finishing.value;
                    return (
                      <CarouselItem key={finishing.value} className="basis-full md:basis-1/2">
                        <Card 
                          className={`cursor-pointer transition-all bg-[#0D2D44] h-full ${
                            isSelected
                              ? "ring-2 ring-primary shadow-[0_0_10px_rgba(140,198,63,0.2)]" 
                              : "hover:shadow-md"
                          }`}
                          onClick={() => setFormData({ ...formData, finishing: finishing.value })}
                        >
                          <CardContent className="p-6 text-center flex flex-col items-center justify-center min-h-[180px]">
                            <Icon className={`w-10 h-10 mb-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                            <p className="font-bold text-[#E0F7FA] mb-2">{finishing.label}</p>
                            <p className="text-xs text-[#587C88]">{finishing.description}</p>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}

          {/* Step 5: Desired Size */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Desired size (optional)</h3>
                <p className="text-sm text-muted-foreground">Enter approximate dimensions in meters</p>
              </div>
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Length (m)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Width (m)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Depth (m)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={formData.depth}
                    onChange={(e) => setFormData({ ...formData, depth: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Filtration System */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Select filtration system</h3>
                <p className="text-sm text-muted-foreground">Choose your preferred water filtration type (optional)</p>
              </div>
              <Carousel className="w-full max-w-2xl mx-auto">
                <CarouselContent>
                  {filtrations.map((filtration) => {
                    const Icon = filtration.icon;
                    const isSelected = formData.filtration === filtration.value;
                    return (
                      <CarouselItem key={filtration.value} className="basis-full md:basis-1/2">
                        <Card 
                          className={`cursor-pointer transition-all bg-[#0D2D44] h-full ${
                            isSelected
                              ? "ring-2 ring-primary shadow-[0_0_10px_rgba(140,198,63,0.2)]" 
                              : "hover:shadow-md"
                          }`}
                          onClick={() => setFormData({ ...formData, filtration: filtration.value })}
                        >
                          <CardContent className="p-6 text-center flex flex-col items-center justify-center min-h-[180px]">
                            <Icon className={`w-10 h-10 mb-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                            <p className="font-bold text-[#E0F7FA] mb-2">{filtration.label}</p>
                            <p className="text-xs text-[#587C88]">{filtration.description}</p>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}

          {/* Step 7: Contact Details */}
          {step === 7 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Your contact details</h3>
                <p className="text-sm text-muted-foreground">How can we reach you?</p>
              </div>
              <div className="space-y-4 max-w-lg mx-auto">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+971 50 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contactMethod">Preferred Contact Method *</Label>
                  <RadioGroup 
                    value={formData.contactMethod} 
                    onValueChange={(value) => setFormData({ ...formData, contactMethod: value })}
                  >
                    {contactMethods.map((method) => (
                      <div key={method.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={method.value} id={method.value} />
                        <Label htmlFor={method.value} className="font-normal cursor-pointer">
                          {method.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {/* Step 8: File Upload */}
          {step === 8 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Upload reference file (optional)</h3>
                <p className="text-sm text-muted-foreground">
                  Share photos or documents that help us understand your needs (max 1 MB)
                </p>
              </div>
              <div className="max-w-lg mx-auto">
                <Label 
                  htmlFor="file-upload" 
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                    {selectedFile ? (
                      <div className="text-center">
                        <p className="text-sm font-medium">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">JPG, PNG, or PDF (max 1 MB)</p>
                      </>
                    )}
                  </div>
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={handleFileChange}
                  />
                </Label>
                {selectedFile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    className="w-full mt-2"
                  >
                    Remove file
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between gap-4 pt-4 border-t">
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
            <Button onClick={handleSubmit} disabled={uploading}>
              {uploading ? "Uploading..." : "Submit Form"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PreConsultationModal;
