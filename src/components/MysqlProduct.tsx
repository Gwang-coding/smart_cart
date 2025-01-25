import { Product } from '@/types/types';
export default async function MysqlProduct() {
    const res = await fetch('http://localhost:3000/api/products', { cache: 'no-store' });
    const product: Product[] = await res.json();

    return (
        <div>
            <h1>product list</h1>
            <ul>
                {product.map((product) => (
                    <li key={product.barcode}>
                        {product.name}: {product.price}
                    </li>
                ))}
            </ul>
        </div>
    );
}
