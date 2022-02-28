import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth-slice';
import cartSlice from './cart-slice';
import favoritesSlice from './fav-slice';
import uiSlice from './ui-slice';

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        cart: cartSlice.reducer,
        favorites: favoritesSlice.reducer,
        ui: uiSlice.reducer,
    },
});

export default store;
