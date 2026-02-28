import React, { useState } from "react";
import { motion } from "motion/react";
import { Send, CheckCircle2 } from "lucide-react";

export default function Bespeak() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="pt-32 pb-24 bg-luxury-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12 sticky top-32"
          >
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.4em] font-bold text-luxury-gold">Bespeak Service</p>
              <h1 className="text-6xl md:text-7xl font-serif font-light leading-tight">
                Your <span className="italic">Vision</span>, Our Craft
              </h1>
            </div>
            
            <div className="space-y-8 text-luxury-black/70 leading-relaxed font-light text-lg">
              <p>
                Our Bespeak Service is an invitation to collaborate directly with our master artisans 
                to create a piece of furniture that is uniquely yours.
              </p>
              <p>
                Whether it's a modification of an existing design or a completely new concept, 
                we bring your vision to life with the same uncompromising quality and attention 
                to detail that defines our collection.
              </p>
              <ul className="space-y-4 pt-6">
                <li className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 bg-luxury-gold rounded-full" /> Custom Dimensions
                </li>
                <li className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 bg-luxury-gold rounded-full" /> Exclusive Material Selection
                </li>
                <li className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 bg-luxury-gold rounded-full" /> Personalized Finishes
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-12 rounded-3xl shadow-xl"
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif">Start Your Journey</h3>
                  <p className="text-sm text-luxury-black/40">Tell us about your bespoke project</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Full Name</label>
                    <input required className="w-full border-b border-luxury-black/10 py-3 focus:outline-none focus:border-luxury-gold transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Email Address</label>
                    <input required type="email" className="w-full border-b border-luxury-black/10 py-3 focus:outline-none focus:border-luxury-gold transition-colors" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Project Type</label>
                  <select className="w-full border-b border-luxury-black/10 py-3 focus:outline-none focus:border-luxury-gold transition-colors bg-transparent">
                    <option>Living Room Piece</option>
                    <option>Dining Table</option>
                    <option>Bedroom Furniture</option>
                    <option>Office Solution</option>
                    <option>Full Interior Project</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Project Description</label>
                  <textarea rows={4} className="w-full border-b border-luxury-black/10 py-3 focus:outline-none focus:border-luxury-gold transition-colors resize-none" placeholder="Describe your vision, dimensions, and preferred materials..." />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Budget Range (₹)</label>
                  <input className="w-full border-b border-luxury-black/10 py-3 focus:outline-none focus:border-luxury-gold transition-colors" placeholder="e.g. 5,00,000 - 10,00,000" />
                </div>

                <button type="submit" className="w-full bg-luxury-black text-white py-5 rounded-full uppercase tracking-[0.2em] text-xs font-bold flex items-center justify-center gap-3 hover:bg-luxury-gold transition-all duration-500">
                  Submit Inquiry <Send size={14} />
                </button>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-20 text-center space-y-8"
              >
                <div className="flex justify-center">
                  <CheckCircle2 size={64} className="text-emerald-500" strokeWidth={1} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-serif">Inquiry Received</h3>
                  <p className="text-luxury-black/60 leading-relaxed">
                    Thank you for your interest in our Bespeak Service. A design consultant will 
                    review your project and contact you within 48 hours to discuss the next steps.
                  </p>
                </div>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-luxury-gold uppercase tracking-widest text-xs font-bold hover:text-luxury-black transition-colors"
                >
                  Send another inquiry
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
