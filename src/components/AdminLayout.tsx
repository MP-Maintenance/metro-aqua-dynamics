import { ReactNode, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Package, FileText, MessageSquare, Building, Users, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { isAdmin, isAuthenticated, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
    { path: "/admin/products", icon: Package, label: "Products" },
    { path: "/admin/categories", icon: Package, label: "Categories" },
    { path: "/admin/quotes", icon: FileText, label: "Quote Requests" },
    { path: "/admin/consultations", icon: MessageSquare, label: "Pre-Consultations" },
    { path: "/admin/reviews", icon: MessageSquare, label: "Reviews" },
    { path: "/admin/company", icon: Building, label: "Company Details" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/faqs", icon: HelpCircle, label: "FAQs" },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card flex flex-col">
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Metro Pools Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
