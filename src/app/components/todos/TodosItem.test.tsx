import { render, screen } from '@testing-library/react';
import TodosItem from './TodosItem';
import userEvent from '@testing-library/user-event';

//note
// TodosItem의 테스트 범위는?
// 텍스트 렌더링,버튼들 렌더링 여부, / 수정버튼 눌렀을 때, 인풋창이 나오는지 여부,
// 버튼 클릭시 호출 되어야 할 함수가 호출 되는가?
//->함수호출 여부 및 호출조건을 확인 가능한 mock함수로  Props로 전달.
// test는 컴포넌트의 내부스테이트를 직접 조작하는 것이 아닌(직접조작도 거의 불가능함, 어려움)
// User에게 보여지는 인터페이스를 동작시켜(click 등) 함수 호출 여부만 체크해도 됨.

describe('todo item 테스트', () => {
  const mockDeleteTodo = jest.fn();
  const mockUpdateTodo = jest.fn();
  const mockTodo = {
    id: 4,
    content: '테스트 할일',
    done: false,
  };
  const user = userEvent.setup();

  beforeEach(() => {
    render(
      <TodosItem
        todo={mockTodo}
        deleteTodo={mockDeleteTodo}
        updateTodo={mockUpdateTodo}
      />,
    );
  });

  it('할일 내용이 올바르게 렌더링되는지 확인', async () => {
    expect(screen.getByText(mockTodo.content)).toBeInTheDocument();
  });

  it('체크박스가 존재하는지 확인', async () => {
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('수정 버튼이 존재하는지 확인', async () => {
    expect(screen.getByText('수정')).toBeInTheDocument();
  });

  it('수정 버튼 클릭 시 입력 필드로 변경되는지 확인', async () => {
    await user.click(screen.getByText('수정'));
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('저장')).toBeInTheDocument();
  });

  it('수정 버튼 클릭 시 content삭제하고, input랜더링 하는지 확인', async () => {
    await user.click(screen.getByText('수정'));
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('저장')).toBeInTheDocument();
    expect(screen.queryByText(mockTodo.content)).not.toBeInTheDocument();
  });

  it('수정 모드에서 저장 버튼 클릭 시 updateTodo가 호출되는지 확인', async () => {
    await user.click(screen.getByText('수정'));
    await user.click(screen.getByText('저장'));
    expect(mockUpdateTodo).toHaveBeenCalledWith(mockTodo);
  });

  it('체크박스 변경 시 updateTodo가 호출되는지 확인', async () => {
    await user.click(screen.getByRole('checkbox'));
    expect(mockUpdateTodo).toHaveBeenCalledWith({ ...mockTodo, done: true });
    await user.click(screen.getByRole('checkbox'));
    expect(mockUpdateTodo).toHaveBeenCalledWith({ ...mockTodo, done: false });
  });

  it('체크박스 2번 변경 시 updateTodo가 호출되는지 확인', async () => {
    await user.click(screen.getByRole('checkbox'));
    expect(mockUpdateTodo).toHaveBeenCalledWith({ ...mockTodo, done: false });
  });
});
