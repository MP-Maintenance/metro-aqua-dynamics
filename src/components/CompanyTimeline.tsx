import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, Award, TrendingUp, Globe, Star, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const CompanyTimeline = () => {
  const milestones = [
    {
      year: "2010",
      title: "Company Founded",
      description: "Metro Pools established with a vision to revolutionize pool maintenance in the region.",
      icon: Rocket,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      year: "2013",
      title: "Regional Expansion",
      description: "Expanded operations to serve multiple cities across the GCC region.",
      icon: Globe,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      year: "2016",
      title: "Innovation Award",
      description: "Received the Regional Excellence Award for innovative pool maintenance solutions.",
      icon: Award,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      year: "2019",
      title: "500+ Projects Milestone",
      description: "Successfully completed over 500 major projects for residential and commercial clients.",
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      year: "2022",
      title: "Excellence Certification",
      description: "Achieved ISO certification and industry-leading quality standards.",
      icon: Star,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      year: "2025",
      title: "Continued Growth",
      description: "Leading the market with cutting-edge pool management technology and sustainable practices.",
      icon: Calendar,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Journey</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From humble beginnings to industry leadership, discover the milestones that shaped Metro Pools
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-secondary to-accent transform -translate-x-1/2" />

          <div className="space-y-12">
            {milestones.map((milestone, index) => {
              const IconComponent = milestone.icon;
              const isEven = index % 2 === 0;
              
              return (
                <TimelineItem
                  key={milestone.year}
                  milestone={milestone}
                  index={index}
                  isEven={isEven}
                  IconComponent={IconComponent}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

interface TimelineItemProps {
  milestone: any;
  index: number;
  isEven: boolean;
  IconComponent: any;
}

const TimelineItem = ({ milestone, index, isEven, IconComponent }: TimelineItemProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -50 : 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative md:flex md:items-center ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* Content */}
      <div className={`md:w-5/12 ${isEven ? "md:text-right md:pr-12" : "md:pl-12"}`}>
        <Card className="hover:shadow-medium transition-all duration-300 border-border/50 group">
          <CardContent className="pt-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={`inline-flex items-center gap-2 mb-3 ${milestone.color}`}>
                <Calendar className="w-4 h-4" />
                <span className="text-2xl font-bold">{milestone.year}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {milestone.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {milestone.description}
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </div>

      {/* Center waypoint */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
        className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full items-center justify-center z-10"
      >
        <motion.div
          whileHover={{ scale: 1.2, rotate: 360 }}
          transition={{ duration: 0.6 }}
          className={`w-full h-full ${milestone.bgColor} rounded-full flex items-center justify-center shadow-lg border-4 border-background`}
        >
          <IconComponent className={`w-7 h-7 ${milestone.color}`} />
        </motion.div>
      </motion.div>

      {/* Spacer for opposite side */}
      <div className="hidden md:block md:w-5/12" />

      {/* Mobile icon */}
      <div className="md:hidden mb-4">
        <div className={`inline-flex w-12 h-12 ${milestone.bgColor} rounded-full items-center justify-center`}>
          <IconComponent className={`w-6 h-6 ${milestone.color}`} />
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyTimeline;
