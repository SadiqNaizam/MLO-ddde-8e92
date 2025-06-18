import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RotateCcw, ZoomIn, ZoomOut, Settings2, ImageOff } from 'lucide-react';

interface ProductFeature {
  id: string;
  name: string;
  defaultVisibility?: boolean;
}

interface ProductShowcase3DProps {
  modelUrl: string; // URL to the 3D model (e.g., .glb, .gltf)
  altText?: string;  // Alt text for accessibility
  initialRotationY?: number; // Initial rotation around Y axis in degrees
  initialZoom?: number;      // Initial zoom level (e.g., 1 = 100%)
  features?: ProductFeature[]; // Array of configurable features
  backgroundColor?: string; // Background color for the 3D view area
}

const ProductShowcase3D: React.FC<ProductShowcase3DProps> = ({
  modelUrl,
  altText = "Interactive 3D model of the product",
  initialRotationY = 0,
  initialZoom = 1,
  features = [],
  backgroundColor = "bg-slate-950", // Default dark background
}) => {
  console.log('ProductShowcase3D loaded with model URL:', modelUrl);

  const [rotationY, setRotationY] = useState<number>(initialRotationY);
  const [zoom, setZoom] = useState<number>(initialZoom);
  const [featureVisibility, setFeatureVisibility] = useState<Record<string, boolean>>(
    features.reduce((acc, feature) => {
      acc[feature.id] = feature.defaultVisibility ?? true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real scenario, you would initialize a 3D library (e.g., Three.js, React Three Fiber) here
    // and load the model from `modelUrl` into the `canvasRef.current`.
    // This is a placeholder simulation.
    console.log(`Simulating 3D model loading for: ${modelUrl}`);
    if (canvasRef.current) {
      // Clear previous content
      canvasRef.current.innerHTML = '';

      const placeholderContent = document.createElement('div');
      placeholderContent.className = "flex flex-col items-center justify-center h-full text-slate-400 p-4";
      
      const icon = document.createElement('div');
      // Note: This is a simplified way to add an SVG. In real use, you'd use the Icon component or raw SVG.
      icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-box"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`;
      icon.className = "mb-3";
      placeholderContent.appendChild(icon);
      
      const text = document.createElement('p');
      text.textContent = altText;
      text.className = "text-center text-sm";
      placeholderContent.appendChild(text);

      const modelInfo = document.createElement('p');
      modelInfo.textContent = `Model: ${modelUrl.split('/').pop() || 'N/A'}`;
      modelInfo.className = "text-center text-xs text-slate-500 mt-1";
      placeholderContent.appendChild(modelInfo);
      
      canvasRef.current.appendChild(placeholderContent);
    }
  }, [modelUrl, altText, backgroundColor]);


  const handleRotate = (delta: number) => {
    setRotationY(prev => (prev + delta) % 360);
    console.log(`Simulated Y-axis rotation. New angle: ${(rotationY + delta) % 360}°`);
    // In a real implementation, update the 3D scene's camera or model rotation.
  };

  const handleZoomChange = (newZoom: number[]) => {
    const val = Math.max(0.5, Math.min(3, newZoom[0])); // Clamp zoom: 50% to 300%
    setZoom(val);
    console.log('Simulated zoom level:', val);
    // In a real implementation, update the 3D scene's camera Z position or FOV.
  };

  const toggleFeatureVisibility = (featureId: string) => {
    setFeatureVisibility(prev => {
      const newVisibility = { ...prev, [featureId]: !prev[featureId] };
      console.log(`Toggled visibility for feature ${featureId} to ${newVisibility[featureId]}`);
      // In a real implementation, show/hide parts of the 3D model.
      return newVisibility;
    });
  };

  return (
    <Card className="w-full h-full flex flex-col bg-slate-800/50 border border-slate-700 shadow-xl shadow-sky-500/10 overflow-hidden">
      <CardHeader className="py-3 px-4 border-b border-slate-700">
        <CardTitle className="text-base font-semibold text-sky-400 text-center tracking-wider">
          3D Interactive Garment Preview
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow p-1 md:p-2 flex flex-col items-center justify-center relative">
        {/* Placeholder for 3D Canvas */}
        <div
          ref={canvasRef}
          className={`w-full aspect-[16/10] border border-slate-700 rounded-md flex items-center justify-center text-slate-400 transition-colors duration-300 ${backgroundColor}`}
          aria-label={altText}
          role="img"
          style={{ transform: `rotateY(${rotationY}deg) scale(${zoom})` }} // Simple visual feedback
        >
          {/* Content dynamically injected by useEffect */}
        </div>
      </CardContent>

      {/* Controls Panel */}
      <div className="p-3 border-t border-slate-700 bg-slate-800/70 backdrop-blur-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
          {/* Rotation and Zoom Controls */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="zoom-slider" className="text-xs font-medium text-sky-300 mb-1 block">Zoom ({Math.round(zoom * 100)}%)</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent border-sky-600/50 hover:bg-sky-500/20 text-sky-300" onClick={() => handleZoomChange([zoom - 0.1])}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Slider
                  id="zoom-slider"
                  min={0.5} max={3} step={0.1}
                  value={[zoom]}
                  onValueChange={handleZoomChange}
                  className="[&>span:first-child]:h-1 [&>span:first-child]:bg-sky-500 [&>span:first-child_span]:bg-sky-300"
                />
                <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent border-sky-600/50 hover:bg-sky-500/20 text-sky-300" onClick={() => handleZoomChange([zoom + 0.1])}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-xs font-medium text-sky-300 mb-1 block">Rotate Model (Y-axis)</Label>
              <div className="flex items-center justify-start gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent border-sky-600/50 hover:bg-sky-500/20 text-sky-300" onClick={() => handleRotate(-15)}>
                  <RotateCcw className="h-4 w-4 transform -scale-x-100" />
                </Button>
                 <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent border-sky-600/50 hover:bg-sky-500/20 text-sky-300" onClick={() => handleRotate(15)}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Features Toggles */}
          {features && features.length > 0 && (
            <div className="space-y-1 max-h-32 overflow-y-auto pr-1 border-l border-slate-700 pl-3">
              <Label className="text-xs font-medium text-sky-300 mb-2 flex items-center"><Settings2 className="h-3.5 w-3.5 mr-1.5" />Toggle Features</Label>
              {features.map(feature => (
                <div key={feature.id} className="flex items-center justify-between py-0.5">
                  <Label htmlFor={`feature-${feature.id}`} className="text-xs text-slate-300 cursor-pointer">
                    {feature.name}
                  </Label>
                  <Switch
                    id={`feature-${feature.id}`}
                    checked={featureVisibility[feature.id]}
                    onCheckedChange={() => toggleFeatureVisibility(feature.id)}
                    className="data-[state=checked]:bg-sky-600 data-[state=unchecked]:bg-slate-600 h-4 w-7 [&>span]:h-3 [&>span]:w-3"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProductShowcase3D;