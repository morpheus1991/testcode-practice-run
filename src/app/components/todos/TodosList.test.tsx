import { render, screen } from '@testing-library/react';
import { Todo } from './type';
import TodosList from './TodosList';
import userEvent from '@testing-library/user-event';

// note
// TodosList는 무엇을 테스트해야할까?
// 넘겨주는 CRUD함수들이 호출되는지는 체크하는 것이 적절하겠다.
// 아이템 3개를 넘기면 3개가 그려지는지 체크가 필요하겠다.
// 위에 두가지 사항을 제외하고, 나머지 아이템을 눌러서 호출이 되는지에 대한것,
// 아이템 체크 및 체크해제에 대한 것들은 TodosItem에서 체크해야하는 부분이다.
describe('TodosList', () => {
  const mockDeleteTodo = jest.fn();
  const mockUpdateTodo = jest.fn();
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

  it('deleteTodo 함수가 올바르게 호출되는지 확인', async () => {
    const user = userEvent.setup();
    render(
      <TodosList
        todos={mockTodos}
        deleteTodo={mockDeleteTodo}
        updateTodo={mockUpdateTodo}
      />,
    );
    const deleteButtons = screen.getAllByText('삭제');
    await user.click(deleteButtons[0]);
    expect(mockDeleteTodo).toHaveBeenCalledWith(1);
  });

  it('updateTodo 함수가 올바르게 호출되는지 확인', async () => {
    const user = userEvent.setup();
    render(
      <TodosList
        todos={mockTodos}
        deleteTodo={mockDeleteTodo}
        updateTodo={mockUpdateTodo}
      />,
    );
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);
    expect(mockUpdateTodo).toHaveBeenCalledWith({
      ...mockTodos[0],
      done: true,
    });
  });
});
