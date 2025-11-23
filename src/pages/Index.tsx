import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatbotWidget from "@/components/ChatbotWidget";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import FloatingActionButton from "@/components/FloatingActionButton";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollProgress from "@/components/ScrollProgress";
import Hero from "@/components/Hero";
import WaveBackground from "@/components/WaveBackground";
import ServiceCard from "@/components/ServiceCard";
import FlipCard from "@/components/FlipCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import CompanyTimeline from "@/components/CompanyTimeline";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import ParallaxSection from "@/components/ParallaxSection";
import ReviewsList from "@/features/reviews/components/ReviewsList";
import ReviewSubmissionForm from "@/features/reviews/components/ReviewSubmissionForm";
import FAQSection from "@/features/faqs/components/FAQSection";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
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
      <ScrollProgress />
      <WaveBackground />
      <Navbar />
      <FloatingActionButton />
      <ScrollToTop />
      <div id="hero">
        <Hero />
      </div>

      {/* Dark Mode Showcase Section with Parallax */}
      <ParallaxSection speed={0.3}>
        <section className="py-20 bg-gradient-to-b from-background via-card to-background overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Experience the Deep Water Theme
              </h2>
              <p className="text-lg text-text-secondary leading-relaxed">
                Immerse yourself in our premium, underwater-inspired interface designed for modern pool management
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { color: "primary", label: "Electric Lime Accents", desc: "Vibrant primary actions that pop against deep navy", shadow: "shadow-glow-primary" },
                { color: "secondary", label: "Pool Teal Highlights", desc: "Cool water tones for secondary elements", shadow: "shadow-glow-secondary" },
                { color: "accent", label: "Metro Indigo Depth", desc: "Deep ocean surfaces for premium feel", shadow: "" }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className={`bg-card border-${item.color}/20 hover:border-${item.color}/50 transition-all duration-300 ${item.shadow && `hover:${item.shadow}`}`}>
                    <CardContent className="pt-6 text-center">
                      <div className={`w-16 h-16 rounded-full bg-${item.color}/20 mx-auto mb-4 flex items-center justify-center ${item.shadow}`}>
                        <div className={`w-8 h-8 rounded-full bg-${item.color} animate-pulse`} />
                      </div>
                      <h3 className="font-semibold text-lg mb-2 text-text-primary">{item.label}</h3>
                      <p className="text-sm text-text-secondary">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ParallaxSection>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">About Metro Pools</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Metro Pools has been a trusted name in facility management for over a decade, 
              providing specialized maintenance for swimming pools, fountains, spas, and wellness 
              facilities. We combine technical expertise with premium service quality to ensure 
              safety, efficiency, and crystal-clear results. Our commitment to excellence has 
              made us the preferred choice for villas, hotels, compounds, parks, and commercial 
              properties across the region.
            </p>
            <AnimatedCounter />
          </motion.div>
        </div>
      </section>

      {/* Company Timeline */}
      <CompanyTimeline />

      {/* Services Section with Parallax */}
      <ParallaxSection speed={0.2}>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
              <p className="text-lg text-muted-foreground">
                Professional solutions for all your pool maintenance needs
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Maintenance / Cleaning", description: "Routine and preventive cleaning to keep your pool safe, hygienic, and sparkling.", image: maintenanceImg, link: "/services#maintenance" },
                { title: "Inspection / Repairs", description: "Professional assessment and corrective actions for leaks, pumps, and structural issues.", image: inspectionImg, link: "/services#inspection" },
                { title: "Renovation", description: "Transform and upgrade old facilities with modern fittings, finishes, and energy-efficient systems.", image: renovationImg, link: "/services#renovation" }
              ].map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <ServiceCard
                    title={service.title}
                    description={service.description}
                    image={service.image}
                    link={service.link}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </ParallaxSection>

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
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="h-[280px]"
              >
                <FlipCard
                  type="team"
                  frontContent={
                    <CardContent className="pt-6 text-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-glow-primary">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                      <p className="text-sm text-primary mb-2">{member.role}</p>
                      <p className="text-sm text-muted-foreground">{member.desc}</p>
                    </CardContent>
                  }
                  backContent={{
                    name: member.name,
                    email: member.email,
                    mobile: member.mobile,
                  }}
                />
              </motion.div>
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
                  <div className="h-[220px]">
                    <FlipCard
                      type="partner"
                      frontContent={
                        <CardContent className="flex flex-col items-center justify-center p-6 min-h-[220px]">
                          <div className="text-3xl font-bold text-primary mb-3 text-center">
                            {partner.name}
                          </div>
                          <p className="text-xs text-muted-foreground text-center italic">
                            {partner.tagline}
                          </p>
                        </CardContent>
                      }
                      backContent={{
                        name: partner.name,
                        description: partner.description,
                      }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Testimonials Carousel */}
      <TestimonialsCarousel />

      {/* Before/After Renovation Slider */}
      <section className="py-20 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Transformation Gallery</h2>
            <p className="text-lg text-muted-foreground">
              See the stunning results of our renovation projects
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <BeforeAfterSlider
                beforeImage="https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?w=800&h=600&fit=crop"
                afterImage="https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&h=600&fit=crop"
                alt="Pool Renovation Project 1"
              />
              <p className="text-center mt-4 text-muted-foreground">Residential Pool - Complete Surface Refinishing</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <BeforeAfterSlider
                beforeImage="https://images.unsplash.com/photo-1519974719765-e6559eac2575?w=800&h=600&fit=crop"
                afterImage="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&h=600&fit=crop"
                alt="Pool Renovation Project 2"
              />
              <p className="text-center mt-4 text-muted-foreground">Commercial Hotel Pool - Modern Equipment Upgrade</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Area Map */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Where We Serve</h2>
            <p className="text-lg text-muted-foreground">
              Premium pool services across the Middle East
            </p>
          </motion.div>
          <ServiceAreaMap />
        </div>
      </section>

      {/* Reviews Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h2>
            <p className="text-lg text-muted-foreground">
              Share your experience or reach out to us
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Reviews List */}
            <div>
              <h3 className="text-2xl font-semibold mb-6">What Our Clients Say</h3>
              <ReviewsList />
            </div>

            {/* Review Submission Form */}
            <div>
              <ReviewSubmissionForm />
              
              {/* Contact Info */}
              <div className="space-y-4 mt-8">
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
                        <MessageCircle className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">WhatsApp</h3>
                        <a 
                          href="https://wa.me/97317000000" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-lg transition-colors font-medium"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Message on WhatsApp
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
            </div>
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
