// contexts/CartContext.tsx
'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type CartContextType = {
    cartId: string | null;
    sessionToken: string | null;
    setCartId: (id: string) => void;
    setSessionToken: (token: string | null) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    // 초기 상태를 로컬 스토리지에서 가져옴
    const [cartId, setCartIdState] = useState<string | null>(null);
    const [sessionToken, setSessionTokenState] = useState<string | null>(null);

    // 컴포넌트 마운트 시 로컬 스토리지에서 값 로드
    useEffect(() => {
        const storedCartId = localStorage.getItem('cartId');
        const storedToken = localStorage.getItem('sessionToken');

        if (storedCartId) setCartIdState(storedCartId);
        if (storedToken) setSessionTokenState(storedToken);
    }, []);

    // 값이 변경될 때 로컬 스토리지에 저장하는 래퍼 함수
    const setCartId = (id: string) => {
        localStorage.setItem('cartId', id);
        setCartIdState(id);
    };

    const setSessionToken = (token: string | null) => {
        if (token) {
            localStorage.setItem('sessionToken', token);
        } else {
            localStorage.removeItem('sessionToken');
        }
        setSessionTokenState(token);
    };

    return (
        <CartContext.Provider
            value={{
                cartId,
                sessionToken,
                setCartId,
                setSessionToken,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
