import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CartItem } from "../types";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onCheckout: () => void;
}

export default function Cart({ isOpen, onClose, items, onUpdateQuantity, onCheckout }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-luxury-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-luxury-cream z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-8 flex items-center justify-between border-b border-luxury-black/5">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} />
                <h2 className="text-xl uppercase tracking-widest font-light">Your Selection</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:rotate-90 transition-transform duration-300">
                <X size={24} strokeWidth={1} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-luxury-black/40 space-y-4">
                  <ShoppingBag size={48} strokeWidth={0.5} />
                  <p className="font-serif italic text-lg">Your collection is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-6">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-white border border-luxury-black/5">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-lg mb-1">{item.name}</h3>
                      <p className="text-sm text-luxury-black/60 mb-4">₹{item.price.toLocaleString()}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-luxury-black/10 rounded-full px-3 py-1 gap-4">
                          <button onClick={() => onUpdateQuantity(item.id, -1)} className="hover:text-luxury-gold">
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.id, 1)} className="hover:text-luxury-gold">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-8 bg-white border-t border-luxury-black/5 space-y-6">
                <div className="flex justify-between items-end">
                  <p className="text-xs uppercase tracking-widest text-luxury-black/40 font-semibold">Subtotal</p>
                  <p className="text-2xl font-light tracking-tight">₹{total.toLocaleString()}</p>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full bg-luxury-black text-white py-5 rounded-full uppercase tracking-[0.2em] text-xs font-bold hover:bg-luxury-gold transition-colors duration-500"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
