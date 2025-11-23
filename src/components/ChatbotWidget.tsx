import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

const predefinedQuestions = [
  "What services do you offer?",
  "How much does pool maintenance cost?",
  "Do you offer emergency services?",
  "What areas do you serve?",
  "How do I schedule an appointment?",
];

const botResponses: Record<string, string> = {
  "What services do you offer?": "We offer comprehensive pool maintenance, cleaning, inspection, repairs, and renovation services for residential and commercial properties.",
  "How much does pool maintenance cost?": "Our pricing varies based on pool size and service frequency. Contact us for a free quote tailored to your needs!",
  "Do you offer emergency services?": "Yes! We provide 24/7 emergency repair services for urgent pool issues. Call us at +974 4477 1588.",
  "What areas do you serve?": "We proudly serve Qatar, UAE, Saudi Arabia, Bahrain, Kuwait, Oman, and Egypt.",
  "How do I schedule an appointment?": "You can request a consultation through our quote form or call us directly at +974 4477 1588.",
};

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: "Hello! How can I help you today? Choose a question below or type your own.", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const playNotificationSound = () => {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = 880;
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (error) {
      console.error("Notification sound error", error);
    }
  };

  const showDesktopNotification = (text: string) => {
    if (typeof window === "undefined" || typeof Notification === "undefined") return;
    if (Notification.permission !== "granted") return;

    try {
      new Notification("Metro Pools Assistant", {
        body: text,
      });
    } catch (error) {
      console.error("Desktop notification error", error);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    if (typeof window === "undefined" || typeof Notification === "undefined") return;

    if (Notification.permission === "granted") {
      setNotificationsEnabled(true);
    } else if (Notification.permission === "default") {
      Notification.requestPermission()
        .then((permission) => {
          setNotificationsEnabled(permission === "granted");
        })
        .catch(() => {
          setNotificationsEnabled(false);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (messages.length <= 1) return;

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage.isBot) return;

    playNotificationSound();

    if (notificationsEnabled) {
      showDesktopNotification(lastMessage.text);
    }
  }, [messages, notificationsEnabled]);

  const handleQuestionClick = (question: string) => {
    const userMessage: Message = {
      id: messages.length,
      text: question,
      isBot: false,
    };
    
    const botMessage: Message = {
      id: messages.length + 1,
      text: botResponses[question] || "I'm here to help! For specific inquiries, please contact us at +974 4477 1588.",
      isBot: true,
    };

    setMessages([...messages, userMessage, botMessage]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length,
      text: inputValue,
      isBot: false,
    };

    const botMessage: Message = {
      id: messages.length + 1,
      text: "Thank you for your message! For personalized assistance, please call us at +974 4477 1588 or submit a quote request.",
      isBot: true,
    };

    setMessages([...messages, userMessage, botMessage]);
    setInputValue("");
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)]"
          >
            <Card className="shadow-glow-primary border-primary/20">
              <CardHeader className="bg-gradient-to-r from-primary to-secondary text-primary-foreground pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Metro Pools Assistant</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-primary-foreground hover:bg-primary-foreground/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-sm text-primary-foreground/90">We're here to help!</p>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[350px] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.isBot
                              ? "bg-muted text-foreground"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                      </motion.div>
                    ))}
                    
                    {messages.length === 1 && (
                      <div className="space-y-2 mt-4">
                        <p className="text-sm text-muted-foreground mb-2">Quick Questions:</p>
                        {predefinedQuestions.map((question, idx) => (
                          <motion.button
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => handleQuestionClick(question)}
                            className="w-full text-left px-3 py-2 text-sm rounded-lg bg-primary/10 hover:bg-primary/20 text-foreground transition-colors"
                          >
                            {question}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                <div className="border-t p-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button
                      onClick={handleSendMessage}
                      size="icon"
                      className="shadow-glow-primary"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="fixed bottom-6 right-6 z-40 rounded-full w-14 h-14 shadow-glow-primary"
          aria-label="Open chat support"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    </>
  );
};

export default ChatbotWidget;
