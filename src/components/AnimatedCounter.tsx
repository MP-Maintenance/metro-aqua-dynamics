import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Users, Calendar, CheckCircle } from "lucide-react";

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

const Counter = ({ end, duration = 2, suffix = "", prefix = "" }: CounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * (end - startValue) + startValue);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
};

const AnimatedCounter = () => {
  const stats = [
    {
      icon: CheckCircle,
      value: 500,
      suffix: "+",
      label: "Completed Projects",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Users,
      value: 350,
      suffix: "+",
      label: "Satisfied Clients",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Calendar,
      value: 15,
      suffix: "+",
      label: "Years Experience",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Award,
      value: 98,
      suffix: "%",
      label: "Client Satisfaction",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`w-16 h-16 mx-auto mb-4 rounded-full ${stat.bgColor} flex items-center justify-center`}
            >
              <IconComponent className={`w-8 h-8 ${stat.color}`} />
            </motion.div>
            <motion.div
              className="text-4xl font-bold mb-2"
              initial={{ scale: 0.5 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              viewport={{ once: true }}
            >
              <Counter end={stat.value} suffix={stat.suffix} />
            </motion.div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default AnimatedCounter;
