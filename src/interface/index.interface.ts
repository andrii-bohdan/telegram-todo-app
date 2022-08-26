import { Context as ContextTelegraf } from 'telegraf';
export interface Context extends ContextTelegraf {
  session: {
    type?: 'done' | 'edit' | 'delete' | 'create' | 'list';
  };
}

export interface List {
  id: number;
  description: string;
  author?: string;
  isCompleted?: boolean;
  date: string;
}

export interface OptionList extends List {
  title?: string;
}

export enum ContexType {
  DONE = 'done',
  EDIT = 'edit',
  DELETE = 'delete',
  CREATE = 'create',
  LIST = 'list',
}
