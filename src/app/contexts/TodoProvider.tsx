'use client';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Todo } from '../components/todos/type';

type TodoContext = {
  todos: Todo[];
  add: (text: string) => void;
  update: (todo: Todo) => void;
  delete: (id: number) => void;
};

const TodoContext = createContext<TodoContext | null>(null);

type Props = {
  children: ReactNode;
};

const TodoProvider = ({ children }: Props) => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const add = (text: string) => {
    setTodos((prevTodos) => [
      ...prevTodos,
      { id: Date.now(), content: text, done: false },
    ]);
  };

  const update = (updatedTodo: Todo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo,
      ),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  return (
    <TodoContext.Provider value={{ todos, add, update, delete: deleteTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

export default TodoProvider;

export const useTodosContext = () => {
  const context = useContext(TodoContext);
  if (context === null) {
    throw new Error('useTodosContext must be used within a TodoProvider');
  }
  return context;
};
