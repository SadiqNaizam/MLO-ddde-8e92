import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Custom Components
import GlobalHeader from '@/components/layout/GlobalHeader';
import GlobalFooter from '@/components/layout/GlobalFooter';
import MultiStepIndicator from '@/components/MultiStepIndicator';
import IronManThemedButton from '@/components/IronManThemedButton';
import ArcReactorLoader from '@/components/ArcReactorLoader'; // For order processing

// Shadcn/ui Components
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Package, ShieldCheck, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

// Page specific styles
const inputStyles = "bg-slate-700/50 border-slate-600 text-slate-200 placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500";
const labelStyles = "text-amber-400";
const cardContainerStyles = "bg-slate-800/80 border border-slate-700 shadow-xl shadow-red-900/30 backdrop-blur-sm p-6 rounded-lg";

// Schemas for form validation
const shippingSchema = z.object({
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters." }),
  address1: z.string().min(5, { message: "Address line 1 is required." }),
  address2: z.string().optional(),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(2, { message: "State/Province is required." }),
  zip: z.string().min(5, { message: "Postal/ZIP code is required." }),
  country: z.string().min(2, { message: "Country is required." }),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

const paymentSchema = z.object({
  paymentMethod: z.enum(['starkpay', 'creditcard'], { required_error: "Please select a payment method." }),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.paymentMethod === 'creditcard') {
    if (!data.cardNumber || !/^\d{16}$/.test(data.cardNumber)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valid 16-digit card number is required.", path: ['cardNumber'] });
    }
    if (!data.expiryDate || !/^\d{2}\/\d{2}$/.test(data.expiryDate)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valid expiry date (MM/YY) is required.", path: ['expiryDate'] });
    }
    if (!data.cvv || !/^\d{3,4}$/.test(data.cvv)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Valid 3 or 4 digit CVV is required.", path: ['cvv'] });
    }
  }
});

type PaymentFormData = z.infer<typeof paymentSchema>;

// Placeholder cart data
const initialCartItems = [
  { id: 'prod1', name: 'MK-V Armor Inspired Flight Jacket', quantity: 1, price: 1500.00, customization: "Crimson Red, Nanotech Weave, Stark Emblem" },
  { id: 'prod2', name: 'Repulsor Gauntlet Set (Training Grade)', quantity: 2, price: 350.00, customization: "Standard Issue" },
];

const CheckoutProcessPage = () => {
  console.log('CheckoutProcessPage loaded');
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0); // 0: Cart, 1: Shipping, 2: Payment, 3: Confirm
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [shippingDetails, setShippingDetails] = useState<ShippingFormData | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentFormData | null>(null);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const shippingForm = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: shippingDetails || {
      fullName: '', address1: '', address2: '', city: '', state: '', zip: '', country: 'USA'
    },
  });

  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: paymentDetails || {
      paymentMethod: 'starkpay', cardNumber: '', expiryDate: '', cvv: ''
    },
  });

  const handleNextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const handlePrevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const onShippingSubmit = (data: ShippingFormData) => {
    console.log("Shipping Details:", data);
    setShippingDetails(data);
    handleNextStep();
  };

  const onPaymentSubmit = (data: PaymentFormData) => {
    console.log("Payment Details:", data);
    setPaymentDetails(data);
    handleNextStep();
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    console.log("Placing order with:", { cartItems, shippingDetails, paymentDetails });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsProcessing(false);
    setOrderConfirmed(true);
    // Clear cart or navigate to an order success page in a real app
    setCartItems([]); 
  };

  const stepsContent = [
    { name: "VAULT", icon: ShoppingBag },
    { name: "DELIVERY", icon: Package },
    { name: "PAYMENT", icon: ShieldCheck },
    { name: "CONFIRM", icon: CheckCircle },
  ];

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center">
        <ArcReactorLoader className="w-32 h-32" />
        <p className="mt-8 text-xl text-sky-400 animate-pulse">Authorizing Your Build Protocol...</p>
      </div>
    );
  }

  if (orderConfirmed) {
    return (
      <>
        <GlobalHeader />
        <main className="flex-grow container mx-auto px-4 py-12 md:py-20 text-slate-100 flex flex-col items-center justify-center text-center">
          <Card className={cn(cardContainerStyles, "max-w-lg")}>
            <CardHeader>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-3xl font-bold text-amber-400">Order Confirmed!</CardTitle>
              <CardDescription className="text-slate-300 mt-2">
                Your custom Stark Industries gear is now in production. Estimated completion: 7-10 business days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">Order ID: STARK-{Date.now().toString().slice(-6)}</p>
              <p className="mt-4">A confirmation email with your order details has been sent to your registered address.</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-6">
               <IronManThemedButton onClick={() => navigate('/user-account')} className="w-full">
                View Order History
              </IronManThemedButton>
              <IronManThemedButton variant="outline" onClick={() => navigate('/gallery')} className="w-full border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-slate-900">
                Continue Shopping
              </IronManThemedButton>
            </CardFooter>
          </Card>
        </main>
        <GlobalFooter />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <GlobalHeader />
      <main className="flex-grow container mx-auto px-2 sm:px-4 py-8 md:py-12">
        <MultiStepIndicator steps={stepsContent} currentStep={currentStep} />
        <Separator className="my-8 bg-slate-700" />

        {/* Step 1: Cart Review */}
        {currentStep === 0 && (
          <Card className={cardContainerStyles}>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-amber-400 flex items-center"><ShoppingBag className="mr-3 h-7 w-7"/>Your Vault (Cart Review)</CardTitle>
              <CardDescription className="text-slate-400">Review your advanced tech before proceeding.</CardDescription>
            </CardHeader>
            <CardContent>
              {cartItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-700/30">
                      <TableHead className="text-amber-500">Product</TableHead>
                      <TableHead className="text-amber-500">Customization</TableHead>
                      <TableHead className="text-amber-500 text-center">Quantity</TableHead>
                      <TableHead className="text-amber-500 text-right">Price</TableHead>
                      <TableHead className="text-amber-500 text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartItems.map(item => (
                      <TableRow key={item.id} className="border-slate-700 hover:bg-slate-700/30">
                        <TableCell className="font-medium text-slate-200">{item.name}</TableCell>
                        <TableCell className="text-xs text-slate-400">{item.customization}</TableCell>
                        <TableCell className="text-center text-slate-300">{item.quantity}</TableCell>
                        <TableCell className="text-right text-slate-300">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right text-slate-200 font-semibold">${(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter className="border-t border-slate-600">
                    <TableRow className="hover:bg-slate-700/30">
                      <TableCell colSpan={4} className="text-xl text-amber-400 font-bold text-right">Total Power Output (USD)</TableCell>
                      <TableCell className="text-right text-xl text-amber-300 font-bold">${totalAmount.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              ) : (
                <Alert variant="default" className="bg-slate-700 border-sky-500 text-sky-300">
                  <Package className="h-4 w-4 !text-sky-300" />
                  <AlertTitle>Your Vault is Empty</AlertTitle>
                  <AlertDescription>
                    Looks like you haven't forged any gear yet. <Link to="/gallery" className="font-semibold underline hover:text-sky-100">Explore the Gallery</Link> to find your next masterpiece.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex justify-end pt-6">
              {cartItems.length > 0 && (
                <IronManThemedButton onClick={handleNextStep}>
                  Proceed to Delivery Specs <ArrowRight className="ml-2 h-5 w-5" />
                </IronManThemedButton>
              )}
            </CardFooter>
          </Card>
        )}

        {/* Step 2: Shipping Address */}
        {currentStep === 1 && (
          <Card className={cardContainerStyles}>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-amber-400 flex items-center"><Package className="mr-3 h-7 w-7"/>Delivery Specifications</CardTitle>
              <CardDescription className="text-slate-400">Enter your coordinates for secure delivery.</CardDescription>
            </CardHeader>
            <Form {...shippingForm}>
              <form onSubmit={shippingForm.handleSubmit(onShippingSubmit)} className="space-y-6">
                <CardContent className="space-y-4">
                  <FormField
                    control={shippingForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyles}>Full Name / Recipient ID</FormLabel>
                        <FormControl><Input placeholder="Tony Stark" {...field} className={inputStyles} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={shippingForm.control}
                      name="address1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelStyles}>Address Line 1 / Sector</FormLabel>
                          <FormControl><Input placeholder="10880 Malibu Point" {...field} className={inputStyles} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={shippingForm.control}
                      name="address2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelStyles}>Address Line 2 / Sub-Sector (Optional)</FormLabel>
                          <FormControl><Input placeholder="Stark Tower Penthouse" {...field} className={inputStyles} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField
                      control={shippingForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelStyles}>City / Region</FormLabel>
                          <FormControl><Input placeholder="Malibu" {...field} className={inputStyles} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={shippingForm.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelStyles}>State / Province</FormLabel>
                          <FormControl><Input placeholder="CA" {...field} className={inputStyles} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={shippingForm.control}
                      name="zip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelStyles}>Postal / ZIP Code</FormLabel>
                          <FormControl><Input placeholder="90265" {...field} className={inputStyles} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                   <FormField
                    control={shippingForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyles}>Country / Territory</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={cn(inputStyles, "w-full")}>
                              <SelectValue placeholder="Select Country/Territory" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                            <SelectItem value="USA" className="hover:bg-red-700/50">United States of America</SelectItem>
                            <SelectItem value="CAN" className="hover:bg-red-700/50">Canada</SelectItem>
                            <SelectItem value="GBR" className="hover:bg-red-700/50">United Kingdom</SelectItem>
                             {/* Add more countries as needed */}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between pt-6">
                  <IronManThemedButton type="button" variant="outline" onClick={handlePrevStep} className="border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-slate-900">
                    <ArrowLeft className="mr-2 h-5 w-5" /> Back to Vault
                  </IronManThemedButton>
                  <IronManThemedButton type="submit">
                    Proceed to Secure Payment <ArrowRight className="ml-2 h-5 w-5" />
                  </IronManThemedButton>
                </CardFooter>
              </form>
            </Form>
          </Card>
        )}

        {/* Step 3: Payment Method */}
        {currentStep === 2 && (
          <Card className={cardContainerStyles}>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-amber-400 flex items-center"><ShieldCheck className="mr-3 h-7 w-7"/>Secure Payment Protocol</CardTitle>
              <CardDescription className="text-slate-400">Select your preferred Stark-approved payment method.</CardDescription>
            </CardHeader>
            <Form {...paymentForm}>
              <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-6">
                <CardContent className="space-y-4">
                  <FormField
                    control={paymentForm.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className={labelStyles}>Payment Method</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="starkpay" id="starkpay" className="border-slate-500 text-red-500 focus:ring-red-500" /></FormControl>
                              <Label htmlFor="starkpay" className="font-medium text-slate-200 hover:text-red-400 cursor-pointer">StarkPay Credit Balance</Label>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value="creditcard" id="creditcard" className="border-slate-500 text-red-500 focus:ring-red-500" /></FormControl>
                              <Label htmlFor="creditcard" className="font-medium text-slate-200 hover:text-red-400 cursor-pointer">Arc Credit Card</Label>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {paymentForm.watch("paymentMethod") === 'creditcard' && (
                    <div className="space-y-4 p-4 border border-slate-700 rounded-md bg-slate-900/30">
                      <FormField
                        control={paymentForm.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelStyles}>Card Number</FormLabel>
                            <FormControl><Input placeholder="XXXX XXXX XXXX XXXX" {...field} className={inputStyles} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={paymentForm.control}
                          name="expiryDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={labelStyles}>Expiry Date (MM/YY)</FormLabel>
                              <FormControl><Input placeholder="MM/YY" {...field} className={inputStyles} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={paymentForm.control}
                          name="cvv"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className={labelStyles}>CVV / Security Code</FormLabel>
                              <FormControl><Input placeholder="XXX" {...field} className={inputStyles} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between pt-6">
                  <IronManThemedButton type="button" variant="outline" onClick={handlePrevStep} className="border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-slate-900">
                     <ArrowLeft className="mr-2 h-5 w-5" /> Back to Delivery
                  </IronManThemedButton>
                  <IronManThemedButton type="submit">
                    Review Order <ArrowRight className="ml-2 h-5 w-5" />
                  </IronManThemedButton>
                </CardFooter>
              </form>
            </Form>
          </Card>
        )}

        {/* Step 4: Order Confirmation/Review */}
        {currentStep === 3 && (
          <Card className={cardContainerStyles}>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-amber-400 flex items-center"><CheckCircle className="mr-3 h-7 w-7"/>Final Confirmation Protocol</CardTitle>
              <CardDescription className="text-slate-400">Review all system diagnostics before authorizing build.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-sky-400 mb-2">Items in Vault:</h3>
                {cartItems.map(item => (
                  <div key={item.id} className="text-sm text-slate-300 p-2 border-b border-slate-700 last:border-b-0">
                    {item.name} (x{item.quantity}) - ${ (item.price * item.quantity).toFixed(2) }
                    <p className="text-xs text-slate-400 italic">{item.customization}</p>
                  </div>
                ))}
              </div>
              {shippingDetails && (
                <div>
                  <h3 className="text-lg font-semibold text-sky-400 mb-2">Delivery Coordinates:</h3>
                  <p className="text-sm text-slate-300">{shippingDetails.fullName}</p>
                  <p className="text-sm text-slate-300">{shippingDetails.address1}{shippingDetails.address2 ? `, ${shippingDetails.address2}` : ''}</p>
                  <p className="text-sm text-slate-300">{shippingDetails.city}, {shippingDetails.state} {shippingDetails.zip}</p>
                  <p className="text-sm text-slate-300">{shippingDetails.country}</p>
                </div>
              )}
              {paymentDetails && (
                <div>
                  <h3 className="text-lg font-semibold text-sky-400 mb-2">Payment Method:</h3>
                  <p className="text-sm text-slate-300">
                    {paymentDetails.paymentMethod === 'starkpay' ? 'StarkPay Credit Balance' : `Arc Credit Card ending in ${paymentDetails.cardNumber?.slice(-4)}`}
                  </p>
                </div>
              )}
              <Separator className="bg-slate-600 my-4"/>
              <div className="text-right">
                <p className="text-2xl font-bold text-amber-300">Total: ${totalAmount.toFixed(2)}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-6">
              <IronManThemedButton type="button" variant="outline" onClick={handlePrevStep} className="border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-slate-900">
                <ArrowLeft className="mr-2 h-5 w-5" /> Back to Payment
              </IronManThemedButton>
              <IronManThemedButton onClick={handlePlaceOrder}>
                Authorize & Build My Gear
              </IronManThemedButton>
            </CardFooter>
          </Card>
        )}
      </main>
      <GlobalFooter />
    </div>
  );
};

export default CheckoutProcessPage;