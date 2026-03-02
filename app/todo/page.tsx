"use client";

import { useState, useEffect, useRef } from "react";

type Priority = "low" | "medium" | "high";

interface Todo {
    id: string;
    text: string;
    completed: boolean;
    priority: Priority;
    createdAt: number;
}

type Filter = "all" | "active" | "completed";

const PRIORITY_COLORS: Record<Priority, string> = {
    low: "#4ade80",
    medium: "#facc15",
    high: "#f87171",
};

const PRIORITY_BG: Record<Priority, string> = {
    low: "rgba(74,222,128,0.15)",
    medium: "rgba(250,204,21,0.15)",
    high: "rgba(248,113,113,0.15)",
};

export default function TodoPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [input, setInput] = useState("");
    const [priority, setPriority] = useState<Priority>("medium");
    const [filter, setFilter] = useState<Filter>("all");
    const [mounted, setMounted] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem("todos-nextapp");
        if (stored) {
            setTodos(JSON.parse(stored));
        }
        setMounted(true);
    }, []);

    // Persist to localStorage
    useEffect(() => {
        if (mounted) {
            localStorage.setItem("todos-nextapp", JSON.stringify(todos));
        }
    }, [todos, mounted]);

    const addTodo = () => {
        const trimmed = input.trim();
        if (!trimmed) return;
        const newTodo: Todo = {
            id: crypto.randomUUID(),
            text: trimmed,
            completed: false,
            priority,
            createdAt: Date.now(),
        };
        setTodos((prev) => [newTodo, ...prev]);
        setInput("");
        inputRef.current?.focus();
    };

    const toggleTodo = (id: string) => {
        setTodos((prev) =>
            prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
        );
    };

    const deleteTodo = (id: string) => {
        setTodos((prev) => prev.filter((t) => t.id !== id));
    };

    const clearCompleted = () => {
        setTodos((prev) => prev.filter((t) => !t.completed));
    };

    const filteredTodos = todos.filter((t) => {
        if (filter === "active") return !t.completed;
        if (filter === "completed") return t.completed;
        return true;
    });

    const totalCount = todos.length;
    const completedCount = todos.filter((t) => t.completed).length;
    const activeCount = totalCount - completedCount;

    if (!mounted) return null;

    return (
        <div style={styles.pageWrapper}>
            {/* Animated background blobs */}
            <div style={{ ...styles.blob, ...styles.blob1 }} />
            <div style={{ ...styles.blob, ...styles.blob2 }} />

            <div style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                    <h1 style={styles.title}>✅ My Tasks</h1>
                    <p style={styles.subtitle}>Stay organized, stay productive</p>
                </div>

                {/* Stats Bar */}
                <div style={styles.statsBar}>
                    <div style={styles.statItem}>
                        <span style={styles.statNumber}>{totalCount}</span>
                        <span style={styles.statLabel}>Total</span>
                    </div>
                    <div style={styles.statDivider} />
                    <div style={styles.statItem}>
                        <span style={{ ...styles.statNumber, color: "#60a5fa" }}>
                            {activeCount}
                        </span>
                        <span style={styles.statLabel}>Active</span>
                    </div>
                    <div style={styles.statDivider} />
                    <div style={styles.statItem}>
                        <span style={{ ...styles.statNumber, color: "#4ade80" }}>
                            {completedCount}
                        </span>
                        <span style={styles.statLabel}>Done</span>
                    </div>
                </div>

                {/* Input Area */}
                <div style={styles.inputCard}>
                    <input
                        ref={inputRef}
                        style={styles.input}
                        type="text"
                        value={input}
                        placeholder="What needs to be done?"
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addTodo()}
                    />
                    {/* Priority Selector */}
                    <div style={styles.priorityRow}>
                        <span style={styles.priorityLabel}>Priority:</span>
                        {(["low", "medium", "high"] as Priority[]).map((p) => (
                            <button
                                key={p}
                                style={{
                                    ...styles.priorityBtn,
                                    background:
                                        priority === p ? PRIORITY_BG[p] : "transparent",
                                    color: priority === p ? PRIORITY_COLORS[p] : "#888",
                                    borderColor:
                                        priority === p ? PRIORITY_COLORS[p] : "transparent",
                                }}
                                onClick={() => setPriority(p)}
                            >
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                            </button>
                        ))}
                        <button style={styles.addBtn} onClick={addTodo}>
                            + Add Task
                        </button>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div style={styles.filterRow}>
                    {(["all", "active", "completed"] as Filter[]).map((f) => (
                        <button
                            key={f}
                            style={{
                                ...styles.filterBtn,
                                background:
                                    filter === f
                                        ? "rgba(99,102,241,0.25)"
                                        : "transparent",
                                color: filter === f ? "#a5b4fc" : "#888",
                                borderColor:
                                    filter === f ? "#6366f1" : "transparent",
                            }}
                            onClick={() => setFilter(f)}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                            <span style={styles.filterCount}>
                                {f === "all"
                                    ? totalCount
                                    : f === "active"
                                        ? activeCount
                                        : completedCount}
                            </span>
                        </button>
                    ))}
                    {completedCount > 0 && (
                        <button style={styles.clearBtn} onClick={clearCompleted}>
                            Clear Completed
                        </button>
                    )}
                </div>

                {/* Todo List */}
                <div style={styles.list}>
                    {filteredTodos.length === 0 ? (
                        <div style={styles.emptyState}>
                            <span style={styles.emptyIcon}>🎉</span>
                            <p style={styles.emptyText}>
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
                                style={{
                                    ...styles.todoItem,
                                    opacity: todo.completed ? 0.65 : 1,
                                }}
                            >
                                {/* Checkbox */}
                                <button
                                    style={{
                                        ...styles.checkbox,
                                        background: todo.completed
                                            ? "#6366f1"
                                            : "transparent",
                                        borderColor: todo.completed ? "#6366f1" : "#555",
                                    }}
                                    onClick={() => toggleTodo(todo.id)}
                                    aria-label="Toggle todo"
                                >
                                    {todo.completed && (
                                        <span style={styles.checkmark}>✓</span>
                                    )}
                                </button>

                                {/* Text */}
                                <span
                                    style={{
                                        ...styles.todoText,
                                        textDecoration: todo.completed
                                            ? "line-through"
                                            : "none",
                                        color: todo.completed ? "#666" : "#e2e8f0",
                                    }}
                                >
                                    {todo.text}
                                </span>

                                {/* Priority Badge */}
                                <span
                                    style={{
                                        ...styles.badge,
                                        color: PRIORITY_COLORS[todo.priority],
                                        background: PRIORITY_BG[todo.priority],
                                        borderColor: PRIORITY_COLORS[todo.priority],
                                    }}
                                >
                                    {todo.priority}
                                </span>

                                {/* Delete */}
                                <button
                                    style={styles.deleteBtn}
                                    onClick={() => deleteTodo(todo.id)}
                                    aria-label="Delete todo"
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

const styles: Record<string, React.CSSProperties> = {
    pageWrapper: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0c29, #1a1a2e, #16213e)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "40px 16px 80px",
        position: "relative",
        overflow: "hidden",
    },
    blob: {
        position: "absolute",
        borderRadius: "50%",
        filter: "blur(80px)",
        opacity: 0.3,
        pointerEvents: "none",
    },
    blob1: {
        width: 400,
        height: 400,
        background: "radial-gradient(circle, #6366f1, transparent)",
        top: -100,
        left: -100,
    },
    blob2: {
        width: 350,
        height: 350,
        background: "radial-gradient(circle, #8b5cf6, transparent)",
        bottom: -80,
        right: -80,
    },
    container: {
        width: "100%",
        maxWidth: 640,
        position: "relative",
        zIndex: 1,
    },
    header: {
        textAlign: "center",
        marginBottom: 32,
    },
    title: {
        fontSize: 42,
        fontWeight: 800,
        background: "linear-gradient(90deg, #a5b4fc, #818cf8, #c4b5fd)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        margin: 0,
        letterSpacing: "-1px",
    },
    subtitle: {
        color: "#64748b",
        marginTop: 8,
        fontSize: 15,
    },
    statsBar: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        padding: "16px 32px",
        marginBottom: 20,
        backdropFilter: "blur(12px)",
    },
    statItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: 700,
        color: "#e2e8f0",
        lineHeight: 1,
    },
    statLabel: {
        fontSize: 12,
        color: "#64748b",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },
    statDivider: {
        width: 1,
        height: 36,
        background: "rgba(255,255,255,0.08)",
    },
    inputCard: {
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 18,
        padding: "20px 24px",
        marginBottom: 16,
        backdropFilter: "blur(12px)",
    },
    input: {
        width: "100%",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 12,
        padding: "14px 18px",
        fontSize: 16,
        color: "#e2e8f0",
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.2s",
    },
    priorityRow: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginTop: 14,
        flexWrap: "wrap",
    },
    priorityLabel: {
        fontSize: 13,
        color: "#64748b",
        marginRight: 2,
    },
    priorityBtn: {
        padding: "5px 14px",
        borderRadius: 20,
        border: "1px solid",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 600,
        transition: "all 0.2s",
        textTransform: "capitalize",
    },
    addBtn: {
        marginLeft: "auto",
        padding: "8px 22px",
        borderRadius: 12,
        border: "none",
        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
        color: "#fff",
        fontWeight: 700,
        fontSize: 14,
        cursor: "pointer",
        transition: "transform 0.1s, box-shadow 0.2s",
        boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
    },
    filterRow: {
        display: "flex",
        gap: 8,
        alignItems: "center",
        marginBottom: 16,
        flexWrap: "wrap",
    },
    filterBtn: {
        padding: "7px 16px",
        borderRadius: 10,
        border: "1px solid",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: 6,
        transition: "all 0.2s",
    },
    filterCount: {
        background: "rgba(255,255,255,0.1)",
        borderRadius: 20,
        padding: "1px 7px",
        fontSize: 11,
    },
    clearBtn: {
        marginLeft: "auto",
        padding: "7px 14px",
        borderRadius: 10,
        border: "1px solid rgba(248,113,113,0.3)",
        background: "rgba(248,113,113,0.1)",
        color: "#f87171",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 600,
        transition: "all 0.2s",
    },
    list: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },
    emptyState: {
        textAlign: "center",
        padding: "60px 20px",
        background: "rgba(255,255,255,0.03)",
        borderRadius: 18,
        border: "1px dashed rgba(255,255,255,0.08)",
    },
    emptyIcon: {
        fontSize: 48,
        display: "block",
        marginBottom: 12,
    },
    emptyText: {
        color: "#64748b",
        fontSize: 15,
    },
    todoItem: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        padding: "14px 18px",
        backdropFilter: "blur(10px)",
        transition: "all 0.2s",
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 8,
        border: "2px solid",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "all 0.2s",
    },
    checkmark: {
        color: "#fff",
        fontSize: 13,
        fontWeight: 700,
    },
    todoText: {
        flex: 1,
        fontSize: 15,
        transition: "all 0.2s",
    },
    badge: {
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        border: "1px solid",
        textTransform: "capitalize",
        flexShrink: 0,
    },
    deleteBtn: {
        background: "transparent",
        border: "none",
        color: "#475569",
        cursor: "pointer",
        fontSize: 14,
        padding: "4px 8px",
        borderRadius: 6,
        transition: "color 0.2s",
        flexShrink: 0,
    },
};
