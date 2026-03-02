"use client";

import { useState } from "react";

export default function Counter() {
    const [count, setCount] = useState<number>(0);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Simple Counter</h1>
            <h2>{count}</h2>

            <button onClick={() => setCount(count + 1)}>Increment</button>
            <button onClick={() => setCount(count - 1)}>Decrement</button>
            <button onClick={() => setCount(0)}>Reset</button>
        </div>
    );
}