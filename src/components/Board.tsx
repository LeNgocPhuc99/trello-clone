"use client";
import { useBoardStore } from "@/store/BoardStore";
import { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "./Column";
const Board = () => {
  const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore(
    (state) => [
      state.board,
      state.getBoard,
      state.setBoardState,
      state.updateTodoInDB,
    ]
  );

  useEffect(() => {
    getBoard();
  }, []);

  const handleOnDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    // check if user dragged card outside of board
    if (!destination) return;

    // Handle column drag
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      // get the source column and remove it from the old index
      const [removed] = entries.splice(source.index, 1);
      // push it to new index
      entries.splice(destination.index, 0, removed);
      const reRangedColumn = new Map(entries);
      setBoardState({
        ...board,
        columns: reRangedColumn,
      });
    }

    // For re-building column (droppableId <=> column's index)
    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];

    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };

    const finishCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    };

    if (!startCol || !finishCol) return;

    if (source.index === destination.index && startCol === finishCol) return;

    // remove todo task from the old index
    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);

    if (startCol.id === finishCol.id) {
      // case 1: same column
      newTodos.splice(destination.index, 0, todoMoved);

      // create new col
      const newCol: Column = {
        id: startCol.id,
        todos: newTodos,
      };

      // update columns
      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);

      setBoardState({ ...board, columns: newColumns });
    } else {
      // case 2: different column
      const finishTodos = Array.from(finishCol.todos);
      // update todos list
      finishTodos.splice(destination.index, 0, todoMoved);

      // update columns
      const newColumns = new Map(board.columns);

      const newCol: Column = {
        id: startCol.id,
        todos: newTodos,
      };

      // source column
      newColumns.set(startCol.id, newCol);
      // destination column
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      });

      // update DB
      updateTodoInDB(todoMoved, finishCol.id);

      // update state
      setBoardState({ ...board, columns: newColumns });
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
