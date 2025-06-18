import React from 'react';
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IronManThemedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // children, className, onClick, type, disabled etc. are inherited
}

const IronManThemedButton: React.FC<IronManThemedButtonProps> = ({
  children,
  className,
  disabled,
  ...props
}) => {
  console.log('IronManThemedButton loaded');

  const themedStyles = `
    // Base styling: font, padding, rounded corners, transitions
    font-semibold text-base md:text-lg
    py-2.5 px-5 md:py-3 md:px-6 
    rounded-md 
    transition-all duration-300 ease-in-out 
    transform active:scale-95 
    focus-visible:outline-none // Remove default outline for custom focus

    // Iron Man Theme Colors & Effects:
    // Background: Deep red gradient for a metallic, layered look
    bg-gradient-to-br from-red-700 via-red-600 to-red-800
    // Text: Metallic gold
    text-yellow-300 
    // Border: Subtle metallic gold border
    border-2 border-yellow-600/60 

    // Hover States: Enhanced metallic feel and illumination
    hover:from-red-600 hover:to-red-700 // Slightly lighter/brighter red
    hover:text-yellow-200 // Brighter gold text
    hover:border-yellow-500 // More prominent gold border
    hover:shadow-[0_0_18px_4px_rgba(250,204,21,0.4)] // Gold illumination (metallic sheen/glow)

    // Focus State: Arc-reactor blue accent
    focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-opacity-80 
    
    // Disabled State: Muted, non-interactive appearance
    disabled:bg-slate-700 disabled:hover:bg-slate-700 
    disabled:text-slate-500 disabled:hover:text-slate-500
    disabled:border-slate-600 disabled:hover:border-slate-600
    disabled:shadow-none 
    disabled:cursor-not-allowed
    disabled:active:scale-100 // Prevent active scale transform when disabled
  `;

  return (
    <ShadcnButton
      className={cn(
        themedStyles,
        className // Allow consumers to pass additional classes
      )}
      disabled={disabled}
      {...props} // Pass down other standard button attributes (onClick, type, etc.)
    >
      {children}
    </ShadcnButton>
  );
};

export default IronManThemedButton;