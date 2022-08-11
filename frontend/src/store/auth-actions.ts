import { Dispatch } from '@reduxjs/toolkit';
import { authActions } from './auth-slice';
import { uiActions } from './ui-slice';

export const setCSRFToken = () => {
    return async (dispatch: Dispatch) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/csrf`, {
                credentials: 'include',
            });

            if (!res.ok) {
                throw new Error('Something went wrong when accesing the server');
            }

            const data = await res.json();

            dispatch(authActions.setCSRF(data.csrfToken));
        } catch (err) {
            dispatch(
                uiActions.showNotification({
                    status: 'error',
                    message: 'Something went wrong please try again later',
                })
            );
        }
    };
};

export const logout = () => {
    return async (dispatch: Dispatch) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/users/logout`, {
                credentials: 'include',
            });

            if (!res.ok) {
                throw new Error('Something went wrong when accesing the server');
            }

            dispatch(authActions.loggedOut());
        } catch (err) {
            dispatch(
                uiActions.showNotification({
                    status: 'error',
                    message: 'Something went wrong please try again later',
                })
            );
        }
    };
};
