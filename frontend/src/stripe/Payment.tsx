import { CreditCard, ShoppingCart } from 'phosphor-react';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useFetch from '../hooks/use-fetch';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import './Payment.scss';

import { loadStripe } from '@stripe/stripe-js';
import Button from '../components/ui-components/Button';
import { sendCartData } from '../store/cart-actions';
const stripePromise = loadStripe(
    'pk_test_51KUDgVGg7aAflOuXCkyFuW66rAxxdfe339dVnAOimJ2JYjr7E7LQkA1omy1edRYzbXoJE342Fv76OKXifDm91yeR00C99LGi7b'
);

const Payment: FC = () => {
    const { cart, auth } = useSelector((state: any) => state);
    const { totalQuantity, totalAmount, items } = cart;
    const { csrfToken, user } = auth;
    const [clientSecret, setClientSecret] = useState('');

    const dispatch = useDispatch();

    const { sendRequest } = useFetch();

    useEffect(() => {
        if (!csrfToken) {
            return;
        }

        dispatch(sendCartData(cart, csrfToken, user.id))

        sendRequest(
            `${process.env.REACT_APP_API_URL}/payments/create-payment-intent`,
            'POST',
            {
                'x-csrf-token': csrfToken,
                'Content-Type': 'application/json',
            },
            JSON.stringify({
                items: [
                    ...items.map((item: any) => {
                        return { id: item.id as string, quantity: item.quantity as number };
                    }),
                ],
            }),
            'include'
        )
            .then(data => {
                setClientSecret(data.clientSecret);
            })
            .catch(console.error);
    }, [csrfToken, sendRequest, items, dispatch, cart, user.id]);

    return (
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
    );
};
export default Payment;
