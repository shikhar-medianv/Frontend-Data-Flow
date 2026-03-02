"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const todo_service_1 = require("./todo.service");
let TodoGateway = class TodoGateway {
    todoService;
    server;
    constructor(todoService) {
        this.todoService = todoService;
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
        client.emit('todo:all', this.todoService.findAll());
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    async handleAddTodo(data) {
        const newTodo = this.todoService.create(data.text, data.priority);
        this.broadcastUpdate();
        return newTodo;
    }
    handleToggleTodo(id) {
        const updated = this.todoService.toggle(id);
        if (updated) {
            this.broadcastUpdate();
        }
        return updated;
    }
    handleDeleteTodo(id) {
        const success = this.todoService.delete(id);
        if (success) {
            this.broadcastUpdate();
        }
        return success;
    }
    handleClearCompleted() {
        this.todoService.clearCompleted();
        this.broadcastUpdate();
    }
    broadcastUpdate() {
        this.server.emit('todo:update', this.todoService.findAll());
        this.fireWebhookNotification('todos_updated', this.todoService.findAll());
    }
    async fireWebhookNotification(event, data) {
        console.log(`Firing outgoing webhook: ${event}`);
    }
};
exports.TodoGateway = TodoGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], TodoGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('todo:add'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TodoGateway.prototype, "handleAddTodo", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('todo:toggle'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TodoGateway.prototype, "handleToggleTodo", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('todo:delete'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TodoGateway.prototype, "handleDeleteTodo", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('todo:clear-completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TodoGateway.prototype, "handleClearCompleted", null);
exports.TodoGateway = TodoGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [todo_service_1.TodoService])
], TodoGateway);
//# sourceMappingURL=todo.gateway.js.map