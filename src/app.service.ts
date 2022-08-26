import { Injectable } from '@nestjs/common';
import { TodoApp } from '@prisma/client';
import { Markup } from 'telegraf';
import { PrismaService } from './commons/prisma/prisma.service';
import { Message as MessageFromUser } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  actionButtons() {
    return Markup.keyboard(
      [
        Markup.button.callback('Todo list 📃', 'list'),
        Markup.button.callback('Edit todo 📝', 'edit'),
        Markup.button.callback('Remove todo ❌', 'remove'),
        Markup.button.callback('Task completed ✅', 'done'),
      ],
      {
        columns: 2,
      },
    );
  }

  showList(title: string | null, todo: TodoApp[]): string {
    return `<b>${title}</b>\n\n\t${todo
      .map(
        (list) =>
          `<b>${Number(list.id)}.</b> <i>${list.author}</i> ${
            list.completed ? '✅' : '⏱'
          } \n\n\t - ${list.description}\r\n\n`,
      )
      .join(' ')}`;
  }

  async deleteTodo(id: string): Promise<TodoApp> {
    const pattern: RegExp = /^\d+\.?\d*$/;
    if (!pattern.test(id)) {
      throw new Error('Please type number to delete todo');
    }

    const drop = await this.prisma.todoApp.delete({
      where: {
        id: Number(id),
      },
    });
    return drop;
  }

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
}
