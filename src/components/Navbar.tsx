import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Moon, Sun, ShoppingCart, User, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useQuote } from "@/features/quotes/contexts/QuoteContext";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/metro-pools-logo.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { items, setIsCartOpen } = useQuote();
  const { user, isAuthenticated, setIsAuthModalOpen, signOut } = useAuth();
  
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleAnchorClick = (path: string, hash: string) => {
    if (location.pathname === path) {
      // Same page, just scroll
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // Different page, navigate then scroll
      navigate(path);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="Metro Pools" className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-foreground"
              }`}
            >
              Home
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Services <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border z-50">
                <DropdownMenuItem asChild>
                  <Link to="/services" className="cursor-pointer">
                    All Services
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAnchorClick("/services", "maintenance")}>
                  Maintenance & Cleaning
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAnchorClick("/services", "inspection")}>
                  Inspection & Repairs
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAnchorClick("/services", "renovation")}>
                  Renovation
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Products <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border z-50">
                <DropdownMenuItem asChild>
                  <Link to="/products" className="cursor-pointer">
                    All Products
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAnchorClick("/products", "filtration")}>
                  Filtration Systems
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAnchorClick("/products", "heating")}>
                  Pool Heating / Chiller
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAnchorClick("/products", "lighting")}>
                  Pool Lighting
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAnchorClick("/products", "pumps")}>
                  Pumps
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAnchorClick("/products", "fittings")}>
                  Pool Fittings
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAnchorClick("/products", "surround")}>
                  Pool Surround
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAnchorClick("/products", "fountain")}>
                  Fountain Accessories
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAnchorClick("/products", "spa")}>
                  Spa Fittings
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAnchorClick("/products", "treatment")}>
                  Water Treatment
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAnchorClick("/products", "wellness")}>
                  Wellness
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAnchorClick("/products", "covers")}>
                  Pool Covers
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Projects <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border z-50">
                <DropdownMenuItem asChild>
                  <Link to="/projects" className="cursor-pointer">
                    All Projects
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAnchorClick("/projects", "villas")}>
                  Private Villas
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAnchorClick("/projects", "hotels")}>
                  Hotels
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAnchorClick("/projects", "parks")}>
                  Parks
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAnchorClick("/projects", "compounds")}>
                  Compounds
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleAnchorClick("/projects", "malls")}>
                  Malls
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart Icon */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsCartOpen(true)}
              className="relative"
            >
              <ShoppingCart className="h-[1.2rem] w-[1.2rem]" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* User Dropdown or Auth Button */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <User className="h-4 w-4" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    View Account
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile?tab=quotes")}>
                    My Quotes
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => setIsAuthModalOpen(true)} variant="default">
                Sign In
              </Button>
            )}

            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>

          {/* Mobile Menu Button, Cart & Theme Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsCartOpen(true)}
              className="relative"
            >
              <ShoppingCart className="h-[1.2rem] w-[1.2rem]" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 bg-card border-t border-border">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Home
              </Link>
              <Link
                to="/services"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/products"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/projects"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Projects
              </Link>
              
              {isAuthenticated && user ? (
                <>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      View Account
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Sign In / Join Us
                </Button>
              )}
              
              <Button asChild variant="default" className="w-full">
                <Link to="/quote" onClick={() => setIsMobileMenuOpen(false)}>
                  Get a Quote
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
