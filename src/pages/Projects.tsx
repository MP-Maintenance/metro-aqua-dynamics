import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import heroImage from "@/assets/hero-pool.jpg";

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<{
    title: string;
    location: string;
    image: string;
    category: string;
  } | null>(null);

  const categories = [
    { id: "all", name: "All Projects", hash: "" },
    { id: "villas", name: "Private Villas", hash: "villas" },
    { id: "compounds", name: "Compounds", hash: "compounds" },
    { id: "hotels", name: "Hotels", hash: "hotels" },
    { id: "parks", name: "Parks", hash: "parks" },
    { id: "malls", name: "Malls", hash: "malls" },
  ];

  const projects = [
    { id: 1, category: "villas", title: "Luxury Villa Pool", location: "Riffa, Bahrain", image: heroImage },
    { id: 2, category: "villas", title: "Modern Villa Spa", location: "Saar, Bahrain", image: heroImage },
    { id: 3, category: "villas", title: "Infinity Edge Pool", location: "Amwaj Islands", image: heroImage },
    { id: 4, category: "compounds", title: "Residential Compound Pool", location: "Juffair", image: heroImage },
    { id: 5, category: "compounds", title: "Family Community Pool", location: "Tubli", image: heroImage },
    { id: 6, category: "compounds", title: "Gated Community Facility", location: "Budaiya", image: heroImage },
    { id: 7, category: "hotels", title: "5-Star Hotel Resort Pool", location: "Manama", image: heroImage },
    { id: 8, category: "hotels", title: "Boutique Hotel Spa", location: "Seef", image: heroImage },
    { id: 9, category: "hotels", title: "Hotel Rooftop Pool", location: "Bahrain Bay", image: heroImage },
    { id: 10, category: "parks", title: "Public Park Water Feature", location: "Isa Town", image: heroImage },
    { id: 11, category: "parks", title: "Community Park Fountain", location: "Al Muharraq", image: heroImage },
    { id: 12, category: "parks", title: "Recreational Park Pool", location: "Hamad Town", image: heroImage },
    { id: 13, category: "malls", title: "Shopping Mall Water Display", location: "City Centre", image: heroImage },
    { id: 14, category: "malls", title: "Mall Fountain Feature", location: "Seef Mall", image: heroImage },
    { id: 15, category: "malls", title: "Retail Complex Pool", location: "Avenues", image: heroImage },
  ];

  const filteredProjects = selectedCategory === "all"
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background font-['Inter',sans-serif]">
      <Navbar />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Our Projects
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Explore our portfolio of successful pool and wellness installations
          </p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="py-8 border-b border-border sticky top-20 bg-background/95 backdrop-blur-sm z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? "default" : "outline"}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Villas Section */}
      <section id="villas" className="py-20 scroll-mt-32">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Private Villas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(selectedCategory === "all" || selectedCategory === "villas") && 
              projects.filter(p => p.category === "villas").map((project) => (
              <Card
                key={project.id}
                className="group overflow-hidden hover:shadow-strong transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6 text-white w-full">
                      <p className="text-sm font-medium mb-1">View Project</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm">{project.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Hotels Section */}
      <section id="hotels" className="py-20 bg-muted/30 scroll-mt-32">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Hotels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(selectedCategory === "all" || selectedCategory === "hotels") && 
              projects.filter(p => p.category === "hotels").map((project) => (
              <Card
                key={project.id}
                className="group overflow-hidden hover:shadow-strong transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6 text-white w-full">
                      <p className="text-sm font-medium mb-1">View Project</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm">{project.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Parks Section */}
      <section id="parks" className="py-20 scroll-mt-32">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Parks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(selectedCategory === "all" || selectedCategory === "parks") && 
              projects.filter(p => p.category === "parks").map((project) => (
              <Card
                key={project.id}
                className="group overflow-hidden hover:shadow-strong transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6 text-white w-full">
                      <p className="text-sm font-medium mb-1">View Project</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm">{project.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Compounds Section */}
      <section id="compounds" className="py-20 bg-muted/30 scroll-mt-32">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Compounds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(selectedCategory === "all" || selectedCategory === "compounds") && 
              projects.filter(p => p.category === "compounds").map((project) => (
              <Card
                key={project.id}
                className="group overflow-hidden hover:shadow-strong transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6 text-white w-full">
                      <p className="text-sm font-medium mb-1">View Project</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm">{project.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Malls Section */}
      <section id="malls" className="py-20 scroll-mt-32">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Malls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(selectedCategory === "all" || selectedCategory === "malls") && 
              projects.filter(p => p.category === "malls").map((project) => (
              <Card
                key={project.id}
                className="group overflow-hidden hover:shadow-strong transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6 text-white w-full">
                      <p className="text-sm font-medium mb-1">View Project</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm">{project.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Project Detail Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedProject?.title}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground capitalize">{selectedProject?.category} Project</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative h-96 overflow-hidden rounded-lg">
              <img
                src={selectedProject?.image}
                alt={selectedProject?.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2 capitalize">{selectedProject?.category} Project</p>
              <p className="text-lg font-medium mb-2">{selectedProject?.location}</p>
              <p className="text-foreground leading-relaxed">
                This {selectedProject?.category} project showcases our expertise in delivering high-quality pool and wellness solutions. 
                From initial design to final installation, we ensure every detail meets the highest standards of excellence and safety.
              </p>
            </div>
            <Button asChild className="w-full">
              <Link to="/quote">Request Similar Project</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Projects;
