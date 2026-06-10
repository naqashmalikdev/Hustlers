export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: "customer" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "customer" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "customer" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          brand: string;
          description: string | null;
          category: "protein" | "pre-workout" | "recovery" | "vitamins" | "apparel" | "equipment";
          price: number;
          compare_at_price: number | null;
          weight: string | null;
          images: string[];
          flavors: string[];
          sizes: string[];
          stock_quantity: number;
          is_active: boolean;
          slug: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          brand: string;
          description?: string | null;
          category: "protein" | "pre-workout" | "recovery" | "vitamins" | "apparel" | "equipment";
          price: number;
          compare_at_price?: number | null;
          weight?: string | null;
          images?: string[];
          flavors?: string[];
          sizes?: string[];
          stock_quantity?: number;
          is_active?: boolean;
          slug: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          brand?: string;
          description?: string | null;
          category?: "protein" | "pre-workout" | "recovery" | "vitamins" | "apparel" | "equipment";
          price?: number;
          compare_at_price?: number | null;
          weight?: string | null;
          images?: string[];
          flavors?: string[];
          sizes?: string[];
          stock_quantity?: number;
          is_active?: boolean;
          slug?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          type: "percentage" | "fixed";
          value: number;
          min_order_amount: number;
          max_uses: number | null;
          uses_count: number;
          expires_at: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          type: "percentage" | "fixed";
          value: number;
          min_order_amount?: number;
          max_uses?: number | null;
          uses_count?: number;
          expires_at?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          type?: "percentage" | "fixed";
          value?: number;
          min_order_amount?: number;
          max_uses?: number | null;
          uses_count?: number;
          expires_at?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          guest_email: string | null;
          guest_name: string | null;
          guest_phone: string | null;
          status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
          subtotal: number;
          discount_amount: number;
          shipping_amount: number;
          total: number;
          coupon_id: string | null;
          shipping_address: Json;
          payment_method: string;
          payment_status: "pending" | "paid" | "failed" | "refunded";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          user_id?: string | null;
          guest_email?: string | null;
          guest_name?: string | null;
          guest_phone?: string | null;
          status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
          subtotal: number;
          discount_amount?: number;
          shipping_amount?: number;
          total: number;
          coupon_id?: string | null;
          shipping_address: Json;
          payment_method?: string;
          payment_status?: "pending" | "paid" | "failed" | "refunded";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          user_id?: string | null;
          guest_email?: string | null;
          guest_name?: string | null;
          guest_phone?: string | null;
          status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
          subtotal?: number;
          discount_amount?: number;
          shipping_amount?: number;
          total?: number;
          coupon_id?: string | null;
          shipping_address?: Json;
          payment_method?: string;
          payment_status?: "pending" | "paid" | "failed" | "refunded";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          flavor: string | null;
          size: string | null;
          subtotal: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          flavor?: string | null;
          size?: string | null;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
          flavor?: string | null;
          size?: string | null;
          subtotal?: number;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          rating: number;
          title: string | null;
          body: string | null;
          is_verified_purchase: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id: string;
          rating: number;
          title?: string | null;
          body?: string | null;
          is_verified_purchase?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string;
          rating?: number;
          title?: string | null;
          body?: string | null;
          is_verified_purchase?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string | null;
          full_name: string;
          phone: string;
          address_line1: string;
          address_line2: string | null;
          city: string;
          province: string;
          postal_code: string | null;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label?: string | null;
          full_name: string;
          phone: string;
          address_line1: string;
          address_line2?: string | null;
          city: string;
          province: string;
          postal_code?: string | null;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          label?: string | null;
          full_name?: string;
          phone?: string;
          address_line1?: string;
          address_line2?: string | null;
          city?: string;
          province?: string;
          postal_code?: string | null;
          is_default?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      generate_order_number: {
        Args: Record<string, never>;
        Returns: string;
      };
      get_product_avg_rating: {
        Args: { product_uuid: string };
        Returns: number;
      };
    };
    Enums: {
      user_role: "customer" | "admin";
      product_category: "protein" | "pre-workout" | "recovery" | "vitamins" | "apparel" | "equipment";
      order_status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
      payment_status: "pending" | "paid" | "failed" | "refunded";
      coupon_type: "percentage" | "fixed";
    };
  };
};

// Convenience aliases
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Coupon = Database["public"]["Tables"]["coupons"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Address = Database["public"]["Tables"]["addresses"]["Row"];

export type ProductCategory = Database["public"]["Enums"]["product_category"];
export type OrderStatus = Database["public"]["Enums"]["order_status"];
export type PaymentStatus = Database["public"]["Enums"]["payment_status"];
export type CouponType = Database["public"]["Enums"]["coupon_type"];
export type UserRole = Database["public"]["Enums"]["user_role"];

// Order with joined data
export type OrderWithItems = Order & {
  order_items: (OrderItem & { products: Product })[];
  profiles: Profile | null;
};
