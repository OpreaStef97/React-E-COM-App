import { Dispatch } from '@reduxjs/toolkit';
import { Cart, cartActions } from './cart-slice';

const updateCart = async (cart: Cart, csrfToken: string) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/carts`, {
        method: 'PUT',
        body: JSON.stringify({
            products: (cart as Cart).items.map(({ id, quantity }) => {
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
};

export function sendCartData(cart: Cart, csrfToken: string) {
    return async (dispatch: Dispatch) => {
        try {
            await updateCart(cart, csrfToken);
        } catch (err) {
            console.error(err);
            dispatch(cartActions.reinitializeCart());
        }
    };
}

export function modifyCartData(cart: any[], csrfToken: string) {
    return async (dispatch: Dispatch) => {
        const localCart = localStorage.getItem('cart');
        let lcart;
        try {
            lcart = JSON.parse(localCart || '{}');
            if (
                localCart &&
                (cart.length === 0 || lcart.modifiedAt > new Date(cart[0].modifiedAt).getTime())
            ) {
                if ((lcart as Cart).totalAmount < 0 || (lcart as Cart).totalQuantity < 0) {
                    throw new Error('User modified the cart data');
                }

                dispatch(cartActions.replaceCart(lcart));
                // update cart on server
                await updateCart(lcart, csrfToken);
                return;
            }
            if (cart.length > 0) {
                return dispatch(
                    cartActions.replaceCart({
                        items: cart[0].products.map(
                            ({ product, quantity }: { product: any; quantity: number }) => {
                                return {
                                    id: product.id,
                                    slug: product.slug,
                                    image: product.images[0],
                                    name: product.name,
                                    price: Math.ceil(product.price * 100),
                                    totalPrice: Math.ceil(product.price * 100 * quantity),
                                    quantity,
                                };
                            }
                        ),
                        totalQuantity: cart[0].totalQuantity,
                        totalAmount: cart[0].totalAmount,
                        modifiedAt: new Date(cart[0].modifiedAt).getTime(),
                    })
                );
            }
        } catch (err) {
            console.error(err);
            dispatch(cartActions.reinitializeCart());
        }
    };
}

export const replaceLocalCart = () => async (dispatch: Dispatch) => {
    const localCart = localStorage.getItem('cart');
    try {
        if (!localCart) {
            throw new Error('User modified the cart data');
        }
        dispatch(cartActions.replaceCart(JSON.parse(localCart)));
    } catch (err) {
        console.error(err);
        dispatch(cartActions.reinitializeCart());
    }
};
