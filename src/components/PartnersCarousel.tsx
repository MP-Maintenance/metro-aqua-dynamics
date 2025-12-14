import { useState, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { CardContent } from "@/components/ui/card";
import FlipCard from "@/components/FlipCard";
import Autoplay from "embla-carousel-autoplay";

interface Partner {
  partnerid: number;
  name: string;
  tagline: string | null;
  country: string | null;
  description: string | null;
  logo: string | null;
}

interface PartnersCarouselProps {
  partners: Partner[];
  partnersLoading: boolean;
}

const PartnersCarousel = ({ partners, partnersLoading }: PartnersCarouselProps) => {
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

  if (partnersLoading) {
    return <div className="w-full text-center text-muted-foreground py-12">Loading partners...</div>;
  }

  if (partners.length === 0) {
    return <div className="w-full text-center text-muted-foreground py-12">No partners found.</div>;
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
            delay: 3000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {partners.map((partner, idx) => (
            <CarouselItem key={idx} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="h-[220px]">
                <FlipCard
                  type="partner"
                  frontContent={
                    <CardContent className="flex flex-col items-center justify-center p-6 min-h-[220px]">
                      <div className="text-3xl font-bold text-primary mb-3 text-center">
                        {partner.name}
                      </div>
                      <p className="text-xs text-muted-foreground text-center italic">
                        {partner.tagline}
                      </p>
                    </CardContent>
                  }
                  backContent={{
                    name: partner.name,
                    description: partner.description || "",
                  }}
                />
              </div>
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

export default PartnersCarousel;
