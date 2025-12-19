'use client';

import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
    id: string;
    title: string;
    price: number;
    image?: string;
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

    useEffect(() => {
        const localCart = localStorage.getItem('haatbazaar_cart');
        if (localCart) {
            setCart(JSON.parse(localCart));
        }
    }, []);

    useEffect(() => {
        if (cart.length > 0) {
            localStorage.setItem('haatbazaar_cart', JSON.stringify(cart));
        }
    }, [cart]);

    function addToCart(item: CartItem) {
        setCart(prev => {
            // Prevent duplicates for simplicity if needed, or allow quantity
            if (prev.find(i => i.id === item.id)) return prev;
            return [...prev, item];
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
