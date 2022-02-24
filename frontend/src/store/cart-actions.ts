import { Dispatch } from '@reduxjs/toolkit';
import { Cart, cartActions } from './cart-slice';

const updateCart = async (cart: Cart, csrfToken: string) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/cart`, {
        method: 'PUT',
        body: JSON.stringify({
            products: (cart as Cart).items.map(({ id, quantity }) => {
                return {
                    product: id,
                    quantity,
                };
            }),
            modifiedAt: new Date(cart.modifiedAt),
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

export function getCartData(cart: any[], csrfToken: string) {
    return async (dispatch: Dispatch) => {
        const localCart = localStorage.getItem('cart');
        const lcart = JSON.parse(localCart || '{}');

        if (
            localCart &&
            (cart.length === 0 || lcart.modifiedAt > new Date(cart[0].modifiedAt).getDate())
        ) {
            dispatch(cartActions.replaceCart(lcart));
            // update cart on server
            try {
                await updateCart(lcart, csrfToken);
            } catch (err) {
                console.error((err instanceof Error && err.message) || 'Something went wrong');
            }
            return;
        }
        if (cart.length > 0)
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
                    modifiedAt: new Date(cart[0].modifiedAt).getDate(),
                })
            );
        return dispatch(cartActions.reinitializeCart());
    };
}
