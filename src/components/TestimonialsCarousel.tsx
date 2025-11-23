import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image?: string;
}

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Ahmed Al-Mansouri",
      role: "Property Manager",
      company: "Lusail Villas",
      content: "Metro Pools transformed our community pool maintenance. Their attention to detail and professional service is unmatched. We've seen a 40% reduction in maintenance issues.",
      rating: 5,
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "Hotel Operations Director",
      company: "Pearl Resort & Spa",
      content: "Outstanding service! Their team is reliable, knowledgeable, and always goes above and beyond. Our pool systems have never been in better condition.",
      rating: 5,
    },
    {
      id: 3,
      name: "Mohammed Al-Thani",
      role: "Facility Director",
      company: "West Bay Towers",
      content: "We've been working with Metro Pools for over 5 years. Their expertise in commercial pool maintenance and quick response time make them our trusted partner.",
      rating: 5,
    },
    {
      id: 4,
      name: "Jennifer Martinez",
      role: "Homeowner",
      company: "The Pearl Qatar",
      content: "Professional, efficient, and thorough. Metro Pools takes care of everything, allowing us to simply enjoy our pool without any worries. Highly recommended!",
      rating: 5,
    },
    {
      id: 5,
      name: "Khalid Ibrahim",
      role: "Community Manager",
      company: "Al Khor Residences",
      content: "Their preventive maintenance program has saved us thousands in repair costs. The team is always punctual and their work quality is exceptional.",
      rating: 5,
    },
  ];

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it – hear from the clients who trust us with their pool maintenance
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative min-h-[400px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full"
              >
                <Card className="bg-gradient-to-br from-card via-card to-muted border-primary/20 shadow-lg">
                  <CardContent className="pt-12 pb-8 px-8 md:px-12 relative">
                    {/* Decorative Quote Icon */}
                    <div className="absolute top-6 left-6 opacity-10">
                      <Quote className="w-16 h-16 text-primary" />
                    </div>

                    {/* Rating Stars */}
                    <div className="flex justify-center gap-1 mb-6">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: i * 0.1, type: "spring" }}
                        >
                          <Star className="w-5 h-5 fill-primary text-primary" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Content */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-lg text-center mb-8 leading-relaxed text-foreground italic"
                    >
                      "{testimonials[currentIndex].content}"
                    </motion.p>

                    {/* Author */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold mb-3 shadow-glow-primary">
                        {testimonials[currentIndex].name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <h4 className="font-semibold text-lg">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonials[currentIndex].role}
                      </p>
                      <p className="text-sm text-primary font-medium">
                        {testimonials[currentIndex].company}
                      </p>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                className="w-3 h-3 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: currentIndex === index ? "hsl(var(--primary))" : "hsl(var(--muted))",
                  boxShadow: currentIndex === index ? "0 0 8px hsl(var(--primary))" : "none",
                }}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
