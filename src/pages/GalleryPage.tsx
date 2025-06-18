import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

import GlobalHeader from '@/components/layout/GlobalHeader';
import GlobalFooter from '@/components/layout/GlobalFooter';
import ThemedProductCard from '@/components/ThemedProductCard';

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, Search, ArrowUpDown } from 'lucide-react';

interface Product {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  description: string;
  basePrice: number;
  category: string;
  styleLine?: string;
  releaseDate: string; // ISO date string for sorting by newest
}

const ALL_PRODUCTS: Product[] = [
  { id: '1', slug: 'mk-v-flight-jacket', name: 'MK-V "Suitcase" Flight Jacket', imageUrl: 'https://images.unsplash.com/photo-1580927336900-6c401324926e?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGZ1dHVyaXN0aWMlMjBqYWNrZXR8ZW58MHx8MHx8fDA%3D', description: 'Sleek, agile, and deploys in seconds. Inspired by the iconic Mark V armor.', basePrice: 499.99, category: 'Jackets', styleLine: 'Mark Series', releaseDate: '2024-07-15T10:00:00Z' },
  { id: '2', slug: 'repulsor-tech-gauntlets', name: 'Repulsor Tech Gauntlets', imageUrl: 'https://images.unsplash.com/photo-1617294094243-0d7a915c10e5?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnV0dXJpc3RpYyUyMGdhdW50bGV0fGVufDB8fDB8fHww', description: 'Channel energy with these high-tech gauntlets, featuring integrated repulsor designs.', basePrice: 199.50, category: 'Accessories', styleLine: 'Repulsor Tech', releaseDate: '2024-06-20T10:00:00Z' },
  { id: '3', slug: 'arc-reactor-chestplate', name: 'Arc Reactor Training Vest', imageUrl: 'https://images.unsplash.com/photo-1551028822-e2f01e088320?q=80&w=600&auto=format&fit=crop', description: 'Lightweight vest with an illuminated Arc Reactor emblem. Perfect for training simulations.', basePrice: 249.00, category: 'Apparel', styleLine: 'Arc Reactor Series', releaseDate: '2024-05-10T10:00:00Z' },
  { id: '4', slug: 'stealth-mode-hoodie', name: 'Stealth Mode Tactical Hoodie', imageUrl: 'https://images.unsplash.com/photo-1576680600090-9d4a230f8e83?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dGFjdGljYWwlMjBob29kaWV8ZW58MHx8MHx8fDA%3D', description: 'Adaptive camouflage patterns and thermal regulation for covert operations.', basePrice: 320.00, category: 'Apparel', styleLine: 'Stealth Series', releaseDate: '2024-08-01T10:00:00Z' },
  { id: '5', slug: 'iron-legion-helmet', name: 'Iron Legion Drone Pilot Helmet', imageUrl: 'https://images.unsplash.com/photo-1519735777090-ec97162dc260?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnV0dXJpc3RpYyUyMGhlbG1ldHxlbnwwfHwwfHx8MA%3D', description: 'Full-visored helmet with integrated HUD, inspired by the Iron Legion drones.', basePrice: 650.75, category: 'Helmets', styleLine: 'Iron Legion', releaseDate: '2024-03-15T10:00:00Z' },
  { id: '6', slug: 'stark-expo-collectors-jacket', name: 'Stark Expo Commemorative Jacket', imageUrl: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym9tYmVyJTIwamFja2V0fGVufDB8fDB8fHww', description: 'Limited edition jacket celebrating the legacy of Stark Expos. Classic design, modern tech.', basePrice: 399.00, category: 'Jackets', styleLine: 'Legacy Collection', releaseDate: '2024-02-28T10:00:00Z' },
  { id: '7', slug: 'nanotech-briefcase', name: 'Nanotech Deployment Briefcase', imageUrl: 'https://images.unsplash.com/photo-1585088058794-fc9971c1b6aa?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWV0YWxsaWMlMjBicmllZmNhc2V8ZW58MHx8MHx8fDA%3D', description: 'A sophisticated briefcase that hints at hidden technological marvels within. (Accessory)', basePrice: 899.99, category: 'Accessories', styleLine: 'Mark Series', releaseDate: '2024-07-25T10:00:00Z' },
  { id: '8', slug: 'extremis-infused-gloves', name: 'Extremis Infused Combat Gloves', imageUrl: 'https://images.unsplash.com/photo-1608734265335-6017c7496c5a?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3liZXJwdW5rJTIwZ2xvdmVzfGVufDB8fDB8fHww', description: 'Enhanced strength and tactile feedback. For those who like to get hands-on.', basePrice: 275.00, category: 'Accessories', styleLine: 'Extremis Program', releaseDate: '2024-08-10T10:00:00Z' },
  { id: '9', slug: 'hulkbuster-prototype-hoodie', name: 'Hulkbuster Prototype Schematic Hoodie', imageUrl: 'https://images.unsplash.com/photo-1618453292517-99940c19560a?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z3JhcGhpYyUyMGhvb2RpZXxlbnwwfHwwfHx8MA%3D', description: 'Features early concept art and schematics of the Hulkbuster armor.', basePrice: 180.00, category: 'Apparel', styleLine: 'Heavy Duty Series', releaseDate: '2024-01-20T10:00:00Z' },
];

const ITEMS_PER_PAGE = 8;
const CATEGORIES = ["Jackets", "Accessories", "Apparel", "Helmets"];
const STYLE_LINES = ["Mark Series", "Repulsor Tech", "Arc Reactor Series", "Stealth Series", "Iron Legion", "Legacy Collection", "Extremis Program", "Heavy Duty Series"];

const GalleryPage: React.FC = () => {
  console.log('GalleryPage loaded');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStyleLines, setSelectedStyleLines] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handleStyleLineChange = (styleLine: string) => {
    setSelectedStyleLines(prev =>
      prev.includes(styleLine) ? prev.filter(s => s !== styleLine) : [...prev, styleLine]
    );
    setCurrentPage(1);
  };

  const filteredAndSortedProducts = useMemo(() => {
    let products = ALL_PRODUCTS;

    if (searchTerm) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      products = products.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedStyleLines.length > 0) {
      products = products.filter(p => p.styleLine && selectedStyleLines.includes(p.styleLine));
    }

    switch (sortOption) {
      case 'newest':
        products.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
        break;
      case 'price_asc':
        products.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price_desc':
        products.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'name_asc':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        products.sort((a, b) => b.name.localeCompare(a.name));
        break;
      // 'relevance' (default) doesn't require specific sort here, could be enhanced with scoring
    }
    return products;
  }, [searchTerm, selectedCategories, selectedStyleLines, sortOption]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0); // Scroll to top on page change
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen flex flex-col">
      <GlobalHeader />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-red-500 tracking-tight uppercase">
              Suit Up, Hero
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mt-2 max-w-2xl mx-auto">
              Explore our arsenal of customizable gear. Each piece engineered for peak performance and iconic style.
            </p>
          </header>

          {/* Filters and Sort Section */}
          <section className="mb-10 p-6 bg-slate-800 rounded-lg border border-slate-700 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Search Input */}
              <div className="md:col-span-1">
                <Label htmlFor="search-gallery" className="text-sm font-medium text-amber-400 mb-1.5 block">
                  <Search className="inline h-4 w-4 mr-1.5" /> Search Blueprints
                </Label>
                <Input
                  id="search-gallery"
                  type="text"
                  placeholder="e.g., Mark V, Gauntlets..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="bg-slate-700 border-slate-600 placeholder-slate-500 text-slate-100 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Sort Select */}
              <div className="md:col-span-1">
                <Label htmlFor="sort-gallery" className="text-sm font-medium text-amber-400 mb-1.5 block">
                   <ArrowUpDown className="inline h-4 w-4 mr-1.5" /> Sort By
                </Label>
                <Select value={sortOption} onValueChange={(value) => { setSortOption(value); setCurrentPage(1); }}>
                  <SelectTrigger id="sort-gallery" className="w-full bg-slate-700 border-slate-600 text-slate-100 focus:ring-red-500 focus:border-red-500">
                    <SelectValue placeholder="Sort products" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-slate-100">
                    <SelectGroup>
                      <SelectLabel className="text-amber-400">Sort Options</SelectLabel>
                      <SelectItem value="relevance" className="hover:bg-slate-600 focus:bg-slate-600">Relevance</SelectItem>
                      <SelectItem value="newest" className="hover:bg-slate-600 focus:bg-slate-600">Newest Arrivals</SelectItem>
                      <SelectItem value="price_asc" className="hover:bg-slate-600 focus:bg-slate-600">Price: Low to High</SelectItem>
                      <SelectItem value="price_desc" className="hover:bg-slate-600 focus:bg-slate-600">Price: High to Low</SelectItem>
                      <SelectItem value="name_asc" className="hover:bg-slate-600 focus:bg-slate-600">Name: A to Z</SelectItem>
                      <SelectItem value="name_desc" className="hover:bg-slate-600 focus:bg-slate-600">Name: Z to A</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              <div className="md:col-span-1 flex items-end">
                 <Button 
                    variant="outline" 
                    onClick={() => {
                        setSearchTerm('');
                        setSelectedCategories([]);
                        setSelectedStyleLines([]);
                        setSortOption('relevance');
                        setCurrentPage(1);
                    }}
                    className="w-full text-amber-400 border-amber-500 hover:bg-amber-500 hover:text-slate-900"
                    disabled={!searchTerm && selectedCategories.length === 0 && selectedStyleLines.length === 0 && sortOption === 'relevance'}
                  >
                    <Filter className="h-4 w-4 mr-2" /> Clear All Filters
                  </Button>
              </div>
            </div>

            {/* Category Filters */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-amber-400 mb-2">Filter by Category:</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {CATEGORIES.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${category}`}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={() => handleCategoryChange(category)}
                      className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-700 border-slate-600"
                    />
                    <Label htmlFor={`cat-${category}`} className="text-sm text-slate-300 cursor-pointer hover:text-red-400">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Style Line Filters */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-amber-400 mb-2">Filter by Style Line:</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {STYLE_LINES.map(styleLine => (
                  <div key={styleLine} className="flex items-center space-x-2">
                    <Checkbox
                      id={`style-${styleLine.replace(/\s+/g, '-')}`}
                      checked={selectedStyleLines.includes(styleLine)}
                      onCheckedChange={() => handleStyleLineChange(styleLine)}
                      className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-700 border-slate-600"
                    />
                    <Label htmlFor={`style-${styleLine.replace(/\s+/g, '-')}`} className="text-sm text-slate-300 cursor-pointer hover:text-red-400">
                      {styleLine}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Product Grid */}
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {paginatedProducts.map(product => (
                <ThemedProductCard
                  key={product.id}
                  slug={product.slug}
                  name={product.name}
                  imageUrl={product.imageUrl}
                  description={product.description}
                  basePrice={product.basePrice}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-slate-400">No Blueprints Match Your Criteria</h2>
              <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
               <Button variant="link" className="mt-4 text-red-400 hover:text-red-300" onClick={() => {
                        setSearchTerm('');
                        setSelectedCategories([]);
                        setSelectedStyleLines([]);
                        setSortOption('relevance');
                        setCurrentPage(1);
                    }}>Reset Filters</Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50 text-slate-600" : "text-red-400 hover:text-red-300 hover:bg-slate-700"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                     // Basic logic to show limited page numbers: first, last, current, and neighbors.
                     // More complex logic for many pages (e.g., with ellipsis) can be added.
                     const showPage = Math.abs(page - currentPage) < 2 || page === 1 || page === totalPages;
                     const isEllipsis = Math.abs(page - currentPage) === 2 && page !== 1 && page !== totalPages;

                     if (isEllipsis && page < currentPage && currentPage > 3 && totalPages > 5) {
                        return <PaginationItem key={`ellipsis-start-${page}`}><PaginationEllipsis className="text-slate-400"/></PaginationItem>;
                     }
                     if (isEllipsis && page > currentPage && currentPage < totalPages - 2 && totalPages > 5) {
                        return <PaginationItem key={`ellipsis-end-${page}`}><PaginationEllipsis className="text-slate-400"/></PaginationItem>;
                     }

                    if(showPage) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => { e.preventDefault(); handlePageChange(page); }}
                            isActive={currentPage === page}
                            className={currentPage === page ? "bg-red-600 text-white border-red-700 hover:bg-red-500" : "text-slate-300 hover:text-red-400 hover:bg-slate-700"}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    }
                    return null;
                  })}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50 text-slate-600" : "text-red-400 hover:text-red-300 hover:bg-slate-700"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </main>
      <GlobalFooter />
    </div>
  );
};

export default GalleryPage;