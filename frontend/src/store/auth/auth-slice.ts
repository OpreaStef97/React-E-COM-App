import { createSlice } from '@reduxjs/toolkit';

export type AuthType = {
    user:
        | {
              email: string;
              name: string;
              id: string;
              photo: string;
              role: string;
              favorites: any[];
              phone: string;
          }
        | null;
    isLoggedIn: boolean;
    csrfToken: string;
};

const initialState: AuthType = {
    user: null,
    isLoggedIn: false,
    csrfToken: '',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCSRF(state: AuthType, action) {
            state.csrfToken = action.payload;
        },

        loggingIn(state: AuthType, action) {
            state.user = { ...state.user, ...action.payload };
            state.isLoggedIn = true;
        },
        loggedOut(state: AuthType) {
            state.user = null;
            state.isLoggedIn = false;
        },
    },
});

export const authActions = authSlice.actions;

export default authSlice;
