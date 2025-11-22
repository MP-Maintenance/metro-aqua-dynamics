import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { QuoteProvider } from "@/contexts/QuoteContext";
import { AuthProvider } from "@/contexts/AuthContext";
import QuoteCartSidebar from "@/components/QuoteCartSidebar";
import AuthModal from "@/components/AuthModal";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Products from "./pages/Products";
import Projects from "./pages/Projects";
import Quote from "./pages/Quote";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminProducts from "./pages/AdminProducts";
import AdminQuotes from "./pages/AdminQuotes";
import AdminConsultations from "./pages/AdminConsultations";
import AdminReviews from "./pages/AdminReviews";
import AdminCompany from "./pages/AdminCompany";
import AdminUsers from "./pages/AdminUsers";
import AdminFAQs from "./pages/AdminFAQs";
import NotFound from "./pages/NotFound";

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
              <QuoteCartSidebar />
              <AuthModal />
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
      <Route path="/admin/quotes" element={<AdminQuotes />} />
      <Route path="/admin/consultations" element={<AdminConsultations />} />
      <Route path="/admin/reviews" element={<AdminReviews />} />
      <Route path="/admin/company" element={<AdminCompany />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/faqs" element={<AdminFAQs />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QuoteProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
