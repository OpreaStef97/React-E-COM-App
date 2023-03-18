import { XCircle } from "phosphor-react";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { cartActions } from "../../../store/cart";
import { FavoritesType, favActions } from "../../../store/favorites";
import { Button } from "../../ui-components";
import "./MeFavorites.scss";

const MeFavorites: FC = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items } = useSelector((state: { favorites: FavoritesType }) => state.favorites);

    const deleteItemHandler = (id: string) => {
        dispatch(favActions.deleteItemFromFavBox(id));
    };

    const moveItemToCartHandler = (item: FavoritesType["items"][0]) => {
        dispatch(cartActions.addItemToCart(item));
        dispatch(favActions.deleteItemFromFavBox(item.id));
    };

    return (
        <div className="me-favorites">
            <ul className="me-favorites__list">
                {items.map((item: FavoritesType["items"][0], i: number) => {
                    return (
                        <li key={i} className="me-favorites__item">
                            <img
                                onClick={() => navigate(`/product/${item.slug}/${item.id}`)}
                                className="me-favorites__item--image"
                                src={`${process.env.REACT_APP_RESOURCES_URL}/products//${item.image}`}
                                alt={item.name}
                            />
                            <div className="me-favorites__item--info-box">
                                <h3>{item.name}</h3>
                                <span className="info-box--text">
                                    Price: {`$${item.price.toFixed(2)}`}
                                </span>
                                <Button onClick={moveItemToCartHandler.bind(null, item)}>
                                    MOVE TO CART
                                </Button>
                            </div>
                            <XCircle onClick={deleteItemHandler.bind(null, item.id)} />
                        </li>
                    );
                })}
                {items.length === 0 && (
                    <li key={Math.random()} className="me-favorites__item--empty">
                        <p>Your favorites box is empty</p>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default MeFavorites;
