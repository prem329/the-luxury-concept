export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  dimensions?: string;
  materials?: string;
  fabrics?: string;
  additional_images?: string; // Comma separated URLs
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  items: CartItem[];
  total_amount: number;
}
