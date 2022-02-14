import { CaretLeft, CaretRight } from 'phosphor-react';
import { FC, Fragment, useState } from 'react';
import Button from '../ui-components/Button';
import LoadingSpinner from '../ui-components/LoadingSpinner';
import Stars from '../ui-components/Stars';
import TransitionSlider from '../ui-components/TransitionSlider';
import './ProductContent.scss';
import ProductOptions from './ProductOptions';

const ProductContent: FC<{ product: any }> = props => {
    const [imageLoaded, setImageLoaded] = useState(false);

    const { product } = props;

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
                        Object.keys(product).length > 0 &&
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
                                    src={`${process.env.REACT_APP_RESOURCES_URL}/images/products//${src}`}
                                    alt={src}
                                />
                            </Fragment>
                        ))}
                </TransitionSlider>
            </div>
            <div className="product-content__title">{product && <h2>{product.name}</h2>}</div>
            <div className="product-content__options">
                <div className="product-content__options--price">
                    {product && <p>{`$${product.price}`}</p>}
                </div>
                <div className="product-content__options--reviews">
                    <div className="product-content__options--star-container">
                        <Stars rating={product?.ratingsAverage || 5} />
                    </div>
                    <p className="product-content__options--reviews-count">
                        No. of reviews: {product?.ratingsQuantity || 0}
                    </p>
                </div>
                {product &&
                    Object.keys(product.options).map(key => {
                        return (
                            <ProductOptions
                                key={key}
                                label={key.charAt(0).toUpperCase() + key.slice(1)}
                                items={product.options[key]}
                                active={product.default[key]}
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
