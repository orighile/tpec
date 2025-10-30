
import { useState, useRef, useEffect } from "react";
import { PaperPlaneTilt, Sparkle, X, ArrowsOut, ArrowsIn, Microphone, MicrophoneSlash, ArrowCounterClockwise } from "phosphor-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type Message = {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
};

const SAMPLE_RESPONSES = [
  "Oga, you've booked a caterer but no DJ – should I suggest top-rated vendors near you?",
  "Abeg, what's your budget? No shaking, I go fit hack am!",
  "You don blow 70% on decor – cut back or earn 'Ballers Club' points for discounts!",
  "Send 50 invites before Friday to avoid 'African Time' drama!",
  "For your Yoruba wedding, would you like me to recommend some aso ebi vendors?",
  "You need a sound system for your Lagos beach party? I get people wey sabi!",
  "You're planning a corporate event? Make I help you find venue wey get proper AC!",
  "How many guests you dey expect? Small gathering or proper Owambe?",
  "I see you're looking at the roadmap. Phase 3 (my development) is currently in progress!",
  "Would you like me to help you understand which phases of the project are critical?"
];

const JaraBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content: "Heyyy! JaraBot don land! How I fit help you plan your next lit event?",
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);
    
    // Simulate typing indicator
    setTimeout(() => {
      // Add bot response
      const randomResponse = SAMPLE_RESPONSES[Math.floor(Math.random() * SAMPLE_RESPONSES.length)];
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: randomResponse,
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, botMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast("Voice recording stopped", {
        description: "I no fit hear you again o!"
      });
    } else {
      setIsRecording(true);
      toast("Voice recording started", {
        description: "I dey listen! Speak your mind."
      });
      
      // Simulate voice recognition after 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        setInput("Tell me about the current project roadmap status");
        toast("Voice recognized", {
          description: "I don hear you!"
        });
      }, 3000);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        type: "bot",
        content: "Chat history cleared! How else I fit help you today?",
        timestamp: new Date()
      }
    ]);
    toast("Chat history cleared", {
      description: "Fresh start, fresh ideas!"
    });
  };

  return (
    <>
      {/* Chat button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-jara-green text-white shadow-lg hover:bg-jara-green/90 transition-all duration-300 hover:scale-105 animate-pulse-gentle"
        >
          <Sparkle className="w-6 h-6" />
          <Badge className="absolute -top-2 -right-2 bg-jara-purple">Beta</Badge>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div 
          className={cn(
            "fixed z-50 bg-white rounded-lg shadow-xl flex flex-col transition-all duration-300",
            isExpanded 
              ? "inset-4 md:inset-10 lg:inset-20" 
              : "bottom-6 right-6 w-80 md:w-96 h-[500px]"
          )}
        >
          {/* Header */}
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
                <ArrowCounterClockwise className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Minimize" : "Maximize"}
              >
                {isExpanded ? <ArrowsIn className="h-4 w-4" /> : <ArrowsOut className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
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

          {/* Input area */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className={cn(
                  "flex-shrink-0",
                  isRecording && "border-red-500 text-red-500 animate-pulse"
                )} 
                onClick={toggleRecording}
              >
                {isRecording ? <MicrophoneSlash className="h-5 w-5" /> : <Microphone className="h-5 w-5" />}
              </Button>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="w-full rounded-full border border-gray-300 py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-jara-green"
                  placeholder="Ask JaraBot for help..."
                />
              </div>
              <Button 
                className="bg-jara-green text-white flex-shrink-0 hover:bg-jara-green/90" 
                size="icon"
                onClick={handleSendMessage}
              >
                <PaperPlaneTilt className="h-5 w-5" />
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
