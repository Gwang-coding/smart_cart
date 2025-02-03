'use client';
import CancleBtn from '@/components/CancleBtn';
import Image from 'next/image';
export default function BuyProduct() {
    return (
        <div className="border border-red-300 w-full h-full">
            <div className="p-5 border border-red-300">
                <div className="flex justify-between items-center w-full pb-2">
                    <input type="checkbox" className="accent-[#4285f4] w-9 h-9 " />
                    <div className="w-full mx-4">위대한 게츠비</div>
                    <div>
                        <CancleBtn
                            onClick={() => {
                                console.log('hi');
                            }}
                        />
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="relative w-20 h-[90px] rounded-xl overflow-hidden">
                        <Image src="/images/sample1.jpg" alt="sample" fill className="object-cover" />
                    </div>
                    <div className="px-4 ">
                        <p className="">26,500원</p>
                        <p>수량: 1개</p>
                        <p className="text-2xl font-extrabold mt-1">26,500원</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
