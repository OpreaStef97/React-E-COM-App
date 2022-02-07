import { useCallback, useState } from 'react';

import ProductContent from '../../components/products/ProductContent';
import ProductList from '../../components/products/ProductList';
import Reviews from '../../components/reviews/Reviews';
import SectionTitle from '../../components/ui-components/SectionTitle';
import { useTitle } from '../../hooks/use-title';
import './ProductPage.scss';

const ProductPage = () => {
    const [category, setCategory] = useState('');

    const setCategoryHandler = useCallback((cat: string) => setCategory(cat), []);

    useTitle('ReactCOM | Product');

    return (
        <section className="product-page">
            <ProductContent onSetCategory={setCategoryHandler} />
            <Reviews />
            <SectionTitle>Other similar items:</SectionTitle>
            <ProductList category={category} />
        </section>
    );
};

export default ProductPage;
