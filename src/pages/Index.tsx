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
import { useTeam } from "@/features/team/hooks/useTeam";
import { usePartners } from "@/features/partners/hooks/usePartners";
import { Card, CardContent } from "@/components/ui/card";
import { LazyImage } from "@/components/ui/LazyImage";
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
  const { team: teamMembers, loading: teamLoading } = useTeam();
  const { partners, loading: partnersLoading } = usePartners();
  
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

  return (
    <div className="min-h-screen bg-background font-['Inter',sans-serif] relative">
      <ScrollProgress />
      <WaveBackground />
      <Navbar />
      <FloatingActionButton />
      <ScrollToTop />
      <ChatbotWidget />
      <div id="hero">
        <Hero />
      </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Maintenance / Cleaning", description: "Routine and preventive cleaning to keep your pool safe, hygienic, and sparkling.", image: maintenanceImg, link: "/services#maintenance" },
                { title: "Inspection / Repairs", description: "Professional assessment and corrective actions for leaks, pumps, and structural issues.", image: inspectionImg, link: "/services#inspection" },
                { title: "Renovation", description: "Transform your pool with modern upgrades and energy-efficient solutions.", image: renovationImg, link: "/services#renovation" },
                { title: "Design & Build", description: "Custom aesthetic pool design and construction tailored to your vision and space.", image: renovationImg, link: "/services#design-build" }
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
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-4">
              {teamLoading ? (
                <div className="w-full text-center text-muted-foreground py-12">Loading team...</div>
              ) : teamMembers.length === 0 ? (
                <div className="w-full text-center text-muted-foreground py-12">No team members found.</div>
              ) : teamMembers.map((member, idx) => (
                <CarouselItem key={idx} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <motion.div
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
                          {member.imageurl ? (
                            <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 shadow-glow-primary">
                              <LazyImage
                                src={member.imageurl}
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-glow-primary">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                          <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                          <p className="text-sm text-primary mb-2">{member.role}</p>
                          <p className="text-sm text-muted-foreground">{member.description}</p>
                        </CardContent>
                      }
                      backContent={{
                        name: member.name,
                        email: member.email,
                        mobile: member.mobile,
                      }}
                    />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
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
              {partnersLoading ? (
                <div className="w-full text-center text-muted-foreground py-12">Loading partners...</div>
              ) : partners.length === 0 ? (
                <div className="w-full text-center text-muted-foreground py-12">No partners found.</div>
              ) : partners.map((partner, idx) => (
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

      {/* Get In Touch Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Get In Touch</h2>
            <p className="text-lg text-muted-foreground">
              Share your experience or reach out to us
            </p>
          </motion.div>

          {/* What Our Clients Say - Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-foreground">
              What Our Clients Say
            </h3>
            <TestimonialsCarousel />
          </motion.div>

          {/* Review Form and Contact Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mt-8 md:mt-12">
            {/* Review Submission Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-6 text-primary">Share Your Experience</h3>
              <ReviewSubmissionForm />
            </motion.div>

            {/* Company Contact Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold mb-6 text-primary">Contact Information</h3>
              <div className="space-y-4">
                <Card className="bg-card border-border/50 hover:border-secondary/50 transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-secondary/10">
                        <Mail className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-foreground">Email</h4>
                        <a href="mailto:info@metropools.com" className="text-muted-foreground hover:text-secondary transition-colors">
                          info@metropools.com
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border/50 hover:border-secondary/50 transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-secondary/10">
                        <Phone className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-foreground">Phone</h4>
                        <a href="tel:+97444771588" className="text-muted-foreground hover:text-secondary transition-colors">
                          +974 4477 1588
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border/50 hover:border-secondary/50 transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-secondary/10">
                        <MessageCircle className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-primary">WhatsApp</h4>
                        <a 
                          href="https://wa.me/97317000000" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-primary-foreground rounded-lg transition-all duration-200 font-medium shadow-glow-primary"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Message on WhatsApp
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border/50 hover:border-secondary/50 transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-secondary/10">
                        <MapPin className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-foreground">Address</h4>
                        <a 
                          href="https://maps.app.goo.gl/hsDcLnTRTu6NYreyk9" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-secondary transition-colors"
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
            </motion.div>
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
