import {DragDropContext, DropResult} from 'react-beautiful-dnd';
import {useDispatch, useSelector} from 'react-redux';
import {
  crossColumnReorder,
  reorderTodos
} from '../store/reducers/todoReducer';
import {RootStore} from '../store/store';
import {Todo, TodoStatus} from '../types/Todo';
import Column from './Column';
import styles from './styles/Board.module.scss';
import React from 'react';

const reorder = (list: Todo[], startIndex: number, endIndex: number): Todo[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const move = (source: Todo[], destination: Todo[], droppableSource: any, droppableDestination: any) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);
  return [sourceClone, destClone];
};

interface IBoardProps {
  child?: React.ReactElement<typeof Column>[];
}

const Board: React.FC<IBoardProps> = (props) => {
  const dispatch = useDispatch();
  const {todo} = useSelector((store: RootStore) => store.todos);

  const getList = () => {
    return {todos: todo, status: TodoStatus.Todo};
  };

  const onDragEnd = (result: DropResult) => {
    const {source, destination} = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const {todos, status} = getList();
      const items = reorder(todos, result.source.index, destination.index);
      dispatch(reorderTodos({todos: items, type: status}));
    } else {
      const sourceList = getList();
      const destinationList = getList();

      const [updatedSource, updatedDestination] = move(sourceList.todos, destinationList.todos, source, destination);

      dispatch(
        crossColumnReorder({
          source: updatedSource.map((t) => ({...t, status: sourceList.status})),
          sourceStatus: sourceList.status,
          destination: updatedDestination.map((t) => ({...t, status: destinationList.status})),
          destinationStatus: destinationList.status,
        })
      );
    }
  };

  return (
    <div className={styles.board}>
      <DragDropContext onDragEnd={onDragEnd}>{props.children}</DragDropContext>
    </div>
  );
};

export default Board;
