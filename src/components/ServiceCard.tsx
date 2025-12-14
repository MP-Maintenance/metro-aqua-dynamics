import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
}

const ServiceCard = ({ title, description, image, link }: ServiceCardProps) => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <Card className="group overflow-hidden hover:shadow-strong transition-all duration-300 border-border">
      <motion.div 
        className="relative overflow-hidden h-64"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          animate={{
            scale: mousePosition.x !== 0 || mousePosition.y !== 0 ? 1.15 : 1,
            x: mousePosition.x,
            y: mousePosition.y,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
      </motion.div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex flex-col gap-2">
          <Button 
            variant="outline" 
            className="group/btn"
            onClick={() => {
              const [path, hash] = link.split('#');
              navigate(path);
              if (hash) {
                setTimeout(() => {
                  document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
          >
            Learn More
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
          </Button>
          <Button 
            asChild
            variant="default"
            className="w-full"
          >
            <Link to="/quote">Request a Quote</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
