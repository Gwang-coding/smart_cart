'use client';

import CheckInventory from '@/container/CheckInventory';
export default function Page() {
    return (
        <div className="flex flex-col h-screen">
            <div className="w-full h-full ">
                <CheckInventory />
            </div>
        </div>
    );
}
