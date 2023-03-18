import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import sleep from "../../utils/sleep";

export type UIType = {
    notification: {
        visible: boolean;
        status: string | null;
        message: string | null;
        timeOnScreen?: number;
    };
    stickyNav: {
        sticky: boolean;
        animation: boolean;
    };
    reset: number;
    compReset: number;
    savedState: any;
};

type Action = {
    delay?: number;
    message: string | null;
    status: string | null;
    timeOnScreen?: number;
};

export const delayedNotification = createAsyncThunk("sleep", async (action: Action) => {
    await sleep(action.delay || 400);
    return action;
});

export const delayedUIReset = createAsyncThunk("ui-reset", async (action: { delay?: number }) => {
    await sleep(action.delay || 400);
    return action;
});

const initialState: UIType = {
    notification: {
        visible: false,
        status: null,
        message: null,
    },
    stickyNav: {
        sticky: true,
        animation: false,
    },
    reset: 0,
    compReset: 0,
    savedState: undefined,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        toggle(state) {
            state.notification.visible = !state.notification.visible;
        },
        setUIReset(state) {
            state.reset = Math.random();
        },
        setComponentReset(state) {
            state.compReset = Math.random();
        },
        setStickyNav(state, action) {
            state.stickyNav = { ...state.stickyNav, ...action.payload };
        },
        showNotification(state, action) {
            state.notification = {
                visible: true,
                status: action.payload.status,
                message: action.payload.message,
                timeOnScreen: action.payload.timeOnScreen,
            };
        },
        setSaveState(state, action) {
            state.savedState = action.payload;
        },
        deleteSavedState(state) {
            state.savedState = undefined;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(delayedNotification.fulfilled, (state, action) => {
            state.notification = {
                visible: true,
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
