import { TodoService } from './todo.service';
import { Priority } from './todo.interface';
export declare class TodoController {
    private readonly todoService;
    constructor(todoService: TodoService);
    findAll(): import("./todo.interface").Todo[];
    create(data: {
        text: string;
        priority: Priority;
    }): import("./todo.interface").Todo;
    toggle(id: string): import("./todo.interface").Todo | null;
    remove(id: string): boolean;
    clearCompleted(): void;
}
