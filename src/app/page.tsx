'use client';
import { useState } from 'react';
import Top from '@/components/Top';
import ShoppingCart from '@/container/ShoppingCart';
import SearchProduct from '@/container/SearchProduct';
import CheckInventory from '@/container/CheckInventory';
import QR from '@/container/QR';
interface CartPageProps {
    params: {
        id: string;
    };
    searchParams: {
        token: string;
    };
}
export default function Home({ params, searchParams }: CartPageProps) {
    const [activeComponent, setActiveComponent] = useState('ShoppingCart');
    const cartId = parseInt(params.id);
    const token = searchParams.token;
    return (
        <div className="flex flex-col h-screen">
            <div className="w-full h-full">
                <Top text={getComponentTitle(activeComponent)} />

                {/* Render the active component based on state */}
                {activeComponent === 'ShoppingCart' && <ShoppingCart cartId={cartId} token={token} />}
                {activeComponent === 'CheckInventory' && <CheckInventory />}
                {activeComponent === 'QR' && <QR />}
                {activeComponent === 'SearchProduct' && <SearchProduct />}
            </div>
        </div>
    );
}

// Helper function to get the title for the Top component
function getComponentTitle(componentName: string): string {
    switch (componentName) {
        case 'ShoppingCart':
            return '장바구니';
        case 'CheckInventory':
            return '재고확인';
        case 'SearchProduct':
            return '물품 위치찾기';
        case 'QR':
            return 'QR';
        default:
            return '장바구니';
    }
}
