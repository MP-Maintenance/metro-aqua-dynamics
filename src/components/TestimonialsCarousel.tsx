import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Star, Quote } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { useReviews } from "@/features/reviews/hooks/useReviews";
import { Skeleton } from "@/components/ui/skeleton";

const TestimonialsCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const { reviews, loading } = useReviews(true);
  const plugin = useRef(
    Autoplay({ delay: 4500, stopOnInteraction: true })
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[320px]" />
          <Skeleton className="h-[320px]" />
        </div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto text-center py-12">
        <p className="text-muted-foreground">No testimonials available yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin.current]}
        className="w-full max-w-6xl mx-auto"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="-ml-4">
          {reviews.map((review, idx) => (
            <CarouselItem key={review.id} className="pl-4 md:basis-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <Card className="bg-card border-primary/20 hover:border-primary/40 transition-all duration-300 h-full">
                  <CardContent className="pt-8 pb-6 px-6 relative flex flex-col h-full min-h-[320px]">
                    {/* Decorative Quote Icon */}
                    <div className="absolute top-4 right-4 opacity-10">
                      <Quote className="w-12 h-12 text-primary" />
                    </div>

                    {/* Rating Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(review.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-sm text-text-secondary leading-relaxed italic mb-6 flex-grow">
                      "{review.comment}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 mt-auto">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold shadow-glow-primary flex-shrink-0">
                        {review.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-primary text-sm">
                          {review.name}
                        </h4>
                        {review.role && (
                          <p className="text-xs text-text-muted">
                            {review.role}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-12" />
        <CarouselNext className="hidden md:flex -right-12" />
      </Carousel>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className="w-3 h-3 rounded-full transition-all duration-300"
            style={{
              backgroundColor: current === index ? "#8CC63F" : "#587C88",
              boxShadow: current === index ? "0 0 8px #8CC63F" : "none",
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
