import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, Download, Send, Edit, Trash2, Eye, 
  CheckCircle, Clock, AlertCircle, User, Calendar, DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Contract {
  id: string;
  title: string;
  type: 'service' | 'venue' | 'vendor' | 'employment';
  status: 'draft' | 'sent' | 'signed' | 'completed' | 'cancelled';
  clientName: string;
  vendorName: string;
  amount: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  createdDate: Date;
  signedDate?: Date;
  terms: string[];
  deliverables: string[];
  paymentSchedule: PaymentMilestone[];
  documents: ContractDocument[];
}

interface PaymentMilestone {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
}

interface ContractDocument {
  id: string;
  name: string;
  type: 'contract' | 'amendment' | 'invoice' | 'receipt';
  url: string;
  uploadedAt: Date;
}

interface ContractTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  content: string;
}

const ContractManagement: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: '1',
      title: 'Wedding Photography Services',
      type: 'service',
      status: 'signed',
      clientName: 'John & Sarah Wedding',
      vendorName: 'Elite Photography',
      amount: 250000,
      currency: 'NGN',
      startDate: new Date('2025-03-15'),
      endDate: new Date('2025-03-15'),
      createdDate: new Date('2025-01-10'),
      signedDate: new Date('2025-01-15'),
      terms: [
        '8 hours of photography coverage',
        '500+ edited high-resolution photos',
        '2 photographers on site',
        'Online gallery delivery within 14 days'
      ],
      deliverables: [
        'Pre-wedding consultation',
        'Wedding day photography',
        'Photo editing and retouching',
        'Online gallery with download access'
      ],
      paymentSchedule: [
        {
          id: '1',
          name: 'Deposit (50%)',
          amount: 125000,
          dueDate: new Date('2025-01-20'),
          status: 'paid'
        },
        {
          id: '2',
          name: 'Final Payment (50%)',
          amount: 125000,
          dueDate: new Date('2025-03-15'),
          status: 'pending'
        }
      ],
      documents: [
        {
          id: '1',
          name: 'Photography Service Contract.pdf',
          type: 'contract',
          url: '#',
          uploadedAt: new Date('2025-01-15')
        }
      ]
    },
    {
      id: '2',
      title: 'Corporate Event Catering',
      type: 'vendor',
      status: 'sent',
      clientName: 'TechCorp Nigeria',
      vendorName: 'Royal Catering',
      amount: 450000,
      currency: 'NGN',
      startDate: new Date('2025-02-20'),
      endDate: new Date('2025-02-20'),
      createdDate: new Date('2025-01-20'),
      terms: [
        'Catering for 150 guests',
        '3-course meal with appetizers',
        'Professional service staff',
        'Setup and cleanup included'
      ],
      deliverables: [
        'Menu planning consultation',
        'Food preparation and service',
        'Beverage service',
        'Event cleanup'
      ],
      paymentSchedule: [
        {
          id: '1',
          name: 'Deposit (40%)',
          amount: 180000,
          dueDate: new Date('2025-01-25'),
          status: 'pending'
        },
        {
          id: '2',
          name: 'Final Payment (60%)',
          amount: 270000,
          dueDate: new Date('2025-02-18'),
          status: 'pending'
        }
      ],
      documents: []
    }
  ]);

  const [showCreateContract, setShowCreateContract] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [newContract, setNewContract] = useState({
    title: '',
    type: '',
    clientName: '',
    vendorName: '',
    amount: 0,
    startDate: '',
    endDate: '',
    terms: '',
    deliverables: ''
  });

  const [templates] = useState<ContractTemplate[]>([
    {
      id: '1',
      name: 'Photography Service Contract',
      type: 'service',
      description: 'Standard contract for photography services',
      content: 'Photography service contract template...'
    },
    {
      id: '2',
      name: 'Catering Service Agreement',
      type: 'vendor',
      description: 'Comprehensive catering service contract',
      content: 'Catering service agreement template...'
    },
    {
      id: '3',
      name: 'Venue Rental Agreement',
      type: 'venue',
      description: 'Standard venue rental contract',
      content: 'Venue rental agreement template...'
    }
  ]);

  const { toast } = useToast();

  const formatCurrency = (amount: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed': return 'bg-primary/10 text-primary';
      case 'sent': return 'bg-accent text-accent-foreground';
      case 'completed': return 'bg-secondary text-secondary-foreground';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed': return <CheckCircle className="h-4 w-4 text-primary" />;
      case 'sent': return <Send className="h-4 w-4 text-accent-foreground" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-secondary-foreground" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleCreateContract = () => {
    if (!newContract.title || !newContract.type || !newContract.clientName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const contract: Contract = {
      id: Date.now().toString(),
      title: newContract.title,
      type: newContract.type as any,
      status: 'draft',
      clientName: newContract.clientName,
      vendorName: newContract.vendorName,
      amount: newContract.amount,
      currency: 'NGN',
      startDate: new Date(newContract.startDate),
      endDate: new Date(newContract.endDate),
      createdDate: new Date(),
      terms: newContract.terms.split('\n').filter(term => term.trim()),
      deliverables: newContract.deliverables.split('\n').filter(del => del.trim()),
      paymentSchedule: [],
      documents: []
    };

    setContracts([contract, ...contracts]);
    setNewContract({
      title: '', type: '', clientName: '', vendorName: '',
      amount: 0, startDate: '', endDate: '', terms: '', deliverables: ''
    });
    setShowCreateContract(false);

    toast({
      title: "Contract Created",
      description: "Your contract has been saved as a draft",
    });
  };

  const handleSendContract = (contractId: string) => {
    setContracts(contracts.map(contract => 
      contract.id === contractId 
        ? { ...contract, status: 'sent' }
        : contract
    ));

    toast({
      title: "Contract Sent",
      description: "The contract has been sent to the client for signature",
    });
  };

  const getTotalValue = () => {
    return contracts.reduce((total, contract) => total + contract.amount, 0);
  };

  const getContractStats = () => {
    return {
      total: contracts.length,
      signed: contracts.filter(c => c.status === 'signed').length,
      pending: contracts.filter(c => c.status === 'sent').length,
      draft: contracts.filter(c => c.status === 'draft').length
    };
  };

  const stats = getContractStats();

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Contracts</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Signed</p>
                <p className="text-2xl font-bold text-green-600">{stats.signed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(getTotalValue())}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Contract Management</h3>
              <p className="text-muted-foreground">Manage your service contracts and agreements</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Templates
              </Button>
              <Button onClick={() => setShowCreateContract(true)}>
                <FileText className="h-4 w-4 mr-2" />
                New Contract
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Contract Form */}
      {showCreateContract && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Contract</CardTitle>
            <CardDescription>Fill in the details to create a new service contract</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contract Title *</Label>
                <Input
                  placeholder="e.g., Wedding Photography Services"
                  value={newContract.title}
                  onChange={(e) => setNewContract({...newContract, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Contract Type *</Label>
                <Select value={newContract.type} onValueChange={(value) => setNewContract({...newContract, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service">Service Contract</SelectItem>
                    <SelectItem value="vendor">Vendor Agreement</SelectItem>
                    <SelectItem value="venue">Venue Rental</SelectItem>
                    <SelectItem value="employment">Employment Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Client Name *</Label>
                <Input
                  placeholder="Client or company name"
                  value={newContract.clientName}
                  onChange={(e) => setNewContract({...newContract, clientName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Vendor/Service Provider</Label>
                <Input
                  placeholder="Vendor name"
                  value={newContract.vendorName}
                  onChange={(e) => setNewContract({...newContract, vendorName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Contract Value (NGN)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newContract.amount || ''}
                  onChange={(e) => setNewContract({...newContract, amount: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={newContract.startDate}
                  onChange={(e) => setNewContract({...newContract, startDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Terms & Conditions</Label>
              <Textarea
                placeholder="Enter each term on a new line..."
                rows={4}
                value={newContract.terms}
                onChange={(e) => setNewContract({...newContract, terms: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Deliverables</Label>
              <Textarea
                placeholder="Enter each deliverable on a new line..."
                rows={4}
                value={newContract.deliverables}
                onChange={(e) => setNewContract({...newContract, deliverables: e.target.value})}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleCreateContract}>Create Contract</Button>
              <Button variant="outline" onClick={() => setShowCreateContract(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contracts List */}
      <div className="space-y-4">
        {contracts.map((contract) => (
          <Card key={contract.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{contract.title}</h3>
                    <Badge className={getStatusColor(contract.status)}>
                      {getStatusIcon(contract.status)}
                      <span className="ml-1">{contract.status}</span>
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {contract.clientName}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {contract.startDate.toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      {formatCurrency(contract.amount)}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {contract.type}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedContract(contract)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  {contract.status === 'draft' && (
                    <Button size="sm" onClick={() => handleSendContract(contract.id)}>
                      <Send className="h-4 w-4 mr-1" />
                      Send
                    </Button>
                  )}
                </div>
              </div>

              {/* Payment Schedule */}
              {contract.paymentSchedule.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Payment Schedule</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {contract.paymentSchedule.map((milestone) => (
                      <div key={milestone.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <div>
                          <div className="text-sm font-medium">{milestone.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Due: {milestone.dueDate.toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{formatCurrency(milestone.amount)}</div>
                          <Badge className={getPaymentStatusColor(milestone.status)} variant="outline">
                            {milestone.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Created: {contract.createdDate.toLocaleDateString()}
                  {contract.signedDate && (
                    <span> • Signed: {contract.signedDate.toLocaleDateString()}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {contract.status === 'signed' && (
                    <Button variant="outline" size="sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Complete
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {contracts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No contracts yet</h3>
            <p className="text-muted-foreground mb-4">Create your first contract to get started</p>
            <Button onClick={() => setShowCreateContract(true)}>
              <FileText className="h-4 w-4 mr-2" />
              Create First Contract
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContractManagement;
