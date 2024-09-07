import { render, screen } from '@testing-library/react';
import { Todo } from './type';
import TodosList from './TodosList';

describe('TodosList', () => {
  const mockDeleteTodo = () => jest.fn();
  const mockUpdateTodo = () => jest.fn();
  const mockTodos: Todo[] = [
    { id: 1, content: 'aa', done: false },
    { id: 2, content: 'bb', done: false },
  ];

  it('갯수대로 그리는지 체크', () => {
    render(
      <TodosList
        todos={mockTodos}
        deleteTodo={mockDeleteTodo}
        updateTodo={mockUpdateTodo}
      />,
    );
    expect(screen.getAllByTestId('todolist-item').length).toBe(2);
  });
});
