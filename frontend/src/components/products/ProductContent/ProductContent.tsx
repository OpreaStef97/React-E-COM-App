import "./ProductContent.scss";
import ProductOptions from "../ProductOptions";
import { CaretLeft, CaretRight, Heart, ShoppingCart } from "phosphor-react";
import { FC, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../../store/cart";
import { FavoritesType, favActions } from "../../../store/favorites";
import { TransitionSlider, LoadingSpinner, Stars, Button } from "../../ui-components";

const ProductContent: FC<{ product: any }> = (props) => {
    const { product } = props;
    const [imageLoaded, setImageLoaded] = useState(false);
    const dispatch = useDispatch();
    const { items } = useSelector((state: { favorites: FavoritesType }) => state.favorites);

    const addItemToCartHandler = (item: any) => {
        dispatch(cartActions.addItemToCart(item));
    };

    const addItemToFavHandler = (item: any) => {
        const fav = (items as any[]).some((item: any) => item.id === product.id);
        if (!fav) {
            dispatch(favActions.addItemToFavBox(item));
        } else {
            dispatch(favActions.deleteItemFromFavBox(item.id));
        }
    };

    return (
        <div className="product-content">
            <div className="product-content__gallery">
                <TransitionSlider
                    dots
                    dotsPosition="end"
                    buttonLeft={<CaretLeft style={{ color: "#0b6775" }} />}
                    buttonRight={<CaretRight style={{ color: "#0b6775" }} />}
                >
                    {product &&
                        Object.keys(product).length > 0 &&
                        product.images.map((src: string, idx: number) => (
                            <Fragment key={idx}>
                                {!imageLoaded && <LoadingSpinner />}
                                <img
                                    className="product-content__gallery--image"
                                    style={{
                                        objectFit: "cover",
                                        display: `${imageLoaded ? "block" : "none"}`,
                                    }}
                                    onLoad={() => setImageLoaded(true)}
                                    src={`${process.env.REACT_APP_RESOURCES_URL}/products//${src}`}
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
                    {product && (
                        <button
                            className="product-content__options--fav-btn"
                            onClick={addItemToFavHandler.bind(null, {
                                id: product.id,
                                slug: product.slug,
                                price: product.price,
                                image: product.images[0],
                                name: product.name,
                            })}
                            aria-label="fav-button"
                        >
                            <Heart
                                weight={
                                    items.some((item: any) => item.id === product.id)
                                        ? "fill"
                                        : "regular"
                                }
                            />
                        </button>
                    )}
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
                    Object.keys(product.options).map((key) => {
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
                <Button
                    onClick={() =>
                        addItemToCartHandler({
                            id: product.id,
                            slug: product.slug,
                            price: product.price,
                            image: product.images[0],
                            name: product.name,
                        })
                    }
                    icon={<ShoppingCart className="product-content__cart--icon" />}
                    style={{ transform: "scale(1.3)" }}
                >
                    ADD TO CART
                </Button>
            </div>
        </div>
    );
};

export default ProductContent;
