import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Priority = "low" | "medium" | "high";
export type Filter = "all" | "active" | "completed";

export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    priority: Priority;
    createdAt: number;
}

interface TodoState {
    todos: Todo[];
    filter: Filter;
    selectedPriority: Priority;
}

const loadFromStorage = (): Todo[] => {
    if (typeof window === "undefined") return [];
    try {
        const stored = localStorage.getItem("todos-nextapp");
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const initialState: TodoState = {
    todos: loadFromStorage(),
    filter: "all",
    selectedPriority: "medium",
};

const todoSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        addTodo: (state, action: PayloadAction<{ text: string; priority: Priority }>) => {
            state.todos.unshift({
                id: crypto.randomUUID(),
                text: action.payload.text,
                completed: false,
                priority: action.payload.priority,
                createdAt: Date.now(),
            });
        },
        toggleTodo: (state, action: PayloadAction<string>) => {
            const todo = state.todos.find((t) => t.id === action.payload);
            if (todo) todo.completed = !todo.completed;
        },
        deleteTodo: (state, action: PayloadAction<string>) => {
            state.todos = state.todos.filter((t) => t.id !== action.payload);
        },
        clearCompleted: (state) => {
            state.todos = state.todos.filter((t) => !t.completed);
        },
        setFilter: (state, action: PayloadAction<Filter>) => {
            state.filter = action.payload;
        },
        setSelectedPriority: (state, action: PayloadAction<Priority>) => {
            state.selectedPriority = action.payload;
        },
    },
});

export const {
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    setFilter,
    setSelectedPriority,
} = todoSlice.actions;

export default todoSlice.reducer;
