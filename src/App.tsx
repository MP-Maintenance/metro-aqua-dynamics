import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/features/auth/contexts/AuthContext";
import { QuoteProvider } from "@/features/quotes/contexts/QuoteContext";
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
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
const AdminInquiries = lazy(() => import("./pages/AdminInquiries"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
        <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
        <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
        <Route path="/quote" element={<PageTransition><Quote /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="/admin-login" element={<PageTransition><AdminLogin /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
        <Route path="/admin/products" element={<PageTransition><AdminProducts /></PageTransition>} />
        <Route path="/admin/categories" element={<PageTransition><AdminCategories /></PageTransition>} />
        <Route path="/admin/quotes" element={<PageTransition><AdminQuotes /></PageTransition>} />
        <Route path="/admin/consultations" element={<PageTransition><AdminConsultations /></PageTransition>} />
        <Route path="/admin/inquiries" element={<PageTransition><AdminInquiries /></PageTransition>} />
        <Route path="/admin/reviews" element={<PageTransition><AdminReviews /></PageTransition>} />
        <Route path="/admin/company" element={<PageTransition><AdminCompany /></PageTransition>} />
        <Route path="/admin/users" element={<PageTransition><AdminUsers /></PageTransition>} />
        <Route path="/admin/faqs" element={<PageTransition><AdminFAQs /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <QuoteProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <QuoteCartSidebar />
              <AuthModal />
              <Suspense fallback={<LoadingFallback />}>
                <AnimatedRoutes />
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </QuoteProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
