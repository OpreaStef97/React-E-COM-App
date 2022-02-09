import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth-slice';
import productsSlice from './products-slice';

const store = configureStore({
    reducer: {
        products: productsSlice.reducer,
        auth: authSlice.reducer,
    },
});

export default store;
