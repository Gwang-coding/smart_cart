// app/providers.tsx
'use client';

import { CartProvider } from '@/contexts/CartContext';
import { ScanModeProvider } from '@/contexts/ScanModeContext';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <CartProvider>
            <ScanModeProvider>{children}</ScanModeProvider>
        </CartProvider>
    );
}
