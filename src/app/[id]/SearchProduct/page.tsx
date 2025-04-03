'use client';
import SearchProduct from '@/container/SearchProduct';

export default function Page() {
    return (
        <div className="flex flex-col h-screen">
            <div className="w-full h-full ">
                <SearchProduct />
            </div>
        </div>
    );
}
