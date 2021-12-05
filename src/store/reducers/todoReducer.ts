import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Todo, TodoStatus} from '../../types/Todo';
import {TodosState} from '../../types/TodosState';
import axios from 'axios';

const url = `http://localhost:5003/`;

export const fetchUsers = () => async (dispatch: any) => {
  dispatch(usersLoading());
  const response = await axios.get(`${url}deals`);
  dispatch(usersReceived(response.data));
};

let initialState: TodosState = {
  loading: 'idle',
  todo: [],
  editingTodo: null,
};

// Helper function to get respective todo list based on status
const getTodoOriginByStatus = (status: TodoStatus, state: TodosState) => {
  return state.todo;
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    usersLoading(state) {
      // Use a "state machine" approach for loading state instead of booleans
      if (state.loading === 'idle') {
        state.loading = 'pending';
      }
    },

    usersReceived(state, action) {
      if (state.loading === 'pending') {
        state.loading = 'idle';
        state.todo = action.payload;
      }
    },

    addTodo: (state: TodosState, action: PayloadAction<Todo>) => {
      const {status} = action.payload;
      const todo = action.payload;
      axios.post(`${url}deals`, todo);

      switch (status) {
        case TodoStatus.Todo:
          state.todo.push(todo);
          break;
      }
    },

    updateTodo: (state: TodosState, {
      payload: {
        todo,
        prevStatus
      }
    }: PayloadAction<{ todo: Todo; prevStatus: TodoStatus }>) => {
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
        axios.put(`${url}deal/${todo.id}`, todo);
      }

      state.editingTodo = null;
    },

    removeTodo: (state: TodosState, {payload: {id, status}}: PayloadAction<Todo>) => {
      const origin = getTodoOriginByStatus(status, state);
      const todo = origin.find((todo) => todo.id === id);

      todo && origin.splice(state.todo.indexOf(todo), 1);
      axios.delete(`${url}deal/${id}`);
    },

    setEditingTodo: (state: TodosState, action: PayloadAction<Todo>) => {
      state.editingTodo = action.payload;
    },

    dismissEditingTodo: (state: TodosState) => {
      state.editingTodo = null;
    },

    reorderTodos: (state: TodosState, {payload: {todos, type}}: PayloadAction<{ todos: Todo[]; type: TodoStatus }>) => {
      if (type === TodoStatus.Todo) state.todo = todos;
      axios.put(`${url}deals`, todos);
    },

    crossColumnReorder: (
      state: TodosState,
      {
        payload: {source, sourceStatus, destination, destinationStatus},
      }: PayloadAction<{ source: Todo[]; sourceStatus: TodoStatus; destination: Todo[]; destinationStatus: TodoStatus }>
    ) => {
      if (sourceStatus === TodoStatus.Todo) state.todo = source;

      if (destinationStatus === TodoStatus.Todo) state.todo = destination;

    },
  },
});


export const {
  usersLoading,
  usersReceived,
  addTodo,
  updateTodo,
  setEditingTodo,
  dismissEditingTodo,
  removeTodo,
  reorderTodos,
  crossColumnReorder
} = todoSlice.actions;

export default todoSlice.reducer;


