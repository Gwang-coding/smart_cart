'use client';
import { useState } from 'react';

interface Product {
    name: string;
    price: number;
}

function ProductSearch() {
    const [barcode, setBarcode] = useState<string>('');
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        const res = await fetch(`@/services/getProduct?barcode=${barcode}`);
        if (res.ok) {
            const data: Product = await res.json();
            setProduct(data);
            setError(null);
        } else {
            setError('Product not found');
            setProduct(null);
        }
    };

    return (
        <div>
            <input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="Enter barcode" />
            <button onClick={handleSearch}>Search</button>

            {error && <p>{error}</p>}
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
