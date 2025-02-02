'use client';
import { useState, useEffect } from 'react';

interface Product {
    name: string;
    price: number;
}

function ProductSearch() {
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
            const res = await fetch(`/api/getProduct?barcode=${barcode}`);

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
            <input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="Enter barcode" />
            <button onClick={handleSearch}>Search</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {product && (
                <div>
                    <h2>{product.name}</h2>
                    <p>Price: {product.price} 원</p>
                </div>
            )}
        </div>
    );
}

export default ProductSearch;
