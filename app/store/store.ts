import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./todoSlice";
import { socketMiddleware } from "./socketMiddleware";

export const store = configureStore({
    reducer: {
        todos: todoReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(socketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
