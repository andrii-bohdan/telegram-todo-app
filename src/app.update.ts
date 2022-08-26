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

let _deleteTodoList: any;

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  @Start()
  async startBot(ctx: Context) {
    await ctx.reply(
      'Welcome!\n\nCreate a new todo',
      this.appService.actionButtons(),
    );
  }

  @Hears('Todo list 📃')
  async getList(ctx: Context) {
    const todoList = await this.appService.getTodoList();
    if (!todoList.length) await ctx.reply('No todo list available');
    _deleteTodoList = await ctx.replyWithHTML(
      this.appService.showList('Todo list', todoList),
    );
    await ctx.deleteMessage();
  }

  @Hears('Edit todo 📝')
  async editList(ctx: Context) {
    ctx.session.type = 'edit';
    await ctx.deleteMessage();
  }

  @Hears('Remove todo ❌')
  async deleteList(ctx: Context) {
    ctx.session.type = 'delete';
    await ctx.deleteMessage();
    await ctx.reply('Type number to delete todo');
  }

  @Hears('Task completed ✅')
  async completeTodo(ctx: Context) {
    ctx.session.type = 'done';
    await ctx.deleteMessage();
  }

  @On('text')
  async getMessage(
    @Ctx() ctx: Context,
    @Message() msg: MessageFromUser.TextMessage,
  ) {
    const { message_id, from, date, text } = msg;

    switch (ctx.session.type) {
      case 'edit':
        console.log('edit', text);
        ctx.session.type = 'create';
        break;
      case 'delete':
        const deleteTodo = await this.appService.deleteTodo(text);
        if (!deleteTodo) await ctx.reply('Please insert a number value');
        this.getList(ctx);
        ctx.session.type = 'create';
        break;
      case 'done':
        console.log('done', text);
        ctx.session.type = 'create';
        break;
      default:
        await this.appService.createTodo(msg);
        this.getList(ctx);

        break;
    }
  }
}
