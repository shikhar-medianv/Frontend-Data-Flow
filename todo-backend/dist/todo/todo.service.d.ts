import { Todo, Priority } from './todo.interface';
export declare class TodoService {
    private todos;
    findAll(): Todo[];
    create(text: string, priority: Priority): Todo;
    toggle(id: string): Todo | null;
    delete(id: string): boolean;
    clearCompleted(): void;
    setTodos(todos: Todo[]): void;
}
