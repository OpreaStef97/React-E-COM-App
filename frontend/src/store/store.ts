import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './auth';
import { cartSlice } from './cart';
import { favoritesSlice } from './favorites';

import uiSlice from './ui/ui-slice';

const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        cart: cartSlice.reducer,
        favorites: favoritesSlice.reducer,
        ui: uiSlice.reducer,
    },
});

export default store;
