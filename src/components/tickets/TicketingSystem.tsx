import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Ticket, Plus, Edit, Trash2, QrCode, Calendar, MapPin, Users } from 'lucide-react';

interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sold: number;
  category: 'general' | 'vip' | 'early_bird' | 'group';
  benefits: string[];
  saleStart: string;
  saleEnd: string;
  status: 'active' | 'paused' | 'sold_out';
}

interface TicketingSystemProps {
  eventId: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
}

const TicketingSystem: React.FC<TicketingSystemProps> = ({
  eventId,
  eventName,
  eventDate,
  eventLocation
}) => {
  const [tickets, setTickets] = useState<TicketType[]>([
    {
      id: '1',
      name: 'General Admission',
      description: 'Standard entry to the event',
      price: 5000,
      quantity: 100,
      sold: 25,
      category: 'general',
      benefits: ['Event entry', 'Welcome drink'],
      saleStart: '2025-01-01',
      saleEnd: '2025-03-01',
      status: 'active'
    }
  ]);
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketType | null>(null);
  const [newTicket, setNewTicket] = useState<Partial<TicketType>>({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    category: 'general',
    benefits: [],
    saleStart: '',
    saleEnd: '',
    status: 'active'
  });
  
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-primary/10 text-primary';
      case 'paused': return 'bg-secondary/50 text-secondary-foreground';
      case 'sold_out': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'vip': return 'bg-accent text-accent-foreground';
      case 'early_bird': return 'bg-primary/10 text-primary';
      case 'group': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleCreateTicket = () => {
    if (!newTicket.name || !newTicket.price || !newTicket.quantity) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const ticket: TicketType = {
      id: Date.now().toString(),
      name: newTicket.name!,
      description: newTicket.description || '',
      price: newTicket.price!,
      quantity: newTicket.quantity!,
      sold: 0,
      category: newTicket.category as any || 'general',
      benefits: newTicket.benefits || [],
      saleStart: newTicket.saleStart || '',
      saleEnd: newTicket.saleEnd || '',
      status: 'active'
    };

    setTickets([...tickets, ticket]);
    setNewTicket({
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      category: 'general',
      benefits: [],
      saleStart: '',
      saleEnd: '',
      status: 'active'
    });
    setIsCreating(false);

    toast({
      title: "Ticket Created",
      description: `${ticket.name} has been added to the event`,
    });
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTickets(tickets.filter(t => t.id !== ticketId));
    toast({
      title: "Ticket Deleted",
      description: "Ticket type has been removed",
    });
  };

  const toggleTicketStatus = (ticketId: string) => {
    setTickets(tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: ticket.status === 'active' ? 'paused' : 'active' }
        : ticket
    ));
  };

  const getTotalRevenue = () => {
    return tickets.reduce((total, ticket) => total + (ticket.price * ticket.sold), 0);
  };

  const getTotalSold = () => {
    return tickets.reduce((total, ticket) => total + ticket.sold, 0);
  };

  const getTotalAvailable = () => {
    return tickets.reduce((total, ticket) => total + ticket.quantity, 0);
  };

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Ticketing System
          </CardTitle>
          <CardDescription>Manage tickets for {eventName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {new Date(eventDate).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {eventLocation}
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              {getTotalSold()} / {getTotalAvailable()} sold
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(getTotalRevenue())}</div>
            <div className="text-sm text-muted-foreground">Total Revenue</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{getTotalSold()}</div>
            <div className="text-sm text-muted-foreground">Tickets Sold</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{getTotalAvailable() - getTotalSold()}</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </CardContent>
        </Card>
      </div>

      {/* Create Ticket Button */}
      <Button onClick={() => setIsCreating(true)} className="mb-4">
        <Plus className="mr-2 h-4 w-4" />
        Create Ticket Type
      </Button>

      {/* Create Ticket Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Ticket Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ticket-name">Ticket Name *</Label>
                <Input
                  id="ticket-name"
                  placeholder="e.g., VIP Access"
                  value={newTicket.name}
                  onChange={(e) => setNewTicket({...newTicket, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticket-category">Category</Label>
                <Select value={newTicket.category} onValueChange={(value) => setNewTicket({...newTicket, category: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="vip">VIP</SelectItem>
                    <SelectItem value="early_bird">Early Bird</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticket-price">Price (NGN) *</Label>
                <Input
                  id="ticket-price"
                  type="number"
                  placeholder="5000"
                  value={newTicket.price || ''}
                  onChange={(e) => setNewTicket({...newTicket, price: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticket-quantity">Quantity *</Label>
                <Input
                  id="ticket-quantity"
                  type="number"
                  placeholder="100"
                  value={newTicket.quantity || ''}
                  onChange={(e) => setNewTicket({...newTicket, quantity: Number(e.target.value)})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticket-description">Description</Label>
              <Textarea
                id="ticket-description"
                placeholder="What's included with this ticket..."
                value={newTicket.description}
                onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateTicket}>Create Ticket</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tickets List */}
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{ticket.name}</h3>
                    <Badge className={getCategoryColor(ticket.category)}>
                      {ticket.category.replace('_', ' ')}
                    </Badge>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-semibold">{formatCurrency(ticket.price)}</div>
                      <div className="text-muted-foreground">Price</div>
                    </div>
                    <div>
                      <div className="font-semibold">{ticket.sold} / {ticket.quantity}</div>
                      <div className="text-muted-foreground">Sold</div>
                    </div>
                    <div>
                      <div className="font-semibold">{formatCurrency(ticket.price * ticket.sold)}</div>
                      <div className="text-muted-foreground">Revenue</div>
                    </div>
                    <div>
                      <div className="font-semibold">{Math.round((ticket.sold / ticket.quantity) * 100)}%</div>
                      <div className="text-muted-foreground">Sold</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleTicketStatus(ticket.id)}
                  >
                    {ticket.status === 'active' ? 'Pause' : 'Resume'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingTicket(ticket)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteTicket(ticket.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tickets.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tickets created yet</h3>
            <p className="text-muted-foreground mb-4">Start by creating your first ticket type</p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Ticket
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TicketingSystem;
