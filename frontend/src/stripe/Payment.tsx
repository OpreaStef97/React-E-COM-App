import { CreditCard, ShoppingCart } from 'phosphor-react';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useFetch from '../hooks/use-fetch';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import './Payment.scss';
import { loadStripe } from '@stripe/stripe-js';
import Button from '../components/ui-components/Button';
import ErrorModal from '../components/ui-components/ErrorModal';
import { cartActions } from '../store/cart-slice';
import { useTitle } from '../hooks/use-title';
import { uiActions } from '../store/ui-slice';

const stripePromise = loadStripe(
    'pk_test_51KUDgVGg7aAflOuXCkyFuW66rAxxdfe339dVnAOimJ2JYjr7E7LQkA1omy1edRYzbXoJE342Fv76OKXifDm91yeR00C99LGi7b'
);

const Payment: FC = () => {
    const { cart, auth } = useSelector((state: any) => state);
    const { totalQuantity, totalAmount, items } = cart;
    const { csrfToken, user } = auth;
    const [clientSecret, setClientSecret] = useState('');
    useTitle(`ReactECOM | Payment`);

    const dispatch = useDispatch();

    const { error, clearError, sendRequest } = useFetch();

    useEffect(() => {
        dispatch(
            uiActions.showNotification({
                status: 'info',
                message:
                    'Please use the following card number: 4242 4242 4242 4242 to test payments functionality',
                timeOnScreen: 10000,
            })
        );
    }, [dispatch]);

    useEffect(() => {
        if (!csrfToken) {
            return;
        }

        // dispatch(sendCartData(cart, csrfToken, user.id));
        sendRequest({
            url: `${process.env.REACT_APP_API_URL}/payments/create-payment-intent`,
            method: 'POST',
            headers: {
                'x-csrf-token': csrfToken,
                'Content-Type': 'application/json',
            },
            body: {
                products: [
                    ...items.map((item: any) => {
                        return { product: item.id as string, quantity: item.quantity as number };
                    }),
                ],
            },
            credentials: 'include',
        })
            .then(data => {
                setClientSecret(data.clientSecret);
            })
            .catch(() => dispatch(cartActions.reinitializeCart()));
    }, [csrfToken, sendRequest, items, dispatch, cart, user.id]);

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
                            <Elements
                                stripe={stripePromise}
                                options={{
                                    clientSecret,
                                    appearance: { theme: 'flat' },
                                }}
                            >
                                <CheckoutForm />
                            </Elements>
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
