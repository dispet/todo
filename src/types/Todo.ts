export type Todo = {
  id: string;
  name: string;
  text: string;
  status: TodoStatus;
};

export enum TodoStatus {
  Todo = 'Todo',
}
