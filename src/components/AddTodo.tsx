import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {v4 as uuidv4} from 'uuid';
import {addTodo, dismissEditingTodo, updateTodo} from '../store/reducers/todoReducer';
import {RootStore} from '../store/store';
import {TodoStatus} from '../types/Todo';
import Modal from './shared/Modal';
import styles from './styles/AddTodo.module.scss';

const AddTodo: React.FC = () => {
  const dispatch = useDispatch();
  const {todo, editingTodo} = useSelector((store: RootStore) => store.todos);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todoTitle, setTodoTitle] = useState('');
  const [todoDescription, setTodoDescription] = useState('');
  const [todoStatus, setTodoStatus] = useState<TodoStatus>(TodoStatus.Todo);

  useEffect(() => {
    if (editingTodo) {
      setIsModalOpen(true);
      setTodoTitle(editingTodo.name);
      setTodoDescription(editingTodo.text);
      setTodoStatus(editingTodo.status);
    }
  }, [editingTodo]);

  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const todo = {
      id: editingTodo ? editingTodo.id : uuidv4(),
      name: todoTitle,
      text: todoDescription,
      status: todoStatus,
    };
    dispatch(editingTodo ? updateTodo({todo, prevStatus: editingTodo.status}) : addTodo(todo));

    setIsModalOpen(false);
    setTodoTitle('');
    setTodoDescription('');
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setTodoTitle('');
    setTodoDescription('');
    setTodoStatus(TodoStatus.Todo);
    setTimeout(() => dispatch(dismissEditingTodo()), 500);
  };

  const totalTasks = todo.length;

  return (
    <>
      <Modal visible={isModalOpen} closeHandler={() => resetForm()}>
        <form className={styles.addTodoForm} onSubmit={(e) => handleAddTodo(e)}>
          <h4>{editingTodo ? 'Edit Todo' : 'Add New Todo'}</h4>
          <label htmlFor="title">Title</label>
          <input
            name="title"
            id="title"
            className={styles.textInput}
            value={todoTitle}
            onChange={(e) => setTodoTitle(e.target.value)}
            type="text"
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            value={todoDescription}
            onChange={(e) => setTodoDescription(e.target.value)}
            className={styles.textInput}
            name="description"
            id="description"
            rows={3}
          />

          <div>
            <button className={[styles.button, styles.success].join(' ')} type="submit">
              {editingTodo ? 'Update Todo' : 'Save Todo'}
            </button>
            <button
              onClick={() => {
                resetForm();
              }}
              type="button"
              className={[styles.button, styles.danger].join(' ')}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      <div className={styles.addTodo}>
        <button type="submit" onClick={() => setIsModalOpen(true)}
                className={[styles.button, styles.primary].join(' ')}>
          New Todo
        </button>
        <p className={styles.summary}>
          {totalTasks} task{totalTasks > 1 ? 's' : ''}
        </p>
      </div>
    </>
  );
};
export default AddTodo;
