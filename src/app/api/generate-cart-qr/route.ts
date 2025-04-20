// app/api/generate-cart-qr/route.ts
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

interface RequestBody {
    cartId: number;
}

// POST 함수를 명명된 export로 내보냅니다
export async function POST(request: Request) {
    const body = (await request.json()) as RequestBody;
    const { cartId } = body;

    // MySQL 연결
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        // 카트가 존재하는지 확인 (없으면 생성)
        // 방법 3: execute 함수의 반환 타입 지정
        const [carts] = await connection.execute<mysql.RowDataPacket[]>('SELECT id FROM carts WHERE id = ?', [cartId]);

        if (carts.length === 0) {
            // 카트 생성
            await connection.execute('INSERT INTO carts (id) VALUES (?)', [cartId]);
        }

        // 토큰 생성
        const token = uuidv4();

        // 토큰 저장
        await connection.execute('INSERT INTO cart_access (token, cart_id, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))', [
            token,
            cartId,
        ]);

        // QR 코드에 인코딩될 URL (사용자에게 표시될 URL)
        const qrUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/cart/${cartId}?token=${token}`;

        return NextResponse.json({
            success: true,
            qrUrl: qrUrl,
            token: token,
        });
    } catch (error) {
        console.error('Error generating QR:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    } finally {
        await connection.end();
    }
}
