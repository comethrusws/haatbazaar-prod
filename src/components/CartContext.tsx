'use client';

import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
    id: string;
    title: string;
    price: number;
    image?: string;
    location?: { lat: number; lng: number };
    quantity?: number;
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    cartOpen: boolean;
    setCartOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const localCart = localStorage.getItem('haatbazaar_cart');
        if (localCart) {
            try {
                setCart(JSON.parse(localCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (!isInitialized) return;
        localStorage.setItem('haatbazaar_cart', JSON.stringify(cart));
    }, [cart, isInitialized]);

    function addToCart(item: CartItem) {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id
                    ? { ...i, quantity: (i.quantity || 1) + (item.quantity || 1) }
                    : i
                );
            }
            return [...prev, { ...item, quantity: item.quantity || 1 }];
        });
        setCartOpen(true);
    }

    function removeFromCart(id: string) {
        setCart(prev => prev.filter(item => item.id !== id));
    }

    function clearCart() {
        setCart([]);
        localStorage.removeItem('haatbazaar_cart');
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartOpen, setCartOpen }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
