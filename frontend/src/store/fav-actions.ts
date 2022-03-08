import { Dispatch } from '@reduxjs/toolkit';
import { favActions, Favorites } from './fav-slice';

const updateFav = async (fav: Favorites, csrfToken: string) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/users/favorites`, {
        method: 'PUT',
        body: JSON.stringify({
            products: fav.items.map(({ id }) => {
                return {
                    product: id,
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

export function sendFavData(fav: Favorites, csrfToken: string) {
    return async (dispatch: Dispatch) => {
        try {
            await updateFav(fav, csrfToken);
        } catch (err) {
            console.error(err);
            dispatch(favActions.reinitializeFav());
        }
    };
}

export function modifyFavData(fav: any[], csrfToken: string) {
    return async (dispatch: Dispatch) => {
        const localFav = localStorage.getItem('favorites');
        let lfav;
        try {
            lfav = JSON.parse(localFav || '{}');
            if (
                localFav &&
                (fav.length === 0 || lfav.modifiedAt > new Date(fav[0].modifiedAt).getTime())
            ) {
                dispatch(favActions.replaceFav(lfav));
                // update fav on server
                await updateFav(lfav, csrfToken);
                return;
            }
            if (fav.length > 0) {
                return dispatch(
                    favActions.replaceFav({
                        items: fav[0].products.map(({ product }: { product: any }) => {
                            return {
                                id: product.id,
                                slug: product.slug,
                                image: product.images[0],
                                name: product.name,
                                price: product.price,
                            };
                        }),
                        modifiedAt: new Date(fav[0].modifiedAt).getTime(),
                    })
                );
            }
        } catch (err) {
            console.error(err);
            dispatch(favActions.reinitializeFav());
        }
    };
}

export const replaceLocalFav = () => async (dispatch: Dispatch) => {
    const localFav = localStorage.getItem('favorites');

    if (localFav) {
        dispatch(favActions.replaceFav(JSON.parse(localFav)));
    } else {
        dispatch(favActions.reinitializeFav());
    }
};
