import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TodoGateway } from './todo.gateway';

@Module({
    controllers: [TodoController],
    providers: [TodoService, TodoGateway],
    exports: [TodoService],
})
export class TodoModule { }
