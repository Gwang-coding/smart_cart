'use client';
import BuyButton from '@/container/BuyButton';
import BuyProduct from '@/container/BuyProduct';
import BuyTop from '@/container/BuyTop';

export default function ShopingCart() {
    return (
        <div className="h-full flex flex-col justify-between items-center border-t border-red-500">
            <BuyTop />
            <BuyProduct />
            <BuyButton />
        </div>
    );
}
