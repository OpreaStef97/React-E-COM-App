import { CreditCard, ShoppingCart } from "phosphor-react";
import { FC, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { ErrorModal, Button } from "../../components/ui-components";
import { useTitle, useFetch } from "../../hooks";
import { CartType } from "../../store/cart";
import { uiActions } from "../../store/ui";
import CheckoutForm from "../CheckoutForm";
import "./Payment.scss";
import StripeElements from "./StripeElements";

const Payment: FC = () => {
    const { cart } = useSelector((state: { cart: CartType }) => state);
    const { totalQuantity, totalAmount } = cart;
    useTitle(`ReactECOM | Payment`);

    const dispatch = useDispatch();

    const { error, clearError } = useFetch();

    useEffect(() => {
        dispatch(
            uiActions.showNotification({
                status: "info",
                message:
                    "Please use the following card number: 4242 4242 4242 4242 to test payments functionality",
                timeOnScreen: 10000,
            })
        );
    }, [dispatch]);

    const location = useLocation();

    const clientSecret = (location.state as unknown as { clientSecret: string })?.clientSecret;

    return (
        <>
            <ErrorModal
                error={error}
                onClear={(e: React.MouseEvent) => {
                    e.preventDefault();
                    clearError();
                }}
            />
            <section className="payment">
                <div className="payment__container">
                    <header className="payment__header">
                        <div className="payment__header-box">
                            <h2>PAYMENT</h2>
                            <CreditCard />
                        </div>
                        <p>{totalQuantity} Items</p>
                    </header>
                    <div className="payment__checkout">
                        {clientSecret && (
                            <StripeElements clientSecret={clientSecret}>
                                <CheckoutForm />
                            </StripeElements>
                        )}
                    </div>
                    <footer className="payment__footer">
                        <Button link inverse to="/cart" icon={<ShoppingCart />}>
                            Back To cart
                        </Button>
                        <p>Total Amount: {`$${(totalAmount / 100).toFixed(2)}`}</p>
                    </footer>
                </div>
            </section>
        </>
    );
};
export default Payment;
