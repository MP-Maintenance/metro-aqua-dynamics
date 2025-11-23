import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import App from "./App.tsx";
import LoadingScreen from "./components/LoadingScreen.tsx";
import "./index.css";

const RootApp = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AnimatePresence mode="wait">
        {isLoading ? <LoadingScreen key="loading" /> : <App key="app" />}
      </AnimatePresence>
    </ThemeProvider>
  );
};

createRoot(document.getElementById("root")!).render(<RootApp />);
