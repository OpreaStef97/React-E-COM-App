import { Dispatch } from '@reduxjs/toolkit';
import { Cart } from './cart-slice';

export function sendCartData(cart: Cart, csrfToken: string, userId: string) {
    return async (dispatch: Dispatch) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
                method: 'POST',
                body: JSON.stringify({
                    user: userId,
                    products: cart.items.map(({ id, quantity }) => {
                        return {
                            product: id,
                            quantity,
                        };
                    }),
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': csrfToken,
                },
                credentials: 'include',
            });

            if (!res.ok) {
                throw new Error('Sending cart data failed!');
            }
        } catch (err) {
            console.error((err instanceof Error && err.message) || 'Something went wrong');
        }
    };
}
