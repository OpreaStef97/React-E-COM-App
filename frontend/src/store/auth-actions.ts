import { authActions } from './auth-slice';

export const setCSRFToken = () => {

    return async (dispatch: any) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/csrf`, { credentials: 'include' });

            if (!res.ok) {
                throw new Error('Something went wrong when accesing the server');
            }

            const data = await res.json();

            dispatch(authActions.setCSRF(data.csrfToken));
        } catch (err) {
            console.error(err);
        }
    };
};

export const logout = () => {
    return async (dispatch: any) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/users/logout`, {
                credentials: 'include',
            });

            if (!res.ok) {
                throw new Error('Something went wrong when accesing the server');
            }

            dispatch(authActions.loggedOut());
        } catch (err) {
            console.error(err);
        }
    };
};
