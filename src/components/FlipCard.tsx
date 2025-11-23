import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

interface FlipCardProps {
  frontContent: React.ReactNode;
  backContent: {
    name: string;
    email?: string;
    mobile?: string;
    description?: string;
  };
  type?: "team" | "partner";
}

const FlipCard = ({ frontContent, backContent, type = "team" }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="perspective-1000 h-full cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
      >
        {/* Front Side */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Card className="h-full hover:shadow-medium transition-shadow">
            {frontContent}
          </Card>
        </div>

        {/* Back Side */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <Card className="h-full bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-primary/30">
            <CardContent className="pt-6 h-full flex flex-col justify-center">
              {type === "team" ? (
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold text-text-primary">{backContent.name}</h3>
                  {backContent.email && (
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-primary" />
                      <a
                        href={`mailto:${backContent.email}`}
                        className="text-text-secondary hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {backContent.email}
                      </a>
                    </div>
                  )}
                  {backContent.mobile && (
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-secondary" />
                      <a
                        href={`tel:${backContent.mobile}`}
                        className="text-text-secondary hover:text-secondary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {backContent.mobile}
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <h3 className="text-2xl font-bold text-primary">{backContent.name}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed px-4">
                    {backContent.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default FlipCard;
