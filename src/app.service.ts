import { Context } from './commons/interface/context.interface';
import { isNumber } from './commons/utils/isNumber.utils';
import { Injectable } from '@nestjs/common';
import { Todo, User } from '@prisma/client';
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
    const storeTodo = await this._upsertTodoUser(todo);
    if (!storeTodo) {
      throw new Error("Unable to create todo!");
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

  async findUserById(id: number) {
    return await this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  async _upsertTodoUser(todo: MessageFromUser.TextMessage) {
    return await this.prisma.user.upsert({
      where: { user_id: todo.from.id },
      update: {
        ...todo.from,
        todos: {
          create: [
            {
              message_id: todo.message_id,
              description: todo.text,
              completed: false,
            },
          ],
        },
      },
      create: {
        user_id: todo.from.id,
        ...(todo.from as User),
        todos: {
          create: [
            {
              message_id: todo.message_id,
              description: todo.text,
              completed: false,
            },
          ],
        },
      },
    });
  }
}
