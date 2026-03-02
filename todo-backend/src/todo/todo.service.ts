import { Injectable } from '@nestjs/common';
import { Todo, Priority } from './todo.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TodoService {
    private todos: Todo[] = [];

    findAll(): Todo[] {
        return this.todos;
    }

    create(text: string, priority: Priority): Todo {
        const newTodo: Todo = {
            id: uuidv4(),
            text,
            completed: false,
            priority,
            createdAt: Date.now(),
        };
        this.todos.unshift(newTodo);
        return newTodo;
    }

    toggle(id: string): Todo | null {
        const todo = this.todos.find((t) => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            return todo;
        }
        return null;
    }

    delete(id: string): boolean {
        const initialLength = this.todos.length;
        this.todos = this.todos.filter((t) => t.id !== id);
        return this.todos.length < initialLength;
    }

    clearCompleted(): void {
        this.todos = this.todos.filter((t) => !t.completed);
    }

    setTodos(todos: Todo[]): void {
        this.todos = todos;
    }
}
