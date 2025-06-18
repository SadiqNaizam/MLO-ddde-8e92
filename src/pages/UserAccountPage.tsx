import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import GlobalHeader from '@/components/layout/GlobalHeader';
import GlobalFooter from '@/components/layout/GlobalFooter';
import IronManThemedButton from '@/components/IronManThemedButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button'; // For action buttons in tables
import { UserCog, Ruler, PackageSearch, Palette, Edit3, Trash2, Eye, Save } from 'lucide-react';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

// Schemas for forms
const profileFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }).max(50),
  email: z.string().email({ message: "Please enter a valid email address." }),
  // Placeholder for password change, actual implementation would be more complex
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine(data => {
    if (data.newPassword && !data.confirmPassword) return false; // if newPassword, confirmPassword is required
    if (data.newPassword && data.newPassword !== data.confirmPassword) return false; // passwords must match
    return true;
}, {
    message: "New passwords do not match or confirmation is missing.",
    path: ["confirmPassword"], // Error path
});


// Placeholder data types
interface MeasurementSet {
  id: string;
  name: string;
  lastUpdated: string;
}

interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: number;
}

interface SavedDesign {
  id: string;
  name: string;
  imageUrl?: string; // Placeholder
  lastSaved: string;
}

const UserAccountPage: React.FC = () => {
  console.log('UserAccountPage loaded');

  // Profile Form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "Anthony Stark", // Placeholder
      email: "ceo@stark.industries", // Placeholder
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    console.log("Profile submitted:", values);
    toast.success("Profile Updated", {
      description: "Your new details have been successfully saved.",
      action: {
        label: "Dismiss",
        onClick: () => console.log("Dismissed toast"),
      },
    });
    // Reset password fields after submission
    profileForm.reset({ ...values, currentPassword: "", newPassword: "", confirmPassword: "" });
  }

  // Placeholder data
  const [measurementSets, setMeasurementSets] = useState<MeasurementSet[]>([
    { id: 'm1', name: 'Mark XLII Fit', lastUpdated: '2024-07-15' },
    { id: 'm2', name: 'Casual Friday Suit', lastUpdated: '2024-06-20' },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    { id: 'ORD001', date: '2024-07-10', status: 'Delivered', total: 4999.99, items: 1 },
    { id: 'ORD002', date: '2024-07-20', status: 'Shipped', total: 120.50, items: 3 },
    { id: 'ORD003', date: '2024-07-28', status: 'Processing', total: 850.00, items: 2 },
  ]);

  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([
    { id: 'd1', name: 'Repulsor Gauntlet - V3', imageUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?Text=Design+Gauntlet', lastSaved: '2024-07-25' },
    { id: 'd2', name: 'Stealth Suit - Night Ops', imageUrl: 'https://via.placeholder.com/150/1A202C/4A5568?Text=Design+Stealth', lastSaved: '2024-07-18' },
  ]);
  
  const handleDelete = (type: string, id: string) => {
    console.log(`Delete ${type} with id: ${id}`);
    toast.error(`${type} Deleted`, { description: `Item ${id} has been removed.`});
    if (type === 'Measurement Set') {
        setMeasurementSets(prev => prev.filter(item => item.id !== id));
    } else if (type === 'Saved Design') {
        setSavedDesigns(prev => prev.filter(item => item.id !== id));
    }
  };


  const tabCommonCardClasses = "bg-slate-800/[.7] border-slate-700 text-slate-200 shadow-xl backdrop-blur-sm";
  const tabTitleClasses = "text-2xl font-semibold text-red-400";
  const inputClasses = "bg-slate-700 border-slate-600 text-slate-100 focus:border-red-500 focus:ring-red-500";
  const labelClasses = "text-slate-300";
  const actionButtonClasses = "text-sky-400 hover:text-sky-300";

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <GlobalHeader />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-center mb-10 tracking-tight"
          style={{ textShadow: '0 0 10px rgba(239, 68, 68, 0.7)' }} // Red glow
        >
          JARVIS ACCOUNT CENTER
        </motion.h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 mb-8 bg-slate-800 border border-slate-700 p-1.5 rounded-lg shadow-md">
            {[{ value: "profile", label: "My Profile", Icon: UserCog },
             { value: "measurements", label: "Measurements", Icon: Ruler },
             { value: "orders", label: "Order History", Icon: PackageSearch },
             { value: "designs", label: "Saved Designs", Icon: Palette }].map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="py-2.5 data-[state=active]:bg-red-700 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-700/70 transition-all duration-200 text-slate-300 text-sm font-medium flex items-center justify-center gap-2">
                <tab.Icon className="h-5 w-5" /> {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className={tabCommonCardClasses}>
              <CardHeader>
                <CardTitle className={tabTitleClasses}>Profile Information</CardTitle>
                <CardDescription className="text-slate-400">Manage your personal details and password.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClasses}>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Pepper Potts" {...field} className={inputClasses} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClasses}>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="e.g., pepper@stark.industries" {...field} className={inputClasses} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4 border-t border-slate-700">
                        <h3 className="text-lg font-medium text-red-400 mb-3">Change Password (Optional)</h3>
                        <FormField
                            control={profileForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem className="mb-4">
                                <FormLabel className={labelClasses}>Current Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} className={inputClasses} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={profileForm.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem className="mb-4">
                                <FormLabel className={labelClasses}>New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} className={inputClasses} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={profileForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className={labelClasses}>Confirm New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} className={inputClasses} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                      <IronManThemedButton type="submit">
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                      </IronManThemedButton>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Measurements Tab */}
          <TabsContent value="measurements">
            <Card className={tabCommonCardClasses}>
              <CardHeader>
                <CardTitle className={tabTitleClasses}>My Measurement Sets</CardTitle>
                <CardDescription className="text-slate-400">View and manage your saved body measurements for custom fittings.</CardDescription>
              </CardHeader>
              <CardContent>
                <IronManThemedButton onClick={() => console.log("Add new measurement set")} className="mb-6">
                  Add New Set
                </IronManThemedButton>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-700/30">
                      <TableHead className="text-amber-400">Set Name</TableHead>
                      <TableHead className="text-amber-400">Last Updated</TableHead>
                      <TableHead className="text-right text-amber-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {measurementSets.map((set) => (
                      <TableRow key={set.id} className="border-slate-700 hover:bg-slate-700/50">
                        <TableCell className="font-medium text-slate-200">{set.name}</TableCell>
                        <TableCell className="text-slate-400">{set.lastUpdated}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => console.log(`Edit measurement: ${set.id}`)} className={actionButtonClasses} aria-label="Edit Measurement">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete('Measurement Set', set.id)} className="text-red-500 hover:text-red-400" aria-label="Delete Measurement">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                     {measurementSets.length === 0 && (
                        <TableRow><TableCell colSpan={3} className="text-center text-slate-500 py-8">No measurement sets saved yet.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Order History Tab */}
          <TabsContent value="orders">
            <Card className={tabCommonCardClasses}>
              <CardHeader>
                <CardTitle className={tabTitleClasses}>Order History</CardTitle>
                <CardDescription className="text-slate-400">Track your past and current orders.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption className="text-slate-500 mt-4">A list of your recent orders.</TableCaption>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-700/30">
                      <TableHead className="text-amber-400">Order ID</TableHead>
                      <TableHead className="text-amber-400">Date</TableHead>
                      <TableHead className="text-amber-400">Status</TableHead>
                      <TableHead className="text-amber-400">Items</TableHead>
                      <TableHead className="text-right text-amber-400">Total</TableHead>
                      <TableHead className="text-right text-amber-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="border-slate-700 hover:bg-slate-700/50">
                        <TableCell className="font-medium text-sky-400 hover:underline cursor-pointer" onClick={() => console.log(`View details for order: ${order.id}`)}>{order.id}</TableCell>
                        <TableCell className="text-slate-400">{order.date}</TableCell>
                        <TableCell>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                order.status === 'Delivered' ? 'bg-green-700 text-green-200' :
                                order.status === 'Shipped' ? 'bg-blue-700 text-blue-200' :
                                order.status === 'Processing' ? 'bg-yellow-700 text-yellow-200' :
                                'bg-red-800 text-red-300' // Cancelled
                            }`}>
                                {order.status}
                            </span>
                        </TableCell>
                        <TableCell className="text-slate-400">{order.items}</TableCell>
                        <TableCell className="text-right text-slate-200">${order.total.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => console.log(`View details for order: ${order.id}`)} className={actionButtonClasses} aria-label="View Order">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {orders.length === 0 && (
                        <TableRow><TableCell colSpan={6} className="text-center text-slate-500 py-8">You haven't placed any orders yet.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saved Designs Tab */}
          <TabsContent value="designs">
            <Card className={tabCommonCardClasses}>
              <CardHeader>
                <CardTitle className={tabTitleClasses}>My Saved Designs</CardTitle>
                <CardDescription className="text-slate-400">Access and manage your custom apparel designs.</CardDescription>
              </CardHeader>
              <CardContent>
                <IronManThemedButton onClick={() => console.log("Go to customizer to create new design")} className="mb-6">
                  <Link to="/customizer">Create New Design</Link>
                </IronManThemedButton>
                <Table>
                  <TableHeader>
                     <TableRow className="border-slate-700 hover:bg-slate-700/30">
                      <TableHead className="text-amber-400 w-[100px]">Preview</TableHead>
                      <TableHead className="text-amber-400">Design Name</TableHead>
                      <TableHead className="text-amber-400">Last Saved</TableHead>
                      <TableHead className="text-right text-amber-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {savedDesigns.map((design) => (
                      <TableRow key={design.id} className="border-slate-700 hover:bg-slate-700/50">
                        <TableCell>
                          <img src={design.imageUrl || 'https://via.placeholder.com/80/4A5568/FFFFFF?Text=N/A'} alt={design.name} className="w-20 h-20 object-cover rounded-md border border-slate-600" />
                        </TableCell>
                        <TableCell className="font-medium text-slate-200">{design.name}</TableCell>
                        <TableCell className="text-slate-400">{design.lastSaved}</TableCell>
                        <TableCell className="text-right space-x-2">
                           <IronManThemedButton size="sm" variant="outline" onClick={() => console.log(`Load design: ${design.id}`)} className="border-sky-500 text-sky-400 hover:bg-sky-500/20">
                            Load Design
                          </IronManThemedButton>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete('Saved Design', design.id)} className="text-red-500 hover:text-red-400" aria-label="Delete Design">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {savedDesigns.length === 0 && (
                        <TableRow><TableCell colSpan={4} className="text-center text-slate-500 py-8">No custom designs saved yet.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <GlobalFooter />
    </div>
  );
};

// Added motion import for the h1 tag animation.
import { motion } from 'framer-motion';

export default UserAccountPage;