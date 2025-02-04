// import Image from 'next/image';
import MysqlProduct from '@/components/MysqlProduct';
import ProductSearch from '@/components/ProductSearch';

import ShoppingCart from '@/container/ShoppingCart';

export default function Home() {
    const handleClick = () => {
        alert('버튼이 클릭되었습니다!');
    };
    return (
        <div className="flex flex-col h-screen">
            <ShoppingCart />
            {/* <ProductSearch /> */}

            {/* <MysqlProduct /> */}

            <div></div>
        </div>
    );
}
