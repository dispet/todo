import {configureStore} from '@reduxjs/toolkit';
import todoReducer from './reducers/todoReducer';

const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});

export type RootStore = ReturnType<typeof store.getState>;

export default store;
