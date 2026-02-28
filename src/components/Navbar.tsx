import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

export default function Navbar({ cartCount, onOpenCart }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-luxury-cream/80 backdrop-blur-md border-b border-luxury-black/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button 
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium">
            <a href="/#collection" className="hover:text-luxury-gold transition-colors">Collections</a>
            <a href="/bespeak" className="hover:text-luxury-gold transition-colors">Bespeak</a>
            <a href="/about" className="hover:text-luxury-gold transition-colors">About</a>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-2xl tracking-[0.3em] uppercase font-light">
            Luxury <span className="font-serif italic lowercase tracking-normal">Concept</span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={onOpenCart}
            className="relative p-2 hover:text-luxury-gold transition-colors"
          >
            <ShoppingBag size={24} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-luxury-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-luxury-cream border-b border-luxury-black/5 px-6 py-8 flex flex-col gap-6 text-xs uppercase tracking-[0.2em] font-medium"
          >
            <a href="/#collection" onClick={() => setIsMenuOpen(false)}>Collections</a>
            <a href="/bespeak" onClick={() => setIsMenuOpen(false)}>Bespeak</a>
            <a href="/about" onClick={() => setIsMenuOpen(false)}>About</a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
