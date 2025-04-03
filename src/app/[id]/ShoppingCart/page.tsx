'use client';

import ShoppingCart from '@/container/ShoppingCart';

export default function Page() {
    return (
        <div className="flex flex-col h-screen">
            <div className="w-full h-full ">
                <ShoppingCart />
            </div>
        </div>
    );
}
