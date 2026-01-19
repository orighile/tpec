import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, X, Maximize, Minimize, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useChiefChat } from "@/hooks/useChiefChat";

const Chief = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const { messages, isLoading, sendMessage, clearMessages } = useChiefChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === "" || isLoading) return;
    const userInput = input;
    setInput("");
    await sendMessage(userInput);
  };

  const handleClearChat = () => {
    clearMessages();
    toast.success("Chat history cleared");
  };

  const toggleChat = () => setIsOpen(!isOpen);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <>
      {!isOpen && (
        <button 
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 animate-pulse-gentle"
        >
          <Sparkles className="w-6 h-6" />
          <Badge className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground">AI</Badge>
        </button>
      )}

      {isOpen && (
        <div 
          className={cn(
            "fixed z-50 bg-card rounded-lg shadow-xl flex flex-col transition-all duration-300",
            isExpanded 
              ? "inset-4 md:inset-10 lg:inset-20" 
              : "bottom-6 right-6 w-80 md:w-96 h-[500px]"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary">
                <AvatarImage src="/src/assets/bot-avatar.jpg" alt="Chief" />
                <AvatarFallback className="bg-primary text-primary-foreground">CH</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-foreground">Chief</h3>
                  <Badge className="bg-secondary text-secondary-foreground">AI</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Your Nigerian event expert</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={handleClearChat}
                title="Clear chat history"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={toggleExpand}
                title={isExpanded ? "Minimize" : "Maximize"}
              >
                {isExpanded ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
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
            {/* Welcome message when no messages */}
            {messages.length === 0 && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                  <AvatarImage src="/src/assets/bot-avatar.jpg" alt="Chief" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">CH</AvatarFallback>
                </Avatar>
                <div className="p-3 rounded-lg bg-muted text-foreground">
                  <p>Hello! I'm Chief, your Nigerian event planning expert. 🎉</p>
                  <p className="mt-2">I can help you with:</p>
                  <ul className="list-disc list-inside mt-1 text-sm">
                    <li>Venue recommendations across Nigeria</li>
                    <li>Finding vendors (caterers, DJs, decorators)</li>
                    <li>Budget planning and cost estimates</li>
                    <li>Traditional ceremony protocols</li>
                    <li>Guest management tips</li>
                  </ul>
                  <p className="mt-2">What event are you planning?</p>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex gap-3 max-w-[85%]",
                  message.role === "user" ? "ml-auto" : ""
                )}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                    <AvatarImage src="/src/assets/bot-avatar.jpg" alt="Chief" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">CH</AvatarFallback>
                  </Avatar>
                )}
                <div 
                  className={cn(
                    "p-3 rounded-lg whitespace-pre-wrap",
                    message.role === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-foreground"
                  )}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                    <AvatarImage src="/src/assets/avatar-4.jpg" alt="You" />
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">YOU</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                  <AvatarImage src="/src/assets/bot-avatar.jpg" alt="Chief" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">CH</AvatarFallback>
                </Avatar>
                <div className="p-3 rounded-lg bg-muted text-foreground">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "600ms" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                  className="w-full rounded-full border border-border bg-background text-foreground py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ask Chief anything about your event..."
                  disabled={isLoading}
                />
              </div>
              <Button 
                className="flex-shrink-0" 
                size="icon"
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Chief is powered by AI and specializes in Nigerian event planning
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Chief;
