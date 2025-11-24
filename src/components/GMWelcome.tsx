import { motion } from "framer-motion";
import { LazyImage } from "@/components/ui/LazyImage";

const GMWelcome = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Subtle water texture overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_hsl(174_100%_33%_/_0.3)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_hsl(85_55%_52%_/_0.2)_0%,_transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left Column: GM Photo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex justify-center md:justify-end"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-lg ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                  <LazyImage
                    src="/assets/manager.jpg" // <-- Updated to local image
                    alt="Ayman Almaghrabi - General Manager"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>

            {/* Right Column: Welcome Message */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Welcome to Metro Pools
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full" />
              </div>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                At Metro Pools, our mission is to create safe, clean, and beautiful aquatic 
                spaces for our clients. With over a decade of experience in pool and wellness 
                facility management, we combine expertise, innovation, and a personal touch to 
                deliver services that exceed expectations.
              </p>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Thank you for trusting us — we look forward to making your pool experience exceptional.
              </p>

              <div className="pt-4 border-t border-border/50">
                <p className="font-semibold text-lg text-foreground">
                  Ayman Almaghrabi
                </p>
                <p className="text-sm text-muted-foreground">
                  General Manager
                </p>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "60px" }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="mt-2 h-px bg-gradient-to-r from-primary to-transparent"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GMWelcome;
