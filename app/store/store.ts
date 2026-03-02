import { configureStore, Middleware } from "@reduxjs/toolkit";
import todoReducer from "./todoSlice";

// Middleware: persist todos to localStorage on every state change
const localStorageMiddleware: Middleware = (storeAPI) => (next) => (action) => {
    const result = next(action);
    const { todos } = storeAPI.getState().todos;
    if (typeof window !== "undefined") {
        localStorage.setItem("todos-nextapp", JSON.stringify(todos));
    }
    return result;
};

export const store = configureStore({
    reducer: {
        todos: todoReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
