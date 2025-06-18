import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react'; // Standard icon for navigation links

// Interface for individual navigation items
interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode; // Allow custom icons (e.g., from lucide-react)
}

// Props for the ArmorTransformationMenu component
interface ArmorTransformationMenuProps {
  navItems: NavItem[];
  isOpen: boolean; // Controls visibility and triggers animations, managed by parent (e.g., GlobalHeader)
  className?: string; // Allows custom styling for the UL container from the parent
  onItemClick?: () => void; // Optional: Callback for when a menu item is clicked (e.g., to close a mobile menu)
}

const ArmorTransformationMenu: React.FC<ArmorTransformationMenuProps> = ({
  navItems,
  isOpen,
  className = '',
  onItemClick,
}) => {
  console.log('ArmorTransformationMenu loaded');

  // Variants for the main menu container (ul)
  const menuVariants = {
    hidden: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1, // Stagger out in reverse
        when: "afterChildren", // Animate children out first
      },
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // "unfold segment by segment" effect for items
        delayChildren: 0.1, // Small delay before children start animating in
        when: "beforeChildren", // Animate container then children
      },
    },
  };

  // Variants for individual menu items (li)
  const itemVariants = {
    hidden: { opacity: 0, x: -30, scaleX: 0.8 }, // "glide open" from left, slightly scaled
    visible: {
      opacity: 1,
      x: 0,
      scaleX: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 14,
      },
    },
    exit: { // Animation for items when menu closes
      opacity: 0,
      x: -20,
      scaleX: 0.8,
      transition: { duration: 0.15 }
    }
  };

  // Thematic styling classes
  const baseItemClasses = "bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-neutral-200"; // Dark metallic base
  const hoverItemClasses = "hover:from-red-600 hover:via-red-700 hover:to-red-600 hover:text-white"; // Iron Man red on hover
  const focusItemClasses = "focus-visible:from-amber-500 focus-visible:via-amber-400 focus-visible:to-amber-500 focus-visible:text-black"; // Gold on focus

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.ul
          className={`list-none p-0 m-0 space-y-px ${className}`} // space-y-px for thin separation lines, mimicking armor segments
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          aria-label="Armor Transformation Menu"
        >
          {navItems.map((item, index) => (
            <motion.li
              key={`${item.path}-${index}`}
              variants={itemVariants}
              // No exit prop here, parent AnimatePresence + itemVariants.exit handles individual item exit
              className="overflow-hidden" // Ensures sharp edges during transformations
              style={{ transformOrigin: 'left' }} // Crucial for scaleX animation
            >
              <Link
                to={item.path}
                onClick={onItemClick} // Call a function on click, e.g., to close a mobile menu
                className={`
                  flex items-center justify-between w-full
                  px-4 py-3.5 
                  font-semibold text-sm tracking-wide uppercase
                  transition-colors duration-200 ease-in-out
                  border-l-4 border-transparent 
                  ${baseItemClasses}
                  ${hoverItemClasses}
                  ${focusItemClasses}
                  hover:border-red-500 focus-visible:border-amber-400
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-opacity-60
                  group 
                `}
              >
                <span className="flex items-center">
                  {item.icon && <span className="mr-3 h-5 w-5">{item.icon}</span>}
                  {item.label}
                </span>
                <ChevronRight className="h-5 w-5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  );
};

export default ArmorTransformationMenu;