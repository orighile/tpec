import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  Package, Plus, Search, Filter, Edit, Trash2, AlertTriangle, 
  TrendingDown, TrendingUp, BarChart3, Download, Upload, QrCode
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  quantity: number;
  minStock: number;
  price: number;
  cost: number;
  supplier: string;
  location: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: Date;
  description: string;
}

const InventoryManagement: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'LED String Lights',
      category: 'lighting',
      sku: 'LED-001',
      quantity: 45,
      minStock: 10,
      price: 2500,
      cost: 1200,
      supplier: 'Light Masters Ltd',
      location: 'Warehouse A-1',
      status: 'in_stock',
      lastUpdated: new Date(),
      description: 'Warm white LED string lights, 10m length'
    },
    {
      id: '2',
      name: 'Sound System - Basic',
      category: 'audio',
      sku: 'AUDIO-001',
      quantity: 3,
      minStock: 5,
      price: 45000,
      cost: 28000,
      supplier: 'Audio Pro Nigeria',
      location: 'Equipment Room B',
      status: 'low_stock',
      lastUpdated: new Date(),
      description: 'Portable sound system with wireless microphones'
    }
  ]);

  const [activeTab, setActiveTab] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    sku: '',
    quantity: 0,
    minStock: 0,
    price: 0,
    cost: 0,
    supplier: '',
    location: '',
    description: ''
  });

  const { toast } = useToast();

  const categories = ['lighting', 'audio', 'decoration', 'furniture', 'catering', 'transport'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.sku) {
      toast({
        title: "Missing Information",
        description: "Please provide item name and SKU",
        variant: "destructive"
      });
      return;
    }

    const item: InventoryItem = {
      id: Date.now().toString(),
      ...newItem,
      status: newItem.quantity > newItem.minStock ? 'in_stock' : 
              newItem.quantity > 0 ? 'low_stock' : 'out_of_stock',
      lastUpdated: new Date()
    };

    setInventory([...inventory, item]);
    setNewItem({
      name: '', category: '', sku: '', quantity: 0, minStock: 0,
      price: 0, cost: 0, supplier: '', location: '', description: ''
    });

    toast({
      title: "Item Added",
      description: "Inventory item has been added successfully",
    });
  };

  const handleUpdateStock = (id: string, newQuantity: number) => {
    setInventory(items => items.map(item => {
      if (item.id === id) {
        const status = newQuantity > item.minStock ? 'in_stock' : 
                      newQuantity > 0 ? 'low_stock' : 'out_of_stock';
        return { ...item, quantity: newQuantity, status, lastUpdated: new Date() };
      }
      return item;
    }));

    toast({
      title: "Stock Updated",
      description: "Item quantity has been updated",
    });
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTotalValue = () => {
    return inventory.reduce((total, item) => total + (item.quantity * item.cost), 0);
  };

  const getLowStockCount = () => {
    return inventory.filter(item => item.status === 'low_stock').length;
  };

  const getOutOfStockCount = () => {
    return inventory.filter(item => item.status === 'out_of_stock').length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            Inventory Management
          </h1>
          <p className="text-muted-foreground">Track and manage your event equipment and supplies</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <QrCode className="h-4 w-4 mr-2" />
            Scan Item
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{inventory.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">{formatCurrency(getTotalValue())}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{getLowStockCount()}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{getOutOfStockCount()}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Button
              variant={activeTab === 'inventory' ? 'default' : 'outline'}
              onClick={() => setActiveTab('inventory')}
            >
              Inventory
            </Button>
            <Button
              variant={activeTab === 'add' ? 'default' : 'outline'}
              onClick={() => setActiveTab('add')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Items List */}
          <div className="space-y-2">
            {filteredInventory.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{item.name}</h3>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">SKU: </span>
                          <span className="font-medium">{item.sku}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Quantity: </span>
                          <span className="font-medium">{item.quantity}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Price: </span>
                          <span className="font-medium">{formatCurrency(item.price)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Location: </span>
                          <span className="font-medium">{item.location}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        className="w-20"
                        placeholder="Qty"
                        onBlur={(e) => {
                          const newQuantity = parseInt(e.target.value);
                          if (!isNaN(newQuantity) && newQuantity !== item.quantity) {
                            handleUpdateStock(item.id, newQuantity);
                          }
                        }}
                      />
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add Item Tab */}
      {activeTab === 'add' && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Inventory Item</CardTitle>
            <CardDescription>Create a new item in your inventory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input
                  placeholder="Enter item name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>SKU</Label>
                <Input
                  placeholder="Enter SKU code"
                  value={newItem.sku}
                  onChange={(e) => setNewItem({...newItem, sku: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newItem.quantity || ''}
                  onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label>Min Stock Level</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newItem.minStock || ''}
                  onChange={(e) => setNewItem({...newItem, minStock: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cost Price (₦)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newItem.cost || ''}
                  onChange={(e) => setNewItem({...newItem, cost: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label>Selling Price (₦)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newItem.price || ''}
                  onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Supplier</Label>
                <Input
                  placeholder="Enter supplier name"
                  value={newItem.supplier}
                  onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Storage Location</Label>
                <Input
                  placeholder="Enter storage location"
                  value={newItem.location}
                  onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Enter item description"
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              />
            </div>

            <Button onClick={handleAddItem} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Item to Inventory
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InventoryManagement;
