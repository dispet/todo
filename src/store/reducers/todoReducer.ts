import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo, TodoStatus } from '../../types/Todo';
import { TodosState } from '../../types/TodosState';

const url = `http:/localhost:5003/`;


// axios.get(`${url}deals`).then( response =>
//     this.setState({TodosState : response})
// );

// const persistedTodos = () => {
//   try {
//     // const persistedState = localStorage.getItem('todos');
//     axios.get(`${url}deals`).then( response =>
//         this.initialState = response
//     );
//     if (persistedState) return persistedState as unknown as TodosState;
//     // if (persistedState) return JSON.parse(persistedState) as TodosState;
//   } catch (e) {
//     console.log(e);
//   }
// };

const  persistedTodos = async () => {
  const response = await fetch(`${url}deals`);
  // const persistedState = localStorage.getItem('todos');
  if (!response.ok) {
    throw new Error(`Could not fetch ${url}deals received ${response.status}`);
  }
  try {
    return await response.json()
  } catch (e) {
    console.log(e);
  }
};

let initialState: TodosState = {
  todo: [],
  editingTodo: null,
};

persistedTodos().then( res => (res) ? initialState = { todo: res.todo,editingTodo: null } : initialState)

// Helper function to get respective todo list based on status
const getTodoOriginByStatus = (status: TodoStatus, state: TodosState) => {
      return state.todo;
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state: TodosState, action: PayloadAction<Todo>) => {
      const { status } = action.payload;
      const todo = action.payload;

      switch (status) {
        case TodoStatus.Todo:
          state.todo.push(todo);
          break;
      }
    },

    updateTodo: (state: TodosState, { payload: { todo, prevStatus } }: PayloadAction<{ todo: Todo; prevStatus: TodoStatus }>) => {
      const origin = getTodoOriginByStatus(prevStatus, state);
      const index = origin.findIndex((t) => t.id === todo.id);

      if (index > -1) {
        // Todo status changed
        // We need to remove it from the current array and add it to the respective array
        if (todo.status !== prevStatus) {
          const newOrigin = getTodoOriginByStatus(todo.status, state);
          origin.splice(index, 1);
          newOrigin.push(todo);
        } else {
          origin[index] = todo;
        }
      }

      state.editingTodo = null;
    },

    removeTodo: (state: TodosState, { payload: { id, status } }: PayloadAction<Todo>) => {
      const origin = getTodoOriginByStatus(status, state);
      const todo = origin.find((todo) => todo.id === id);

      todo && origin.splice(state.todo.indexOf(todo), 1);
    },

    setEditingTodo: (state: TodosState, action: PayloadAction<Todo>) => {
      state.editingTodo = action.payload;
    },

    dismissEditingTodo: (state: TodosState) => {
      state.editingTodo = null;
    },

    reorderTodos: (state: TodosState, { payload: { todos, type } }: PayloadAction<{ todos: Todo[]; type: TodoStatus }>) => {
      if (type === TodoStatus.Todo) state.todo = todos;
    },

    crossColumnReorder: (
      state: TodosState,
      {
        payload: { source, sourceStatus, destination, destinationStatus },
      }: PayloadAction<{ source: Todo[]; sourceStatus: TodoStatus; destination: Todo[]; destinationStatus: TodoStatus }>
    ) => {
      if (sourceStatus === TodoStatus.Todo) state.todo = source;

      if (destinationStatus === TodoStatus.Todo) state.todo = destination;
    },
  },
});

export const { addTodo, updateTodo, setEditingTodo, dismissEditingTodo, removeTodo, reorderTodos, crossColumnReorder } = todoSlice.actions;

export default todoSlice.reducer;
