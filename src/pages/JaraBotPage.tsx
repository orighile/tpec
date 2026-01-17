import { useState, useRef, useEffect } from "react";
import { MessageCircle, Sparkles, Send, Mic, MicOff, RotateCcw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import botAvatar from "@/assets/bot-avatar.jpg";
import userAvatar from "@/assets/avatar-4.jpg";

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
];

const JaraBotPage = () => {
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
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);
    
    setTimeout(() => {
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
      toast("Voice recording stopped");
    } else {
      setIsRecording(true);
      toast("Voice recording started - I dey listen!");
      
      setTimeout(() => {
        setIsRecording(false);
        setInput("Tell me about the best venues in Lagos");
        toast("Voice recognized!");
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
    toast("Chat history cleared");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ask JaraBot
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your smart Nigerian event assistant. Get instant help with planning, vendor recommendations, and event advice!
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Smart Conversations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Chat naturally with JaraBot in English or Pidgin. Get helpful suggestions tailored to your event needs.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Vendor Matching
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                JaraBot knows all our verified vendors and can recommend the perfect match based on your location and budget.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Cultural Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get advice on Nigerian traditions, typical event costs, and culturally appropriate planning tips.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Interface */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary">
                <AvatarImage src={botAvatar} alt="JaraBot" />
                <AvatarFallback className="bg-primary text-primary-foreground">JB</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">JaraBot</CardTitle>
                <CardDescription>Your Nigerian event assistant</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={clearChat} title="Clear chat history">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Chat messages */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-4">
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
                      <AvatarImage src={botAvatar} alt="JaraBot" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">JB</AvatarFallback>
                    </Avatar>
                  )}
                  <div 
                    className={cn(
                      "p-3 rounded-lg",
                      message.type === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-foreground"
                    )}
                  >
                    {message.content}
                    <div 
                      className={cn(
                        "text-xs mt-1 opacity-70"
                      )}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {message.type === "user" && (
                    <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                      <AvatarImage src={userAvatar} alt="You" />
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">YOU</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isProcessing && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                    <AvatarImage src={botAvatar} alt="JaraBot" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">JB</AvatarFallback>
                  </Avatar>
                  <div className="p-3 rounded-lg bg-muted">
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

            {/* Input area */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={cn(
                    "flex-shrink-0",
                    isRecording && "border-destructive text-destructive animate-pulse"
                  )} 
                  onClick={toggleRecording}
                >
                  {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 rounded-full border border-input bg-background py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ask JaraBot for help..."
                />
                <Button 
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!input.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                JaraBot speaks Pidgin and understands Nigerian events!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JaraBotPage;
