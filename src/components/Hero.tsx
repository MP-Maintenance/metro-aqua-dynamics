import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import heroImage1 from "@/assets/hero-metro.jpg";
import heroImage2 from "@/assets/hero-pool.jpg";
import heroImage3 from "@/assets/service-maintenance.jpg";
import heroImage4 from "@/assets/service-renovation.jpg";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  const slides = [heroImage1, heroImage2, heroImage3, heroImage4];

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    aboutSection?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Slider with Parallax */}
      <motion.div style={{ y }} className="absolute inset-0 bg-[#051B2C]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide}
              alt={`Pool ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(5,27,44,0.7)] to-[rgba(13,45,68,0.4)]" />
          </div>
        ))}
      </motion.div>

      {/* Content with Parallax */}
      <motion.div style={{ opacity }} className="relative z-10 container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight" 
            style={{ color: "#E0F7FA" }}
          >
            Your Trusted Partner in Pool Maintenance & Wellness Solutions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto" 
            style={{ color: "#C7EEF3" }}
          >
            Delivering excellence in pool care, inspection, and renovation services.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              onClick={scrollToAbout}
              variant="secondary"
              className="min-w-[160px]"
            >
              Learn More
            </Button>
            <Button
              asChild
              size="lg"
              className="min-w-[160px]"
            >
              <Link to="/quote">Get a Quote</Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Dots Navigation */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="w-3 h-3 rounded-full transition-all duration-300"
            style={{
              backgroundColor: currentSlide === index ? "#8CC63F" : "#587C88",
              boxShadow: currentSlide === index ? "0 0 6px #8CC63F" : "none",
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
