import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Package,
  ShoppingCart,
  AlertCircle
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import MenuItemForm from '@/components/MenuItemForm';
import { MenuItem } from '@/services/menuService';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const Admin = () => {
  const { 
    stats, 
    menuItems, 
    loading, 
    error, 
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem 
  } = useAdmin();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item: MenuItem | null }>({
    open: false,
    item: null
  });
  const [formLoading, setFormLoading] = useState(false);

  const handleAddMenuItem = async (menuItem: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>) => {
    setFormLoading(true);
    try {
      await addMenuItem(menuItem);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditMenuItem = async (menuItem: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingItem) return;
    
    setFormLoading(true);
    try {
      await updateMenuItem(editingItem.id, menuItem);
      setEditingItem(null);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteMenuItem = async () => {
    if (!deleteDialog.item) return;
    
    try {
      await deleteMenuItem(deleteDialog.item.id);
      setDeleteDialog({ open: false, item: null });
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Restaurant Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your restaurant operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Today's Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                ${stats.todayRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Today's Customers
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                {stats.todayCustomers}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Monthly Revenue
              </CardTitle>
              <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                ${stats.monthRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="menu" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="menu">Manage Menu</TabsTrigger>
            <TabsTrigger value="homepage">Home Page</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
          </TabsList>

          {/* Manage Menu Tab */}
          <TabsContent value="menu" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Menu Items
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Add New Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Menu Item</DialogTitle>
                        <DialogDescription>
                          Fill in the details for the new menu item.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="item-name">Item Name</Label>
                          <Input
                            id="item-name"
                            value={newMenuItem.name}
                            onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                            placeholder="Enter item name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select value={newMenuItem.category} onValueChange={(value) => setNewMenuItem({ ...newMenuItem, category: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Breakfast">Breakfast</SelectItem>
                              <SelectItem value="Lunch">Lunch</SelectItem>
                              <SelectItem value="Dinner">Dinner</SelectItem>
                              <SelectItem value="Dessert">Dessert</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label htmlFor="small-price">Small Price</Label>
                            <Input
                              id="small-price"
                              type="number"
                              value={newMenuItem.smallPrice}
                              onChange={(e) => setNewMenuItem({ ...newMenuItem, smallPrice: e.target.value })}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor="medium-price">Medium Price</Label>
                            <Input
                              id="medium-price"
                              type="number"
                              value={newMenuItem.mediumPrice}
                              onChange={(e) => setNewMenuItem({ ...newMenuItem, mediumPrice: e.target.value })}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor="large-price">Large Price</Label>
                            <Input
                              id="large-price"
                              type="number"
                              value={newMenuItem.largePrice}
                              onChange={(e) => setNewMenuItem({ ...newMenuItem, largePrice: e.target.value })}
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="image">Image</Label>
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setNewMenuItem({ ...newMenuItem, image: e.target.files?.[0] || null })}
                          />
                        </div>
                        <Button onClick={handleAddMenuItem} className="w-full">
                          Add Menu Item
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="h-32 bg-muted bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{item.name}</h3>
                        <Badge variant="secondary" className="mb-2">{item.category}</Badge>
                        <div className="text-sm text-muted-foreground mb-3">
                          <div>Small: ${item.smallPrice}</div>
                          <div>Medium: ${item.mediumPrice}</div>
                          <div>Large: ${item.largePrice}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Home Page Tab */}
          <TabsContent value="homepage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Edit Home Page Content</CardTitle>
                <CardDescription>Update your restaurant's homepage content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="restaurant-summary">Restaurant Summary</Label>
                  <Textarea
                    id="restaurant-summary"
                    placeholder="Enter restaurant description..."
                    className="min-h-[100px]"
                    defaultValue="Welcome to restaurantFresh, where culinary excellence meets warm hospitality. Our chefs craft each dish with locally sourced ingredients and passion for flavor."
                  />
                </div>
                <div>
                  <Label htmlFor="hero-image">Hero Image</Label>
                  <div className="flex items-center gap-4">
                    <Input id="hero-image" type="file" accept="image/*" />
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Featured Dishes</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    {menuItems.slice(0, 3).map((item) => (
                      <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className="h-12 w-12 bg-muted rounded bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Star className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Incoming Orders</CardTitle>
                <CardDescription>Manage customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.customerName}</TableCell>
                        <TableCell>{order.items}</TableCell>
                        <TableCell>${order.total}</TableCell>
                        <TableCell>{order.time}</TableCell>
                        <TableCell>
                          <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {order.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleOrderAction(order.id, 'accept')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleOrderAction(order.id, 'reject')}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reservations Tab */}
          <TabsContent value="reservations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Table Reservations</CardTitle>
                <CardDescription>Manage table booking requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Guests</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-medium">{reservation.customerName}</TableCell>
                        <TableCell>{reservation.date}</TableCell>
                        <TableCell>{reservation.time}</TableCell>
                        <TableCell>{reservation.guests} people</TableCell>
                        <TableCell>
                          <Badge variant={reservation.status === 'pending' ? 'secondary' : 'default'}>
                            {reservation.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {reservation.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleReservationAction(reservation.id, 'accept')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleReservationAction(reservation.id, 'reject')}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;