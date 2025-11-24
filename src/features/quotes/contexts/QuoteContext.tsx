import { createContext, useContext, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface QuoteItem {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  quantity: number;
  availability: "available" | "not-available";
}

interface QuoteContextType {
  items: QuoteItem[];
  addItem: (item: Omit<QuoteItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  submitQuote: (contactInfo: { fullName: string; phone: string }) => Promise<void>;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addItem = (item: Omit<QuoteItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const submitQuote = async (contactInfo: { fullName: string; phone: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to submit a quote request");
      }

      // Prepare items for database
      const quoteItems = items.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
      }));

      // Insert quote request
      const { data: quoteRequest, error } = await supabase
        .from("quote_requests")
        .insert({
          user_id: user.id,
          items: quoteItems,
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      // Create notification for admins (non-blocking)
      if (quoteRequest) {
        supabase
          .from("notifications")
          .insert({
            type: "quote_request",
            reference_id: parseInt(quoteRequest.id),
            message: `New quote request from ${contactInfo.fullName || user.email}`,
            created_by: user.id,
            assigned_to: null,
          })
          .then(({ error: notifError }) => {
            if (notifError) console.error("Error creating notification:", notifError);
          });
      }

      // Update user profile with contact info if provided
      if (contactInfo.fullName || contactInfo.phone) {
        await supabase
          .from("profiles")
          .update({
            full_name: contactInfo.fullName,
            phone: contactInfo.phone,
          })
          .eq("id", user.id);
      }

      // Send email notification to admins (non-blocking)
      supabase.functions.invoke('send-notification-email', {
        body: {
          type: 'quote',
          customerName: contactInfo.fullName || user.email || 'Unknown',
          customerEmail: user.email || '',
          items: items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            category: item.category,
          })),
        },
      }).catch(emailError => {
        console.error('Error sending notification email:', emailError);
        // Email failure doesn't block quote submission
      });

      // Clear cart after successful submission
      clearCart();
    } catch (error: any) {
      console.error("Error submitting quote:", error);
      throw error;
    }
  };

  return (
    <QuoteContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        submitQuote,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuote = () => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error("useQuote must be used within QuoteProvider");
  }
  return context;
};
