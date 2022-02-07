import { CaretLeft, CaretRight, Star } from 'phosphor-react';
import { FC, Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/use-fetch';
import Button from '../ui-components/Button';
import LoadingSpinner from '../ui-components/LoadingSpinner';
import TransitionSlider from '../ui-components/TransitionSlider';
import './ProductContent.scss';
import ProductOptions from './ProductOptions';

const ProductContent: FC<{ onSetCategory?: (cat: string) => void }> = props => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [product, setProduct] = useState<any>();

    const { onSetCategory } = props;

    const params = useParams();

    const { sendRequest } = useFetch();

    useEffect(() => {
        sendRequest(`http://localhost:5000/api/products/${params.id}`)
            .then(data => {
                onSetCategory && onSetCategory(data.product.category);
                setProduct({ ...data.product });
            })
            .catch(console.error);
    }, [sendRequest, params, onSetCategory]);

    return (
        <div className="product-content">
            <div className="product-content__gallery">
                <TransitionSlider
                    dots
                    dotsPosition="end"
                    buttonLeft={<CaretLeft style={{ color: '#0b6775' }} />}
                    buttonRight={<CaretRight style={{ color: '#0b6775' }} />}
                >
                    {product &&
                        product.images.map((src: string, idx: number) => (
                            <Fragment key={idx}>
                                {!imageLoaded && <LoadingSpinner />}
                                <img
                                    className="product-content__gallery--image"
                                    style={{
                                        objectFit: 'cover',
                                        display: `${imageLoaded ? 'block' : 'none'}`,
                                    }}
                                    onLoad={() => setImageLoaded(true)}
                                    src={`http://localhost:5000/images/products//${src}`}
                                    alt={src}
                                />
                            </Fragment>
                        ))}
                </TransitionSlider>
            </div>
            <div className="product-content__title">{product && <h2>{product.name}</h2>}</div>
            <div className="product-content__options">
                <div className="product-content__options--price">
                    {product && <p>${product.price}</p>}
                </div>
                <div className="product-content__options--reviews">
                    <div className="product-content__options--star-container">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <Fragment key={i}>
                                {i < 5 && <Star opacity={1} weight="fill" className="star-icon" />}
                            </Fragment>
                        ))}
                    </div>
                    <p className="product-content__options--reviews-count">No. of reviews: 237</p>
                </div>
                {product &&
                    Object.keys(product.options).map(key => {
                        return (
                            <ProductOptions
                                key={key}
                                label={key.charAt(0).toUpperCase() + key.slice(1)}
                                items={product.options[key]}
                            />
                        );
                    })}
            </div>
            <div className="product-content__cart">
                <Button style={{ transform: 'scale(1.3)' }}>ADD TO CART</Button>
            </div>
        </div>
    );
};

export default ProductContent;
