import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { orderId, amount, paymentKey } = req.query;
    const secretKey = process.env.NEXT_PUBLIC_TOSS_SECRET_KEY;

    if (!secretKey) {
        return res.status(500).json({ message: 'Secret key is not defined' });
    }

    // query 파라미터는 string | string[] | undefined 타입일 수 있으므로 타입 처리 필요
    const orderIdStr = typeof orderId === 'string' ? orderId : Array.isArray(orderId) ? orderId[0] : '';
    const amountStr = typeof amount === 'string' ? amount : Array.isArray(amount) ? amount[0] : '';
    const paymentKeyStr = typeof paymentKey === 'string' ? paymentKey : Array.isArray(paymentKey) ? paymentKey[0] : '';

    if (!orderIdStr || !amountStr || !paymentKeyStr) {
        return res.status(400).json({ message: 'Missing required parameters' });
    }

    const url = 'https://api.tosspayments.com/v1/payments/confirm';
    const basicToken = Buffer.from(`${secretKey}:`, 'utf-8').toString('base64');

    try {
        const response = await fetch(url, {
            method: 'post',
            body: JSON.stringify({
                amount: amountStr,
                orderId: orderIdStr,
                paymentKey: paymentKeyStr,
            }),
            headers: {
                Authorization: `Basic ${basicToken}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        return res.redirect(`/payments/complete?orderId=${orderIdStr}`);
    } catch (error) {
        console.error('Payment confirmation error:', error);
        return res.status(500).json({ message: 'Payment confirmation failed' });
    }
}
