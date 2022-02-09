import { Star, StarHalf } from 'phosphor-react';
import { FC, Fragment, useState } from 'react';
import Button from '../ui-components/Button';
import LoadingSpinner from '../ui-components/LoadingSpinner';

import './ProductItem.scss';

const ProductItem: FC<{
    name?: string;
    price?: number;
    id?: string;
    slug?: string;
    numberOfShownCards?: number;
    idx: number;
    imgUrl: string;
    style?: {
        [key: string]: any;
    };
    className?: string;
}> = props => {
    const [imgLoaded, setImgLoaded] = useState(false);

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
                    {!imgLoaded && <LoadingSpinner />}
                    <img
                        src={props.imgUrl}
                        alt={'product-item'}
                        style={imgLoaded ? {} : { display: 'none' }}
                        onLoad={() => setImgLoaded(true)}
                    />
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
                            {[1, 2, 3, 4, 5].map((_, i) => (
                                <Fragment key={i}>
                                    {i < 4 && (
                                        <Star opacity={1} weight="fill" className="star-icon" />
                                    )}
                                    {i === 4 && (
                                        <StarHalf opacity={1} weight="fill" className="star-icon" />
                                    )}
                                </Fragment>
                            ))}
                        </div>
                        <span className="rating">{97 * (props.idx + 1)}</span>
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
