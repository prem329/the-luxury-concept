import React from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "../types";
import { motion } from "motion/react";
import { Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  key?: React.Key;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="aspect-[3/4] overflow-hidden bg-white/50 rounded-2xl border border-luxury-black/5 relative">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-luxury-black/0 group-hover:bg-luxury-black/10 transition-colors duration-500" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            {product.dimensions && (
              <p className="text-[10px] uppercase tracking-widest text-luxury-black/60">
                <span className="font-bold">Dimensions:</span> {product.dimensions}
              </p>
            )}
            {product.materials && (
              <p className="text-[10px] uppercase tracking-widest text-luxury-black/60">
                <span className="font-bold">Materials:</span> {product.materials}
              </p>
            )}
          </div>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 hover:bg-luxury-gold hover:text-white pointer-events-auto z-10"
        >
          <Plus size={24} strokeWidth={1.5} />
        </button>
      </div>

      <div className="mt-6 flex justify-between items-start">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-luxury-black/40 font-semibold mb-1">
            {product.category}
          </p>
          <h3 className="text-xl font-serif font-light tracking-wide group-hover:text-luxury-gold transition-colors">
            {product.name}
          </h3>
        </div>
        <p className="text-lg font-light tracking-tight">
          ₹{product.price.toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
}
