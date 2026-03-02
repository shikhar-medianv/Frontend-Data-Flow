"use client";

import { useState, useEffect, useRef } from "react";

type Priority = "low" | "medium" | "high";
type Filter = "all" | "active" | "completed";

interface Todo {
    id: string;
    text: string;
    completed: boolean;
    priority: Priority;
    createdAt: number;
}

const PRIORITY_STYLES: Record<Priority, string> = {
    low: "text-emerald-700 bg-emerald-100 border-emerald-300",
    medium: "text-amber-700 bg-amber-100 border-amber-300",
    high: "text-rose-700 bg-rose-100 border-rose-300",
};

const PRIORITY_BTN_ACTIVE: Record<Priority, string> = {
    low: "text-emerald-700 bg-emerald-100 border-emerald-400 shadow-emerald-200 shadow-md",
    medium: "text-amber-700 bg-amber-100 border-amber-400 shadow-amber-200 shadow-md",
    high: "text-rose-700 bg-rose-100 border-rose-400 shadow-rose-200 shadow-md",
};

export default function TodoPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [input, setInput] = useState("");
    const [priority, setPriority] = useState<Priority>("medium");
    const [filter, setFilter] = useState<Filter>("all");
    const [mounted, setMounted] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const stored = localStorage.getItem("todos-nextapp");
        if (stored) setTodos(JSON.parse(stored));
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) localStorage.setItem("todos-nextapp", JSON.stringify(todos));
    }, [todos, mounted]);

    const addTodo = () => {
        const trimmed = input.trim();
        if (!trimmed) return;
        setTodos((prev) => [
            { id: crypto.randomUUID(), text: trimmed, completed: false, priority, createdAt: Date.now() },
            ...prev,
        ]);
        setInput("");
        inputRef.current?.focus();
    };

    const toggleTodo = (id: string) =>
        setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

    const deleteTodo = (id: string) =>
        setTodos((prev) => prev.filter((t) => t.id !== id));

    const clearCompleted = () =>
        setTodos((prev) => prev.filter((t) => !t.completed));

    const filteredTodos = todos.filter((t) =>
        filter === "active" ? !t.completed : filter === "completed" ? t.completed : true
    );

    const totalCount = todos.length;
    const completedCount = todos.filter((t) => t.completed).length;
    const activeCount = totalCount - completedCount;

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-200 via-violet-100 to-pink-200 px-4 py-12 relative overflow-hidden flex justify-center">
            {/* Decorative blobs */}
            <div className="absolute top-[-80px] left-[-80px] w-80 h-80 rounded-full bg-yellow-300/50 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-[-60px] right-[-60px] w-72 h-72 rounded-full bg-pink-400/40 blur-[80px] pointer-events-none" />
            <div className="absolute top-1/2 left-10 w-48 h-48 rounded-full bg-sky-300/40 blur-[60px] pointer-events-none" />

            <div className="w-full max-w-xl relative z-10">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-violet-600 via-pink-500 to-orange-400 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
                        ✅ My Tasks
                    </h1>
                    <p className="text-violet-400 mt-2 text-sm font-medium">Stay organized, stay happy! 🌈</p>
                </div>

                {/* Stats Bar */}
                <div className="flex justify-center items-center gap-8 bg-white/70 backdrop-blur-md border border-white/80 rounded-2xl px-8 py-4 mb-5 shadow-lg shadow-violet-100">
                    {[
                        { label: "Total", value: totalCount, color: "text-violet-600" },
                        { label: "Active", value: activeCount, color: "text-sky-500" },
                        { label: "Done", value: completedCount, color: "text-emerald-500" },
                    ].map((stat, i, arr) => (
                        <div key={stat.label} className="flex items-center gap-8">
                            <div className="flex flex-col items-center">
                                <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                                <span className="text-xs text-slate-400 uppercase tracking-widest mt-0.5 font-semibold">{stat.label}</span>
                            </div>
                            {i < arr.length - 1 && <div className="w-px h-9 bg-slate-200" />}
                        </div>
                    ))}
                </div>

                {/* Input Card */}
                <div className="bg-white/75 backdrop-blur-md border border-white/90 rounded-2xl p-5 mb-4 shadow-lg shadow-pink-100">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        placeholder="What needs to be done? 🎯"
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addTodo()}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all text-base"
                    />

                    {/* Priority + Add */}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <span className="text-xs text-slate-400 font-semibold mr-1">Priority:</span>
                        {(["low", "medium", "high"] as Priority[]).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPriority(p)}
                                className={`px-3 py-1 rounded-full border text-xs font-bold capitalize transition-all ${priority === p
                                        ? PRIORITY_BTN_ACTIVE[p]
                                        : "text-slate-400 border-slate-200 bg-white hover:border-slate-300"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={addTodo}
                            className="ml-auto px-5 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-bold text-sm shadow-md shadow-violet-200 hover:scale-105 hover:shadow-violet-300 transition-all active:scale-95"
                        >
                            + Add Task
                        </button>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {(["all", "active", "completed"] as Filter[]).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl border text-sm font-bold capitalize transition-all ${filter === f
                                    ? "bg-violet-500 text-white border-violet-500 shadow-md shadow-violet-200"
                                    : "text-slate-500 border-slate-200 bg-white hover:border-violet-300 hover:text-violet-500"
                                }`}
                        >
                            {f}
                            <span className={`rounded-full px-2 py-0.5 text-xs ${filter === f ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"}`}>
                                {f === "all" ? totalCount : f === "active" ? activeCount : completedCount}
                            </span>
                        </button>
                    ))}
                    {completedCount > 0 && (
                        <button
                            onClick={clearCompleted}
                            className="ml-auto px-3 py-1.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-500 text-xs font-bold hover:bg-rose-100 transition-colors"
                        >
                            Clear Completed
                        </button>
                    )}
                </div>

                {/* Todo List */}
                <div className="flex flex-col gap-3">
                    {filteredTodos.length === 0 ? (
                        <div className="text-center py-16 bg-white/60 border border-dashed border-violet-200 rounded-2xl backdrop-blur-md">
                            <span className="text-5xl block mb-3">🎉</span>
                            <p className="text-slate-400 text-sm font-medium">
                                {filter === "completed"
                                    ? "No completed tasks yet!"
                                    : filter === "active"
                                        ? "All tasks complete — great job!"
                                        : "No tasks yet. Add your first task above!"}
                            </p>
                        </div>
                    ) : (
                        filteredTodos.map((todo) => (
                            <div
                                key={todo.id}
                                className={`flex items-center gap-3 bg-white/80 border border-white/90 rounded-2xl px-5 py-4 backdrop-blur-md shadow-sm hover:shadow-md transition-all ${todo.completed ? "opacity-60" : ""
                                    }`}
                            >
                                {/* Checkbox */}
                                <button
                                    onClick={() => toggleTodo(todo.id)}
                                    aria-label="Toggle todo"
                                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${todo.completed
                                            ? "bg-gradient-to-br from-violet-500 to-pink-500 border-transparent shadow-sm"
                                            : "bg-white border-slate-300 hover:border-violet-400"
                                        }`}
                                >
                                    {todo.completed && (
                                        <span className="text-white text-xs font-extrabold">✓</span>
                                    )}
                                </button>

                                {/* Text */}
                                <span
                                    className={`flex-1 text-sm font-medium transition-all ${todo.completed ? "line-through text-slate-400" : "text-slate-700"
                                        }`}
                                >
                                    {todo.text}
                                </span>

                                {/* Priority Badge */}
                                <span
                                    className={`px-2.5 py-0.5 rounded-full border text-xs font-bold capitalize flex-shrink-0 ${PRIORITY_STYLES[todo.priority]}`}
                                >
                                    {todo.priority}
                                </span>

                                {/* Delete */}
                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    aria-label="Delete todo"
                                    className="text-slate-300 hover:text-rose-400 transition-colors text-sm px-1.5 py-1 rounded-md flex-shrink-0 hover:bg-rose-50"
                                >
                                    ✕
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
