import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Plus, Minus, ShoppingBag, Ruler, Info, Layers } from "lucide-react";
import { Product } from "../types";

interface ProductDetailProps {
  onAddToCart: (product: Product) => void;
}

export default function ProductDetail({ onAddToCart }: ProductDetailProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setActiveImage(data.image_url);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
      <h2 className="text-4xl font-serif">Piece not found</h2>
      <button onClick={() => navigate("/")} className="text-luxury-gold uppercase tracking-widest text-xs font-bold">Return to Collection</button>
    </div>
  );

  const additionalImages = product.additional_images ? product.additional_images.split(",") : [];
  const allImages = [product.image_url, ...additionalImages];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <button 
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-luxury-black/40 hover:text-luxury-black transition-colors mb-12 uppercase tracking-widest text-[10px] font-bold"
      >
        <ArrowLeft size={16} /> Back to Collection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Image Gallery */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div 
            layoutId={`product-image-${product.id}`}
            className="aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-luxury-black/5"
          >
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="grid grid-cols-4 gap-4">
            {allImages.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? "border-luxury-gold" : "border-transparent opacity-60 hover:opacity-100"}`}
              >
                <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-bold">{product.category}</p>
            <h1 className="text-5xl md:text-6xl font-serif font-light leading-tight">{product.name}</h1>
            <p className="text-3xl font-light tracking-tight">₹{product.price.toLocaleString()}</p>
          </div>

          <p className="text-luxury-black/60 leading-relaxed text-lg font-light">
            {product.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-luxury-black/5">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl border border-luxury-black/5">
                <Ruler size={20} className="text-luxury-gold" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40 mb-1">Dimensions</p>
                <p className="text-sm">{product.dimensions || "Contact for details"}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl border border-luxury-black/5">
                <Layers size={20} className="text-luxury-gold" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40 mb-1">Materials</p>
                <p className="text-sm">{product.materials || "Natural finishes"}</p>
              </div>
            </div>
            {product.fabrics && (
              <div className="flex items-start gap-4 md:col-span-2">
                <div className="p-3 bg-white rounded-xl border border-luxury-black/5">
                  <Info size={20} className="text-luxury-gold" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40 mb-1">Fabric Details</p>
                  <p className="text-sm">{product.fabrics}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-8">
              <div className="flex items-center border border-luxury-black/10 rounded-full px-6 py-3 gap-8">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="hover:text-luxury-gold transition-colors">
                  <Minus size={18} />
                </button>
                <span className="text-lg font-medium w-6 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="hover:text-luxury-gold transition-colors">
                  <Plus size={18} />
                </button>
              </div>
              <p className="text-sm text-luxury-black/40 italic">In stock and ready for delivery</p>
            </div>

            <button 
              onClick={() => {
                for(let i=0; i<quantity; i++) onAddToCart(product);
              }}
              className="w-full bg-luxury-black text-white py-6 rounded-full uppercase tracking-[0.2em] text-xs font-bold hover:bg-luxury-gold transition-all duration-500 flex items-center justify-center gap-3 shadow-xl hover:shadow-luxury-gold/20"
            >
              <ShoppingBag size={18} /> Add to Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
