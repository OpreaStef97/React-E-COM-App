import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ProductContent from '../../components/products/ProductContent';
import ProductList from '../../components/products/ProductList';
import Reviews from '../../components/reviews/Reviews';
import SectionTitle from '../../components/ui-components/SectionTitle';
import useFetch from '../../hooks/use-fetch';
import { useTitle } from '../../hooks/use-title';
import './ProductPage.scss';

const ProductPage: FC = props => {
    const [category, setCategory] = useState('');
    const [product, setProduct] = useState<any>();
    const params = useParams();
    const { sendRequest } = useFetch();

    useEffect(() => {
        sendRequest({ url: `${process.env.REACT_APP_API_URL}/products/${params.id}` })
            .then(data => {
                setProduct(data.doc);
                setCategory(data.doc.category);
            })
            .catch(console.error);

        return () => {
            setCategory('');
            setProduct(undefined);
        };
    }, [sendRequest, params.id]);

    useTitle('ReactECOM | Product');

    return (
        <section className="product-page">
            <ProductContent product={product} />
            <Reviews rating={product?.ratingsAverage} id={params.id} />
            <SectionTitle>Other similar items:</SectionTitle>
            <ProductList exclude={params.id} category={category} />
        </section>
    );
};

export default ProductPage;
