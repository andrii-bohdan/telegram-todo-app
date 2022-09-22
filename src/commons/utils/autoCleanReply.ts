import { Context } from 'telegraf';

export const autoCleanReply = async (ctx: Context, message: string) => {
  return new Promise(async (resolve) => {
    const reply = await ctx.reply(message);
    setTimeout(async () => {
      resolve(await ctx.deleteMessage(reply.message_id));
    }, 2000);
  });
};
