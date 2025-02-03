// import Image from 'next/image';
import MysqlProduct from '@/components/MysqlProduct';
import ProductSearch from '@/components/ProductSearch';

import ShopingCart from './shoppingcart';

export default function Home() {
    const handleClick = () => {
        alert('버튼이 클릭되었습니다!');
    };
    return (
        <div className="flex flex-col h-screen">
            <div>장바구니</div>

            <ShopingCart />

            {/* <ProductSearch /> */}

            {/* <MysqlProduct /> */}

            <div></div>
        </div>
    );
}
