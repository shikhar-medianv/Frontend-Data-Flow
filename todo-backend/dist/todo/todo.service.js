"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
let TodoService = class TodoService {
    todos = [];
    findAll() {
        return this.todos;
    }
    create(text, priority) {
        const newTodo = {
            id: (0, uuid_1.v4)(),
            text,
            completed: false,
            priority,
            createdAt: Date.now(),
        };
        this.todos.unshift(newTodo);
        return newTodo;
    }
    toggle(id) {
        const todo = this.todos.find((t) => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            return todo;
        }
        return null;
    }
    delete(id) {
        const initialLength = this.todos.length;
        this.todos = this.todos.filter((t) => t.id !== id);
        return this.todos.length < initialLength;
    }
    clearCompleted() {
        this.todos = this.todos.filter((t) => !t.completed);
    }
    setTodos(todos) {
        this.todos = todos;
    }
};
exports.TodoService = TodoService;
exports.TodoService = TodoService = __decorate([
    (0, common_1.Injectable)()
], TodoService);
//# sourceMappingURL=todo.service.js.map