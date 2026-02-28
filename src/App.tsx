import React, { useState, useEffect, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";
import CheckoutModal from "./components/CheckoutModal";
import AdminDashboard from "./components/AdminDashboard";
import ProductDetail from "./components/ProductDetail";
import About from "./pages/About";
import Bespeak from "./pages/Bespeak";
import { Product, CartItem } from "./types";
import { ArrowRight, Search, Settings } from "lucide-react";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function HomePage({ products, addToCart }: { products: Product[], addToCart: (p: Product) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Living Room", "Bedroom", "Dining Room", "Office", "Decor"];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, activeCategory]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Interior"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-luxury-black/30" />
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.4em] font-bold mb-6"
          >
            Est. 2026 — The Art of Living
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-serif font-light mb-8 leading-tight"
          >
            Curated <span className="italic">Elegance</span> for Modern Spaces
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <button 
              onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-luxury-black px-10 py-5 rounded-full uppercase tracking-[0.2em] text-xs font-bold flex items-center gap-3 hover:bg-luxury-gold hover:text-white transition-all duration-500"
            >
              Explore Collection <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Collection Grid */}
      <section id="collection" className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="max-w-xl">
            <h2 className="text-5xl font-serif font-light mb-6">The 2026 Collection</h2>
            <p className="text-luxury-black/60 leading-relaxed">
              Discover our latest curation of artisanal furniture, where traditional craftsmanship 
              meets contemporary vision. Each piece is a testament to the luxury of simplicity.
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-black/40" size={18} />
            <input 
              type="text"
              placeholder="Search pieces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-luxury-black/10 rounded-full pl-12 pr-6 py-4 focus:outline-none focus:border-luxury-gold transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-xs uppercase tracking-widest font-bold mb-16 border-b border-luxury-black/5 pb-6">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`transition-all pb-1 border-b-2 ${
                activeCategory === cat 
                  ? "text-luxury-gold border-luxury-gold" 
                  : "text-luxury-black/40 border-transparent hover:text-luxury-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart} 
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4">
            <p className="font-serif italic text-2xl text-luxury-black/40">No pieces found matching your criteria</p>
            <button 
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="text-luxury-gold uppercase tracking-widest text-xs font-bold hover:text-luxury-black transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </>
  );
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) return;
    setWaitlistStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: waitlistEmail })
      });
      if (res.ok) {
        setWaitlistStatus("success");
        setWaitlistEmail("");
        setTimeout(() => setWaitlistStatus("idle"), 3000);
      } else {
        setWaitlistStatus("error");
      }
    } catch (error) {
      setWaitlistStatus("error");
    }
  };

  const fetchProducts = () => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen">
        <Navbar cartCount={cart.reduce((s, i) => s + i.quantity, 0)} onOpenCart={() => setIsCartOpen(true)} />
        
        <Cart 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          items={cart} 
          onUpdateQuantity={updateQuantity}
          onCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
        />

        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          items={cart}
          onOrderComplete={clearCart}
        />

        <AdminDashboard 
          isOpen={isAdminOpen} 
          onClose={() => setIsAdminOpen(false)} 
          onProductsChange={fetchProducts}
        />

        <Routes>
          <Route path="/" element={<HomePage products={products} addToCart={addToCart} />} />
          <Route path="/product/:id" element={<ProductDetail onAddToCart={addToCart} />} />
          <Route path="/about" element={<About />} />
          <Route path="/bespeak" element={<Bespeak />} />
        </Routes>

        {/* Footer */}
        <footer className="bg-luxury-black text-white py-24 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="md:col-span-2 space-y-8">
              <h2 className="text-3xl tracking-[0.3em] uppercase font-light">
                Luxury <span className="font-serif italic lowercase tracking-normal">Concept</span>
              </h2>
              <p className="text-white/40 max-w-sm leading-relaxed">
                Crafting timeless environments through exceptional design and uncompromising quality. 
                Join our exclusive circle for early access to new collections.
              </p>
              <form onSubmit={handleWaitlistSubmit} className="flex gap-4">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  required
                  className="bg-transparent border-b border-white/20 py-2 flex-1 focus:outline-none focus:border-luxury-gold transition-colors"
                />
                <button 
                  type="submit"
                  disabled={waitlistStatus === "loading"}
                  className="uppercase text-[10px] tracking-widest font-bold hover:text-luxury-gold transition-colors disabled:opacity-50"
                >
                  {waitlistStatus === "loading" ? "Joining..." : waitlistStatus === "success" ? "Joined" : waitlistStatus === "error" ? "Error" : "Join"}
                </button>
              </form>
            </div>
            
            <div className="space-y-6">
              <h4 className="uppercase text-[10px] tracking-widest font-bold text-white/40">Navigation</h4>
              <ul className="space-y-4 text-sm font-light">
                <li><a href="/#collection" className="hover:text-luxury-gold transition-colors">Collections</a></li>
                <li><a href="/bespeak" className="hover:text-luxury-gold transition-colors">Bespeak Service</a></li>
                <li><a href="/about" className="hover:text-luxury-gold transition-colors">Our Story</a></li>
                <li><button onClick={() => setIsAdminOpen(true)} className="flex items-center gap-2 hover:text-luxury-gold transition-colors">
                  <Settings size={14} /> Owner Login
                </button></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="uppercase text-[10px] tracking-widest font-bold text-white/40">Connect</h4>
              <ul className="space-y-4 text-sm font-light">
                <li><a href="#" className="hover:text-luxury-gold transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-luxury-gold transition-colors">Pinterest</a></li>
                <li><a href="#" className="hover:text-luxury-gold transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-6 text-[10px] uppercase tracking-widest text-white/40 font-bold">
            <p>© 2026 The Luxury Concept. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
