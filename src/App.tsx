import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/features/auth/contexts/AuthContext";
import { QuoteProvider } from "@/features/quotes/contexts/QuoteContext";
import QuoteCartSidebar from "@/components/QuoteCartSidebar";
import AuthModal from "@/features/auth/components/AuthModal";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Quote from "./pages/Quote";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Lazy load heavy pages
const Products = lazy(() => import("./features/products/pages/Products"));
const Projects = lazy(() => import("./pages/Projects"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));
const AdminCategories = lazy(() => import("./pages/AdminCategories"));
const AdminQuotes = lazy(() => import("./pages/AdminQuotes"));
const AdminConsultations = lazy(() => import("./pages/AdminConsultations"));
const AdminReviews = lazy(() => import("./pages/AdminReviews"));
const AdminFAQs = lazy(() => import("./pages/AdminFAQs"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminCompany = lazy(() => import("./pages/AdminCompany"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <QuoteProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              //<QuoteCartSidebar />
              //<AuthModal />
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/quote" element={<Quote />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/categories" element={<AdminCategories />} />
                  <Route path="/admin/quotes" element={<AdminQuotes />} />
                  <Route path="/admin/consultations" element={<AdminConsultations />} />
                  <Route path="/admin/reviews" element={<AdminReviews />} />
                  <Route path="/admin/company" element={<AdminCompany />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/faqs" element={<AdminFAQs />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </QuoteProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
