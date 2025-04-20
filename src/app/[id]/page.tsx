'use client';
import ShoppingCart from '@/container/ShoppingCart';
import { redirect } from 'next/navigation';
import mysql from 'mysql2/promise';

interface CartPageProps {
    params: {
        id: string;
    };
    searchParams: {
        token?: string;
    };
}

export default async function Page({ params, searchParams }: CartPageProps) {
    const cartId = parseInt(params.id);
    const token = searchParams.token;

    if (!token) {
        // 토큰 없이 직접 접근 시도
        redirect('/unauthorized');
    }

    // MySQL 연결
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        // 토큰 유효성 확인
        const [access]: any[] = await connection.execute(
            'SELECT token FROM cart_access WHERE token = ? AND cart_id = ? AND expires_at > NOW()',
            [token, cartId]
        );

        if (access.length === 0) {
            // 유효하지 않은 토큰 또는 카트 ID 불일치
            redirect('/unauthorized');
        }
        return (
            <div className="flex flex-col h-screen">
                <div className="w-full h-full ">
                    <ShoppingCart cartId={cartId} token={token} />
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error in cart page:', error);
        redirect('/error');
    } finally {
        await connection.end();
    }
}
