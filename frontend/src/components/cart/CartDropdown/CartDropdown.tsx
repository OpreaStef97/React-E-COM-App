import { ShoppingCart } from "phosphor-react";
import { FC, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useWindow } from "../../../hooks";
import { CartType } from "../../../store/cart";
import { Button, Dropdown } from "../../ui-components";
import "./CartDropdown.scss";
import CartDropdownItem from "./CartDropdownItem";

const CartDropdown: FC<{ className?: string }> = (props) => {
    const { cart } = useSelector((state: { cart: CartType }) => state);
    const { items } = cart;
    const [width] = useWindow();
    const [showDropdown, setShowDropdown] = useState(false);

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
                <span key={cart.totalQuantity} className="cart-counter">
                    {cart.totalQuantity}
                </span>
            )}
            <div style={{ position: "absolute", height: "0.5rem", width: "100%" }}></div>
            {width > 1100 && (
                <Dropdown
                    allFalse={showDropdown}
                    show={showDropdown}
                    className="cart-button__dropdown__component"
                    style={
                        items.length === 0
                            ? {
                                  width: "35rem",
                                  left: "-15%",
                              }
                            : {
                                  width: "40rem",
                                  left: "-30%",
                              }
                    }
                    height={`${
                        items.length === 0 ? "14" : items.length < 3 ? items.length * 19 : "38"
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
                                        <CartDropdownItem
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

export default CartDropdown;
