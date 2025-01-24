// src/app/api/getProduct/route.ts
import { NextResponse } from 'next/server';
import products from '../../../../product.json';

interface Product {
    barcode: string;
    name: string;
    price: number;
}

// GET 요청 처리
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url); // URL에서 쿼리 파라미터 추출
    const barcode = searchParams.get('barcode');

    if (!barcode) {
        return NextResponse.json({ message: 'Invalid barcode' }, { status: 400 });
    }

    const product = products.find((item: Product) => item.barcode === barcode);

    if (product) {
        return NextResponse.json(product); // 상품 정보 반환
    } else {
        return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
}
