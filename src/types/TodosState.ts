import { Todo } from './Todo';

export type TodosState = {
  loading: string,
  todo: Todo[];
  editingTodo: Todo | null;
};
