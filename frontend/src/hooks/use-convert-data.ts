import { useCallback } from 'react';

export default function useConvertData() {
    const convertData = useCallback(
        (products: any) =>
            products.map((product: any) => {
                return {
                    name: product.name,
                    images: product.images,
                    price: product.price,
                    brand: product.brand,
                    RAM: product.default.RAM,
                    storage: product.default.storage,
                    type: [...product.type],
                    ratingsAverage: product.ratingsAverage,
                    ratingsQuantity: product.ratingsQuantity,
                    id: product.id,
                    slug: product.slug,
                };
            }),
        []
    );

    return convertData;
}
