import { Middleware } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';
import {
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    setTodos,
} from './todoSlice';

let socket: Socket;

export const socketMiddleware: Middleware = (store) => {
    return (next) => (action: any) => {
        // Initialize socket connection
        if (!socket && typeof window !== 'undefined') {
            socket = io('http://localhost:3001');

            socket.on('connect', () => {
                console.log('Connected to WebSocket server');
            });

            socket.on('todo:all', (todos) => {
                store.dispatch(setTodos(todos));
            });

            socket.on('todo:update', (todos) => {
                store.dispatch(setTodos(todos));
            });

            socket.on('disconnect', () => {
                console.log('Disconnected from WebSocket server');
            });
        }

        // Intercept actions to emit via WebSocket
        if (socket && socket.connected) {
            if (addTodo.match(action)) {
                socket.emit('todo:add', {
                    text: action.payload.text,
                    priority: action.payload.priority,
                });
                // We don't call next(action) here because we'll get the update from the server broadcast
                return;
            }

            if (toggleTodo.match(action)) {
                socket.emit('todo:toggle', action.payload);
                return;
            }

            if (deleteTodo.match(action)) {
                socket.emit('todo:delete', action.payload);
                return;
            }

            if (clearCompleted.match(action)) {
                socket.emit('todo:clear-completed');
                return;
            }
        }

        return next(action);
    };
};
