import { XCircle } from 'phosphor-react';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Favorites } from '../../store/fav-slice';
import './MeFavorites.scss';
import { favActions } from '../../store/fav-slice';
import Button from '../ui-components/Button';
import { cartActions } from '../../store/cart-slice';

const MeFavorites: FC = props => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items } = useSelector((state: any) => state.favorites);

    const deleteItemHandler = (id: string) => {
        dispatch(favActions.deleteItemFromFavBox(id));
    };

    const moveItemToCartHandler = (item: any) => {
        dispatch(cartActions.addItemToCart(item));
        dispatch(favActions.deleteItemFromFavBox(item.id));
    };

    return (
        <div className="me-favorites">
            <ul className="me-favorites__list">
                {items.map((item: Favorites['items'][0], i: number) => {
                    return (
                        <li key={i} className="me-favorites__item">
                            <img
                                onClick={() => navigate(`/product/${item.slug}/${item.id}`)}
                                className="me-favorites__item--image"
                                src={`${process.env.REACT_APP_RESOURCES_URL}/products//${item.image}`}
                                alt={item.name}
                            ></img>
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
