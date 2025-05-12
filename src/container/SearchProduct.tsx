'use client';

import GridPoints from '@/components/GridPoints';
type SearchProductProps = {
    sessionToken?: string | null;
};
function SearchProduct({ sessionToken }: SearchProductProps) {
    return (
        <div className="p-8">
            <GridPoints width={300} height={400} gridSize={15} imageSrc="../images/martmap.png" />
        </div>
    );
}

export default SearchProduct;
