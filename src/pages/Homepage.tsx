import React from 'react';
import { Link } from 'react-router-dom';
import GlobalHeader from '@/components/layout/GlobalHeader';
import HeroSectionBanner from '@/components/HeroSectionBanner';
import ThemedProductCard from '@/components/ThemedProductCard';
import IronManThemedButton from '@/components/IronManThemedButton';
import GlobalFooter from '@/components/layout/GlobalFooter';
import { ChevronRight, Settings } from 'lucide-react'; // For button icons

const featuredProducts = [
  {
    slug: "mk-xlv-battle-suit",
    name: "Mark XLV Combat Armor",
    imageUrl: "https://images.unsplash.com/photo-1518310952931-b13140819c51?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cm9ib3QlMjBzdWl0fGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60", // Placeholder
    description: "The pinnacle of defensive and offensive capabilities, inspired by the Age of Ultron.",
    basePrice: 2999.99
  },
  {
    slug: "stealth-recon-suit",
    name: "Stealth Recon Suit",
    imageUrl: "https://images.unsplash.com/photo-1611931960000-812b08e694f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZ1dHVyaXN0aWMlMjBhcm1vcnxlbnwwfHwwfHx8MA&auto=format&fit=crop&w=400&q=60", // Placeholder
    description: "Silent, adaptive camouflage for covert operations. Virtually undetectable.",
    basePrice: 3499.99
  },
  {
    slug: "repulsor-tech-flight-jacket",
    name: "Repulsor Tech Flight Jacket",
    imageUrl: "https://images.unsplash.com/photo-1581092916470-ca7907959a00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNjaSUyMGZpJTIgamFja2V0fGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60", // Placeholder
    description: "Lightweight jacket integrated with primary repulsor-lift technology for enhanced mobility.",
    basePrice: 1899.00
  }
];

const Homepage: React.FC = () => {
  console.log('Homepage loaded');

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-red-700 selection:text-yellow-300">
      <GlobalHeader />
      <main className="flex-grow">
        <HeroSectionBanner />

        {/* Featured Designs Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
          <div className="container mx-auto px-4">
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-12 md:mb-16 uppercase tracking-tight"
              style={{ textShadow: '0 0 8px rgba(239, 68, 68, 0.7)' }} // Red glow for "Featured Designs"
            >
              Featured Designs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {featuredProducts.map((product) => (
                <ThemedProductCard
                  key={product.slug}
                  slug={product.slug}
                  name={product.name}
                  imageUrl={product.imageUrl}
                  description={product.description}
                  basePrice={product.basePrice}
                />
              ))}
            </div>
            <div className="text-center mt-12 md:mt-16">
              <IronManThemedButton size="lg" asChild>
                <Link to="/gallery" className="inline-flex items-center">
                  Explore All Collections
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </IronManThemedButton>
            </div>
          </div>
        </section>

        {/* Call to Action - Customizer Section */}
        <section className="py-16 md:py-24 bg-slate-800 border-t-2 border-red-800/50">
          <div className="container mx-auto px-4 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                <Settings className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
                <h2 
                    className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-yellow-400 mb-6 uppercase tracking-tight"
                    style={{ textShadow: '0 0 8px rgba(250, 204, 21, 0.5)'}} // Gold glow
                >
                    Ready to Customize?
                </h2>
                <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                    Step into the armory. Utilize our state-of-the-art customization interface to forge a suit that's uniquely yours. Your legend begins with your design.
                </p>
                <IronManThemedButton size="lg" asChild>
                  <Link to="/customizer" className="inline-flex items-center">
                    Start Customization
                    <Settings className="ml-2 h-5 w-5" />
                  </Link>
                </IronManThemedButton>
            </motion.div>
          </div>
        </section>
      </main>
      <GlobalFooter />
    </div>
  );
};

// Basic motion import for the whileInView effect
// In a real app, this would ideally be a shared utility or directly imported if complex.
// For this single page generation, a simplified direct import for the effect on one section.
const motion = {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { initial?: any, whileInView?: any, viewport?: any, transition?: any }) => <div {...props}>{children}</div>
};


export default Homepage;