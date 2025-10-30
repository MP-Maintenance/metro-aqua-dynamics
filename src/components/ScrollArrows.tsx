import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const ScrollArrows = () => {
  const [activeSection, setActiveSection] = useState(0);
  
  const sections = [
    { id: "hero", label: "Hero" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "team", label: "Team" },
    { id: "partners", label: "Partners" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      sections.forEach((section, index) => {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(index);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    const sectionId = sections[index]?.id;
    const element = sectionId ? document.getElementById(sectionId) : null;
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full shadow-lg bg-card/95 backdrop-blur-sm"
        onClick={() => scrollToSection(Math.max(0, activeSection - 1))}
        disabled={activeSection === 0}
      >
        <ChevronUp className="h-5 w-5" />
      </Button>
      
      <div className="flex flex-col gap-2 py-2">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === index
                ? "bg-primary scale-125"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to ${section.label}`}
          />
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="rounded-full shadow-lg bg-card/95 backdrop-blur-sm"
        onClick={() => scrollToSection(Math.min(sections.length - 1, activeSection + 1))}
        disabled={activeSection === sections.length - 1}
      >
        <ChevronDown className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ScrollArrows;
