import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import QuoteModal from "@/components/QuoteModal";
import ProductEditModal from "@/components/ProductEditModal";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Filter, Thermometer, Lightbulb, Droplets, Square, Cpu, Sparkles, Wind, Zap, Waves, Shield, Pencil } from "lucide-react";

const Products = () => {
  const { isAdmin } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<{
    name: string;
    description: string;
    icon: any;
    category: string;
    availability: "available" | "not-available";
  } | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<{
    name: string;
    description: string;
    category: string;
    availability: "available" | "not-available";
  } | null>(null);

  const categories = [
    {
      id: "filtration",
      name: "Filtration",
      icon: Filter,
      products: [
        { name: "Sand Filters", description: "High-capacity filtration systems" },
        { name: "Cartridge Filters", description: "Easy-maintenance filter solutions" },
        { name: "Multiport Valves", description: "Precision flow control" },
      ],
    },
    {
      id: "heating",
      name: "Pool Heating / Chiller",
      icon: Thermometer,
      products: [
        { name: "Heat Pumps", description: "Energy-efficient heating" },
        { name: "Gas Heaters", description: "Rapid heating solutions" },
        { name: "Pool Chillers", description: "Temperature regulation" },
      ],
    },
    {
      id: "lighting",
      name: "Pool Lighting",
      icon: Lightbulb,
      products: [
        { name: "LED Underwater Lights", description: "Color-changing options" },
        { name: "RGB Controllers", description: "Smart lighting control" },
        { name: "Fiber Optic Lighting", description: "Premium illumination" },
      ],
    },
    {
      id: "fittings",
      name: "Pool Fittings",
      icon: Droplets,
      products: [
        { name: "Main Drains", description: "High-flow drainage systems" },
        { name: "Skimmers", description: "Surface cleaning efficiency" },
        { name: "Return Inlets", description: "Optimized water circulation" },
      ],
    },
    {
      id: "surround",
      name: "Pool Surround",
      icon: Square,
      products: [
        { name: "Deck Tiles", description: "Non-slip surfaces" },
        { name: "Coatings", description: "Weather-resistant finishes" },
        { name: "Coping Stones", description: "Elegant edge finishing" },
      ],
    },
    {
      id: "pumps",
      name: "Pumps",
      icon: Cpu,
      products: [
        { name: "Circulation Pumps", description: "Reliable water flow" },
        { name: "Variable Speed Pumps", description: "Energy optimization" },
        { name: "Booster Pumps", description: "Enhanced pressure" },
      ],
    },
    {
      id: "fountain",
      name: "Fountain Accessories",
      icon: Sparkles,
      products: [
        { name: "Nozzles", description: "Decorative water patterns" },
        { name: "Jet Rings", description: "Multiple spray options" },
        { name: "Submersible Pumps", description: "Quiet operation" },
      ],
    },
    {
      id: "spa",
      name: "Spa Fittings",
      icon: Wind,
      products: [
        { name: "Air Blowers", description: "Hydrotherapy systems" },
        { name: "Jets", description: "Massage functionality" },
        { name: "Control Panels", description: "Smart spa management" },
      ],
    },
    {
      id: "treatment",
      name: "Water Treatment",
      icon: Zap,
      products: [
        { name: "Chlorinators", description: "Automated sanitization" },
        { name: "pH Controllers", description: "Balance monitoring" },
        { name: "Dosing Systems", description: "Precise chemical control" },
      ],
    },
    {
      id: "wellness",
      name: "Wellness",
      icon: Waves,
      products: [
        { name: "Steam Generators", description: "Spa experiences" },
        { name: "Sauna Heaters", description: "Traditional wellness" },
        { name: "Aromatherapy Systems", description: "Relaxation enhancement" },
      ],
    },
    {
      id: "covers",
      name: "Pool Covers",
      icon: Shield,
      products: [
        { name: "Manual Rollers", description: "Easy operation" },
        { name: "Automatic Covers", description: "Motorized convenience" },
        { name: "Safety Covers", description: "Protection & security" },
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
            Our Products
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Premium pool equipment and accessories from industry-leading brands
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id} id={category.id}>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold">{category.name}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.products.map((product, idx) => (
                      <Card
                        key={idx}
                        className="group hover:shadow-medium transition-all duration-300 relative"
                      >
                        {isAdmin && (
                          <Button
                            size="icon"
                            variant="secondary"
                            className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingProduct({
                                name: product.name,
                                description: product.description,
                                category: category.name,
                                availability: idx % 3 === 0 ? "not-available" : "available",
                              });
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        <CardContent className="pt-6">
                          <div 
                            className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-4 flex items-center justify-center"
                          >
                            <Icon className="w-16 h-16 text-primary/30" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                          <p className="text-muted-foreground mb-4">{product.description}</p>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => {
                              setSelectedProduct({
                                name: product.name,
                                description: product.description,
                                icon: Icon,
                                category: category.name,
                                availability: idx % 3 === 0 ? "not-available" : "available",
                              });
                              setIsQuoteModalOpen(true);
                            }}
                          >
                            Request Quote
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-accent to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Need Help Choosing Products?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Our experts are here to help you select the perfect equipment for your needs
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
            <Link to="/quote">Contact Our Team</Link>
          </Button>
        </div>
      </section>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => {
          setIsQuoteModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />

      <ProductEditModal
        product={editingProduct}
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
      />

      <Footer />
    </div>
  );
};

export default Products;
