import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import sleep from '../utils/sleep';

type UINotification = {
    visible: boolean;
    notification: {
        status: string | null;
        message: string | null;
    };
    reset: boolean;
};

type Action = {
    delay?: number;
    message: string | null;
    status: string | null;
};

export const delayedNotification = createAsyncThunk('sleep', async (action: Action) => {
    await sleep(action.delay || 400);
    return action;
});

const initialState: UINotification = {
    visible: false,
    notification: {
        status: null,
        message: null,
    },
    reset: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggle(state) {
            state.visible = !state.visible;
        },
        setUIReset(state) {
            state.reset = !state.reset;
        },
        showNotification(state, action) {
            state.visible = true;
            state.notification = {
                status: action.payload.status,
                message: action.payload.message,
            };
        },
    },
    extraReducers: builder => {
        builder.addCase(delayedNotification.fulfilled, (state, action) => {
            state.visible = true;
            state.notification = {
                status: action.payload.status,
                message: action.payload.message,
            };
        });
    },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
