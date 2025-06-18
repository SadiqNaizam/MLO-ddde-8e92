import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, User, ShoppingCart, Menu } from 'lucide-react';
import ArmorTransformationMenu from '@/components/ArmorTransformationMenu'; // Assuming this component exists

interface NavItem {
  label: string;
  path: string;
}

const GlobalHeader: React.FC = () => {
  console.log('GlobalHeader loaded');

  const primaryNavItems: NavItem[] = [
    { label: 'Home', path: '/' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Customizer', path: '/customizer' },
  ];

  // This is a simplified representation of how ArmorTransformationMenu might be used.
  // It assumes ArmorTransformationMenu takes navItems and renders them.
  // For mobile, we might use a sheet or drawer triggered by a menu icon.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700 bg-slate-900/80 backdrop-blur-lg supports-[backdrop-filter]:bg-slate-900/50">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <Shield className="h-8 w-8 text-red-500 group-hover:text-red-400 transition-colors" />
          <span className="font-bold text-xl text-slate-100 group-hover:text-red-400 transition-colors">
            Stark Industries
          </span>
        </Link>

        {/* Desktop Navigation using ArmorTransformationMenu */}
        <nav className="hidden md:flex items-center gap-2">
          <ArmorTransformationMenu navItems={primaryNavItems} />
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-red-400 hover:bg-slate-700" asChild>
            <Link to="/user-account">
              <User className="h-6 w-6" />
              <span className="sr-only">User Account</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="text-slate-300 hover:text-red-400 hover:bg-slate-700" asChild>
            <Link to="/checkout-process">
              <ShoppingCart className="h-6 w-6" />
              <span className="sr-only">Mini Cart</span>
            </Link>
          </Button>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-red-400 hover:bg-slate-700"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Rendered via ArmorTransformationMenu or a simple list */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-2">
            {/* Assuming ArmorTransformationMenu can also render for mobile, or use NavLink directly */}
            {/* For simplicity, using NavLink here. ArmorTransformationMenu could be adapted. */}
            {primaryNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-red-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-red-400'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default GlobalHeader;