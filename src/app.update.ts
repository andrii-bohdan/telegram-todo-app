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

let _deletePrevTodoList: any;

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
    if (!todoList.length) {
      await ctx.reply('No todo list available');
    } else {
      _deletePrevTodoList = await ctx.replyWithHTML(
        showTodoList('Todo list', todoList),
      );
      await ctx.deleteMessage();
      ctx.session.type = 'create';
    }
  }

  @Hears('Edit todo 📝')
  async editList(ctx: Context) {
    ctx.session.type = 'edit';
    await ctx.deleteMessage();
    await ctx.reply(
      'Insert new name of todos:\n\n\tExample: 1. Milk\n\nPay attention of . ',
    );
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
    await ctx.reply('Insert number of todos:');
  }

  @Hears('Remove all todo ❌')
  async removeAllTodos(ctx: Context) {
    await ctx.deleteMessage();
    const dropAll = await this.appService.removeAllTodos();
    if (!dropAll) {
      await ctx.reply("Can't remove all todos");
    } else {
      ctx.session.type = 'create';
      await ctx.reply('All todos removed!');
    }
  }

  @On('text')
  async getMessage(
    @Ctx() ctx: Context,
    @Message() msg: MessageFromUser.TextMessage,
  ) {
    switch (ctx.session.type) {
      case 'edit':
        const edit = await this.appService.editTodo(msg.text);
        if (!edit) {
          await ctx.reply('Unable to update todo ⛔');
        } else {
          ctx.session.type = 'create';
          await this.getList(ctx);
        }

        break;
      case 'delete':
        const deleteTodo = await this.appService.deleteTodo(msg.text);
        if (!deleteTodo) {
          await ctx.reply('Please insert a number value');
        } else {
          await this.getList(ctx);
          ctx.session.type = 'create';
        }
        break;
      case 'done':
        ctx.session.type = 'create';
        const complete = await this.appService.completeTodo(msg.text);
        if (!complete) {
          await ctx.reply('Cannot complete todos!');
        } else {
          await this.getList(ctx);
        }

        break;

      case 'create':
        await this.appService.createTodo(msg);
        await this.getList(ctx);

        break;
      default:
        break;
    }
  }
}
