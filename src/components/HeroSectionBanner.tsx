import React from 'react';
import { Link } from 'react-router-dom';
import IronManThemedButton from '@/components/IronManThemedButton';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface HeroSectionBannerProps {
  // This component is primarily designed for static display on the homepage.
  // Props can be added in the future if more dynamic content is required.
  // For example:
  // headline?: string;
  // subHeadline?: string;
  // ctaText?: string;
  // ctaLink?: string;
  // backgroundImage?: string;
}

const HeroSectionBanner: React.FC<HeroSectionBannerProps> = () => {
  console.log('HeroSectionBanner loaded');

  const headlineContent = "FORGE YOUR ARMOR";
  const subHeadlineContent = "Experience the pinnacle of personalized apparel. Craft your unique Iron Man-inspired gear and unleash your inner hero.";
  const ctaButtonText = "Forge Your Legacy";
  const ctaButtonLink = "/gallery"; // Matches route in App.tsx

  return (
    <section className="relative bg-gradient-to-br from-neutral-950 via-red-900 to-amber-600 text-neutral-100 min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Subtle hexagonal background pattern for a high-tech feel */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="heroHexPattern" patternUnits="userSpaceOnUse" width="70" height="80.83" patternTransform="scale(1) rotate(0)">
                    {/* Hexagon path: M center_x, top_y L right_x, top_mid_y L right_x, bottom_mid_y L center_x, bottom_y L left_x, bottom_mid_y L left_x, top_mid_y Z */}
                    <path d="M35 0 L70 20.21 L70 60.62 L35 80.83 L0 60.62 L0 20.21 Z" fill="currentColor" fillOpacity="0.3"/>
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#heroHexPattern)" />
        </svg>
      </div>
      
      {/* Content container */}
      <div className="relative z-10 text-center space-y-8 max-w-4xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase"
          style={{
            textShadow: '0 0 10px rgba(255, 223, 0, 0.6), 0 0 20px rgba(239, 68, 68, 0.5), 2px 2px 5px rgba(0,0,0,0.3)' // Gold and Red glow
          }}
        >
          {headlineContent}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-lg sm:text-xl md:text-2xl text-neutral-300 max-w-3xl mx-auto leading-relaxed"
        >
          {subHeadlineContent}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6, type: "spring", stiffness: 100 }}
          className="pt-6"
        >
          <IronManThemedButton size="lg" asChild>
            <Link to={ctaButtonLink} className="inline-flex items-center text-lg md:text-xl px-8 py-4">
              {ctaButtonText}
              <ChevronRight className="ml-2.5 h-6 w-6" />
            </Link>
          </IronManThemedButton>
        </motion.div>
      </div>

      {/* Optional: Bottom gradient fade to smoothly transition if content follows */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-neutral-950/60 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default HeroSectionBanner;