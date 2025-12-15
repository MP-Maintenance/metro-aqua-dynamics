import { ReactNode, useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Package, FileText, MessageSquare, Building, Users, HelpCircle, Inbox, UsersRound, Handshake, TrendingUp, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import AdminChatbot from "@/features/admin/components/AdminChatbot";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAdmin, isAuthenticated, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      navigate("/admin-login");
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/admin-login");
  };

  if (loading || !isAdmin) return null;

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/analytics", icon: TrendingUp, label: "Analytics" },
    { path: "/admin/products", icon: Package, label: "Products" },
    { path: "/admin/categories", icon: Package, label: "Categories" },
    { path: "/admin/quotes", icon: FileText, label: "Quote Requests" },
    { path: "/admin/consultations", icon: MessageSquare, label: "Pre-Consultations" },
    { path: "/admin/inquiries", icon: Inbox, label: "Inquiries" },
    { path: "/admin/reviews", icon: MessageSquare, label: "Reviews" },
    { path: "/admin/team", icon: UsersRound, label: "Team" },
    { path: "/admin/partners", icon: Handshake, label: "Partners" },
    { path: "/admin/company", icon: Building, label: "Company Details" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/faqs", icon: HelpCircle, label: "FAQs" },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 border-r bg-navbar-bg flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Metro Pools Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-glow-primary"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            className="w-full justify-start hover:bg-surface-hover"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r border-border flex flex-col transform transition-transform duration-200 lg:hidden",
        "bg-background",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Metro Pools Admin</span>
          </Link>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-glow-primary"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            className="w-full justify-start hover:bg-surface-hover"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative w-full">
        <div className="border-b bg-background sticky top-0 z-10 px-4 lg:px-8 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          <NotificationBell />
        </div>
        <div className="p-4 lg:p-8">
          {children}
        </div>
        
        {/* Tinik Chatbot - Global for all admin pages */}
        <AdminChatbot />
      </main>
    </div>
  );
};

export default AdminLayout;
