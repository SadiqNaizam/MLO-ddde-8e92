import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils'; // Standard utility for merging Tailwind classes

interface HUDElementProps {
  /**
   * The type of HUD effect to render.
   * - 'corner-brackets': Animated L-shaped brackets in the corners.
   * - 'scan-line-horizontal': A horizontal line animating vertically.
   * - 'scan-line-vertical': A vertical line animating horizontally.
   * - 'grid-pattern': A subtle background grid.
   * @default 'corner-brackets'
   */
  variant?: 'corner-brackets' | 'scan-line-horizontal' | 'scan-line-vertical' | 'grid-pattern';
  /**
   * Additional CSS classes to apply to the root element.
   * Use this for positioning, sizing, and color (e.g., 'absolute inset-0 text-sky-400').
   */
  className?: string;
  /**
   * Controls the visibility of the HUD element.
   * When set to false, the component will animate out.
   * @default true
   */
  isVisible?: boolean;
}

const HUDElement: React.FC<HUDElementProps> = ({
  variant = 'corner-brackets',
  className,
  isVisible = true,
}) => {
  console.log('HUDElement loaded, variant:', variant);

  const renderCornerBrackets = () => {
    const bracketBaseClasses = 'absolute w-6 h-6 text-current'; // Inherits color from parent via text-*
    const bracketVariants = {
      hidden: { pathLength: 0, opacity: 0 },
      visible: (i: number) => ({
        pathLength: 1,
        opacity: 0.7,
        transition: {
          pathLength: { delay: i * 0.1, type: "tween", duration: 0.5, ease: "easeInOut" },
          opacity: { delay: i * 0.1, duration: 0.01 }
        }
      }),
      exit: { pathLength: 0, opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } }
    };
    
    // Path "M22 2 L2 2 L2 22" draws an L-shape within a 24x24 viewBox.
    // SVG transforms are used to position these for each corner.
    // `scale-x-[-1]` and `scale-y-[-1]` are Tailwind classes for transform: scaleX(-1) / scaleY(-1).
    return (
      <>
        {/* Top-left */}
        <motion.svg 
          className={cn(bracketBaseClasses, 'top-0 left-0')} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          initial="hidden" 
          animate="visible" 
          exit="exit" 
          custom={0}
        >
          <motion.path d="M22 2 L2 2 L2 22" variants={bracketVariants} />
        </motion.svg>
        {/* Top-right */}
        <motion.svg 
          className={cn(bracketBaseClasses, 'top-0 right-0 scale-x-[-1]')} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          initial="hidden" 
          animate="visible" 
          exit="exit" 
          custom={1}
        >
           <motion.path d="M22 2 L2 2 L2 22" variants={bracketVariants} />
        </motion.svg>
        {/* Bottom-left */}
        <motion.svg 
          className={cn(bracketBaseClasses, 'bottom-0 left-0 scale-y-[-1]')} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          initial="hidden" 
          animate="visible" 
          exit="exit" 
          custom={2}
        >
           <motion.path d="M22 2 L2 2 L2 22" variants={bracketVariants} />
        </motion.svg>
        {/* Bottom-right */}
        <motion.svg 
          className={cn(bracketBaseClasses, 'bottom-0 right-0 scale-x-[-1] scale-y-[-1]')} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          initial="hidden" 
          animate="visible" 
          exit="exit" 
          custom={3}
        >
           <motion.path d="M22 2 L2 2 L2 22" variants={bracketVariants} />
        </motion.svg>
      </>
    );
  };

  const renderScanLineHorizontal = () => {
    return (
      <motion.div
        className={cn('absolute bg-current w-full h-[2px] left-0 opacity-50')}
        initial={{ y: '0%' }}
        animate={{ y: ['0%', '100%', '0%'] }} // Animate y position for horizontal line
        transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
      />
    );
  };

  const renderScanLineVertical = () => {
    return (
      <motion.div
        className={cn('absolute bg-current h-full w-[2px] top-0 opacity-50')}
        initial={{ x: '0%' }}
        animate={{ x: ['0%', '100%', '0%'] }} // Animate x position for vertical line
        transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
      />
    );
  };

  const renderGridPattern = () => {
    // Uses an SVG pattern for the grid. Color is inherited via `stroke="currentColor"`.
    return (
      <svg width="100%" height="100%" className="absolute inset-0 opacity-20">
        <defs>
          <pattern id="hudGridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hudGridPattern)" />
      </svg>
    );
  };

  let content = null;
  switch (variant) {
    case 'corner-brackets':
      content = renderCornerBrackets();
      break;
    case 'scan-line-horizontal':
      content = renderScanLineHorizontal();
      break;
    case 'scan-line-vertical':
      content = renderScanLineVertical();
      break;
    case 'grid-pattern':
      content = renderGridPattern();
      break;
    default: // Default to corner-brackets if variant is unspecified or invalid
      content = renderCornerBrackets();
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            'pointer-events-none', // Ensures the HUD doesn't interfere with user interactions
            'overflow-hidden',     // Clips effects to the component's bounds
            'relative',            // Establishes a positioning context for internal elements
            className              // Allows user to pass size, position, and color (e.g. text-sky-400)
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }} // Fade in/out duration
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HUDElement;