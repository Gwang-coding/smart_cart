import { Product } from '@/types/types';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // NestJS 서버 주소

export const useBarcode = (): { isScan: boolean; getProduct: Product | null } => {
    const [barcodeData, setBarcodeData] = useState<{ isScan: boolean; getProduct: Product | null }>({ isScan: false, getProduct: null });

    useEffect(() => {
        socket.on('barcodeData', (data: { isScan: boolean; getProduct: Product }) => {
            console.log('Received barcode data:', data);
            setBarcodeData(data); // 상태 업데이트
        });

        return () => {
            socket.off('barcodeData'); // 컴포넌트 언마운트 시 정리
        };
    }, []);

    return barcodeData;
};
