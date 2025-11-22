import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import QuoteModal from "@/components/QuoteModal";
import ProductEditModal from "@/components/ProductEditModal";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Filter, Thermometer, Lightbulb, Droplets, Square, Cpu, Sparkles, Wind, Zap, Waves, Shield, Pencil, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  availability: string | null;
  image_url: string | null;
  price: number | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

const Products = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Icon mapping for categories
  const iconMap: { [key: string]: any } = {
    Filter,
    Thermometer,
    Lightbulb,
    Droplets,
    Square,
    Cpu,
    Sparkles,
    Wind,
    Zap,
    Waves,
    Shield,
  };

  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await (supabase as any)
        .from("categories")
        .select("*")
        .order("name");

      if (categoriesError) throw categoriesError;

      // Fetch products
      const { data: productsData, error: productsError } = await (supabase as any)
        .from("products")
        .select("*")
        .order("category", { ascending: true });

      if (productsError) throw productsError;

      setCategories(categoriesData || []);
      setProducts(productsData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Group products by category slug (products.category matches categories.slug)
  const groupedProducts = categories.map((category) => ({
    ...category,
    products: products.filter((p) => p.category === category.slug),
  }));

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
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : groupedProducts.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <p className="text-xl">No products available at the moment.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {groupedProducts.map((category) => {
                if (category.products.length === 0) return null;
                
                const Icon = iconMap[category.icon || ""] || Package;
                
                return (
                  <div key={category.id} id={category.slug}>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h2 className="text-3xl font-bold">{category.name}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.products.map((product) => (
                        <Card
                          key={product.id}
                          className="group hover:shadow-medium transition-all duration-300 relative"
                        >
                          {isAdmin && (
                            <Button
                              size="icon"
                              variant="secondary"
                              className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingProduct(product);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          <CardContent className="pt-6">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-48 w-full object-cover rounded-lg mb-4"
                              />
                            ) : (
                              <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-4 flex items-center justify-center">
                                <Icon className="w-16 h-16 text-primary/30" />
                              </div>
                            )}
                            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                            <p className="text-muted-foreground mb-4">{product.description}</p>
                            {product.price && (
                              <p className="text-primary font-semibold mb-4">
                                ${product.price.toFixed(2)}
                              </p>
                            )}
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => {
                                setSelectedProduct(product);
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
          )}
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
        onSave={fetchData}
      />

      <Footer />
    </div>
  );
};

export default Products;
