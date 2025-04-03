'use client';
import { use } from 'react';

import ShoppingCart from '@/container/ShoppingCart';

interface IdProps {
    params: Promise<{ id: string }>;
}

export default function Page({ params }: IdProps) {
    const unwrappedParams = use(params);
    const id = unwrappedParams.id;
    return (
        <div className="flex flex-col h-screen">
            <div className="w-full h-full ">
                <ShoppingCart />
            </div>
        </div>
    );
}
