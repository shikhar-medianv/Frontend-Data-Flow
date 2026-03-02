import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Priority } from './todo.interface';

@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) { }

    @Get()
    findAll() {
        return this.todoService.findAll();
    }

    @Post()
    create(@Body() data: { text: string; priority: Priority }) {
        return this.todoService.create(data.text, data.priority);
    }

    @Patch(':id/toggle')
    toggle(@Param('id') id: string) {
        return this.todoService.toggle(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.todoService.delete(id);
    }

    @Delete('completed')
    clearCompleted() {
        return this.todoService.clearCompleted();
    }
}
