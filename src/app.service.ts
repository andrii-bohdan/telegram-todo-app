import { Injectable } from '@nestjs/common';
import { Markup } from 'telegraf';
import { List } from './interface/index.interface';

@Injectable()
export class AppService {
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

  showList(title: string | null, todo: Array<List>): string {
    return `${title}\n\n${todo
      .map(
        (list) =>
          `<b>${Number(list.id)}.</b> <i>${list.author}</i> ${
            list.isCompleted ? '✅' : '⏱'
          } \n\n - ${list.description}\r\n\n`,
      )
      .join(' ')}`;
  }

  deleteTodo(todo: Array<List>, id: number): any {
    return todo.filter((list) => list.id !== id);
  }
}
