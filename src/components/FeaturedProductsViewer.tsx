import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowRight, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useQuote } from "@/features/quotes/contexts/QuoteContext";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number | null;
  category: string;
  availability?: string | null;
}

interface FeaturedProductsViewerProps {
  products: Product[];
}

const FeaturedProductsViewer = ({ products }: FeaturedProductsViewerProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = products[activeIndex];
  const { addItem, setIsCartOpen } = useQuote();
  const { user, setIsAuthModalOpen } = useAuth();

  const goToPrevious = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
  }, [products.length]);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (products.length <= 1) return;
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [products.length, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevious, goToNext]);


  const handleAddToQuote = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (activeProduct) {
      addItem({
        id: activeProduct.id,
        name: activeProduct.name,
        description: activeProduct.description || "",
        category: activeProduct.category,
        icon: Package,
        availability: (activeProduct.availability === "available" || activeProduct.availability === "not-available") 
          ? activeProduct.availability 
          : "available",
      });
      toast.success(`${activeProduct.name} added to quote request`);
      setIsCartOpen(true);
    }
  };

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

      {/* Navigation Arrows - Desktop only */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-background/20 backdrop-blur-md border border-border/30 text-foreground hover:bg-background/40 transition-all duration-300 hover:scale-110"
        aria-label="Previous product"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-background/20 backdrop-blur-md border border-border/30 text-foreground hover:bg-background/40 transition-all duration-300 hover:scale-110"
        aria-label="Next product"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

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
            
            {/* Category Badge */}
            <Badge variant="secondary" className="mb-3 pointer-events-auto">
              {activeProduct?.category}
            </Badge>
            
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
            
            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 pointer-events-auto">
              <Button 
                onClick={handleAddToQuote}
                size="lg" 
                className="gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Quote
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link to="/products">
                  View All Products
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Thumbnail Dock with Progress Indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center z-20 px-4 gap-4">
        {/* Progress Indicator */}
        <div className="flex items-center gap-2">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`
                h-1.5 rounded-full transition-all duration-300
                ${activeIndex === index 
                  ? "w-8 bg-primary" 
                  : "w-2 bg-foreground/30 hover:bg-foreground/50"
                }
              `}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>

        {/* Thumbnail Dock */}
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
