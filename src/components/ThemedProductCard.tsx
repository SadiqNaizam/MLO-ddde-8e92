import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Settings } from 'lucide-react';

interface ThemedProductCardProps {
  slug: string; // Unique identifier for the product
  name: string;
  imageUrl: string;
  description: string;
  basePrice: number;
}

const ThemedProductCard: React.FC<ThemedProductCardProps> = ({
  slug,
  name,
  imageUrl,
  description,
  basePrice,
}) => {
  console.log('ThemedProductCard loaded for:', name, 'with slug:', slug);

  return (
    <Link to="/customizer" state={{ productSlug: slug, productName: name, productImage: imageUrl, productPrice: basePrice }} className="block group outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded-md">
      <Card className="bg-slate-800 border-2 border-slate-700 text-slate-200 rounded-md overflow-hidden transition-all duration-300 ease-in-out hover:shadow-[0_0_20px_5px_rgba(239,68,68,0.5)] hover:border-red-600 group-hover:scale-[1.02] relative flex flex-col h-full">
        <CardHeader className="p-0 relative">
          <AspectRatio ratio={4/5} className="bg-slate-700">
            <img
              src={imageUrl || 'https://via.placeholder.com/400x500?text=Stark+Designs'}
              alt={name}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </AspectRatio>
          {/* Angular Accent */}
          <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-yellow-400 rounded-tr-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-yellow-400 rounded-bl-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
        </CardHeader>

        <CardContent className="p-4 space-y-3 flex-grow flex flex-col justify-between">
          <div>
            <CardTitle className="text-lg md:text-xl font-bold text-yellow-400 group-hover:text-yellow-300 line-clamp-2 transition-colors">
              {name}
            </CardTitle>
            <p className="text-xs md:text-sm text-slate-400 line-clamp-2 mt-1">
              {description}
            </p>
          </div>
          <p className="text-md md:text-lg font-semibold text-red-500 mt-2">
            Base Price: ${basePrice.toFixed(2)}
          </p>
        </CardContent>

        {/* Hover Overlay - Data and CTA */}
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out scale-95 group-hover:scale-100">
          <h3 className="text-2xl font-bold text-yellow-300 mb-2 text-center line-clamp-2">{name}</h3>
          <p className="text-xl text-red-400 mb-4">
            Starting at ${basePrice.toFixed(2)}
          </p>
          <Button
            variant="outline"
            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-slate-900 font-semibold py-3 px-6 text-lg
                       transition-all duration-300 ease-in-out
                       hover:shadow-[0_0_15px_rgba(250,204,21,0.7)]
                       focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label={`Customize ${name}`}
          >
            <Settings className="mr-2 h-5 w-5" /> Customize Suit
          </Button>
          <p className="text-xs text-slate-500 mt-3 italic">Click to begin personalization</p>
        </div>
      </Card>
    </Link>
  );
};

export default ThemedProductCard;