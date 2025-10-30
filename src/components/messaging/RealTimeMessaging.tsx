import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, Send, Phone, Video, MoreVertical, 
  Paperclip, Smile, Search, Users, Circle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'booking' | 'payment';
  read: boolean;
  metadata?: any;
}

interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  avatar?: string;
  isOnline?: boolean;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'client' | 'vendor' | 'admin';
  isOnline: boolean;
  lastSeen?: Date;
}

const RealTimeMessaging: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      type: 'direct',
      name: 'John Doe (Client)',
      participants: [
        { id: '1', name: 'John Doe', avatar: '/api/placeholder/40/40', role: 'client', isOnline: true }
      ],
      lastMessage: {
        id: '1',
        senderId: '1',
        senderName: 'John Doe',
        senderAvatar: '/api/placeholder/40/40',
        content: 'Hi, I need photography services for my wedding',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        type: 'text',
        read: false
      },
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      type: 'direct',
      name: 'Sarah Williams (Vendor)',
      participants: [
        { id: '2', name: 'Sarah Williams', avatar: '/api/placeholder/40/40', role: 'vendor', isOnline: false, lastSeen: new Date(Date.now() - 30 * 60 * 1000) }
      ],
      lastMessage: {
        id: '2',
        senderId: '2',
        senderName: 'Sarah Williams',
        senderAvatar: '/api/placeholder/40/40',
        content: 'The catering menu has been updated with your preferences',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: 'text',
        read: true
      },
      unreadCount: 0,
      isOnline: false
    }
  ]);

  const [activeConversation, setActiveConversation] = useState<string>('1');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: '1',
      senderName: 'John Doe',
      senderAvatar: '/api/placeholder/40/40',
      content: 'Hi, I need photography services for my wedding',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      type: 'text',
      read: true
    },
    {
      id: '2',
      senderId: 'me',
      senderName: 'You',
      senderAvatar: '/api/placeholder/40/40',
      content: 'Hello! I\'d be happy to help with your wedding photography. When is your wedding date?',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      type: 'text',
      read: true
    },
    {
      id: '3',
      senderId: '1',
      senderName: 'John Doe',
      senderAvatar: '/api/placeholder/40/40',
      content: 'It\'s scheduled for March 15th, 2025. We\'re expecting about 200 guests.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'text',
      read: false
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatLastSeen = (date?: Date) => {
    if (!date) return 'Last seen long ago';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `Last seen ${days}d ago`;
    if (hours > 0) return `Last seen ${hours}h ago`;
    if (minutes > 0) return `Last seen ${minutes}m ago`;
    return 'Last seen just now';
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'You',
      senderAvatar: '/api/placeholder/40/40',
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
      read: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversation 
        ? { ...conv, lastMessage: message, unreadCount: 0 }
        : conv
    ));

    // Simulate typing indicator for response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const response: Message = {
          id: (Date.now() + 1).toString(),
          senderId: '1',
          senderName: 'John Doe',
          senderAvatar: '/api/placeholder/40/40',
          content: 'That sounds perfect! What are your packages and pricing?',
          timestamp: new Date(),
          type: 'text',
          read: false
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }, 500);

    toast({
      title: "Message sent",
      description: "Your message has been delivered",
    });
  };

  const sendBookingMessage = () => {
    const bookingMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'You',
      senderAvatar: '/api/placeholder/40/40',
      content: 'Wedding Photography Package - March 15, 2025',
      timestamp: new Date(),
      type: 'booking',
      read: true,
      metadata: {
        service: 'Wedding Photography',
        date: '2025-03-15',
        price: 150000,
        duration: '8 hours',
        status: 'pending'
      }
    };

    setMessages(prev => [...prev, bookingMessage]);
    toast({
      title: "Booking sent",
      description: "Your booking proposal has been sent",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const activeConv = conversations.find(c => c.id === activeConversation);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-10" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`
                  p-4 cursor-pointer hover:bg-muted/50 border-b transition-colors
                  ${activeConversation === conv.id ? 'bg-muted' : ''}
                `}
                onClick={() => setActiveConversation(conv.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conv.participants[0]?.avatar} />
                      <AvatarFallback>{conv.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <Circle className={`
                      absolute -bottom-1 -right-1 h-3 w-3 
                      ${conv.isOnline ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'}
                    `} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium truncate">{conv.name}</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(conv.lastMessage.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.lastMessage.content}
                      </p>
                      {conv.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="lg:col-span-2">
        {/* Chat Header */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activeConv?.participants[0]?.avatar} />
                  <AvatarFallback>{activeConv?.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <Circle className={`
                  absolute -bottom-1 -right-1 h-3 w-3 
                  ${activeConv?.isOnline ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'}
                `} />
              </div>
              <div>
                <h3 className="font-semibold">{activeConv?.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {activeConv?.isOnline 
                    ? 'Online' 
                    : formatLastSeen(activeConv?.participants[0]?.lastSeen)
                  }
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <Separator />

        {/* Messages */}
        <CardContent className="p-0">
          <ScrollArea className="h-[350px] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.senderId === 'me' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.senderId !== 'me' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.senderAvatar} />
                      <AvatarFallback>{message.senderName.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`
                    max-w-[70%] rounded-lg p-3 text-sm
                    ${message.senderId === 'me' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                    }
                  `}>
                    {message.type === 'booking' ? (
                      <div className="space-y-2">
                        <div className="font-medium">📅 Booking Proposal</div>
                        <div className="text-xs opacity-90">
                          <div>Service: {message.metadata.service}</div>
                          <div>Date: {new Date(message.metadata.date).toLocaleDateString()}</div>
                          <div>Duration: {message.metadata.duration}</div>
                          <div>Price: ₦{message.metadata.price.toLocaleString()}</div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {message.metadata.status}
                        </Badge>
                      </div>
                    ) : (
                      <div>{message.content}</div>
                    )}
                    <div className="text-xs opacity-70 mt-1">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                  
                  {message.senderId === 'me' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.senderAvatar} />
                      <AvatarFallback>ME</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activeConv?.participants[0]?.avatar} />
                    <AvatarFallback>{activeConv?.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-3 text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>

        <Separator />

        {/* Message Input */}
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={sendBookingMessage}>
              📅
            </Button>
            <Button variant="outline" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-10"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={sendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeMessaging;
