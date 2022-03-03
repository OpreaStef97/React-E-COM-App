import { MinusCircle, PlusCircle, ShoppingCart, XCircle } from 'phosphor-react';
import { FC, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useImageLoad from '../../hooks/use-image-load';
import useWindow from '../../hooks/use-window';
import { cartActions } from '../../store/cart-slice';
import Button from '../ui-components/Button';
import Dropdown from '../ui-components/Dropdown';
import LoadingSpinner from '../ui-components/LoadingSpinner';
import './CartButton.scss';

const CartItem = (props: { favorite: any; onClick?: () => void; onClose?: () => void }) => {
    const { favorite } = props;
    const navigate = useNavigate();
    const srcLoaded = useImageLoad(
        `${process.env.REACT_APP_RESOURCES_URL}/images/products/${favorite.image}`
    );
    const dispatch = useDispatch();

    const closeHandler = () => {
        props.onClose && props.onClose();
        navigate(`/product/${favorite.slug}/${favorite.id}`);
    };

    return (
        <li key={favorite.id} className="cart-button__item">
            {!srcLoaded && <LoadingSpinner />}
            {srcLoaded && <img onClick={closeHandler} src={srcLoaded} alt={`${favorite.name}`} />}
            <div className="cart-button__item-info">
                <button
                    className="cart-button__item-close"
                    onClick={() => dispatch(cartActions.deleteItemFromCart(favorite.id))}
                >
                    <XCircle />
                </button>
                <h3>{favorite.name}</h3>
                <div className="cart-button__item-quantity">
                    <span>Qty: </span>
                    <PlusCircle
                        onClick={() =>
                            dispatch(
                                cartActions.addItemToCart({
                                    ...favorite,
                                })
                            )
                        }
                    />
                    <span>{favorite.quantity}</span>
                    <MinusCircle
                        onClick={() => dispatch(cartActions.removeItemFromCart(favorite.id))}
                    />
                </div>
                <Button
                    onClick={props.onClose}
                    link
                    to="/cart"
                    className="cart-button__item-info--btn"
                >
                    SEE CART
                </Button>
            </div>
        </li>
    );
};

const CartButton: FC<{ className?: string }> = props => {
    const { cart } = useSelector((state: any) => state);
    const { items } = cart;
    const [width] = useWindow();
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const closeHandler = useCallback(() => {
        setShowDropdown(false);
    }, []);

    return (
        <div
            className={`cart-button-cotainer ${props.className}`}
            onMouseLeave={() => setShowDropdown(false)}
            onMouseEnter={() => setShowDropdown(true)}
        >
            <Button
                className="cart-button"
                link
                to="/cart"
                icon={<ShoppingCart className="cart-icon" />}
                iconAfter
                onClick={closeHandler}
                aria-label="cart-button"
            >
                CART
            </Button>
            {cart.totalQuantity > 0 && (
                <span
                    onClick={() => navigate('/cart')}
                    key={cart.totalQuantity}
                    className="cart-counter"
                >
                    {cart.totalQuantity}
                </span>
            )}
            <div style={{ position: 'absolute', height: '2rem', width: '100%' }}></div>
            {width > 1100 && (
                <Dropdown
                    allFalse={showDropdown}
                    show={showDropdown}
                    className="cart-button__dropdown__component"
                    style={
                        items.length === 0
                            ? {
                                  width: '35rem',
                                  left: '-15%',
                              }
                            : {
                                  width: '40rem',
                                  left: '-30%',
                              }
                    }
                    height={`${
                        items.length === 0 ? '14' : items.length < 3 ? items.length * 19 : '38'
                    }rem`}
                    transitionMs={450}
                >
                    <div className="cart-button__dropdown">
                        {items.length === 0 && (
                            <p className="cart-button__empty">Your cart is empty</p>
                        )}
                        <ul className="cart-button__list">
                            {items.length > 0 &&
                                items.map((favorite: any) => {
                                    return (
                                        <CartItem
                                            onClose={closeHandler}
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

export default CartButton;
