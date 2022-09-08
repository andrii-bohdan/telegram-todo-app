import { Context } from './commons/interface/context.interface';
import { isNumber } from './commons/utils/isNumber.utils';
import { Injectable } from '@nestjs/common';
import { Todo } from '@prisma/client';
import { PrismaService } from './commons/prisma/prisma.service';
import { Message as MessageFromUser } from 'telegraf/typings/core/types/typegram';
import * as moment from 'moment';
import { greetings } from './commons/utils/greetings.utils';
@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  public startBot(ctx: Context): string {
    const currentTime = moment().format('HH');
    const greeting = greetings(currentTime);
    return `${greeting} ${ctx.from.first_name} ${ctx.from.last_name}`;
  }

  async getTodoList(): Promise<Todo[]> {
    return await this.prisma.todo.findMany();
  }

  async createTodo(todo: MessageFromUser.TextMessage): Promise<any> {
    const { message_id, from, text } = todo;
    const storeTodo = await this.prisma.todo.create({
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

  async deleteTodo(id: string): Promise<Todo> {
    const drop = await this.prisma.todo.delete({
      where: {
        id: isNumber(id),
      },
    });
    return drop;
  }

  async completeTodo(id: string): Promise<Todo> {
    return await this.prisma.todo.update({
      where: {
        id: isNumber(id),
      },
      data: {
        completed: true,
      },
    });
  }

  async removeAllTodos() {
    return await this.prisma.todo.deleteMany({});
  }

  async editTodo(message: string): Promise<Todo> {
    const [todoId, description] = message.trim().split('. ');
    return await this.prisma.todo.update({
      where: {
        id: isNumber(todoId),
      },
      data: {
        description,
      },
    });
  }
}
