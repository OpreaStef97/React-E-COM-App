import { XCircle, PlusCircle, MinusCircle } from "phosphor-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useImageLoad } from "../../../hooks";
import { cartActions } from "../../../store/cart";
import { LoadingSpinner, Button } from "../../ui-components";
import "./CartDropdown.scss";

const CartDropdownItem = (props: { favorite: any; onClick?: () => void; onClose?: () => void }) => {
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

export default CartDropdownItem;
