import { Heart, XCircle } from 'phosphor-react';
import { FC, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import useImageLoad from '../../hooks/use-image-load';
import useWindow from '../../hooks/use-window';
import { cartActions } from '../../store/cart-slice';
import { favActions } from '../../store/fav-slice';
import { uiActions } from '../../store/ui-slice';
import Button from '../ui-components/Button';
import Dropdown from '../ui-components/Dropdown';
import LoadingSpinner from '../ui-components/LoadingSpinner';
import './Favorites.scss';

const FavoritesItem = (props: { favorite: any; onClick?: () => void; onClose?: () => void }) => {
    const { favorite } = props;
    const navigate = useNavigate();
    const srcLoaded = useImageLoad(
        `${process.env.REACT_APP_RESOURCES_URL}/products/${favorite.image}`
    );
    const dispatch = useDispatch();

    const closeHandler = () => {
        props.onClose && props.onClose();
        navigate(`/product/${favorite.slug}/${favorite.id}`);
    };

    return (
        <li key={favorite.id} className="favorites__item">
            {!srcLoaded && <LoadingSpinner />}
            {srcLoaded && <img onClick={closeHandler} src={srcLoaded} alt={`${favorite.name}`} />}
            <div className="favorites__item-info">
                <button
                    className="favorites__item-close"
                    onClick={() => dispatch(favActions.deleteItemFromFavBox(favorite.id))}
                >
                    <XCircle />
                </button>
                <h3>{favorite.name}</h3>
                <Button onClick={props.onClick} className="favorites__item-info--btn">
                    MOVE TO CART
                </Button>
            </div>
        </li>
    );
};

const Favorites: FC<{ onClick?: () => void }> = props => {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const { favorites, auth } = useSelector((state: any) => state);

    const { items } = favorites;
    const dispatch = useDispatch();
    const [width] = useWindow();

    const moveItemToCartHandler = (item: any) => {
        dispatch(cartActions.addItemToCart(item));
        dispatch(favActions.deleteItemFromFavBox(item.id));
    };

    const closeHandler = useCallback(() => {
        setShowDropdown(false);
    }, []);

    return (
        <div
            className="favorites"
            onMouseLeave={() => setShowDropdown(false)}
            onMouseEnter={() => setShowDropdown(true)}
        >
            <Link
                state={{ from: '/me/favorites' }}
                className="favorites__main-link"
                to={auth.isLoggedIn ? '/me/favorites' : '/auth'}
                aria-label="nav-links-favorites"
                onClick={() => {
                    props.onClick && props.onClick();
                    setShowDropdown(false);
                    if (!auth.isLoggedIn) {
                        dispatch(
                            uiActions.showNotification({
                                status: 'warn',
                                message: 'Please authenticate to see your favorites',
                            })
                        );
                    }
                }}
            >
                <span>FAVORITES</span>
                <Heart />
            </Link>
            <div style={{ position: 'absolute', height: '2rem', width: '100%' }}></div>
            {items.length > 0 && (
                <span
                    onClick={() => navigate('/')}
                    key={items.length}
                    className="favorites__counter"
                >
                    {items.length}
                </span>
            )}
            {width > 1100 && (
                <Dropdown
                    allFalse={showDropdown}
                    show={showDropdown}
                    className="favorites__dropdown__component"
                    style={items.length === 0 ? { width: '35rem' } : {}}
                    height={`${
                        items.length === 0 ? '15' : items.length < 3 ? items.length * 19 : '38'
                    }rem`}
                    transitionMs={450}
                >
                    <div className="favorites__dropdown">
                        {items.length === 0 && (
                            <p className="favorites__empty">
                                Favorites box is empty
                                <br /> Add something you like😉
                            </p>
                        )}
                        <ul className="favorites__list">
                            {items.length > 0 &&
                                items.map((favorite: any) => {
                                    return (
                                        <FavoritesItem
                                            onClose={closeHandler}
                                            onClick={moveItemToCartHandler.bind(null, favorite)}
                                            key={favorite.id}
                                            favorite={favorite}
                                        />
                                    );
                                })}
                        </ul>
                    </div>
                </Dropdown>
            )}
        </div>
    );
};

export default Favorites;
