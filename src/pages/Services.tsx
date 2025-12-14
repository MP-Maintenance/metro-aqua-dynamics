import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Droplets, Wrench, Sparkles, CheckCircle, Layers } from "lucide-react";
import { motion } from "framer-motion";
import maintenanceImg from "@/assets/service-maintenance.jpg";
import inspectionImg from "@/assets/service-inspection.jpg";
import renovationImg from "@/assets/service-renovation.jpg";

const Services = () => {
  const services = [
    {
      id: "maintenance",
      icon: Droplets,
      title: "Maintenance / Cleaning",
      image: maintenanceImg,
      description: "Comprehensive pool maintenance services to ensure optimal performance and hygiene",
      features: [
        "Regular water testing and chemical balancing",
        "Vacuuming and brushing of pool surfaces",
        "Skimmer and filter basket cleaning",
        "Filter backwashing and maintenance",
        "Pool equipment inspection",
        "Preventive maintenance schedules",
        "Emergency cleaning services",
        "Seasonal opening and closing",
      ],
    },
    {
      id: "inspection",
      icon: Wrench,
      title: "Inspection / Repairs",
      image: inspectionImg,
      description: "Professional diagnostics and repairs using industry-leading equipment",
      features: [
        "Comprehensive pool system inspection",
        "Leak detection and repair",
        "Pump and motor servicing",
        "Filter repair and replacement",
        "Plumbing system diagnostics",
        "Electrical system checks",
        "Structural integrity assessment",
        "Equipment calibration and optimization",
      ],
    },
    {
      id: "renovation",
      icon: Sparkles,
      title: "Renovation",
      image: renovationImg,
      description: "Transform your pool with modern upgrades and energy-efficient solutions",
      features: [
        "Complete pool resurfacing",
        "Tile and coping replacement",
        "LED lighting installation",
        "Automation system upgrades",
        "Energy-efficient equipment installation",
        "Deck restoration and refinishing",
        "Water feature integration",
        "Modern aesthetic enhancements",
      ],
    },
    {
      id: "design-build",
      icon: Layers,
      title: "Design & Build",
      image: renovationImg,
      description: "Custom pool design and construction tailored to your vision and space",
      features: [
        "Conceptual design & 3D visualization",
        "Pool construction and excavation",
        "Custom finishes, materials, and surfaces",
        "Integration of water features and lighting",
        "Automation and smart controls installation",
        "Deck and landscape design coordination",
        "Energy-efficient and sustainable solutions",
        "Complete project management from start to finish",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background font-['Inter',sans-serif]">
      <Navbar />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Our Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Professional pool maintenance, inspection, and renovation services tailored to your needs
          </p>
        </div>
      </section>

      {/* Services Details */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-24">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  id={service.id}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? "lg:grid-flow-dense" : ""
                  }`}
                >
                  <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                    <div className="relative rounded-2xl overflow-hidden shadow-strong h-[400px]">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}>
                    <div className="inline-flex items-center justify-center p-3 rounded-lg bg-primary/10 mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-4xl font-bold mb-4">{service.title}</h2>
                    <p className="text-lg text-muted-foreground mb-6">
                      {service.description}
                    </p>
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="font-semibold mb-4">What's Included:</h3>
                        <ul className="space-y-3">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    <Button asChild size="lg" className="mt-6">
                      <Link to="/quote">Request This Service</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Transformation Gallery */}
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-accent to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Contact us today for a free consultation and quote
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
            <Link to="/quote">Get a Free Quote</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
