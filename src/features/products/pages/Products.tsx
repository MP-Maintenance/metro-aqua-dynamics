import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import QuoteModal from "@/components/QuoteModal";
import { LazyImage } from "@/components/ui/LazyImage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Filter, Thermometer, Lightbulb, Droplets, Square, Cpu, Sparkles, Wind, Zap, Waves, Shield, Package, Search, SlidersHorizontal, Eye, GitCompare, X, Check, Grid3x3, List } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  availability: string | null;
  image_url: string | null;
  price: number | null;
  created_at: string;
  brand: string | null;
  model: string | null;
  origin: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
}

const Products = () => {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter and sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  
  // Comparison and Quick View states
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  // View toggle state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Recommendations state
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Icon mapping for categories
  const iconMap: { [key: string]: any } = {
    Filter,
    Thermometer,
    Lightbulb,
    Droplets,
    Square,
    Cpu,
    Sparkles,
    Wind,
    Zap,
    Waves,
    Shield,
  };

  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await (supabase as any)
        .from("categories")
        .select("*")
        .order("name");

      if (categoriesError) throw categoriesError;

      // Fetch products
      const { data: productsData, error: productsError } = await (supabase as any)
        .from("products")
        .select("*")
        .order("category", { ascending: true });

      if (productsError) throw productsError;

      setCategories(categoriesData || []);
      setProducts(productsData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter and sort products
  const getFilteredAndSortedProducts = () => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-desc":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
    }

    return filtered;
  };

  const filteredProducts = getFilteredAndSortedProducts();

  // Group products by category slug (products.category matches categories.slug)
  const groupedProducts = categories.map((category) => ({
    ...category,
    products: filteredProducts.filter((p) => p.category === category.slug),
  }));

  // Comparison handlers
  const toggleComparison = (product: Product) => {
    setComparisonProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        if (prev.length >= 4) {
          toast({
            title: "Maximum reached",
            description: "You can compare up to 4 products at a time",
            variant: "destructive",
          });
          return prev;
        }
        return [...prev, product];
      }
    });
  };

  const isInComparison = (productId: string) => {
    return comparisonProducts.some((p) => p.id === productId);
  };

  const clearComparison = () => {
    setComparisonProducts([]);
    setShowComparison(false);
  };
  
  // Fetch AI recommendations
  const fetchRecommendations = async (categorySlug: string) => {
    if (loadingRecommendations) return;
    
    setLoadingRecommendations(true);
    try {
      const { data, error } = await supabase.functions.invoke('product-recommendations', {
        body: { 
          categorySlug,
          currentProducts: products.filter(p => p.category === categorySlug).map(p => p.name)
        }
      });

      if (error) throw error;
      
      // Match recommended product names to actual products
      if (data?.recommendations) {
        const recommendedProducts = data.recommendations
          .map((rec: any) => {
            return products.find(p => 
              p.name.toLowerCase().includes(rec.productName.toLowerCase()) ||
              rec.productName.toLowerCase().includes(p.name.toLowerCase())
            );
          })
          .filter((p: Product | undefined): p is Product => p !== undefined)
          .slice(0, 4);
        
        setRecommendations(recommendedProducts);
      }
    } catch (error: any) {
      console.error('Failed to fetch recommendations:', error);
      // Fallback to random products from different categories
      const otherProducts = products.filter(p => p.category !== categorySlug);
      const random = otherProducts.sort(() => Math.random() - 0.5).slice(0, 4);
      setRecommendations(random);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // Fetch recommendations when category changes
  useEffect(() => {
    if (selectedCategory !== "all" && products.length > 0) {
      fetchRecommendations(selectedCategory);
    } else {
      setRecommendations([]);
    }
  }, [selectedCategory, products]);

  // Availability badge helper
  const getAvailabilityBadge = (availability: string | null) => {
    switch (availability) {
      case "available":
        return <Badge className="bg-green-500 hover:bg-green-600">In Stock</Badge>;
      case "out_of_stock":
        return <Badge variant="destructive">Out of Stock</Badge>;
      case "limited":
        return <Badge variant="secondary">Limited Stock</Badge>;
      default:
        return <Badge>In Stock</Badge>;
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background font-['Inter',sans-serif]">
        <Navbar />
        <WhatsAppButton />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Our Products
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Premium pool equipment and accessories from industry-leading brands
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b bg-background/95 backdrop-blur sticky top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* View Toggle */}
              <div className="flex gap-1 border rounded-lg p-1 bg-background">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="gap-2"
                >
                  <Grid3x3 className="h-4 w-4" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="gap-2"
                >
                  <List className="h-4 w-4" />
                  List
                </Button>
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 bg-background z-50">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48 bg-background z-50">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                  <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground">
            {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-muted-foreground py-16">
              <p className="text-xl">No products found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSortBy("newest");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-16">
              {groupedProducts.map((category) => {
                if (category.products.length === 0) return null;
                
                const Icon = iconMap[category.icon || ""] || Package;
                
                return (
                  <div key={category.id} id={category.slug}>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h2 className="text-3xl font-bold">{category.name}</h2>
                      <span className="text-muted-foreground">({category.products.length})</span>
                    </div>
                    <div className={viewMode === "grid" 
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                    }>
                      {category.products.map((product) => (
                        <Card
                          key={product.id}
                          className={`group hover:shadow-medium transition-all duration-300 relative ${
                            viewMode === "list" ? "flex flex-col sm:flex-row" : ""
                          }`}
                        >
                          {viewMode === "grid" ? (
                            <CardContent className="pt-6">
                              {product.image_url ? (
                                <LazyImage
                                  src={product.image_url}
                                  alt={product.name}
                                  className="h-48 w-full object-cover rounded-lg mb-4"
                                />
                              ) : (
                                <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-4 flex items-center justify-center">
                                  <Icon className="w-16 h-16 text-primary/30" />
                                </div>
                              )}
                              
                              {/* Availability Badge */}
                              <div className="mb-2">
                                {getAvailabilityBadge(product.availability)}
                              </div>

                              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                              <p className="text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                              
                              {/* Brand, Model, Origin */}
                              {(product.brand || product.model || product.origin) && (
                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground mb-3">
                                  {product.brand && <span>Brand: <span className="text-foreground">{product.brand}</span></span>}
                                  {product.model && <span>Model: <span className="text-foreground">{product.model}</span></span>}
                                  {product.origin && <span>Origin: <span className="text-foreground">{product.origin}</span></span>}
                                </div>
                              )}
                              
                              {product.price && (
                                <p className="text-primary font-semibold mb-4">
                                  ${product.price.toFixed(2)}
                                </p>
                              )}
                              
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
                                <div className="flex gap-2 flex-1">
                                  <Button
                                    variant="outline"
                                    className="flex-1"
                                    size="sm"
                                    onClick={() => setQuickViewProduct(product)}
                                  >
                                    <Eye className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Quick View</span>
                                  </Button>
                                  <Button
                                    variant="default"
                                    className="flex-1"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedProduct(product);
                                      setIsQuoteModalOpen(true);
                                    }}
                                  >
                                    Get Quote
                                  </Button>
                                </div>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center gap-1.5 justify-center sm:justify-start px-2 py-1 rounded-md hover:bg-muted/50 transition-colors">
                                      <Checkbox
                                        id={`compare-${product.id}`}
                                        checked={isInComparison(product.id)}
                                        onCheckedChange={() => toggleComparison(product)}
                                      />
                                      <label
                                        htmlFor={`compare-${product.id}`}
                                        className="text-xs font-medium cursor-pointer whitespace-nowrap"
                                      >
                                        Compare
                                      </label>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-xs">
                                    <p className="text-xs">Select up to 4 products to compare features and prices side-by-side</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </CardContent>
                          ) : (
                            // List View - Compact Design
                            <>
                              {product.image_url ? (
                                <LazyImage
                                  src={product.image_url}
                                  alt={product.name}
                                  className="w-full sm:w-32 h-32 object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none flex-shrink-0"
                                />
                              ) : (
                                <div className="w-full sm:w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none flex items-center justify-center flex-shrink-0">
                                  <Icon className="w-10 h-10 text-primary/30" />
                                </div>
                              )}
                              <CardContent className="flex-1 p-3 sm:p-4 flex flex-col sm:flex-row gap-3">
                                {/* Product Info */}
                                <div className="flex-1 min-w-0 grid grid-cols-1 lg:grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      {getAvailabilityBadge(product.availability)}
                                    </div>
                                    <h3 className="font-semibold text-base truncate">{product.name}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                                  </div>
                                  <div className="flex flex-col gap-1 text-sm">
                                    {product.brand && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground w-14">Brand:</span>
                                        <span className="font-medium">{product.brand}</span>
                                      </div>
                                    )}
                                    {product.model && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground w-14">Model:</span>
                                        <span className="font-medium">{product.model}</span>
                                      </div>
                                    )}
                                    {product.origin && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground w-14">Origin:</span>
                                        <span className="font-medium">{product.origin}</span>
                                      </div>
                                    )}
                                    {product.price && (
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className="text-muted-foreground w-14">Price:</span>
                                        <span className="text-primary font-bold text-lg">${product.price.toFixed(2)}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {/* Actions */}
                                <div className="flex sm:flex-col items-center gap-2 flex-shrink-0">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setQuickViewProduct(product)}
                                  >
                                    <Eye className="h-4 w-4 sm:mr-2" />
                                    <span className="hidden sm:inline">View</span>
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedProduct(product);
                                      setIsQuoteModalOpen(true);
                                    }}
                                  >
                                    Quote
                                  </Button>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-muted/50 transition-colors">
                                        <Checkbox
                                          id={`compare-list-${product.id}`}
                                          checked={isInComparison(product.id)}
                                          onCheckedChange={() => toggleComparison(product)}
                                        />
                                        <label
                                          htmlFor={`compare-list-${product.id}`}
                                          className="text-xs font-medium cursor-pointer whitespace-nowrap hidden sm:inline"
                                        >
                                          Compare
                                        </label>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-xs">
                                      <p className="text-xs">Select up to 4 products to compare side-by-side</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </CardContent>
                            </>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* AI Recommendations Section */}
      {recommendations.length > 0 && selectedCategory !== "all" && (
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Recommended for You</h2>
                <p className="text-muted-foreground">Based on your browsing in {categories.find(c => c.slug === selectedCategory)?.name}</p>
              </div>
              <Badge variant="secondary" className="gap-2">
                <Sparkles className="h-4 w-4" />
                AI Powered
              </Badge>
            </div>
            
            {loadingRecommendations ? (
              <div className="flex items-center justify-center h-48">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendations.map((product) => {
                  const categoryData = categories.find(c => c.slug === product.category);
                  const Icon = iconMap[categoryData?.icon || ""] || Package;
                  
                  return (
                    <Card key={product.id} className="group hover:shadow-medium transition-all duration-300">
                      <CardContent className="pt-6">
                        {product.image_url ? (
                          <LazyImage
                            src={product.image_url}
                            alt={product.name}
                            className="h-40 w-full object-cover rounded-lg mb-4"
                          />
                        ) : (
                          <div className="h-40 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg mb-4 flex items-center justify-center">
                            <Icon className="w-12 h-12 text-primary/30" />
                          </div>
                        )}
                        <div className="mb-2">
                          {getAvailabilityBadge(product.availability)}
                        </div>
                        <h3 className="font-semibold mb-2">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                        {product.price && (
                          <p className="text-primary font-semibold mb-3">${product.price.toFixed(2)}</p>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setQuickViewProduct(product)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-accent to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Need Help Choosing Products?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Our experts are here to help you select the perfect equipment for your needs
          </p>
          <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
            <Link to="/quote">Contact Our Team</Link>
          </Button>
        </div>
      </section>

      {/* Comparison Bar */}
      {comparisonProducts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground p-4 shadow-lg z-50">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <GitCompare className="h-5 w-5" />
              <span className="font-semibold">
                {comparisonProducts.length} product{comparisonProducts.length > 1 ? "s" : ""} selected
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowComparison(true)}
                disabled={comparisonProducts.length < 2}
              >
                Compare Now
              </Button>
              <Button variant="outline" size="icon" onClick={clearComparison}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      <Dialog open={showComparison} onOpenChange={setShowComparison}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Comparison</DialogTitle>
            <DialogDescription>
              Compare features, prices, and specifications
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-4 bg-muted text-left font-semibold">Feature</th>
                  {comparisonProducts.map((product) => (
                    <th key={product.id} className="border p-4 bg-muted">
                      <div className="flex flex-col items-center gap-2">
                        {product.image_url ? (
                          <LazyImage
                            src={product.image_url}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded flex items-center justify-center">
                            <Package className="w-8 h-8 text-primary/30" />
                          </div>
                        )}
                        <span className="font-semibold text-sm">{product.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleComparison(product)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-4 font-medium">Description</td>
                  {comparisonProducts.map((product) => (
                    <td key={product.id} className="border p-4 text-center text-sm">
                      {product.description || "—"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-4 font-medium">Price</td>
                  {comparisonProducts.map((product) => (
                    <td key={product.id} className="border p-4 text-center font-semibold text-primary">
                      {product.price ? `$${product.price.toFixed(2)}` : "Contact for price"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-4 font-medium">Availability</td>
                  {comparisonProducts.map((product) => (
                    <td key={product.id} className="border p-4 text-center">
                      {getAvailabilityBadge(product.availability)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-4 font-medium">Category</td>
                  {comparisonProducts.map((product) => (
                    <td key={product.id} className="border p-4 text-center text-sm">
                      {categories.find((c) => c.slug === product.category)?.name || product.category}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-4 font-medium">Action</td>
                  {comparisonProducts.map((product) => (
                    <td key={product.id} className="border p-4 text-center">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsQuoteModalOpen(true);
                          setShowComparison(false);
                        }}
                      >
                        Request Quote
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick View Modal */}
      <Dialog open={!!quickViewProduct} onOpenChange={() => setQuickViewProduct(null)}>
        <DialogContent className="max-w-3xl">
          {quickViewProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{quickViewProduct.name}</DialogTitle>
              </DialogHeader>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {quickViewProduct.image_url ? (
                    <LazyImage
                      src={quickViewProduct.image_url}
                      alt={quickViewProduct.name}
                      className="w-full h-80 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-80 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                      <Package className="w-24 h-24 text-primary/30" />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Availability</h4>
                    {getAvailabilityBadge(quickViewProduct.availability)}
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Category</h4>
                    <p className="text-muted-foreground">
                      {categories.find((c) => c.slug === quickViewProduct.category)?.name || quickViewProduct.category}
                    </p>
                  </div>

                  {/* Brand, Model, Origin in Quick View */}
                  {(quickViewProduct.brand || quickViewProduct.model || quickViewProduct.origin) && (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {quickViewProduct.brand && (
                        <div>
                          <span className="text-muted-foreground">Brand:</span>
                          <p className="font-medium">{quickViewProduct.brand}</p>
                        </div>
                      )}
                      {quickViewProduct.model && (
                        <div>
                          <span className="text-muted-foreground">Model:</span>
                          <p className="font-medium">{quickViewProduct.model}</p>
                        </div>
                      )}
                      {quickViewProduct.origin && (
                        <div>
                          <span className="text-muted-foreground">Origin:</span>
                          <p className="font-medium">{quickViewProduct.origin}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground">
                      {quickViewProduct.description || "No description available"}
                    </p>
                  </div>

                  {quickViewProduct.price && (
                    <div>
                      <h4 className="font-semibold mb-2">Price</h4>
                      <p className="text-2xl font-bold text-primary">
                        ${quickViewProduct.price.toFixed(2)}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button
                      className="flex-1"
                      onClick={() => {
                        setSelectedProduct(quickViewProduct);
                        setIsQuoteModalOpen(true);
                        setQuickViewProduct(null);
                      }}
                    >
                      Request Quote
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => toggleComparison(quickViewProduct)}
                    >
                      {isInComparison(quickViewProduct.id) ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Added
                        </>
                      ) : (
                        <>
                          <GitCompare className="h-4 w-4 mr-2" />
                          Compare
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => {
          setIsQuoteModalOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />

      <Footer />
    </div>
    </TooltipProvider>
  );
};

export default Products;
