import { AppService } from './app.service';
import {
  Ctx,
  Hears,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { Message as MessageFromUser } from 'telegraf/typings/core/types/typegram';
import { Context } from './commons/interface/context.interface';
import {
  actionButtons,
  showTodoList,
} from './commons/template/telegram.template';
import { autoCleanReply } from './commons/utils/autoCleanReply';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  @Start()
  async startBot(ctx: Context) {
    const startMessage = this.appService.startBot(ctx);
    await ctx.reply(startMessage, actionButtons());
  }

  @Hears('Todo list 📃')
  async getList(ctx: Context) {
    const todoList = await this.appService.getTodoList();
    const user = await this.appService.findUserById(todoList[0].authorId);
    if (!todoList.length) {
      await ctx.reply('No todo list available');
    } else {
      await ctx.replyWithHTML(showTodoList('Todo list', { user, todoList }));
      await ctx.deleteMessage();
      ctx.session.type = 'create';
    }
  }

  @Hears('Edit todo 📝')
  async editList(ctx: Context) {
    ctx.session.type = 'edit';
    await ctx.deleteMessage();
    await ctx.reply('Edit todo:\n\n\tExample: 1. Milk');
  }

  @Hears('Remove todo ❌')
  async deleteList(ctx: Context) {
    ctx.session.type = 'delete';
    await ctx.deleteMessage();
    await ctx.reply('Type number to delete todo');
  }

  @Hears('Task completed ✅')
  async completeTodo(ctx: Context) {
    await ctx.deleteMessage();
    ctx.session.type = 'done';
    await ctx.reply('Insert number of todo:');
  }

  @Hears('Remove all todo ❌')
  async removeAllTodos(ctx: Context) {
    ctx.session.type = 'create';
    await ctx.deleteMessage();
    const dropAll = await this.appService.removeAllTodos();
    if (!dropAll) {
      await ctx.reply('Unable remove all todos');
    }
    await autoCleanReply(ctx, 'All todos was removed successfully');
  }

  @On('text')
  async getMessage(
    @Ctx() ctx: Context,
    @Message() msg: MessageFromUser.TextMessage,
  ) {
    switch (ctx.session.type) {
      case 'edit':
        ctx.session.type = 'create';
        const edit = await this.appService.editTodo(msg.text);
        if (!edit) {
          await ctx.reply('Unable to update todo ⛔');
        }
        await autoCleanReply(ctx, 'Todo was updated succesfully');
        break;
      case 'delete':
        ctx.session.type = 'create';
        const deleteTodo = await this.appService.deleteTodo(msg.text);
        if (!deleteTodo) {
          await ctx.reply('Please insert a number value');
        }
        await autoCleanReply(ctx, 'Todos was deleted successfully');
        break;
      case 'done':
        ctx.session.type = 'create';
        const complete = await this.appService.completeTodo(msg.text);
        if (!complete) {
          await ctx.reply('Cannot complete todos!');
        }
        await autoCleanReply(ctx, 'Todo is completed');
        break;

      case 'create':
        await this.appService.createTodo(msg);
        await autoCleanReply(ctx, 'Todo successfully created');
        break;
      default:
        break;
    }
  }
}
