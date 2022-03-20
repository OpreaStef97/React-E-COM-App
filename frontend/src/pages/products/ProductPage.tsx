import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import MenuSelect from '../../components/form/MenuSelect';

import ProductContent from '../../components/products/ProductContent';
import ProductList from '../../components/products/ProductList';
import Reviews from '../../components/reviews/Reviews';
import SectionTitle from '../../components/ui-components/SectionTitle';
import useFetch from '../../hooks/use-fetch';
import useReviewSort from '../../hooks/use-review-sort';
import useSelect from '../../hooks/use-select';
import { useTitle } from '../../hooks/use-title';
import './ProductPage.scss';

const ProductPage: FC = props => {
    const [category, setCategory] = useState('');
    const [product, setProduct] = useState<any>();
    const params = useParams();
    const { sendRequest } = useFetch();
    const { auth } = useSelector((state: any) => state);
    const [userReview, setUserReview] = useState<any>();

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

    useEffect(() => {
        if (!auth?.user.id || !params.id) {
            return;
        }
        sendRequest({
            url: `${process.env.REACT_APP_API_URL}/reviews?user=${auth?.user.id}&product=${params.id}`,
        })
            .then(data => {
                setUserReview(data.docs[0]);
            })
            .catch(err => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const mute = err;
            });
    }, [auth?.user.id, params.id, sendRequest]);

    useTitle('ReactECOM | Product');

    const { selectState, selectHandler, deleteHandler, setHandler } = useSelect();

    useEffect(() => {
        const sortOptions = ['Top rated', 'Low rated', 'Newest', 'Oldest'];
        setHandler({
            sort: { options: sortOptions, selected: sortOptions.map(() => false) },
        });
    }, [setHandler]);

    const sorting = useReviewSort(selectState);

    return (
        <section className="product-page">
            <ProductContent product={product} />
            <Reviews
                key={sorting}
                rating={product?.ratingsAverage}
                productId={params.id}
                userReview={userReview}
                sorting={sorting}
                selectMenu={
                    <MenuSelect
                        id={'sort'}
                        placeholder={'Sort..'}
                        options={selectState && selectState.sort}
                        uniqueSelect
                        onSelect={selectHandler}
                        onDelete={deleteHandler}
                    />
                }
            />
            <SectionTitle>Other similar items:</SectionTitle>
            <ProductList exclude={params.id} category={category} />
        </section>
    );
};

export default ProductPage;
