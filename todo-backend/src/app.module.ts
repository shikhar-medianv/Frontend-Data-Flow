import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TodoModule } from './todo/todo.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TodoModule,
    WebhookModule,
  ],
})
export class AppModule { }
