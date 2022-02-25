import { createSlice } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/internal';

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
    totalQuantity: number;
    totalAmount: number;
    modifiedAt: number;
};

const setLocalStorage = (state: WritableDraft<Cart>) => {
    localStorage.setItem(
        'cart',
        JSON.stringify({
            ...state,
        })
    );
};

export const initialState: Cart = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
    modifiedAt: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        reinitializeCart(state) {
            state.totalQuantity = 0;
            state.totalAmount = 0;
            state.items = [];
            state.modifiedAt = 0;
            setLocalStorage(state);
        },

        replaceCart(state, action: { payload: Cart; type: string }) {
            state.totalQuantity = action.payload.totalQuantity;
            state.totalAmount = action.payload.totalAmount;
            state.items = action.payload.items || [];
            state.modifiedAt = action.payload.modifiedAt;
            setLocalStorage(state);
        },
        addItemToCart(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);
            if (state.items.length === 20 || existingItem?.quantity === 10) {
                return;
            }
            state.totalQuantity++;
            state.modifiedAt = Date.now();
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
            setLocalStorage(state);
        },
        removeItemFromCart(state, action) {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);
            state.totalQuantity--;
            state.modifiedAt = Date.now();
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
            setLocalStorage(state);
        },
        deleteItemFromCart(state, action) {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);
            state.modifiedAt = Date.now();
            if (existingItem) {
                state.totalAmount -= existingItem.totalPrice;
                if (state.totalAmount < 0) state.totalAmount = 0;
                state.totalQuantity -= existingItem.quantity;
                state.items = state.items.filter(item => item.id !== id);
            }
            setLocalStorage(state);
        },
    },
});

export const cartActions = cartSlice.actions;
export default cartSlice;
