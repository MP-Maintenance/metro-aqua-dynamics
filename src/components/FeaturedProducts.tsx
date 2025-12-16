import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { ArrowRight, Package } from "lucide-react";
import { LazyImage } from "@/components/ui/LazyImage";

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number | null;
  image_url: string | null;
  availability: string | null;
  brand: string | null;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, description, category, price, image_url, availability, brand")
        .eq("availability", "in_stock")
        .limit(4);

      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchFeaturedProducts();
  }, []);

  const getAvailabilityBadge = (availability: string | null) => {
    if (availability === "in_stock") {
      return <Badge className="bg-primary/90 text-primary-foreground">In Stock</Badge>;
    }
    return null;
  };

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Products</h2>
          <p className="text-lg text-muted-foreground">
            Top-quality pool equipment and supplies
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                <div className="relative aspect-square overflow-hidden">
                  {product.image_url ? (
                    <LazyImage
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <Package className="w-16 h-16 text-primary/30" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    {getAvailabilityBadge(product.availability)}
                  </div>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
                  {product.brand && (
                    <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                    {product.description}
                  </p>
                  {product.price && (
                    <p className="text-primary font-bold mt-3">${product.price.toFixed(2)}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link to="/products">
            <Button size="lg" className="gap-2">
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
