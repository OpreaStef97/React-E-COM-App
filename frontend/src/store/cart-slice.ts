import { createSlice } from '@reduxjs/toolkit';

export type Cart = {
    items: {
        id: string;
        slug: string;
        name: string;
        totalPrice: number;
        quantity: number;
        image: string;
        price: number;
    }[];
    changed: boolean;
    totalQuantity: number;
    totalAmount: number;
};

const initialState: Cart = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    changed: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        replaceCart(state, action) {
            state.totalQuantity = action.payload.totalQuantity;
            state.items = action.payload.items || [];
        },
        addItemToCart(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);
            state.totalQuantity++;
            state.changed = true;
            if (!existingItem) {
                state.items.push({
                    id: newItem.id,
                    price: newItem.price * 100,
                    slug: newItem.slug,
                    quantity: 1,
                    image: newItem.image,
                    totalPrice: newItem.price * 100,
                    name: newItem.name,
                });
                state.totalAmount += newItem.price * 100;
            } else {
                existingItem.quantity++;
                existingItem.totalPrice += existingItem.price;
                state.totalAmount += existingItem.price;
            }
        },
        removeItemFromCart(state, action) {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);
            state.totalQuantity--;
            state.changed = true;
            if (existingItem) {
                state.totalAmount -= existingItem.price;
                if (state.totalAmount < 0) state.totalAmount = 0;
                if (existingItem.quantity === 1) {
                    state.items = state.items.filter(item => item.id !== id);
                } else {
                    existingItem.quantity--;
                    existingItem.totalPrice -= existingItem.price;
                }
            }
        },

        deleteItemFromCart(state, action) {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);
            if (existingItem) {
                state.totalAmount -= existingItem.totalPrice;
                if (state.totalAmount < 0) state.totalAmount = 0;
                state.totalQuantity -= existingItem.quantity;
                state.changed = true;
                state.items = state.items.filter(item => item.id !== id);
            }
        },

        paidItems(state) {
            state = initialState;
        },
    },
});

export const cartActions = cartSlice.actions;
export default cartSlice;
