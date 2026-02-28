import React, { useState, useEffect, useRef } from "react";
import { X, Plus, Edit2, Trash2, Save, ShoppingBag, Package, Upload, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "../types";

interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  status: string;
  created_at: string;
  items_summary: string;
}

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onProductsChange: () => void;
}

export default function AdminDashboard({ isOpen, onClose, onProductsChange }: AdminDashboardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const fetchOrders = async () => {
    const res = await fetch("/api/admin/orders", {
      headers: { "x-admin-key": adminKey }
    });
    if (res.ok) {
      const data = await res.json();
      setOrders(data);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      if (activeTab === "products") fetchProducts();
      if (activeTab === "orders") fetchOrders();
    }
  }, [isOpen, isAuthenticated, activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey === "luxury-admin-2026") {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
      setAdminKey("");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct(prev => ({ ...prev, image_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const method = editingProduct.id ? "PUT" : "POST";
    const url = editingProduct.id 
      ? `/api/admin/products/${editingProduct.id}` 
      : "/api/admin/products";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey
      },
      body: JSON.stringify(editingProduct)
    });

    if (res.ok) {
      setEditingProduct(null);
      fetchProducts();
      onProductsChange();
    } else {
      alert("Failed to save product");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const res = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey }
    });

    if (res.ok) {
      fetchProducts();
      onProductsChange();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-luxury-black/80 backdrop-blur-xl"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-6xl h-full md:h-[85vh] bg-luxury-cream md:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-4 md:p-8 border-b border-luxury-black/5 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-12">
            <h2 className="text-base md:text-2xl uppercase tracking-widest font-light text-luxury-black/80">Owner Dashboard</h2>
            {isAuthenticated && (
              <div className="flex bg-luxury-black/5 p-1 rounded-lg self-start md:self-auto">
                <button 
                  onClick={() => setActiveTab("products")}
                  className={`px-4 py-1.5 text-[10px] md:text-xs uppercase tracking-widest font-bold transition-all rounded-md ${activeTab === "products" ? "bg-white text-luxury-gold shadow-sm" : "text-luxury-black/40 hover:text-luxury-black"}`}
                >
                  Products
                </button>
                <button 
                  onClick={() => setActiveTab("orders")}
                  className={`px-4 py-1.5 text-[10px] md:text-xs uppercase tracking-widest font-bold transition-all rounded-md ${activeTab === "orders" ? "bg-white text-luxury-gold shadow-sm" : "text-luxury-black/40 hover:text-luxury-black"}`}
                >
                  Orders
                </button>
              </div>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-luxury-black/5 rounded-full transition-colors">
            <X size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6 text-center">
              <div className="space-y-4">
                <p className="text-sm text-luxury-black/60 font-serif italic">Please enter your secure access key</p>
                {loginError && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] uppercase tracking-widest font-bold text-red-500"
                  >
                    Incorrect Access Key
                  </motion.p>
                )}
              </div>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => {
                  setAdminKey(e.target.value);
                  if (loginError) setLoginError(false);
                }}
                className={`w-full bg-white border rounded-xl px-6 py-4 text-center focus:outline-none transition-colors ${loginError ? "border-red-500" : "border-luxury-black/10 focus:border-luxury-gold"}`}
                placeholder="Admin Access Key"
              />
              <button type="submit" className="w-full bg-luxury-black text-white py-4 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-luxury-gold transition-colors">
                Access Dashboard
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            {activeTab === "products" ? (
              <div className="h-full flex flex-col md:flex-row">
                {/* Product List */}
                <div className={`w-full md:w-1/3 border-b md:border-b-0 md:border-r border-luxury-black/5 overflow-y-auto p-4 md:p-6 space-y-4 ${editingProduct ? 'hidden md:block' : 'block'}`}>
                  <button 
                    onClick={() => setEditingProduct({})}
                    className="w-full py-4 border-2 border-dashed border-luxury-black/10 rounded-xl flex items-center justify-center gap-2 text-luxury-black/40 hover:text-luxury-gold hover:border-luxury-gold transition-all"
                  >
                    <Plus size={18} /> Add New Product
                  </button>
                  {products.map(p => (
                    <div key={p.id} className="group p-4 bg-white rounded-xl border border-luxury-black/5 flex justify-between items-center hover:shadow-md transition-shadow">
                      <div className="truncate pr-4">
                        <p className="text-[10px] font-bold text-luxury-gold uppercase tracking-tighter">{p.category}</p>
                        <p className="font-serif truncate text-sm md:text-base">{p.name}</p>
                      </div>
                      <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingProduct(p)} className="p-2 hover:text-luxury-gold"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Editor */}
                <div className={`flex-1 overflow-y-auto p-4 md:p-8 ${editingProduct ? 'block' : 'hidden md:flex md:items-center md:justify-center'}`}>
                  {editingProduct ? (
                    <form onSubmit={handleSave} className="space-y-6">
                      <div className="flex items-center justify-between md:hidden mb-4">
                        <button 
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40 flex items-center gap-2"
                        >
                          <X size={14} /> Cancel Edit
                        </button>
                        <h3 className="text-xs uppercase tracking-widest font-bold text-luxury-gold">
                          {editingProduct.id ? "Edit Product" : "New Product"}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Product Name</label>
                          <input
                            required
                            value={editingProduct.name || ""}
                            onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                            className="w-full bg-white border border-luxury-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-luxury-gold"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Category</label>
                          <select
                            value={editingProduct.category || ""}
                            onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                            className="w-full bg-white border border-luxury-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-luxury-gold"
                          >
                            <option value="">Select Category</option>
                            <option value="Living Room">Living Room</option>
                            <option value="Bedroom">Bedroom</option>
                            <option value="Dining Room">Dining Room</option>
                            <option value="Office">Office</option>
                            <option value="Decor">Decor</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Description</label>
                        <textarea
                          rows={3}
                          value={editingProduct.description || ""}
                          onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                          className="w-full bg-white border border-luxury-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-luxury-gold"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Price (₹)</label>
                          <input
                            type="number"
                            value={editingProduct.price || ""}
                            onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                            className="w-full bg-white border border-luxury-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-luxury-gold"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Dimensions</label>
                          <input
                            value={editingProduct.dimensions || ""}
                            onChange={e => setEditingProduct({...editingProduct, dimensions: e.target.value})}
                            className="w-full bg-white border border-luxury-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-luxury-gold"
                            placeholder="e.g. 200x100x75 cm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Materials</label>
                          <input
                            value={editingProduct.materials || ""}
                            onChange={e => setEditingProduct({...editingProduct, materials: e.target.value})}
                            className="w-full bg-white border border-luxury-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-luxury-gold"
                            placeholder="e.g. Oak, Velvet"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Fabrics</label>
                          <input
                            value={editingProduct.fabrics || ""}
                            onChange={e => setEditingProduct({...editingProduct, fabrics: e.target.value})}
                            className="w-full bg-white border border-luxury-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-luxury-gold"
                            placeholder="e.g. Italian Velvet"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Additional Images (Comma separated)</label>
                          <input
                            value={editingProduct.additional_images || ""}
                            onChange={e => setEditingProduct({...editingProduct, additional_images: e.target.value})}
                            className="w-full bg-white border border-luxury-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-luxury-gold"
                            placeholder="URL1, URL2, ..."
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Product Image</label>
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                          <div className="w-full md:w-32 h-48 md:h-32 rounded-xl border border-luxury-black/10 overflow-hidden bg-white flex items-center justify-center relative group">
                            {editingProduct.image_url ? (
                              <img src={editingProduct.image_url} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <ImageIcon className="text-luxury-black/10" size={32} />
                            )}
                            <button 
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="absolute inset-0 bg-luxury-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                            >
                              <Upload size={20} />
                            </button>
                          </div>
                          <div className="flex-1 w-full space-y-4">
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleImageUpload}
                              accept="image/*"
                              className="hidden"
                            />
                            <div className="space-y-2">
                              <p className="text-[10px] text-luxury-black/40">OR PASTE URL</p>
                              <input
                                value={editingProduct.image_url || ""}
                                onChange={e => setEditingProduct({...editingProduct, image_url: e.target.value})}
                                className="w-full bg-white border border-luxury-black/10 rounded-xl px-4 py-3 focus:outline-none focus:border-luxury-gold"
                                placeholder="https://..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <button type="submit" className="w-full bg-luxury-gold text-white py-4 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-luxury-black transition-colors flex items-center justify-center gap-2">
                        <Save size={18} /> {editingProduct.id ? "Update Product" : "Create Product"}
                      </button>
                    </form>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-luxury-black/20 space-y-4">
                      <Edit2 size={64} strokeWidth={0.5} />
                      <p className="font-serif italic text-xl text-center">Select a product to edit or create a new one</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full overflow-y-auto p-4 md:p-8">
                {orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map(order => (
                      <div key={order.id} className="bg-white rounded-2xl border border-luxury-black/5 p-4 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold mb-1">Order #{order.id}</p>
                            <h3 className="text-lg md:text-xl font-serif">{order.customer_name}</h3>
                            <p className="text-xs md:text-sm text-luxury-black/60">{new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}</p>
                          </div>
                        <div className="md:text-right w-full md:w-auto flex justify-between md:flex-col md:items-end items-center gap-2">
                            <p className="text-lg md:text-2xl font-light">₹{order.total_amount.toLocaleString()}</p>
                            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] uppercase tracking-widest font-bold">
                              {order.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pt-6 border-t border-luxury-black/5">
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Contact</p>
                            <p className="text-sm break-all font-medium">{order.customer_name}</p>
                            <p className="text-sm break-all text-luxury-black/60">{order.customer_email}</p>
                            <p className="text-sm text-luxury-black/60">{order.customer_phone}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Shipping Address</p>
                            <p className="text-sm leading-relaxed text-luxury-black/80">{order.customer_address}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-luxury-black/40">Items Summary</p>
                            <p className="text-sm italic text-luxury-black/60 bg-luxury-black/5 p-3 rounded-lg">{order.items_summary}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-luxury-black/20 space-y-4">
                    <ShoppingBag size={64} strokeWidth={0.5} />
                    <p className="font-serif italic text-xl">No orders received yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
