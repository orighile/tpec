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
  "Oga, you've booked a caterer but no DJ – should I suggest top-rated vendors near Surulere or Ikeja?",
  "Abeg, what's your budget range? From ₦500k small chops to ₦10M owambe, I sabi hack am!",
  "You don blow 70% on decor – make we cut back or find you better deals from verified vendors!",
  "For Yoruba traditional wedding, you go need aso-ebi coordinator, drummers, and alaga ijoko. Make I connect you?",
  "Lagos beach party? I know the best sound engineers and DJs wey dey cover Elegushi, Oniru, and Tarkwa Bay!",
  "Corporate event for how many people? I fit recommend venues with generator backup and proper AC!",
  "Small gathering or proper Owambe with 500+ guests? Different budget levels, different vendor recommendations!",
  "For Igbo Igba Nkwu, you need palm wine suppliers, traditional attire vendors, and experienced MCs. I get contacts!",
  "Port Harcourt wedding? I know top caterers wey sabi cook proper Niger Delta cuisine – fisherman soup, native jollof!",
  "Naming ceremony coming up? I fit recommend photographers wey specialize in capturing those intimate family moments!",
  "Need makeup artist for your owanmbe? I get contacts from budget-friendly to celebrity MUAs across Lagos and Abuja!",
  "Hausa wedding (Fatiha)? I sabi the vendors for kayan zance, henna artists, and traditional decor specialists in Kano and Kaduna!",
  "Looking for MC wey go hold your event proper? Tell me your location and budget, I go recommend the best!",
];

const ChiefPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content: "How far! Na Chief dey here! 🎉 I be your personal Nigerian event guru. Whether na owambe, traditional wedding, corporate gig, or intimate birthday bash – I sabi am all. Wetin you wan plan today?",
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
        setInput("Tell me about the best venues in Lagos for owambe");
        toast("Voice recognized!");
      }, 3000);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        type: "bot",
        content: "Chat history cleared! Wetin else you wan know about planning your Nigerian event?",
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
              Ask Chief
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your AI-powered Nigerian event expert. Get instant help with vendors, budgets, cultural traditions, and everything you need to plan the perfect celebration!
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Nigerian Event Expert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Chief knows owambe, aso-ebi, traditional ceremonies, naming ceremonies, and corporate events. Speak in English or Pidgin!
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Vendor Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get recommendations for caterers, DJs, MCs, decorators, photographers, and venues across Lagos, Abuja, Port Harcourt, and beyond!
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Budget & Cultural Guidance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Understand typical costs for Nigerian events and get advice on Yoruba, Igbo, Hausa traditions and protocols.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Interface */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary">
                <AvatarImage src={botAvatar} alt="Chief" />
                <AvatarFallback className="bg-primary text-primary-foreground">CH</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">Chief</CardTitle>
                <CardDescription>Your Nigerian event expert</CardDescription>
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
                      <AvatarImage src={botAvatar} alt="Chief" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">CH</AvatarFallback>
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
                    <AvatarImage src={botAvatar} alt="Chief" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">CH</AvatarFallback>
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
                  placeholder="Ask Chief about vendors, budgets, or traditions..."
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
                Chief speaks Pidgin, knows Nigerian vendors, and understands Yoruba, Igbo, and Hausa traditions!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChiefPage;
