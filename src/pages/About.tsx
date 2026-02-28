import React from "react";
import { motion } from "motion/react";

export default function About() {
  return (
    <div className="pt-32 pb-24 bg-luxury-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.4em] font-bold text-luxury-gold">Our Heritage</p>
              <h1 className="text-6xl md:text-7xl font-serif font-light leading-tight">
                Crafting <span className="italic">Timeless</span> Legacies
              </h1>
            </div>
            
            <div className="space-y-8 text-luxury-black/70 leading-relaxed font-light text-lg">
              <p>
                Founded in 2026, The Luxury Concept was born from a singular vision: to redefine the 
                boundaries of modern living through uncompromising craftsmanship and artisanal excellence.
              </p>
              <p>
                We believe that furniture is more than just functional objects; they are the silent 
                witnesses to our most cherished moments. Every piece in our collection is a dialogue 
                between the raw beauty of nature and the precision of human artistry.
              </p>
              <p>
                From the selection of sustainably sourced solid oaks to the hand-finishing of Italian 
                velvets, our process is slow, intentional, and deeply personal. We don't just build 
                furniture; we curate environments that inspire, comfort, and endure.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-12 pt-12 border-t border-luxury-black/5">
              <div>
                <p className="text-3xl font-serif mb-2">15+</p>
                <p className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Master Artisans</p>
              </div>
              <div>
                <p className="text-3xl font-serif mb-2">100%</p>
                <p className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Hand-Finished</p>
              </div>
              <div>
                <p className="text-3xl font-serif mb-2">2026</p>
                <p className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Established</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=1000" 
              alt="Artisan at work"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-luxury-black/10" />
          </motion.div>
        </div>

        <div className="mt-48 grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-serif">Uncompromising Quality</h3>
            <p className="text-sm text-luxury-black/60 leading-relaxed">
              We source only the finest materials globally, from Carrara marble to premium Italian leathers, 
              ensuring every piece meets our rigorous standards of excellence.
            </p>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-serif">Artisanal Craft</h3>
            <p className="text-sm text-luxury-black/60 leading-relaxed">
              Our master craftsmen combine traditional techniques with modern innovation, 
              spending hundreds of hours on a single piece to achieve perfection.
            </p>
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-serif">Sustainable Vision</h3>
            <p className="text-sm text-luxury-black/60 leading-relaxed">
              Luxury should not come at the cost of our planet. We use sustainably harvested 
              woods and eco-conscious processes in every step of our production.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
