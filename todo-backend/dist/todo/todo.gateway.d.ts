import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TodoService } from './todo.service';
import { Priority, Todo } from './todo.interface';
export declare class TodoGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly todoService;
    server: Server;
    constructor(todoService: TodoService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleAddTodo(data: {
        text: string;
        priority: Priority;
    }): Promise<Todo>;
    handleToggleTodo(id: string): Todo | null;
    handleDeleteTodo(id: string): boolean;
    handleClearCompleted(): void;
    private broadcastUpdate;
    private fireWebhookNotification;
}
