import { FC } from 'react';
import useImageLoad from '../../hooks/use-image-load';
import Button from '../ui-components/Button';
import LoadingSpinner from '../ui-components/LoadingSpinner';
import Stars from '../ui-components/Stars';
import './ProductItem.scss';

const ProductItem: FC<{
    name?: string;
    price?: number;
    id?: string;
    slug?: string;
    numberOfShownCards?: number;
    ratingsAverage?: number;
    ratingsQuantity?: number;
    idx: number;
    imgUrl: string;
    style?: {
        [key: string]: any;
    };
    className?: string;
}> = props => {
    const srcLoaded = useImageLoad(props.imgUrl);

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
                    {srcLoaded && <img src={srcLoaded} alt={'product-item'} />}
                </div>
                <div className="product__item--description">
                    <p className="product__item--name">
                        {props.name || 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'}
                    </p>
                    <div className="product__item--pr">
                        <span className="product__item--price">
                            {`$ ${props.price || '00.00'}`}
                        </span>
                    </div>
                    <div className="product__item--star_container">
                        <div className="stars">
                            <Stars rating={props.ratingsAverage || 0} />
                        </div>
                        <span className="rating">{props.ratingsQuantity || 0}</span>
                    </div>
                    <Button inverse link to={`/product/${props.slug}/${props.id}`}>
                        See Item
                    </Button>
                </div>
            </div>
        </li>
    );
};

export default ProductItem;
