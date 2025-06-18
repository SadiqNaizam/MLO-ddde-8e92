import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle } from 'lucide-react';

// Note: Assumes TooltipProvider is used globally (e.g., in App.tsx or a main layout component)

interface Option {
  id: string; // Unique ID for React key and HTML id
  name: string; // Display name, used in tooltips or labels
  value: string; // The actual value to be returned on selection
  imageUrl?: string; // URL for image-based swatches or radio item previews
  colorHex?: string; // Hex code for color swatches
  description?: string; // Optional additional description for tooltips or radio items
}

interface CustomizationOptionSelectorProps {
  sectionTitle: string; // Title for this group of options, e.g., "Select Fabric"
  options: Option[]; // Array of available options
  selectedValue: string | null; // The currently selected option's value
  onValueChange: (value: string) => void; // Callback when an option is selected
  displayType: 'color-swatch' | 'image-swatch' | 'radio-image-list'; // Controls rendering style
}

const CustomizationOptionSelector: React.FC<CustomizationOptionSelectorProps> = ({
  sectionTitle,
  options,
  selectedValue,
  onValueChange,
  displayType,
}) => {
  console.log(`CustomizationOptionSelector loaded for: ${sectionTitle}, display type: ${displayType}`);

  // Base styling for interactive items
  const baseItemInteractiveClasses = "border-2 rounded-md focus:outline-none transition-all duration-300 ease-in-out";
  
  // Styling for selected items - "glowing effect" using cyan for an "arc-reactor blue" accent
  // rgba(34,211,238,0.6) is cyan-400 at 60% opacity
  const selectedItemHighlightClasses = "ring-2 ring-offset-2 ring-offset-neutral-900 ring-cyan-400 shadow-[0_0_18px_3px_rgba(34,211,238,0.6)] border-cyan-400";
  const unselectedItemDefaultClasses = "border-neutral-600 hover:border-cyan-500";

  // Main container with Iron Man theme: dark, metallic, high-tech
  const mainContainerClasses = "p-4 md:p-6 my-6 bg-neutral-800/[.85] border border-neutral-700 rounded-xl shadow-2xl backdrop-blur-sm";
  // Section title using amber for a "metallic gold" look
  const sectionTitleClasses = "text-xl font-light mb-5 text-amber-400 tracking-wider uppercase border-b border-neutral-700 pb-3";


  if (displayType === 'color-swatch' || displayType === 'image-swatch') {
    return (
      <div className={mainContainerClasses}>
        <h3 className={sectionTitleClasses}>{sectionTitle}</h3>
        <div className="flex flex-wrap gap-4">
          {options.map((option) => {
            const isSelected = selectedValue === option.value;
            const currentItemStateClasses = isSelected ? selectedItemHighlightClasses : unselectedItemDefaultClasses;

            if (displayType === 'color-swatch') {
              return (
                <Tooltip key={option.id} delayDuration={200}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => onValueChange(option.value)}
                      className={`${baseItemInteractiveClasses} ${currentItemStateClasses} w-12 h-12 sm:w-14 sm:h-14 relative group`}
                      style={{ backgroundColor: option.colorHex || '#262626' }} // Default dark neutral if no color
                      aria-label={option.name}
                      title={option.name} // Basic tooltip fallback
                    >
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/[.30]">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                      )}
                       <span className="sr-only">{option.name}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-neutral-900 text-neutral-100 border-cyan-500 shadow-lg">
                    <p className="font-semibold">{option.name}</p>
                    {option.description && <p className="text-xs text-neutral-400">{option.description}</p>}
                  </TooltipContent>
                </Tooltip>
              );
            }

            if (displayType === 'image-swatch') {
              return (
                <Tooltip key={option.id} delayDuration={200}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => onValueChange(option.value)}
                      className={`${baseItemInteractiveClasses} ${currentItemStateClasses} w-20 h-20 sm:w-24 sm:h-24 overflow-hidden relative group bg-neutral-700`}
                      aria-label={option.name}
                      title={option.name} // Basic tooltip fallback
                    >
                      <img
                        src={option.imageUrl || 'https://via.placeholder.com/100/1E293B/FFFFFF?Text=No+Image'}
                        alt={option.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-cyan-600/[.50]">
                          <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                      )}
                      <span className="sr-only">{option.name}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-neutral-900 text-neutral-100 border-cyan-500 shadow-lg">
                    <p className="font-semibold">{option.name}</p>
                    {option.description && <p className="text-xs text-neutral-400">{option.description}</p>}
                  </TooltipContent>
                </Tooltip>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }

  if (displayType === 'radio-image-list') {
    return (
      <div className={mainContainerClasses}>
        <h3 className={sectionTitleClasses}>{sectionTitle}</h3>
        <RadioGroup
          value={selectedValue || ''} // Ensure value is string for RadioGroup
          onValueChange={onValueChange}
          className="space-y-3"
        >
          {options.map((option) => {
            const isSelected = selectedValue === option.value;
            const radioItemContainerClasses = `flex items-center space-x-4 p-3.5 rounded-lg border-2 cursor-pointer transition-all duration-300 ease-in-out
              focus-within:ring-2 focus-within:ring-cyan-400 focus-within:ring-offset-2 focus-within:ring-offset-neutral-800
              ${isSelected
                ? 'bg-cyan-800/[.30] border-cyan-500 shadow-md' // Lighten selected bg slightly for better contrast
                : 'bg-neutral-700/[.60] border-neutral-600 hover:border-cyan-600 hover:bg-neutral-700/[.80]'
              }`;

            return (
              <Label
                key={option.id}
                htmlFor={`radio-opt-${option.id}`} // Unique ID for RadioGroupItem and its label
                className={radioItemContainerClasses}
              >
                <RadioGroupItem
                  value={option.value}
                  id={`radio-opt-${option.id}`}
                  className="border-neutral-500 text-cyan-500 data-[state=checked]:border-cyan-400 data-[state=checked]:bg-cyan-500 focus:ring-0 focus:ring-offset-0" // Focus handled by parent Label
                />
                {option.imageUrl && (
                  <img
                    src={option.imageUrl || 'https://via.placeholder.com/48/1E293B/FFFFFF?Text=N/A'}
                    alt={option.name}
                    className="w-12 h-12 object-contain rounded-md border border-neutral-600 bg-neutral-800 flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0"> {/* Prevents text overflow issues */}
                  <span className={`block font-medium truncate ${isSelected ? 'text-cyan-300' : 'text-neutral-100'}`}>
                    {option.name}
                  </span>
                  {option.description && (
                    <p className={`text-sm truncate ${isSelected ? 'text-cyan-400/[.90]' : 'text-neutral-400'}`}>
                      {option.description}
                    </p>
                  )}
                </div>
              </Label>
            );
          })}
        </RadioGroup>
      </div>
    );
  }

  // Fallback for unrecognized displayType
  return (
    <div className="p-4 my-6 bg-red-900/[.80] border border-red-700 text-red-100 rounded-lg shadow-lg">
      Configuration Error: Invalid displayType "{displayType}" for CustomizationOptionSelector section "{sectionTitle}".
    </div>
  );
};

export default CustomizationOptionSelector;