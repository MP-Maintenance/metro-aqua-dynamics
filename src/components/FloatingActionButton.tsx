import { useState } from "react";
import { Plus, FileText, MessageSquare, Mail, X } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      icon: FileText,
      label: "Get Quote",
      href: "/quote",
      color: "bg-primary shadow-glow-primary",
    },
    {
      icon: MessageSquare,
      label: "Consultation",
      href: "/quote?tab=consultation",
      color: "bg-secondary shadow-glow-secondary",
    },
    {
      icon: Mail,
      label: "Contact",
      href: "/#contact",
      color: "bg-accent",
    },
  ];

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-20 left-0 flex flex-col gap-3 mb-2"
          >
            {menuItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={item.href} onClick={() => setIsOpen(false)}>
                  <Button
                    className={cn(
                      "h-12 w-12 rounded-full p-0 relative group",
                      item.color
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="absolute left-14 whitespace-nowrap bg-card text-foreground px-3 py-1.5 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity shadow-medium">
                      {item.label}
                    </span>
                  </Button>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-14 w-14 rounded-full flex items-center justify-center transition-all duration-300",
          isOpen ? "bg-destructive shadow-lg" : "bg-primary shadow-glow-primary"
        )}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Plus className="h-6 w-6 text-white" />
          )}
        </motion.div>
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;
