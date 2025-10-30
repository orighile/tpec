import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Gift, Plus, Share2, Heart, ShoppingCart, Trash2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GiftItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  purchased: boolean;
  purchasedBy?: string;
  link?: string;
}

const giftCategories = [
  "Home & Living",
  "Kitchen & Dining", 
  "Electronics",
  "Fashion & Accessories",
  "Books & Media",
  "Experience Gifts",
  "Cash Gifts",
  "Traditional Items"
];

const sampleGifts: GiftItem[] = [
  {
    id: "1",
    name: "Traditional Wooden Serving Tray",
    description: "Beautiful hand-carved wooden serving tray with African motifs",
    price: 25000,
    category: "Traditional Items",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    purchased: false
  },
  {
    id: "2", 
    name: "Blender Set",
    description: "High-quality blender perfect for smoothies and cooking",
    price: 45000,
    category: "Kitchen & Dining",
    imageUrl: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    purchased: true,
    purchasedBy: "Aunt Kemi"
  }
];

const GiftRegistryPage = () => {
  const [giftList, setGiftList] = useState<GiftItem[]>(sampleGifts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGift, setNewGift] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    link: ""
  });
  const [registryInfo, setRegistryInfo] = useState({
    eventName: "Sarah & John's Wedding",
    eventDate: "2024-06-15",
    coupleNames: "Sarah & John",
    message: "Your presence is the greatest gift, but if you wish to honor us with something special, here are some items we would love."
  });
  
  const { toast } = useToast();

  const handleAddGift = () => {
    if (!newGift.name || !newGift.price || !newGift.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the gift name, price, and category.",
        variant: "destructive"
      });
      return;
    }

    const gift: GiftItem = {
      id: Date.now().toString(),
      name: newGift.name,
      description: newGift.description,
      price: parseFloat(newGift.price),
      category: newGift.category,
      imageUrl: newGift.imageUrl || "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      purchased: false,
      link: newGift.link
    };

    setGiftList(prev => [...prev, gift]);
    setNewGift({ name: "", description: "", price: "", category: "", imageUrl: "", link: "" });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Gift Added!",
      description: "Your gift has been added to the registry."
    });
  };

  const handleRemoveGift = (id: string) => {
    setGiftList(prev => prev.filter(gift => gift.id !== id));
    toast({
      title: "Gift Removed",
      description: "The gift has been removed from your registry."
    });
  };

  const handleShareRegistry = () => {
    const registryUrl = `${window.location.origin}/registry/share/${registryInfo.eventName.toLowerCase().replace(/\s+/g, '-')}`;
    navigator.clipboard.writeText(registryUrl);
    toast({
      title: "Registry Link Copied!",
      description: "Share this link with your guests so they can view and purchase gifts."
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  const totalValue = giftList.reduce((sum, gift) => sum + gift.price, 0);
  const purchasedValue = giftList.filter(g => g.purchased).reduce((sum, gift) => sum + gift.price, 0);
  const completionPercentage = giftList.length > 0 ? Math.round((giftList.filter(g => g.purchased).length / giftList.length) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <div className="bg-primary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Gift Registry</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create and manage your gift registry for weddings, birthdays, and special occasions
            </p>
          </div>
        </div>

        <div className="py-16">
          <div className="container mx-auto px-4">
            {/* Registry Info */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{registryInfo.eventName}</CardTitle>
                    <CardDescription className="text-lg mt-2">
                      {registryInfo.coupleNames} • {new Date(registryInfo.eventDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Button onClick={handleShareRegistry} className="flex items-center">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Registry
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{registryInfo.message}</p>
                
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary">{giftList.length}</div>
                    <div className="text-sm text-gray-600">Total Gifts</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{giftList.filter(g => g.purchased).length}</div>
                    <div className="text-sm text-gray-600">Purchased</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{completionPercentage}%</div>
                    <div className="text-sm text-gray-600">Complete</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-xl font-bold text-purple-600">{formatPrice(totalValue)}</div>
                    <div className="text-sm text-gray-600">Total Value</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add Gift Button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Gift List</h2>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Gift
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Gift</DialogTitle>
                    <DialogDescription>
                      Add a gift item to your registry
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="giftName">Gift Name *</Label>
                      <Input
                        id="giftName"
                        placeholder="e.g., Blender Set"
                        value={newGift.name}
                        onChange={(e) => setNewGift(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="giftDescription">Description</Label>
                      <Textarea
                        id="giftDescription"
                        placeholder="Brief description of the gift"
                        value={newGift.description}
                        onChange={(e) => setNewGift(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="giftPrice">Price (₦) *</Label>
                        <Input
                          id="giftPrice"
                          type="number"
                          placeholder="25000"
                          value={newGift.price}
                          onChange={(e) => setNewGift(prev => ({ ...prev, price: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="giftCategory">Category *</Label>
                        <Select value={newGift.category} onValueChange={(value) => setNewGift(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {giftCategories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="giftImage">Image URL (optional)</Label>
                      <Input
                        id="giftImage"
                        placeholder="https://example.com/image.jpg"
                        value={newGift.imageUrl}
                        onChange={(e) => setNewGift(prev => ({ ...prev, imageUrl: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="giftLink">Purchase Link (optional)</Label>
                      <Input
                        id="giftLink"
                        placeholder="https://shop.example.com/product"
                        value={newGift.link}
                        onChange={(e) => setNewGift(prev => ({ ...prev, link: e.target.value }))}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleAddGift} className="flex-1">Add Gift</Button>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Gift Grid */}
            {giftList.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No gifts added yet</h3>
                  <p className="text-gray-600 mb-4">Start building your registry by adding gift items</p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Gift
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {giftList.map((gift) => (
                  <Card key={gift.id} className={`relative ${gift.purchased ? 'opacity-75' : ''}`}>
                    {gift.purchased && (
                      <div className="absolute top-2 right-2 z-10">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Heart className="h-3 w-3 mr-1" />
                          Purchased
                        </Badge>
                      </div>
                    )}
                    
                    <CardContent className="p-0">
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        <img 
                          src={gift.imageUrl} 
                          alt={gift.name}
                          className="w-full h-full object-cover"
                        />
                        {gift.purchased && (
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Heart className="h-8 w-8 text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-lg">{gift.name}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveGift(gift.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Badge variant="outline" className="mb-2">
                          {gift.category}
                        </Badge>
                        
                        {gift.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{gift.description}</p>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-primary">
                            {formatPrice(gift.price)}
                          </span>
                          
                          {!gift.purchased && gift.link && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(gift.link, '_blank')}
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Buy
                            </Button>
                          )}
                        </div>
                        
                        {gift.purchased && gift.purchasedBy && (
                          <p className="text-xs text-green-600 mt-2">
                            Gift from {gift.purchasedBy}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GiftRegistryPage;