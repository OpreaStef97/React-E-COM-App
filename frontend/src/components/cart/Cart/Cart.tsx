import { ShoppingCart, PlusCircle, MinusCircle, XCircle, SignIn } from "phosphor-react";
import { FC, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useFetch, useTitle } from "../../../hooks";
import { AuthType } from "../../../store/auth";
import { CartType, cartActions } from "../../../store/cart";
import { uiActions } from "../../../store/ui";
import { Button } from "../../ui-components";
import "./Cart.scss";

const Cart: FC = () => {
    const { cart, auth } = useSelector((state) => state) as { cart: CartType; auth: AuthType };
    const { items, totalQuantity, totalAmount } = cart;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { sendRequest, isLoading } = useFetch();
    useTitle(`ReactECOM | Cart`);

    const addItemHandler = (item: any) => {
        dispatch(cartActions.addItemToCart(item));
    };

    const removeItemHandler = (id: string) => {
        dispatch(cartActions.removeItemFromCart(id));
    };

    const deleteItemHandler = (id: string) => {
        dispatch(cartActions.deleteItemFromCart(id));
    };

    const navHandler = useCallback(() => {
        if (!auth.isLoggedIn) {
            dispatch(
                uiActions.showNotification({
                    status: "warn",
                    message: "Please authenticate to continue",
                })
            );
            return navigate("/auth", { state: { from: pathname } });
        }
        // return navigate('/payment');

        sendRequest({
            url: `${process.env.REACT_APP_API_URL}/payments/create-payment-intent`,
            method: "POST",
            headers: {
                "x-csrf-token": auth.csrfToken,
                "Content-Type": "application/json",
            },
            body: {
                products: [
                    ...items.map((item: any) => {
                        return { product: item.id as string, quantity: item.quantity as number };
                    }),
                ],
            },
            credentials: "include",
        })
            .then((data) => {
                navigate("/payment", { state: { clientSecret: data.clientSecret } });
            })
            .catch(() => dispatch(cartActions.reinitializeCart()));
    }, [auth.csrfToken, auth.isLoggedIn, dispatch, items, navigate, sendRequest, pathname]);

    return (
        <section className="cart">
            <div className="cart__container">
                <header className="cart__header">
                    <div className="cart__header-box">
                        <h2>Your CART</h2>
                        <ShoppingCart />
                    </div>
                    {totalQuantity > 0 && (
                        <p>
                            {totalQuantity} {totalQuantity === 1 ? "Item" : "Items"}
                        </p>
                    )}
                </header>
                <ul className="cart__content">
                    {items.length > 0 &&
                        items.map((item: any, i: number) => (
                            <li key={i} className="cart__item">
                                <img
                                    onClick={() => navigate(`/product/${item.slug}/${item.id}`)}
                                    className="cart__item--image"
                                    src={`${process.env.REACT_APP_RESOURCES_URL}/products//${item.image}`}
                                    alt={item.name}
                                ></img>
                                <div className="cart__item--info-box">
                                    <h3>{item.name}</h3>
                                    <span>Price: {`$${(item.price / 100).toFixed(2)}`}</span>
                                    <span>
                                        Total Price: {`$${(item.totalPrice / 100).toFixed(2)}`}
                                    </span>
                                    <div className="cart__item--quantity">
                                        <PlusCircle
                                            onClick={addItemHandler.bind(null, {
                                                ...item,
                                            })}
                                        />
                                        <span>{item.quantity}</span>
                                        <MinusCircle
                                            onClick={removeItemHandler.bind(null, item.id)}
                                        />
                                    </div>
                                </div>
                                <XCircle onClick={deleteItemHandler.bind(null, item.id)} />
                            </li>
                        ))}
                    {totalQuantity === 0 && (
                        <li key={Math.random()} className="cart__item--empty">
                            <p>Your cart is empty.. Go and buy something!😉</p>
                            <Button link to="/products">
                                back to store
                            </Button>
                        </li>
                    )}
                </ul>
                <footer className="cart__footer">
                    {totalAmount > 0 && (
                        <>
                            <Button link to="/products" inverse>
                                Back to store
                            </Button>
                            <p>Total amount: {`$${(totalAmount / 100).toFixed(2)}`}</p>
                            <Button
                                icon={<SignIn className="cart__footer-icon" />}
                                inverse
                                onClick={navHandler}
                                loading={isLoading}
                            >
                                Checkout
                            </Button>
                        </>
                    )}
                </footer>
            </div>
        </section>
    );
};

export default Cart;
