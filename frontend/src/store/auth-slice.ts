import { createSlice } from '@reduxjs/toolkit';

type Auth = {
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
        | {};
    isLoggedIn: boolean;
    csrfToken: string;
};

const initialState: Auth = {
    user: {},
    isLoggedIn: false,
    csrfToken: '',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCSRF(state: Auth, action) {
            state.csrfToken = action.payload;
        },

        loggingIn(state: Auth, action) {
            state.user = { ...state.user, ...action.payload };
            state.isLoggedIn = true;
        },
        loggedOut(state: Auth) {
            state.user = {};
            state.isLoggedIn = false;
        },
    },
});

export const authActions = authSlice.actions;

export default authSlice;
