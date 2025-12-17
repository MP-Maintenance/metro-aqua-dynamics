import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Package, ArrowRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number | null;
  category: string;
}

interface FeaturedProductsViewerProps {
  products: Product[];
}

const FeaturedProductsViewer = ({ products }: FeaturedProductsViewerProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = products[activeIndex];

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (products.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [products.length]);

  if (products.length === 0) return null;

  return (
    <section className="relative h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeProduct?.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {activeProduct?.image_url ? (
            <img
              src={activeProduct.image_url}
              alt={activeProduct.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-background to-accent/20 flex items-center justify-center">
              <Package className="w-32 h-32 text-primary/20" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-center z-10 pointer-events-none px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProduct?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-2xl"
          >
            <p className="text-sm uppercase tracking-wider text-primary font-medium mb-2">
              Featured Products
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 text-foreground drop-shadow-lg">
              {activeProduct?.name}
            </h2>
            {activeProduct?.description && (
              <p className="text-base md:text-lg text-muted-foreground line-clamp-2 mb-4">
                {activeProduct.description}
              </p>
            )}
            {activeProduct?.price && (
              <p className="text-2xl font-bold text-primary mb-6">
                ${activeProduct.price.toFixed(2)}
              </p>
            )}
            <Button asChild size="lg" className="gap-2 pointer-events-auto">
              <Link to="/products">
                View All Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Thumbnail Dock */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-background/20 backdrop-blur-md border border-border/30 rounded-2xl p-2 shadow-xl"
        >
          <div className="flex items-center gap-2">
            {products.map((product, index) => (
              <motion.button
                key={product.id}
                onClick={() => setActiveIndex(index)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden cursor-pointer 
                  transition-all duration-300 flex-shrink-0
                  ${activeIndex === index 
                    ? "ring-2 ring-primary scale-110 opacity-100 shadow-lg shadow-primary/20" 
                    : "opacity-60 hover:opacity-90"
                  }
                `}
              >
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary/60" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProductsViewer;
