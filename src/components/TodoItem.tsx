import {CSSProperties, forwardRef} from 'react';
import {DraggableProvidedDraggableProps, DraggableProvidedDragHandleProps} from 'react-beautiful-dnd';
import {useDispatch} from 'react-redux';
import {ReactComponent as EditIcon} from '../assets/edit.svg';
import {ReactComponent as RemoveIcon} from '../assets/remove.svg';
import {removeTodo, setEditingTodo} from '../store/reducers/todoReducer';
import {Todo} from '../types/Todo';
import styles from './styles/TodoItem.module.scss';

interface ITodoItemProps {
  todo: Todo;
  ref: HTMLDivElement;
  style: CSSProperties | undefined;
  dragHandleProps: DraggableProvidedDragHandleProps | undefined;
  draggableProps: DraggableProvidedDraggableProps;
}

const TodoItem = forwardRef<HTMLDivElement, ITodoItemProps>((props, ref) => {
  const dispatch = useDispatch();

  const getTodoStatusStyle = () => {
    return styles.todo;
  };

  return (
    <div
      className={[styles.todoItem, getTodoStatusStyle()].join(' ')}
      {...props.draggableProps}
      {...props.dragHandleProps}
      style={props.style}
      ref={ref}
    >
      <div className={styles.info}>
        <p className={styles.title}>{props.todo.name}</p>
        <p className={styles.description}>{props.todo.text}</p>
      </div>
      <div className={styles.actions}>
        <button
          className={[styles.actionButton, styles.edit].join(' ')}
          onClick={() => {
            dispatch(setEditingTodo(props.todo));
          }}
          aria-label="Edit"
        >
          <EditIcon/>
        </button>
        <button
          className={[styles.actionButton, styles.remove].join(' ')}
          onClick={() => {
            dispatch(removeTodo(props.todo));
          }}
          aria-label="Remove"
        >
          <RemoveIcon/>
        </button>
      </div>
    </div>
  );
});

export default TodoItem;
