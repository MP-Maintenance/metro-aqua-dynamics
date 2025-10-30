import { Users, Droplets, Search, Wrench, Building2, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const StatsCounter = () => {
  const stats = [
    { icon: Users, count: "5000+", title: "Clients Served" },
    { icon: Droplets, count: "3000+", title: "Pools Maintained" },
    { icon: Search, count: "16000+", title: "Inspections" },
    { icon: Wrench, count: "18000+", title: "Repairs Done" },
    { icon: Building2, count: "200+", title: "Renovations" },
    { icon: Settings, count: "7000+", title: "Workshop Repairs" },
  ];

  return (
    <div className="mt-12">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 2500,
          })
        ]}
        className="w-full max-w-5xl mx-auto"
      >
        <CarouselContent>
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-2">
                  <Card className="border-2 hover:border-primary transition-all duration-300">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <div className="p-4 rounded-full bg-primary/10 mb-4">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-3xl font-bold text-primary mb-2">
                        {stat.count}
                      </div>
                      <p className="text-sm text-muted-foreground text-center font-medium">
                        {stat.title}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="-left-12 hidden md:flex" />
        <CarouselNext className="-right-12 hidden md:flex" />
      </Carousel>
    </div>
  );
};

export default StatsCounter;
