import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TodoService } from './todo.service';
import { Priority, Todo } from './todo.interface';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class TodoGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private readonly todoService: TodoService) { }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
        // Send current todos on connection
        client.emit('todo:all', this.todoService.findAll());
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('todo:add')
    async handleAddTodo(@MessageBody() data: { text: string; priority: Priority }) {
        const newTodo = this.todoService.create(data.text, data.priority);
        this.broadcastUpdate();
        return newTodo;
    }

    @SubscribeMessage('todo:toggle')
    handleToggleTodo(@MessageBody() id: string) {
        const updated = this.todoService.toggle(id);
        if (updated) {
            this.broadcastUpdate();
        }
        return updated;
    }

    @SubscribeMessage('todo:delete')
    handleDeleteTodo(@MessageBody() id: string) {
        const success = this.todoService.delete(id);
        if (success) {
            this.broadcastUpdate();
        }
        return success;
    }

    @SubscribeMessage('todo:clear-completed')
    handleClearCompleted() {
        this.todoService.clearCompleted();
        this.broadcastUpdate();
    }

    private broadcastUpdate() {
        this.server.emit('todo:update', this.todoService.findAll());
        this.fireWebhookNotification('todos_updated', this.todoService.findAll());
    }

    private async fireWebhookNotification(event: string, data: any) {
        // This is a placeholder for outgoing webhooks
        console.log(`Firing outgoing webhook: ${event}`);
        // In a real scenario, use axios to POST to a list of configured URLs
    }
}
