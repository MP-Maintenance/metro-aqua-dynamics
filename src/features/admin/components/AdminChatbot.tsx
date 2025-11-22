import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MessageCircle, X, Send, Loader2, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AdminChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [wakeWordActive, setWakeWordActive] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string>('en-US');
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const wakeWordRecognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Detect language from speech recognition results
  const detectLanguageFromResults = (result: any) => {
    const transcript = result[0].transcript.toLowerCase();
    
    // Simple language detection based on common words/patterns
    const arabicPattern = /[\u0600-\u06FF]/;
    const filipinoKeywords = ['kumusta', 'salamat', 'magandang', 'paki', 'ano', 'saan'];
    
    if (arabicPattern.test(transcript)) {
      setDetectedLanguage('ar-SA');
      if (recognitionRef.current) recognitionRef.current.lang = 'ar-SA';
    } else if (filipinoKeywords.some(word => transcript.includes(word))) {
      setDetectedLanguage('fil-PH');
      if (recognitionRef.current) recognitionRef.current.lang = 'fil-PH';
    } else {
      setDetectedLanguage('en-US');
      if (recognitionRef.current) recognitionRef.current.lang = 'en-US';
    }
  };

  // Handle voice commands
  const handleVoiceCommand = (transcript: string): boolean => {
    const lower = transcript.toLowerCase();
    let command = '';
    
    // Product commands
    if (lower.includes('show') && (lower.includes('product') || lower.includes('products'))) {
      command = "Show me all products in the system";
    }
    // Review commands
    else if ((lower.includes('list') || lower.includes('show')) && lower.includes('review')) {
      const status = lower.includes('pending') ? 'pending' : 'all';
      command = `Show me ${status} reviews`;
    }
    // Stats commands
    else if (lower.includes('stat') || lower.includes('statistic') || lower.includes('analytics')) {
      command = "Give me system statistics and analytics";
    }
    // User commands
    else if (lower.includes('user') && (lower.includes('list') || lower.includes('show'))) {
      command = "Show me all users";
    }
    // Quote commands
    else if (lower.includes('quote') && (lower.includes('list') || lower.includes('show'))) {
      command = "Show me all quote requests";
    }
    
    if (command) {
      setInput(command);
      // Use setTimeout to ensure state updates before sending
      setTimeout(() => {
        const sendButton = document.querySelector('[data-send-button]') as HTMLButtonElement;
        if (sendButton) sendButton.click();
      }, 100);
      return true;
    }
    
    return false;
  };

  // Toggle wake word listening
  const toggleWakeWord = () => {
    if (!wakeWordRecognitionRef.current) {
      toast({
        title: "Wake word not supported",
        description: "Your browser doesn't support wake word detection.",
        variant: "destructive",
      });
      return;
    }

    if (wakeWordActive) {
      wakeWordRecognitionRef.current.stop();
      setWakeWordActive(false);
      toast({
        title: "Wake word disabled",
        description: "Say 'Hey Tinik' activation is now off.",
      });
    } else {
      try {
        wakeWordRecognitionRef.current.start();
        setWakeWordActive(true);
        toast({
          title: "Wake word enabled",
          description: "Say 'Hey Tinik' to activate the assistant.",
        });
      } catch (error) {
        console.error('Error starting wake word recognition:', error);
        toast({
          title: "Wake word error",
          description: "Could not start wake word detection.",
          variant: "destructive",
        });
      }
    }
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        // Main recognition for conversation
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true; // Enable continuous listening
        recognitionRef.current.interimResults = true; // Get interim results for better VAD
        recognitionRef.current.lang = detectedLanguage;
        recognitionRef.current.maxAlternatives = 3; // Get multiple alternatives for language detection

        recognitionRef.current.onresult = (event: any) => {
          const lastResult = event.results[event.results.length - 1];
          
          // Voice Activity Detection - only process if confidence is high enough
          if (lastResult.isFinal && lastResult[0].confidence > 0.6) {
            const transcript = lastResult[0].transcript.trim();
            
            // Detect language from alternatives if available
            detectLanguageFromResults(event.results[event.results.length - 1]);
            
            // Check for voice commands
            if (handleVoiceCommand(transcript)) {
              return; // Command handled, don't add to input
            }
            
            setInput(transcript);
            setIsListening(false);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          if (event.error !== 'no-speech' && event.error !== 'aborted') {
            setIsListening(false);
            toast({
              title: "Voice input error",
              description: "Could not capture your voice. Please try again.",
              variant: "destructive",
            });
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        // Wake word recognition
        wakeWordRecognitionRef.current = new SpeechRecognition();
        wakeWordRecognitionRef.current.continuous = true;
        wakeWordRecognitionRef.current.interimResults = false;
        wakeWordRecognitionRef.current.lang = 'en-US';

        wakeWordRecognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
          
          if (transcript.includes('hey tinik') || transcript.includes('hey tinek')) {
            console.log('Wake word detected!');
            setIsOpen(true);
            toast({
              title: "Tinik activated",
              description: "How can I help you?",
            });
            // Start listening for command
            if (recognitionRef.current && !isListening) {
              try {
                recognitionRef.current.start();
                setIsListening(true);
              } catch (e) {
                console.error('Error starting recognition after wake word:', e);
              }
            }
          }
        };

        wakeWordRecognitionRef.current.onerror = (event: any) => {
          if (event.error !== 'no-speech' && event.error !== 'aborted') {
            console.error('Wake word recognition error:', event.error);
          }
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (wakeWordRecognitionRef.current) {
        wakeWordRecognitionRef.current.stop();
      }
    };
  }, [toast, detectedLanguage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      const greeting = "Hi, I'm Tinik, your Admin AI Assistant. How can I help you today?";
      setMessages([
        {
          role: "assistant",
          content: greeting,
        },
      ]);
      setHasGreeted(true);
      
      // Speak greeting if voice is enabled
      if (voiceEnabled) {
        speak(greeting);
      }
    }
  }, [isOpen, hasGreeted, voiceEnabled]);

  const speak = (text: string) => {
    if (!synthRef.current || !voiceEnabled) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to use a more natural voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.lang.startsWith('en')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice input not supported",
        description: "Your browser doesn't support voice input. Try Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast({
          title: "Voice input error",
          description: "Could not start voice input. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const streamChat = async (userMessage: string) => {
    setIsLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to use the chatbot",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(
        `https://ksgxbclcvqimqamuwddm.supabase.co/functions/v1/admin-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            messages: [...messages, { role: "user", content: userMessage }],
            requestContext: ["products", "users", "categories", "quotes", "reviews", "consultations", "faqs", "company"],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      if (!reader) {
        throw new Error("No response body");
      }

      // Add a temporary assistant message that will be updated
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;

              if (content) {
                assistantMessage += content;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: assistantMessage,
                  };
                  return updated;
                });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      // Speak the complete response if voice is enabled
      if (voiceEnabled && assistantMessage) {
        speak(assistantMessage);
      }
    } catch (error) {
      console.error("Error calling chatbot:", error);
      toast({
        title: "Error",
        description: "Failed to get response from Tinik. Please try again.",
        variant: "destructive",
      });
      
      // Remove the empty assistant message if there was an error
      setMessages((prev) => prev.filter((msg) => msg.content !== ""));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Stop any ongoing speech
    stopSpeaking();
    
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    await streamChat(userMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
      <CardHeader className="flex flex-col space-y-3 pb-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-primary-foreground" />
            </div>
            <CardTitle className="text-lg">Tinik - Admin Assistant</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsOpen(false);
              stopSpeaking();
            }}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between gap-4 px-1">
          <div className="flex items-center gap-2">
            <Label htmlFor="voice-toggle" className="text-xs text-muted-foreground cursor-pointer">
              Voice Output
            </Label>
            <Switch
              id="voice-toggle"
              checked={voiceEnabled}
              onCheckedChange={(checked) => {
                setVoiceEnabled(checked);
                if (!checked) stopSpeaking();
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="wake-word-toggle" className="text-xs text-muted-foreground cursor-pointer">
              Wake Word
            </Label>
            <Switch
              id="wake-word-toggle"
              checked={wakeWordActive}
              onCheckedChange={toggleWakeWord}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between px-1">
          {isSpeaking && (
            <div className="flex items-center gap-1 text-xs text-primary">
              <Volume2 className="h-3 w-3 animate-pulse" />
              <span>Speaking...</span>
            </div>
          )}
          {wakeWordActive && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <Mic className="h-3 w-3" />
              <span>Listening for "Hey Tinik"</span>
            </div>
          )}
          {detectedLanguage !== 'en-US' && (
            <div className="text-xs text-muted-foreground">
              Language: {detectedLanguage === 'ar-SA' ? 'Arabic' : detectedLanguage === 'fil-PH' ? 'Filipino' : 'English'}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Button
              onClick={toggleVoiceInput}
              disabled={isLoading}
              size="icon"
              variant={isListening ? "default" : "outline"}
              className={isListening ? "animate-pulse" : ""}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isListening ? "Listening..." : "Ask Tinik anything..."}
              disabled={isLoading || isListening}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              size="icon"
              data-send-button
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {isListening ? "Speak now..." : wakeWordActive ? "Say 'Hey Tinik' or type • Voice commands: 'show products', 'list reviews', 'give stats'" : "Voice & text input • Supports English, Arabic, and Filipino"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminChatbot;
