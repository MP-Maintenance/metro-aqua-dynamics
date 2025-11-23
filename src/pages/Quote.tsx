import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import PreConsultationModal from "@/components/PreConsultationModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-pool.jpg";

const countries = [
  { name: "Qatar", code: "+974" },
  { name: "UAE (Dubai)", code: "+971" },
  { name: "Saudi Arabia", code: "+966" },
  { name: "Bahrain", code: "+973" },
  { name: "Kuwait", code: "+965" },
  { name: "Oman", code: "+968" },
  { name: "Egypt", code: "+20" },
];

const Quote = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+974");
  const [selectedOption, setSelectedOption] = useState<"quote" | "consultation">("quote");
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { inquiriesService } = await import("@/features/inquiries/services/inquiries.service");

      await inquiriesService.create({
        inquirytype: "Quote",
        fullname: formData.get("name") as string,
        email: formData.get("email") as string,
        countrycode: selectedCountryCode,
        mobilenumber: formData.get("mobile") as string,
        servicetype: formData.get("service") as string || "General",
        message: formData.get("message") as string,
      });

      toast({
        title: "Quote Request Sent!",
        description: "We'll get back to you within 24 hours.",
      });

      formElement.reset();
    } catch (error) {
      console.error("Error submitting quote:", error);
      toast({
        title: "Error",
        description: "Failed to submit quote request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-['Inter',sans-serif]">
      <Navbar />
      <WhatsAppButton />

      {/* Hero Banner */}
      <section className="relative h-[400px] overflow-hidden">
        <img
          src={heroImage}
          alt="Get a Quote"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-accent/70 to-secondary/80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
              Get a Free Quote
            </h1>
            <p className="text-xl animate-fade-in-up">
              Tell us about your project and we'll provide a detailed estimate
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Option Selector */}
            <div className="flex gap-4 mb-8 justify-center">
              <Button
                size="lg"
                variant={selectedOption === "quote" ? "default" : "outline"}
                onClick={() => setSelectedOption("quote")}
                className="min-w-[180px]"
              >
                Request a Quote
              </Button>
              <Button
                size="lg"
                variant={selectedOption === "consultation" ? "default" : "outline"}
                onClick={() => {
                  setSelectedOption("consultation");
                  setIsConsultationModalOpen(true);
                }}
                className="min-w-[180px]"
              >
                Pre-Consultation
              </Button>
            </div>

            <Card className="shadow-strong">
              <CardContent className="pt-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mobile Number <span className="text-destructive">*</span>
                    </label>
                    <div className="flex gap-2">
                      <Select value={selectedCountryCode} onValueChange={setSelectedCountryCode}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name} {country.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        type="tel"
                        name="mobile"
                        placeholder="XXXX XXXX"
                        required
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Service Type
                    </label>
                    <select
                      name="service"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="">Select a service</option>
                      <option value="maintenance">Maintenance / Cleaning</option>
                      <option value="inspection">Inspection / Repairs</option>
                      <option value="renovation">Renovation</option>
                      <option value="products">Product Purchase</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message / Project Details <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      name="message"
                      placeholder="Please describe your project requirements, location, and any specific needs..."
                      rows={6}
                      required
                      className="w-full"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Submit Request"}
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    By submitting this form, you agree to our privacy policy.
                    We'll respond within 24 hours.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Alternative Contact Methods */}
            <div className="mt-12 text-center">
              <p className="text-muted-foreground mb-4">
                Prefer to contact us directly?
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild variant="outline">
                  <a href="tel:+97444771588">Call Us</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="mailto:info@metropools.com">Email Us</a>
                </Button>
                <Button asChild variant="outline" className="bg-[#25D366] text-white hover:bg-[#20BD5A] border-none">
                  <a href="https://wa.me/97444771588" target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Consultation Modal */}
      <PreConsultationModal 
        open={isConsultationModalOpen} 
        onOpenChange={(open) => {
          setIsConsultationModalOpen(open);
          if (!open) setSelectedOption("quote");
        }}
      />

      <Footer />
    </div>
  );
};

export default Quote;
