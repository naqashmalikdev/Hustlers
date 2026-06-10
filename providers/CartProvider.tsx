"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/supabase/types";

export interface CartItem {
  product: Product;
  quantity: number;
  flavor: string | null;
  size: string | null;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; productId: string; flavor: string | null; size: string | null }
  | { type: "UPDATE_QTY"; productId: string; flavor: string | null; size: string | null; quantity: number }
  | { type: "CLEAR" }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | { type: "HYDRATE"; items: CartItem[] };

function sameVariant(a: CartItem, productId: string, flavor: string | null, size: string | null) {
  return a.product.id === productId && a.flavor === flavor && a.size === size;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.items };

    case "ADD_ITEM": {
      const { item } = action;
      const existing = state.items.find((i) =>
        sameVariant(i, item.product.id, item.flavor, item.size)
      );
      if (existing) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map((i) =>
            sameVariant(i, item.product.id, item.flavor, item.size)
              ? { ...i, quantity: Math.min(i.quantity + item.quantity, 99) }
              : i
          ),
        };
      }
      return { ...state, isOpen: true, items: [...state.items, item] };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (i) => !sameVariant(i, action.productId, action.flavor, action.size)
        ),
      };

    case "UPDATE_QTY":
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) => !sameVariant(i, action.productId, action.flavor, action.size)
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          sameVariant(i, action.productId, action.flavor, action.size)
            ? { ...i, quantity: Math.min(action.quantity, 99) }
            : i
        ),
      };

    case "CLEAR":
      return { ...state, items: [] };

    case "OPEN_DRAWER":
      return { ...state, isOpen: true };

    case "CLOSE_DRAWER":
      return { ...state, isOpen: false };

    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number, flavor?: string | null, size?: string | null) => void;
  removeItem: (productId: string, flavor?: string | null, size?: string | null) => void;
  updateQty: (productId: string, quantity: number, flavor?: string | null, size?: string | null) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "ironforge_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          dispatch({ type: "HYDRATE", items: parsed });
        }
      }
    } catch {
      // ignore corrupt storage
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // ignore storage quota errors
    }
  }, [state.items]);

  const addItem = useCallback(
    (product: Product, quantity = 1, flavor: string | null = null, size: string | null = null) => {
      dispatch({ type: "ADD_ITEM", item: { product, quantity, flavor, size } });
    },
    []
  );

  const removeItem = useCallback(
    (productId: string, flavor: string | null = null, size: string | null = null) => {
      dispatch({ type: "REMOVE_ITEM", productId, flavor, size });
    },
    []
  );

  const updateQty = useCallback(
    (productId: string, quantity: number, flavor: string | null = null, size: string | null = null) => {
      dispatch({ type: "UPDATE_QTY", productId, flavor, size, quantity });
    },
    []
  );

  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const openCart = useCallback(() => dispatch({ type: "OPEN_DRAWER" }), []);
  const closeCart = useCallback(() => dispatch({ type: "CLOSE_DRAWER" }), []);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items: state.items, isOpen: state.isOpen, itemCount, subtotal, addItem, removeItem, updateQty, clear, openCart, closeCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
