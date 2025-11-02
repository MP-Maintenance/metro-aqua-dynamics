import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("metro-pools-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock authentication - replace with real API call
    const mockUser = {
      id: "1",
      name: email.split("@")[0],
      email,
    };
    setUser(mockUser);
    localStorage.setItem("metro-pools-user", JSON.stringify(mockUser));
    setIsAuthModalOpen(false);
  };

  const signUp = async (name: string, email: string, password: string) => {
    // Mock sign up - replace with real API call
    const mockUser = {
      id: Date.now().toString(),
      name,
      email,
    };
    setUser(mockUser);
    localStorage.setItem("metro-pools-user", JSON.stringify(mockUser));
    setIsAuthModalOpen(false);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("metro-pools-user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        setIsAuthModalOpen,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
