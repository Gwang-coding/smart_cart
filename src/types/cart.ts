// types/cart.ts
export interface Cart {
    id: number;
    createdAt: Date;
}

export interface CartAccess {
    token: string;
    cartId: number;
    createdAt: Date;
    expiresAt: Date;
    isUsed: boolean;
}

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}
