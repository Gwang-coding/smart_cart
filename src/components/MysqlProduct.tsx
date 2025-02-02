'use client';
import { Product } from '@/types/types';
import { useState, useEffect } from 'react';
export default function MysqlProduct() {
    const [barcode, setBarcode] = useState<string>('');
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setProduct(null);
            setError(null);
        }
    }, []);

    const handleSearch = async () => {
        if (!barcode.trim()) {
            setError('Please enter a barcode.');
            setProduct(null);
            return;
        }

        try {
            const res = await fetch(`http://localhost:3001/product/${barcode}`, { cache: 'no-store' });

            if (!res.ok) {
                throw new Error('Product not found');
            }

            const data: Product = await res.json();

            setProduct(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Product not found');
            setProduct(null);
        }
    };
    return (
        <div>
            <input
                type="text"
                value={barcode}
                onChange={(e) => {
                    setBarcode(e.target.value);
                }}
                placeholder="enter barcode id"
            />
            <button onClick={handleSearch}>검색</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {product && (
                <ul>
                    <li>
                        {product.name}: {product.price}
                    </li>
                </ul>
            )}
        </div>
    );
}
