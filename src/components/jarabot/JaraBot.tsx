
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, X, Maximize, Minimize, Mic, MicOff, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { 
  ChatState, 
  Message, 
  PageContext, 
  JaraBotIntent,
  JaraBotFeature
} from "./types";
import { 
  createMessage, 
  generateAIResponse, 
  detectCurrentPage, 
  startSpeechRecognition,
  getRoadmapSummary
} from "./utils";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const JaraBotFeatures: JaraBotFeature[] = [
  {
    name: "Context-aware responses",
    status: "available",
    description: "JaraBot understands what page you're on and provides relevant help"
  },
  {
    name: "Voice recognition",
    status: "beta",
    description: "Speak to JaraBot and get responses (may not work in all browsers)"
  },
  {
    name: "Nigerian event culture knowledge",
    status: "available",
    description: "JaraBot understands Nigerian event terminology and customs"
  },
  {
    name: "Roadmap assistance",
    status: "available",
    description: "Get insights about the project roadmap and progress"
  },
  {
    name: "AI event recommendations",
    status: "coming-soon",
    description: "Personalized event planning suggestions based on your preferences"
  }
];

const JaraBot = () => {
  const [state, setState] = useState<ChatState>({
    isOpen: false,
    isExpanded: false,
    isRecording: false,
    isListening: false,
    input: "",
    messages: [
      createMessage("bot", "Heyyy! JaraBot don land! How I fit help you plan your next lit event?")
    ]
  });
  
  const [pageContext, setPageContext] = useState<PageContext>(detectCurrentPage());
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [state.messages]);

  useEffect(() => {
    const updateContext = () => {
      setPageContext(detectCurrentPage());
    };

    updateContext();

    window.addEventListener('popstate', updateContext);
    
    return () => {
      window.removeEventListener('popstate', updateContext);
    };
  }, []);

  useEffect(() => {
    if (state.isOpen && state.messages.length === 1) {
      const currentPage = pageContext.page;
      
      let welcomeMessage = "How can I help with your event planning today?";
      
      if (currentPage === 'seating-chart') {
        welcomeMessage = "I see you're working on your seating chart! Need help with table arrangements or guest placement?";
      } else if (currentPage === 'marketplace') {
        welcomeMessage = "Looking for vendor recommendations or tips on choosing the right vendors?";
      } else if (currentPage === 'budget') {
        welcomeMessage = "Working on your budget? I can help you allocate funds and save on costs!";
      } else if (currentPage === 'guest-management') {
        welcomeMessage = "Managing your guest list? Let me know if you need help with RSVP tracking or guest grouping!";
      } else if (currentPage === 'roadmap') {
        welcomeMessage = "I see you're checking out our project roadmap! Ask me about our development progress or upcoming features.";
      }
      
      setTimeout(() => {
        setState(prevState => ({
          ...prevState,
          messages: [
            ...prevState.messages,
            createMessage("bot", welcomeMessage)
          ]
        }));
      }, 1000);
    }
  }, [state.isOpen, pageContext]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (state.input.trim() === "") return;
    
    if (state.input === lastUserMessage) {
      toast("Message already sent", {
        description: "Try asking something different or providing more details."
      });
      return;
    }
    
    const userMessage = createMessage("user", state.input);
    setLastUserMessage(state.input);
    
    setState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, userMessage],
      input: ""
    }));
    
    setIsProcessing(true);
    
    const processingTime = Math.floor(Math.random() * 700) + 800;
    
    setTimeout(() => {
      let responseContent = generateAIResponse(userMessage.content, pageContext);
      const botMessage = createMessage("bot", responseContent);
      
      setState(prevState => ({
        ...prevState,
        messages: [...prevState.messages, botMessage]
      }));
      
      setIsProcessing(false);
    }, processingTime);
  };

  const toggleRecording = () => {
    if (state.isRecording) {
      setState(prevState => ({ ...prevState, isRecording: false }));
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      
      toast("Voice recording stopped", {
        description: "I no fit hear you again o!"
      });
      return;
    }
    
    setState(prevState => ({ ...prevState, isRecording: true }));
    toast("Voice recording started", {
      description: "I dey listen! Speak your mind."
    });
    
    const isSpeechSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    
    if (isSpeechSupported) {
      recognitionRef.current = startSpeechRecognition(
        (transcript) => {
          setState(prevState => ({ 
            ...prevState, 
            input: transcript
          }));
        },
        () => {
          setState(prevState => ({ 
            ...prevState, 
            isRecording: false 
          }));
          toast("Voice recognition ended", {
            description: "I don stop dey listen."
          });
        }
      );
      
      if (!recognitionRef.current) {
        simulateVoiceRecognition();
      }
    } else {
      simulateVoiceRecognition();
    }
  };

  const simulateVoiceRecognition = () => {
    setTimeout(() => {
      let simulatedInput = "I need help planning my friend's birthday party";
      
      if (pageContext.page === 'seating-chart') {
        simulatedInput = "How should I arrange the seating for family members?";
      } else if (pageContext.page === 'marketplace') {
        simulatedInput = "How do I find reliable vendors?";
      } else if (pageContext.page === 'roadmap') {
        simulatedInput = "Tell me about the project roadmap status";
      }
      
      setState(prevState => ({ 
        ...prevState, 
        isRecording: false,
        input: simulatedInput
      }));
      toast("Voice recognized", {
        description: "I don hear you!"
      });
    }, 3000);
  };

  const toggleChat = () => {
    setState(prevState => ({ ...prevState, isOpen: !prevState.isOpen }));
  };

  const toggleExpand = () => {
    setState(prevState => ({ ...prevState, isExpanded: !prevState.isExpanded }));
  };

  const clearChat = () => {
    setState(prevState => ({
      ...prevState,
      messages: [
        createMessage("bot", "Chat history cleared! How else I fit help you today?")
      ]
    }));
    setLastUserMessage("");
    toast("Chat history cleared", {
      description: "Fresh start, fresh ideas!"
    });
  };

  return (
    <>
      {!state.isOpen && (
        <button 
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-jara-green text-white shadow-lg hover:bg-jara-green/90 transition-all duration-300 hover:scale-105 animate-pulse-gentle"
        >
          <Sparkles className="w-6 h-6" />
          <Badge className="absolute -top-2 -right-2 bg-jara-purple">Beta</Badge>
        </button>
      )}

      {state.isOpen && (
        <div 
          className={cn(
            "fixed z-50 bg-white rounded-lg shadow-xl flex flex-col transition-all duration-300",
            state.isExpanded 
              ? "inset-4 md:inset-10 lg:inset-20" 
              : "bottom-6 right-6 w-80 md:w-96 h-[500px]"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-jara-green">
                 <AvatarImage src="/src/assets/bot-avatar.jpg" alt="JaraBot" />
                <AvatarFallback className="bg-jara-green text-white">JB</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900">JaraBot</h3>
                  <Badge className="bg-jara-purple">Beta</Badge>
                </div>
                <p className="text-xs text-gray-500">Your Nigerian event assistant</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={clearChat}
                title="Clear chat history"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={toggleExpand}
                title={state.isExpanded ? "Minimize" : "Maximize"}
              >
                {state.isExpanded ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={toggleChat}
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {state.messages.map((message) => (
              <div 
                key={message.id} 
                className={cn(
                  "flex gap-3 max-w-[85%]",
                  message.type === "user" ? "ml-auto" : ""
                )}
              >
                {message.type === "bot" && (
                  <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                     <AvatarImage src="/src/assets/bot-avatar.jpg" alt="JaraBot" />
                    <AvatarFallback className="bg-jara-green text-white text-xs">JB</AvatarFallback>
                  </Avatar>
                )}
                <div 
                  className={cn(
                    "p-3 rounded-lg",
                    message.type === "user" 
                      ? "bg-jara-green text-white" 
                      : "bg-gray-100 text-gray-800"
                  )}
                >
                  {message.content}
                  <div 
                    className={cn(
                      "text-xs mt-1",
                      message.type === "user" ? "text-white/70" : "text-gray-500"
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {message.type === "user" && (
                  <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                    <AvatarImage src="/src/assets/avatar-4.jpg" alt="You" />
                    <AvatarFallback className="bg-jara-purple text-white text-xs">YOU</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isProcessing && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                  <AvatarImage src="/src/assets/bot-avatar.jpg" alt="JaraBot" />
                  <AvatarFallback className="bg-jara-green text-white text-xs">JB</AvatarFallback>
                </Avatar>
                <div className="p-3 rounded-lg bg-gray-100 text-gray-800">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-jara-green animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-jara-green animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-jara-green animate-bounce" style={{ animationDelay: "600ms" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className={cn(
                  "flex-shrink-0",
                  state.isRecording && "border-red-500 text-red-500 animate-pulse"
                )} 
                onClick={toggleRecording}
                disabled={isProcessing}
              >
                {state.isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={state.input}
                  onChange={(e) => setState(prev => ({ ...prev, input: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && !isProcessing && handleSendMessage()}
                  className="w-full rounded-full border border-gray-300 py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-jara-green"
                  placeholder="Ask JaraBot for help..."
                  disabled={isProcessing}
                />
              </div>
              <Button 
                className="bg-jara-green text-white flex-shrink-0 hover:bg-jara-green/90" 
                size="icon"
                onClick={handleSendMessage}
                disabled={isProcessing || !state.input.trim()}
              >
                {isProcessing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              JaraBot speaks Pidgin and understands Nigerian events!
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default JaraBot;
