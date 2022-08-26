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
import { Context, List } from './interface/index.interface';

const todoList: Array<List> = [];
let _hearsTemoraryMessage: any;

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  @Start()
  async startBot(ctx: Context) {
    await ctx.reply('Welcome!');
    await ctx.reply('Choose your action? ', this.appService.actionButtons());
  }

  @Hears('Todo list 📃')
  async getList(ctx: Context) {
    await ctx.deleteMessage();
    await ctx.replyWithHTML(this.appService.showList('Todos', todoList));
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
    _hearsTemoraryMessage = await ctx.reply('Type whitch id will be removed:');
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
        await ctx.deleteMessage(Number(_hearsTemoraryMessage.message_id));
        await ctx.deleteMessage();
        const removedTodo = this.appService.deleteTodo(todoList, Number(text));

        await ctx.replyWithHTML(this.appService.showList('Todos', removedTodo));
        ctx.session.type = 'create';
        break;
      case 'done':
        console.log('done', text);
        ctx.session.type = 'create';
        break;
      default:
        todoList.push({
          id: message_id,
          description: text,
          author: `${from.first_name} ${from.last_name}`,
          isCompleted: false,
          date: new Date().toISOString(),
        });
        await ctx.deleteMessage();
        _hearsTemoraryMessage = await ctx.replyWithHTML(
          this.appService.showList('Todo added', todoList),
        );

        if (_hearsTemoraryMessage.message_id) {
          setTimeout(async () => {
            await ctx.deleteMessage(_hearsTemoraryMessage.message_id);
          }, 500);
        }
        break;
    }
  }
}
