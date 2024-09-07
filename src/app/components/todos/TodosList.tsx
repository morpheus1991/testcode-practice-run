import React from 'react';
import { Todo } from './type';
import TodosItem from './TodosItem';

type Props = {
  todos: Todo[];
  deleteTodo: (id: Todo['id']) => void;
  updateTodo: (todo: Todo) => void;
};
function TodosList({ todos, deleteTodo, updateTodo }: Props) {
  return (
    <ul className="">
      {todos.map((todo) => (
        <TodosItem
          key={todo.id}
          todo={todo}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
        ></TodosItem>
      ))}
    </ul>
  );
}

export default TodosList;
