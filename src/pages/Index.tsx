import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Hero from "@/components/Hero";
import WaveBackground from "@/components/WaveBackground";
import ServiceCard from "@/components/ServiceCard";
import ScrollArrows from "@/components/ScrollArrows";
import StatsCounter from "@/components/StatsCounter";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import maintenanceImg from "@/assets/service-maintenance.jpg";
import inspectionImg from "@/assets/service-inspection.jpg";
import renovationImg from "@/assets/service-renovation.jpg";

const countries = [
  { name: "Qatar", code: "+974" },
  { name: "UAE (Dubai)", code: "+971" },
  { name: "Saudi Arabia", code: "+966" },
  { name: "Bahrain", code: "+973" },
  { name: "Kuwait", code: "+965" },
  { name: "Oman", code: "+968" },
  { name: "Egypt", code: "+20" },
];

const Index = () => {
  const [selectedTeamMember, setSelectedTeamMember] = useState<{
    name: string;
    role: string;
    email: string;
    mobile: string;
    image?: string;
  } | null>(null);

  const [selectedPartner, setSelectedPartner] = useState<{
    name: string;
    country: string;
    description: string;
    tagline: string;
    logo: string;
  } | null>(null);

  const [selectedCountryCode, setSelectedCountryCode] = useState("+974");

  const teamMembers = [
    { 
      name: "Ahmed Al-Khalifa", 
      role: "Operations Manager", 
      email: "ahmed@metropools.com",
      mobile: "+973 3300 0001",
      desc: "15+ years in facility management" 
    },
    { 
      name: "Mohammed Hassan", 
      role: "Lead Technician", 
      email: "mohammed@metropools.com",
      mobile: "+973 3300 0002",
      desc: "Expert in pool systems & automation" 
    },
    { 
      name: "Fatima Al-Mansour", 
      role: "Quality Supervisor", 
      email: "fatima@metropools.com",
      mobile: "+973 3300 0003",
      desc: "Ensuring top-tier service standards" 
    },
    { 
      name: "Khalid Ibrahim", 
      role: "Technical Specialist", 
      email: "khalid@metropools.com",
      mobile: "+973 3300 0004",
      desc: "Advanced diagnostics & repairs" 
    },
  ];

  const partners = [
    { 
      name: "AstralPool", 
      tagline: "Innovative Water Solutions",
      country: "Spain",
      description: "Global leader in pool and wellness equipment, offering filtration systems, pumps, and automation solutions.",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=100&fit=crop"
    },
    { 
      name: "Hayward", 
      tagline: "Efficiency & Performance",
      country: "United States",
      description: "Industry pioneer in residential and commercial pool equipment including pumps, filters, heaters, and automation.",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=100&fit=crop"
    },
    { 
      name: "Emaux", 
      tagline: "Quality Pool Equipment",
      country: "China",
      description: "Manufacturer of comprehensive pool equipment including sand filters, heat pumps, and water treatment systems.",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=100&fit=crop"
    },
    { 
      name: "Pentair", 
      tagline: "Smart & Sustainable",
      country: "United States",
      description: "Leading provider of smart pool technology, variable speed pumps, and energy-efficient water solutions.",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=100&fit=crop"
    },
    { 
      name: "Zodiac", 
      tagline: "Advanced Pool Technology",
      country: "France",
      description: "Specialist in robotic pool cleaners, water treatment, and connected pool management systems.",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=100&fit=crop"
    },
  ];

  return (
    <div className="min-h-screen bg-background font-['Inter',sans-serif] relative">
      <WaveBackground />
      <Navbar />
      <div id="hero">
        <Hero />
      </div>
      <WhatsAppButton />
      <ScrollArrows />

      {/* About Us Section */}
      <section id="about" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">About Metro Pools</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Metro Pools has been a trusted name in facility management for over a decade, 
              providing specialized maintenance for swimming pools, fountains, spas, and wellness 
              facilities. We combine technical expertise with premium service quality to ensure 
              safety, efficiency, and crystal-clear results. Our commitment to excellence has 
              made us the preferred choice for villas, hotels, compounds, parks, and commercial 
              properties across the region.
            </p>
            <StatsCounter />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground">
              Professional solutions for all your pool maintenance needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              title="Maintenance / Cleaning"
              description="Routine and preventive cleaning to keep your pool safe, hygienic, and sparkling."
              image={maintenanceImg}
              link="/services#maintenance"
            />
            <ServiceCard
              title="Inspection / Repairs"
              description="Professional assessment and corrective actions for leaks, pumps, and structural issues."
              image={inspectionImg}
              link="/services#inspection"
            />
            <ServiceCard
              title="Renovation"
              description="Transform and upgrade old facilities with modern fittings, finishes, and energy-efficient systems."
              image={renovationImg}
              link="/services#renovation"
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Team</h2>
            <p className="text-lg text-muted-foreground">
              Expert professionals dedicated to excellence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member, idx) => (
              <Card 
                key={idx} 
                className="text-center hover:shadow-medium transition-shadow cursor-pointer"
                onClick={() => setSelectedTeamMember(member)}
              >
                <CardContent className="pt-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-sm text-primary mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Partners</h2>
            <p className="text-lg text-muted-foreground">
              Working with industry-leading brands
            </p>
          </div>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 3000,
              }),
            ]}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-4">
              {partners.map((partner, idx) => (
                <CarouselItem key={idx} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card 
                    className="border-2 hover:border-primary transition-all duration-300 cursor-pointer h-full"
                    onClick={() => setSelectedPartner(partner)}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-6 min-h-[180px]">
                      <div className="text-3xl font-bold text-primary mb-3 text-center">
                        {partner.name}
                      </div>
                      <p className="text-xs text-muted-foreground text-center italic">
                        {partner.tagline}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h2>
            <p className="text-lg text-muted-foreground">
              Get in touch with our team
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a href="mailto:info@metropools.com" className="text-muted-foreground hover:text-primary transition-colors">
                        info@metropools.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <a href="tel:+97444771588" className="text-muted-foreground hover:text-primary transition-colors">
                        +974 4477 1588
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Address</h3>
                      <a 
                        href="https://maps.app.goo.gl/hsDcLnTRTu6NYreyk9" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        Building No. 225, Zone 44, Street No. 250<br />
                        Nuaija Area, P.O. Box: 32163<br />
                        Doha, Qatar
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card>
              <CardContent className="pt-6">
                <form
                  action="https://formspree.io/f/YOUR_FORM_ID"
                  method="POST"
                  className="space-y-4"
                >
                  <div>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      required
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
                    <Textarea
                      name="message"
                      placeholder="Your Message"
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Member Dialog */}
      <Dialog open={!!selectedTeamMember} onOpenChange={() => setSelectedTeamMember(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedTeamMember?.name}</DialogTitle>
            <DialogDescription className="text-primary font-medium">{selectedTeamMember?.role}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-accent mx-auto flex items-center justify-center text-white text-4xl font-bold">
              {selectedTeamMember?.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href={`mailto:${selectedTeamMember?.email}`} className="text-sm hover:text-primary transition-colors">
                  {selectedTeamMember?.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href={`tel:${selectedTeamMember?.mobile}`} className="text-sm hover:text-primary transition-colors">
                  {selectedTeamMember?.mobile}
                </a>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Partner Dialog */}
      <Dialog open={!!selectedPartner} onOpenChange={() => setSelectedPartner(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-primary">{selectedPartner?.name}</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium">
              {selectedPartner?.country}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
              <div className="text-6xl font-bold text-primary">
                {selectedPartner?.name}
              </div>
            </div>
            <p className="text-foreground leading-relaxed">
              {selectedPartner?.description}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Index;
