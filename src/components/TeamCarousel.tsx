import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { CardContent } from "@/components/ui/card";
import FlipCard from "@/components/FlipCard";
import { LazyImage } from "@/components/ui/LazyImage";
import Autoplay from "embla-carousel-autoplay";

interface TeamMember {
  teamid: number;
  name: string;
  role: string;
  email: string;
  mobile: string;
  description: string | null;
  imageurl: string | null;
}

interface TeamCarouselProps {
  teamMembers: TeamMember[];
  teamLoading: boolean;
}

const TeamCarousel = ({ teamMembers, teamLoading }: TeamCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  if (teamLoading) {
    return <div className="w-full text-center text-muted-foreground py-12">Loading team...</div>;
  }

  if (teamMembers.length === 0) {
    return <div className="w-full text-center text-muted-foreground py-12">No team members found.</div>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {teamMembers.map((member, idx) => (
            <CarouselItem key={idx} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="h-[280px]"
              >
                <FlipCard
                  type="team"
                  frontContent={
                    <CardContent className="pt-6 text-center">
                      {member.imageurl ? (
                        <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 shadow-glow-primary">
                          <LazyImage
                            src={member.imageurl}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold shadow-glow-primary">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                      <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                      <p className="text-sm text-primary mb-2">{member.role}</p>
                      <p className="text-sm text-muted-foreground">{member.description}</p>
                    </CardContent>
                  }
                  backContent={{
                    name: member.name,
                    email: member.email,
                    mobile: member.mobile,
                  }}
                />
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dot indicators */}
      {count > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === current
                  ? "bg-primary shadow-[0_0_6px_hsl(var(--primary))]"
                  : "bg-muted-foreground/40 hover:bg-muted-foreground/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamCarousel;
