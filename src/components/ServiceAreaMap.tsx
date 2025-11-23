import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";

interface ServiceLocation {
  id: string;
  name: string;
  country: string;
  description: string;
  coordinates: { x: number; y: number };
}

const serviceLocations: ServiceLocation[] = [
  {
    id: "qatar",
    name: "Qatar (Headquarters)",
    country: "Qatar",
    description: "Main office in Doha - Full service coverage nationwide",
    coordinates: { x: 58, y: 52 },
  },
  {
    id: "uae",
    name: "United Arab Emirates",
    country: "UAE",
    description: "Dubai & Abu Dhabi - Premium pool services",
    coordinates: { x: 62, y: 54 },
  },
  {
    id: "saudi",
    name: "Saudi Arabia",
    country: "KSA",
    description: "Riyadh & Jeddah - Comprehensive facility management",
    coordinates: { x: 55, y: 56 },
  },
  {
    id: "bahrain",
    name: "Bahrain",
    country: "Bahrain",
    description: "Manama - Residential & commercial services",
    coordinates: { x: 57, y: 53 },
  },
  {
    id: "kuwait",
    name: "Kuwait",
    country: "Kuwait",
    description: "Kuwait City - Expert pool maintenance",
    coordinates: { x: 56, y: 48 },
  },
  {
    id: "oman",
    name: "Oman",
    country: "Oman",
    description: "Muscat - Professional pool solutions",
    coordinates: { x: 64, y: 56 },
  },
  {
    id: "egypt",
    name: "Egypt",
    country: "Egypt",
    description: "Cairo & Alexandria - Expanding services",
    coordinates: { x: 48, y: 50 },
  },
];

const ServiceAreaMap = () => {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<ServiceLocation | null>(null);

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Map Background */}
      <div className="relative bg-gradient-to-br from-card to-muted rounded-2xl p-8 shadow-lg border border-border overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border border-primary/20"></div>
            ))}
          </div>
        </div>

        {/* Map Container */}
        <div className="relative aspect-[16/10] w-full">
          {/* Background waves effect */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-lg"
          />

          {/* Service Locations */}
          {serviceLocations.map((location) => (
            <motion.div
              key={location.id}
              className="absolute cursor-pointer"
              style={{
                left: `${location.coordinates.x}%`,
                top: `${location.coordinates.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onHoverStart={() => setHoveredLocation(location.id)}
              onHoverEnd={() => setHoveredLocation(null)}
              onClick={() => setSelectedLocation(location)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/30"
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />

              {/* Location marker */}
              <div
                className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  hoveredLocation === location.id || selectedLocation?.id === location.id
                    ? "bg-primary shadow-glow-primary"
                    : "bg-secondary shadow-glow-secondary"
                }`}
              >
                <MapPin className="w-5 h-5 text-white" />
              </div>

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredLocation === location.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute top-12 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg shadow-lg p-3 min-w-[200px] z-10"
                  >
                    <div className="text-sm font-semibold text-foreground mb-1">
                      {location.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {location.description}
                    </div>
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card border-l border-t border-border rotate-45"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <div className="w-3 h-3 rounded-full bg-primary shadow-glow-primary"></div>
            <span className="text-sm font-medium">Headquarters</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full">
            <div className="w-3 h-3 rounded-full bg-secondary shadow-glow-secondary"></div>
            <span className="text-sm font-medium">Service Areas</span>
          </div>
        </div>
      </div>

      {/* Selected Location Details */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-xl p-6 shadow-glow-primary"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {selectedLocation.name}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {selectedLocation.description}
                </p>
                <div className="flex gap-2">
                  <a
                    href="tel:+97444771588"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium shadow-glow-primary"
                  >
                    Contact Us
                  </a>
                  <button
                    onClick={() => setSelectedLocation(null)}
                    className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
              <MapPin className="w-8 h-8 text-primary" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceAreaMap;
