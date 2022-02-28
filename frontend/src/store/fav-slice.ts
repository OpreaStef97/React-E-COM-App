import { createSlice } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/internal';

export type Favorites = {
    items: {
        id: string;
        slug: string;
        name: string;
        image: string;
        price: number;
    }[];
    modifiedAt: number;
};

const initialState: Favorites = {
    items: [],
    modifiedAt: 0,
};

const setLocalStorage = (state: WritableDraft<Favorites>) => {
    localStorage.setItem(
        'favorites',
        JSON.stringify({
            ...state,
        })
    );
};

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        reinitializeFav(state) {
            state.items = [];
            state.modifiedAt = 0;
            setLocalStorage(state);
        },
        replaceFav(state, action) {
            state.items = action.payload.items || [];
            state.modifiedAt = action.payload.modifiedAt;
            setLocalStorage(state);
        },
        addItemToFavBox(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);
            if (state.items.length === 10 || existingItem) {
                return;
            }
            state.modifiedAt = Date.now();
            state.items.push({
                id: newItem.id,
                price: newItem.price,
                slug: newItem.slug,
                image: newItem.image,
                name: newItem.name,
            });
            setLocalStorage(state);
        },
        deleteItemFromFavBox(state, action) {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);
            if (existingItem) {
                state.items = state.items.filter(item => item.id !== id);
                state.modifiedAt = Date.now();
            }
            setLocalStorage(state);
        },
    },
});

export const favActions = favoritesSlice.actions;
export default favoritesSlice;
