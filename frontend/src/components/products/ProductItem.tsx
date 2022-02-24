import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useImageLoad from '../../hooks/use-image-load';
import { cartActions } from '../../store/cart-slice';
import Button from '../ui-components/Button';
import LoadingSpinner from '../ui-components/LoadingSpinner';
import Stars from '../ui-components/Stars';
import './ProductItem.scss';

const ProductItem: FC<{
    numberOfShownCards?: number;
    idx: number;
    product: any;
    style?: {
        [key: string]: any;
    };
    className?: string;
}> = props => {
    const { product } = props;

    const srcLoaded = useImageLoad(
        `${process.env.REACT_APP_RESOURCES_URL}/images/products/${product.images[0]}`
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const addItemToCartHandler = (item: any) => {
        dispatch(cartActions.addItemToCart(item));
    };

    return (
        <li
            className={`product__item ${props.className}`}
            style={{
                width: `calc(100% / ${props.numberOfShownCards || 1})`,
                ...props.style,
            }}
        >
            <div className="product__item--wrapper">
                <div className="product__item--image">
                    {!srcLoaded && <LoadingSpinner />}
                    {srcLoaded && (
                        <img
                            onClick={() => navigate(`/product/${product.slug}/${product.id}`)}
                            src={srcLoaded}
                            alt={'product-item'}
                        />
                    )}
                </div>
                <div className="product__item--description">
                    <p className="product__item--name">
                        {product.name || 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'}
                    </p>
                    <div className="product__item--pr">
                        <span className="product__item--price">
                            {`$ ${product.price || '00.00'}`}
                        </span>
                    </div>
                    <div className="product__item--star_container">
                        <div className="stars">
                            <Stars rating={product.ratingsAverage || 0} />
                        </div>
                        <span className="rating">{product.ratingsQuantity || 0}</span>
                    </div>
                    <div className='product__item--footer'>
                        <Button
                            inverse
                            onClick={addItemToCartHandler.bind(null, {
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.images[0],
                                slug: product.slug,
                            })}
                        >
                            ADD TO CART
                        </Button>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default ProductItem;
