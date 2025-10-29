import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import maintenanceImg from "@/assets/service-maintenance.jpg";
import inspectionImg from "@/assets/service-inspection.jpg";
import renovationImg from "@/assets/service-renovation.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-['Inter',sans-serif]">
      <Navbar />
      <Hero />
      <WhatsAppButton />

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
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Team</h2>
            <p className="text-lg text-muted-foreground">
              Expert professionals dedicated to excellence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { name: "Ahmed Al-Khalifa", role: "Operations Manager", desc: "15+ years in facility management" },
              { name: "Mohammed Hassan", role: "Lead Technician", desc: "Expert in pool systems & automation" },
              { name: "Fatima Al-Mansour", role: "Quality Supervisor", desc: "Ensuring top-tier service standards" },
              { name: "Khalid Ibrahim", role: "Technical Specialist", desc: "Advanced diagnostics & repairs" },
            ].map((member, idx) => (
              <Card key={idx} className="text-center hover:shadow-medium transition-shadow">
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Partners</h2>
            <p className="text-lg text-muted-foreground">
              Working with industry-leading brands
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 max-w-5xl mx-auto">
            {["AstralPool", "Hayward", "Emaux", "Pentair", "Zodiac"].map((partner, idx) => (
              <div
                key={idx}
                className="text-4xl font-bold text-muted-foreground/30 hover:text-primary transition-colors cursor-pointer grayscale hover:grayscale-0"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-muted/30">
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
                      <a href="tel:+97317000000" className="text-muted-foreground hover:text-primary transition-colors">
                        +973 1700 0000
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
                      <p className="text-muted-foreground">Bahrain</p>
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

      <Footer />
    </div>
  );
};

export default Index;
