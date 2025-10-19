export interface Product {
  id: number;
  name: string;
  price: number;
  discount?: number;
  description: string;
  longDescription?: string;
  images: string[];
  category: string;
  variants?: ProductVariant[];
  reviews?: ProductReview[];
  inStock: boolean;
  stock?: number;
}

export interface ProductVariant {
  id: number;
  name: string;
  options: string[];
}

export interface ProductReview {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant: string;
  selectedOptions?: Record<string, string>;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface PaymentMethod {
  type: "card" | "paypal" | "cod";
  cardDetails?: {
    number: string;
    name: string;
    expiry: string;
    cvc: string;
  };
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  summary: OrderSummary;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface CustomDeleteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  action: () => void;
}
