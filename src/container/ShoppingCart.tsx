'use client';
import CancleBtn from '@/components/CancleBtn';
import Image from 'next/image';
import { Product } from '@/types/types';
import { useState, useEffect } from 'react';
import BuyButton from '@/container/BuyButton';
import BuyTop from '@/container/BuyTop';

type ProductWithQuantity = Product & { quantity: number; isChecked: boolean };

export default function ShoppingCart() {
    const [barcode, setBarcode] = useState<string>('');
    const [products, setProducts] = useState<ProductWithQuantity[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [selectAll, setSelectAll] = useState<boolean>(false);

    const getTotalProduct = () => {
        return products.filter((product) => product.isChecked).length;
    };
    const getTotalPrice = () => {
        return products.filter((product) => product.isChecked).reduce((total, product) => total + product.price * product.quantity, 0);
    };
    const handleSearch = async () => {
        if (!barcode.trim()) {
            setError('Please enter a barcode.');
            return;
        }

        try {
            const res = await fetch(`http://192.168.0.7:3001/product/${barcode}`, { cache: 'no-store' });
            console.log(res);
            if (!res.ok) {
                throw new Error('Product not found');
            }

            const data: Product = await res.json();
            setProducts((prevProducts) => {
                const existingProductIndex = prevProducts.findIndex((p) => p.barcode === data.barcode);

                if (existingProductIndex !== -1) {
                    return prevProducts.map((product, index) =>
                        index === existingProductIndex ? { ...product, quantity: product.quantity + 1 } : product
                    );
                } else {
                    return [...prevProducts, { ...data, quantity: 1, isChecked: false }];
                }
            });

            setError(null);
            setBarcode('');
        } catch (err) {
            console.error(err);
            setError('Product not found');
            setBarcode('');
        }
    };

    const handleRemoveProduct = (barcode: string) => {
        setProducts((prevProducts) => prevProducts.filter((p) => p.barcode !== barcode));
    };

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setProducts((prevProducts) => prevProducts.map((product) => ({ ...product, isChecked: newSelectAll })));
    };

    const handleCheckboxChange = (barcode: string) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) => (product.barcode === barcode ? { ...product, isChecked: !product.isChecked } : product))
        );
    };

    const handleRemoveSelected = () => {
        setProducts((prevProducts) => prevProducts.filter((p) => !p.isChecked));
        setSelectAll(false);
    };

    return (
        <div className="w-full h-full flex flex-col justify-between">
            <div>
                <BuyTop removeSelected={handleRemoveSelected} selectAll={selectAll} handleSelectAll={handleSelectAll} />

                {products.map((product, index) => (
                    <div key={index} className={`p-5 ${index === 0 ? 'border-t border-b' : 'border-b'} border-gray-400`}>
                        <div className="flex justify-between items-center w-full pb-2">
                            <input
                                type="checkbox"
                                className="accent-[#4285f4] w-8 h-8"
                                checked={product.isChecked}
                                onChange={() => handleCheckboxChange(product.barcode)}
                            />
                            <div className="w-full mx-4"> {product.name}</div>
                            <CancleBtn onClick={() => handleRemoveProduct(product.barcode)} />
                        </div>
                        <div className="flex items-center">
                            <div className="relative w-20 h-[90px] ">
                                <Image src="/images/sample1.jpg" alt="sample" fill className="object-cover" />
                            </div>
                            <div className="px-4">
                                <p className="">{product.price}원</p>
                                <p>수량: {product.quantity}개</p>
                                <div className="flex items-center">
                                    <p className="text-2xl font-extrabold mt-1">{product.price * product.quantity}</p>
                                    <p className="text-base mt-2 ml-1">원</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                <div>
                    <input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="enter barcode id" />
                    <button onClick={handleSearch}>검색</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
            </div>
            <BuyButton getTotalPrice={getTotalPrice()} totalProduct={getTotalProduct()} />
        </div>
    );
}
