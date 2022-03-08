import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import sleep from '../utils/sleep';

type UINotification = {
    visible: boolean;
    notification: {
        status: string | null;
        message: string | null;
    };
    reset: number;
    compReset: number;
    savedState: any;
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

export const delayedUIReset = createAsyncThunk('ui-reset', async (action: { delay?: number }) => {
    await sleep(action.delay || 400);
    return action;
});

const initialState: UINotification = {
    visible: false,
    notification: {
        status: null,
        message: null,
    },
    reset: 0,
    compReset: 0,
    savedState: undefined,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggle(state) {
            state.visible = !state.visible;
        },
        setUIReset(state) {
            state.reset = Math.random();
        },
        setComponentReset(state) {
            state.compReset = Math.random();
        },
        showNotification(state, action) {
            state.visible = true;
            state.notification = {
                status: action.payload.status,
                message: action.payload.message,
            };
        },
        setSaveState(state, action) {
            state.savedState = action.payload;
        },
        deleteSavedState(state) {
            state.savedState = undefined
        }
    },
    extraReducers: builder => {
        builder.addCase(delayedNotification.fulfilled, (state, action) => {
            state.visible = true;
            state.notification = {
                status: action.payload.status,
                message: action.payload.message,
            };
        });
        builder.addCase(delayedUIReset.fulfilled, (state, action) => {
            state.reset = Math.random();
        });
    },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
