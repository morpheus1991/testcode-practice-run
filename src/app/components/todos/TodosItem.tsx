import React, { useState } from 'react';
import { Todo } from './type';
import { click } from '@testing-library/user-event/dist/cjs/convenience/click.js';
type Props = {
  todo: Todo;
  deleteTodo: (id: Todo['id']) => void;
  updateTodo: (todo: Todo) => void;
};
function TodosItem({ todo, deleteTodo, updateTodo }: Props) {
  const [todosContent, setTodosContent] = useState(todo.content);
  const [isModify, setIsModify] = useState(false);

  return (
    <li data-testid={'todolist-item'}>
      <label>
        <input
          type="checkbox"
          name=""
          id=""
          value={todosContent}
          onChange={(e) => {
            updateTodo({
              ...todo,
              done: e.target.checked,
            });
          }}
          checked={todo.done}
        />
        {isModify ? <input type="text" name="" id="" /> : todo.content}
      </label>
      <button
        onClick={() => {
          setIsModify((prev) => {
            const next = !prev;

            next === false && updateTodo({ ...todo, content: todosContent });
            return next;
          });
        }}
      >
        {isModify ? '저장' : '수정'}
      </button>
      <button
        onClick={() => {
          deleteTodo(todo.id);
        }}
      >
        삭제
      </button>
    </li>
  );
}

export default TodosItem;
