import { NextApiRequest, NextApiResponse } from 'next';
import products from '../../product.json';

interface Product {
    barcode: string;
    name: string;
    price: number;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { barcode } = req.query;

    if (typeof barcode !== 'string') {
        res.status(400).json({ message: 'Invalid barcode' });
        return;
    }

    const product = products.find((item: Product) => item.barcode === barcode);

    if (product) {
        res.status(200).json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
}
