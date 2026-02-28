import React, { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CartItem, OrderData } from "../types";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderComplete: () => void;
}

export default function CheckoutModal({ isOpen, onClose, items, onOrderComplete }: CheckoutModalProps) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderData: OrderData = {
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      customer_address: formData.address,
      items,
      total_amount: total
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onOrderComplete();
          onClose();
          setIsSuccess(false);
          setFormData({ name: "", email: "", phone: "", address: "" });
        }, 3000);
      }
    } catch (error) {
      console.error("Order failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-luxury-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-luxury-cream rounded-3xl shadow-2xl overflow-hidden"
          >
            {isSuccess ? (
              <div className="p-12 text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto"
                >
                  <CheckCircle2 size={40} />
                </motion.div>
                <h2 className="text-3xl font-serif">Order Received</h2>
                <p className="text-luxury-black/60">
                  Thank you for choosing The Luxury Concept. <br />
                  Our concierge will contact you shortly.
                </p>
              </div>
            ) : (
              <div className="p-8 md:p-12 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl uppercase tracking-widest font-light">Finalize Order</h2>
                  <button onClick={onClose} className="p-2 hover:rotate-90 transition-transform">
                    <X size={24} strokeWidth={1} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Full Name</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white border border-luxury-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Email Address</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white border border-luxury-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Phone Number</label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-luxury-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Delivery Address</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-white border border-luxury-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-luxury-gold transition-colors"
                      placeholder="Enter your full address"
                    />
                  </div>

                  <div className="pt-4 border-t border-luxury-black/5">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xs uppercase tracking-widest text-luxury-black/40 font-semibold">Total Amount</span>
                      <span className="text-2xl font-light">₹{total.toLocaleString()}</span>
                    </div>
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full bg-luxury-black text-white py-5 rounded-full uppercase tracking-[0.2em] text-xs font-bold hover:bg-luxury-gold transition-colors duration-500 disabled:opacity-50"
                    >
                      {isSubmitting ? "Processing..." : "Confirm Order"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
