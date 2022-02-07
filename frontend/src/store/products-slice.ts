import { createSlice } from '@reduxjs/toolkit';

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        values: [],
    },
    reducers: {
        setProducts(state: { products: any[] }, action) {
            state.products = [...action.payload] || [];
        },
        setValues(state: { values: any }, action) {
            state.values = [...action.payload];
        },
    },
});

export const productsActions = productsSlice.actions;
export default productsSlice;
