import { Todo } from './Todo';

export type TodosState = {
  todo: Todo[];
  editingTodo: Todo | null;
};
