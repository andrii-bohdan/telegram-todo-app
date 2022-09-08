import { Markup } from 'telegraf';
import { Todo } from '@prisma/client';
import * as moment from 'moment';

const actionButtons = () => {
  return Markup.keyboard(
    [
      Markup.button.callback('Todo list 📃', 'list'),
      Markup.button.callback('Edit todo 📝', 'edit'),
      Markup.button.callback('Remove todo ❌', 'remove'),
      Markup.button.callback('Task completed ✅', 'done'),
      Markup.button.callback('Remove all todo ❌', 'done'),
    ],
    {
      columns: 2,
    },
  );
};

const showTodoList = (title: string | null, todo: Todo[]): string => {
  const header = `<code>${title}</code>`;
  const space = {
    xs: '\t\t\t\t',
    md: '\t\t\t\t\t\t\t',
    lg: '\t\t\t\t\t\t\t\t\t',
    xl: '\t\t\t\t\t\t\t\t\t\t\t',
  };
  const newline = '\n\n\t';
  const template = `${header}\n\n\t${todo
    .map(
      (list) =>
        `<code>${Number(list.id)}</code>${space.xs}<b>Andriy</b>${
          space.xl
        }<code>${list.completed ? '✅' : '⏱'}</code>${newline}${
          list.completed
            ? `<s>${list.description}</s>`
            : `<pre>${list.description}</pre>`
        }${newline}<u>${moment(list.created_at).format(
          'dddd MM/YYYY - HH:mm:ss ',
        )}</u>${newline}`,
    )
    .join(' ')}`;

  return template;
};

export { actionButtons, showTodoList };
