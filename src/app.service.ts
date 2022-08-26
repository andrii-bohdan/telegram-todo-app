import { isNumber } from './commons/utils/isNumber.utils';
import { Injectable } from '@nestjs/common';
import { TodoApp } from '@prisma/client';
import { PrismaService } from './commons/prisma/prisma.service';
import { Message as MessageFromUser } from 'telegraf/typings/core/types/typegram';
@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getTodoList(): Promise<TodoApp[]> {
    return await this.prisma.todoApp.findMany();
  }

  async createTodo(todo: MessageFromUser.TextMessage): Promise<any> {
    const { message_id, from, date, text } = todo;
    const storeTodo = await this.prisma.todoApp.create({
      data: {
        id: message_id,
        description: text,
        author: `${from.first_name} ${from.last_name}`,
      },
    });

    if (!storeTodo) {
      throw new Error("Can't store todo");
    }

    return storeTodo;
  }

  async deleteTodo(id: string): Promise<TodoApp> {
    const drop = await this.prisma.todoApp.delete({
      where: {
        id: isNumber(id),
      },
    });
    return drop;
  }

  async completeTodo(id: string): Promise<TodoApp> {
    return await this.prisma.todoApp.update({
      where: {
        id: isNumber(id),
      },
      data: {
        completed: true,
      },
    });
  }

  async removeAllTodos() {
    return await this.prisma.todoApp.deleteMany({});
  }

  async editTodo(message: string): Promise<TodoApp> {
    const [todoId, description] = message.trim().split('. ');
    return await this.prisma.todoApp.update({
      where: {
        id: isNumber(todoId),
      },
      data: {
        description,
      },
    });
  }
}
