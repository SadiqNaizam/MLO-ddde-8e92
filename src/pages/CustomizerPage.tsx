import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Custom Components
import GlobalHeader from '@/components/layout/GlobalHeader';
import GlobalFooter from '@/components/layout/GlobalFooter';
import ProductShowcase3D from '@/components/ProductShowcase3D';
import CustomizationOptionSelector from '@/components/CustomizationOptionSelector';
import IronManThemedButton from '@/components/IronManThemedButton';

// Shadcn/ui Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';

interface ProductDetails {
  slug: string;
  name: string;
  imageUrl: string; // Could be base model image for 3D viewer
  basePrice: number;
}

interface CustomizationChoice {
  id: string;
  name: string;
  value: string;
  imageUrl?: string;
  description?: string;
  cost: number; // Added cost for this option
}

const materialOptions: CustomizationChoice[] = [
  { id: 'mat1', name: 'Nanotech Weave', value: 'nanotech-weave', imageUrl: 'https://via.placeholder.com/48/3B82F6/FFFFFF?Text=NW', description: 'Lightweight, self-repairing fabric.', cost: 150 },
  { id: 'mat2', name: 'Titanium Alloy Mesh', value: 'titanium-mesh', imageUrl: 'https://via.placeholder.com/48/F97316/FFFFFF?Text=TM', description: 'Enhanced durability and protection.', cost: 250 },
  { id: 'mat3', name: 'Vibranium Blend Armor', value: 'vibranium-blend', imageUrl: 'https://via.placeholder.com/48/14B8A6/FFFFFF?Text=VB', description: 'Superior impact absorption and energy redirection.', cost: 500 },
];

const platingOptions: CustomizationChoice[] = [
  { id: 'plt1', name: 'MK-I Tactical Plating', value: 'mk1-plating', imageUrl: 'https://via.placeholder.com/48/6B7280/FFFFFF?Text=MK1', description: 'Classic Stark Industries tactical plating.', cost: 50 },
  { id: 'plt2', name: 'Repulsor-Tech Accents', value: 'repulsor-accents', imageUrl: 'https://via.placeholder.com/48/38BDF8/FFFFFF?Text=RT', description: 'Integrated repulsor energy conduits.', cost: 120 },
  { id: 'plt3', name: 'Stealth Coating System', value: 'stealth-coating', imageUrl: 'https://via.placeholder.com/48/1F2937/FFFFFF?Text=SC', description: 'Radar-absorbent, chameleon-like material.', cost: 200 },
];

const insigniaOptions: CustomizationChoice[] = [
  { id: 'ins1', name: 'Stark Industries Logo', value: 'stark-logo', imageUrl: 'https://via.placeholder.com/48/EF4444/FFFFFF?Text=SI', description: 'Official Stark Industries emblem.', cost: 30 },
  { id: 'ins2', name: 'Arc Reactor Emblem', value: 'arc-reactor', imageUrl: 'https://via.placeholder.com/48/0E7490/FFFFFF?Text=AR', description: 'Iconic Arc Reactor chest piece design.', cost: 45 },
  { id: 'ins3', name: 'Custom Monogram (A.I. Etched)', value: 'custom-monogram', imageUrl: 'https://via.placeholder.com/48/FACC15/000000?Text=ABC', description: 'Personalized initials, precision etched.', cost: 60 },
];

const sample3DFeatures = [
    { id: 'shoulder_armor', name: 'Shoulder Armor Plating', defaultVisibility: true },
    { id: 'gauntlet_repulsors', name: 'Gauntlet Repulsors', defaultVisibility: false },
    { id: 'flight_stabilizers', name: 'Flight Stabilizers (Back)', defaultVisibility: false },
];

const CustomizerPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
  
  // Customization States
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(materialOptions[0].value);
  const [primaryColor, setPrimaryColor] = useState<string>('#B91C1C'); // Iron Man Red
  const [secondaryColor, setSecondaryColor] = useState<string>('#F59E0B'); // Iron Man Gold
  const [selectedPlating, setSelectedPlating] = useState<string | null>(platingOptions[0].value);
  const [selectedInsignia, setSelectedInsignia] = useState<string | null>(insigniaOptions[0].value);
  const [measurements, setMeasurements] = useState({ chest: '', waist: '', sleeve: '', height: '' });
  const [fitPreference, setFitPreference] = useState<number[]>([50]); // 0-tight, 50-standard, 100-loose
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    console.log('CustomizerPage loaded');
    if (location.state && location.state.productName) {
      const { productName, productImage, productPrice, productSlug } = location.state as { productName: string, productImage: string, productPrice: number, productSlug: string };
      setProductDetails({
        name: productName,
        imageUrl: productImage || 'https://via.placeholder.com/600x400.glb?text=Stark+Model+3D', // Use actual 3D model URL if available
        basePrice: productPrice,
        slug: productSlug,
      });
    } else {
      // Fallback if no product is passed via state (e.g., direct navigation)
      setProductDetails({
        name: 'MK-X Custom Suit',
        imageUrl: 'https://via.placeholder.com/600x400.glb?text=Default+MK-X+Model',
        basePrice: 1200,
        slug: 'default-mk-x',
      });
    }
  }, [location.state]);

  const calculateTotalPrice = useCallback(() => {
    let currentTotal = productDetails?.basePrice || 0;
    
    const materialCost = materialOptions.find(opt => opt.value === selectedMaterial)?.cost || 0;
    const platingCost = platingOptions.find(opt => opt.value === selectedPlating)?.cost || 0;
    const insigniaCost = insigniaOptions.find(opt => opt.value === selectedInsignia)?.cost || 0;

    currentTotal += materialCost + platingCost + insigniaCost;
    // Potentially add cost based on fitPreference or other factors in the future
    setTotalPrice(currentTotal);
  }, [productDetails, selectedMaterial, selectedPlating, selectedInsignia]);

  useEffect(() => {
    calculateTotalPrice();
  }, [calculateTotalPrice]);

  const handleMeasurementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMeasurements(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFinalizeDesign = () => {
    const designSummary = {
      product: productDetails?.name,
      material: materialOptions.find(o => o.value === selectedMaterial)?.name,
      primaryColor,
      secondaryColor,
      plating: platingOptions.find(o => o.value === selectedPlating)?.name,
      insignia: insigniaOptions.find(o => o.value === selectedInsignia)?.name,
      measurements,
      fitPreference: fitPreference[0],
      totalPrice,
    };
    console.log("Design Finalized:", designSummary);
    
    toast.success(`${productDetails?.name || 'Custom Design'} Added to Vault!`, {
      description: `Total: $${totalPrice.toFixed(2)}. Proceed to secure checkout.`,
      duration: 5000, // Keep toast longer
      // Removed direct action from toast to simplify, navigate will handle it.
    });
    
    // Navigate to checkout process page, potentially passing designSummary or cart ID
    navigate('/checkout-process', { state: { finalizedDesign: designSummary } });
  };
  
  if (!productDetails) {
    return (
      <div className="bg-slate-900 text-white min-h-screen flex flex-col">
        <GlobalHeader />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-xl">Loading product details or select a product from the gallery...</p>
        </main>
        <GlobalFooter />
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col">
      <GlobalHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column: 3D Viewer & Price */}
          <section className="lg:col-span-3 space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-red-500 tracking-tight mb-2">Customize: {productDetails.name}</h1>
            <ProductShowcase3D
              modelUrl={productDetails.imageUrl} // This should be a .glb or similar 3D model URL
              altText={`3D model of ${productDetails.name}`}
              features={sample3DFeatures}
              backgroundColor="bg-slate-900"
            />
            <Card className="bg-slate-800 border-slate-700 shadow-xl">
              <CardHeader>
                <CardTitle className="text-amber-400 text-2xl">Estimated Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-red-500">${totalPrice.toFixed(2)}</p>
                <p className="text-sm text-slate-400 mt-1">Base Price: ${productDetails.basePrice.toFixed(2)}</p>
              </CardContent>
            </Card>
          </section>

          {/* Right Column: Customization Tabs */}
          <section className="lg:col-span-2">
            <Tabs defaultValue="material" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 mb-4 bg-slate-800 p-1 rounded-lg">
                <TabsTrigger value="material" className="data-[state=active]:bg-red-700 data-[state=active]:text-white">Material</TabsTrigger>
                <TabsTrigger value="colors" className="data-[state=active]:bg-red-700 data-[state=active]:text-white">Colors</TabsTrigger>
                <TabsTrigger value="plating" className="data-[state=active]:bg-red-700 data-[state=active]:text-white">Plating</TabsTrigger>
                <TabsTrigger value="insignia" className="data-[state=active]:bg-red-700 data-[state=active]:text-white">Insignia</TabsTrigger>
                <TabsTrigger value="measure" className="data-[state=active]:bg-red-700 data-[state=active]:text-white">Sizing</TabsTrigger>
              </TabsList>

              <TabsContent value="material">
                <CustomizationOptionSelector
                  sectionTitle="Select Base Material"
                  options={materialOptions}
                  selectedValue={selectedMaterial}
                  onValueChange={setSelectedMaterial}
                  displayType="radio-image-list"
                />
              </TabsContent>

              <TabsContent value="colors">
                <Card className="bg-neutral-800/[.85] border border-neutral-700 p-4 md:p-6 my-6 shadow-xl">
                  <h3 className="text-xl font-light mb-5 text-amber-400 tracking-wider uppercase border-b border-neutral-700 pb-3">Color Scheme</h3>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="primaryColor" className="text-sky-300 block mb-2">Primary Color (e.g., Main Body)</Label>
                      <Input type="color" id="primaryColor" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-full h-12 p-1 border-slate-600 bg-slate-700" />
                    </div>
                    <div>
                      <Label htmlFor="secondaryColor" className="text-sky-300 block mb-2">Secondary Color (e.g., Accents)</Label>
                      <Input type="color" id="secondaryColor" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-full h-12 p-1 border-slate-600 bg-slate-700" />
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="plating">
                <CustomizationOptionSelector
                  sectionTitle="Armor Plating & Accents"
                  options={platingOptions}
                  selectedValue={selectedPlating}
                  onValueChange={setSelectedPlating}
                  displayType="radio-image-list"
                />
              </TabsContent>

              <TabsContent value="insignia">
                 <CustomizationOptionSelector
                  sectionTitle="Select Insignia / Emblem"
                  options={insigniaOptions}
                  selectedValue={selectedInsignia}
                  onValueChange={setSelectedInsignia}
                  displayType="radio-image-list"
                />
              </TabsContent>
              
              <TabsContent value="measure">
                <Card className="bg-neutral-800/[.85] border border-neutral-700 p-4 md:p-6 my-6 shadow-xl">
                  <h3 className="text-xl font-light mb-5 text-amber-400 tracking-wider uppercase border-b border-neutral-700 pb-3">Measurements & Fit</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="chest" className="text-sky-300">Chest (cm)</Label>
                      <Input type="number" id="chest" name="chest" value={measurements.chest} onChange={handleMeasurementChange} placeholder="e.g., 102" className="mt-1 bg-slate-700 border-slate-600 placeholder:text-slate-500" />
                    </div>
                    <div>
                      <Label htmlFor="waist" className="text-sky-300">Waist (cm)</Label>
                      <Input type="number" id="waist" name="waist" value={measurements.waist} onChange={handleMeasurementChange} placeholder="e.g., 86" className="mt-1 bg-slate-700 border-slate-600 placeholder:text-slate-500" />
                    </div>
                     <div>
                      <Label htmlFor="sleeve" className="text-sky-300">Sleeve Length (cm)</Label>
                      <Input type="number" id="sleeve" name="sleeve" value={measurements.sleeve} onChange={handleMeasurementChange} placeholder="e.g., 65" className="mt-1 bg-slate-700 border-slate-600 placeholder:text-slate-500" />
                    </div>
                     <div>
                      <Label htmlFor="height" className="text-sky-300">Overall Height (cm)</Label>
                      <Input type="number" id="height" name="height" value={measurements.height} onChange={handleMeasurementChange} placeholder="e.g., 180" className="mt-1 bg-slate-700 border-slate-600 placeholder:text-slate-500" />
                    </div>
                    <Separator className="my-6 bg-slate-700" />
                    <div>
                      <Label htmlFor="fitPreference" className="text-sky-300 block mb-2">Fit Preference ({fitPreference[0] === 50 ? 'Standard' : fitPreference[0] < 50 ? 'Tighter' : 'Looser'})</Label>
                      <Slider
                        id="fitPreference"
                        min={0} max={100} step={10}
                        value={fitPreference}
                        onValueChange={setFitPreference}
                        className="mt-1 [&>span:first-child]:bg-sky-500 [&>span:first-child_span]:bg-sky-300"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>Tight</span>
                        <span>Standard</span>
                        <span>Loose</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            <IronManThemedButton onClick={handleFinalizeDesign} className="w-full mt-8 py-4 text-xl">
              Finalize Design & Add to Vault
            </IronManThemedButton>
          </section>
        </div>
      </main>
      <GlobalFooter />
    </div>
  );
};

export default CustomizerPage;