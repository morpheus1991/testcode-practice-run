import { fireEvent, render, screen, within } from '@testing-library/react';
import TodoProvider, { useTodosContext } from './TodoProvider';
import userEvent from '@testing-library/user-event';

type Props = { testId?: string };
const TestComponent = ({ testId = '' }: Props) => {
  const { todos, add, update, delete: deleteTodo } = useTodosContext();
  return (
    <div data-testid={testId}>
      <button onClick={() => add('새 할일')}>할일 추가</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.content}
            <button onClick={() => update({ ...todo, done: !todo.done })}>
              {todo.done ? '완료 취소' : '완료'}
            </button>
            <button onClick={() => deleteTodo(todo.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Note :
// TodoProvider는 무엇을 테스트 해야하나?
// 1. 프로바이더 내부에서 상태관리가 일관적인가
// 2. 프로바이더에서 전달하는 value (함수포함)가 정상적으로 바인딩 되는가. (CRUD 함수 실행시 정상동작 하는가)
// 3. 프로바이더 내부에 컴포넌트가 2벌 있어도 하나의 벨류를 공유하나?
// 4. 각각 다른 프로바이더를 감싼 컴포넌트들도 정상동작하나? 싱글톤 useTodosContext를 사용하는데 괜찮은가?
// -> 4번의 대한 답은, useTodosContext를 하나의 컨텍스트 객체를 참조하지만, 컨텍스트의 값은 컴포넌트의 트리상에서 어디에 위치하느냐에 따라 다르게 제공됨.

// Note :
// 테스트의 범위
// 프로바이더의 벨류를 받아 쓸 수 있는 테스트 전용 컴포넌트로 테스트함.
// 만약, TodoLIst를 구현했다면 그걸로 해도 됨, 하지만 가이드 상으로는 전용 테스트 컴포넌트를 작성하는 것을 추천함 (개인관점임)
// 그렇다면 벨류와 CRUD 펑션은 어떻게 확인해야하는가?
// 프로바이더 내부에 투두 구현체를 만들고, 그것의 인터페이스 (즉 유저사이드에서의 버튼 등)를 이용해서 테스트한다. (하단 코드  await user.click 참고)

describe('TodoProvider 테스트', () => {
  beforeEach(() => {
    render(
      <div>
        <TodoProvider>
          <TestComponent testId="test1" />
          <TestComponent testId="test2" />
        </TodoProvider>
        <TodoProvider>
          <TestComponent testId="test3" />
        </TodoProvider>
        f
      </div>,
    );
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('하나의 TestComponent에서 할일 추가, 완료, 삭제가 정상적으로 동작한다', async () => {
    const testComponent = screen.getByTestId('test1');
    const user = userEvent.setup();

    // 할일 추가
    await user.click(within(testComponent).getByText('할일 추가'));
    expect(within(testComponent).getByText('새 할일')).toBeInTheDocument();

    // 두 번째 할일 추가
    await user.click(within(testComponent).getByText('할일 추가'));
    expect(within(testComponent).getAllByText('새 할일')).toHaveLength(2);

    // 첫 번째 할일 완료
    await user.click(within(testComponent).getAllByText('완료')[0]);
    expect(within(testComponent).getByText('완료 취소')).toBeInTheDocument();

    // 두 번째 할일 삭제
    await user.click(within(testComponent).getAllByText('삭제')[1]);
    expect(within(testComponent).getAllByText('새 할일')).toHaveLength(1);

    // 남은 할일 삭제
    await user.click(within(testComponent).getByText('삭제'));
    expect(
      within(testComponent).queryByText('새 할일'),
    ).not.toBeInTheDocument();
  });

  it('두 개의 TestComponent에서 할일을 추가하면 모든 컴포넌트에 반영된다', async () => {
    const user = userEvent.setup();

    const test1 = screen.getByTestId('test1');
    const test2 = screen.getByTestId('test2');
    // 첫 번째 컴포넌트에서 할일 추가
    await user.click(within(test1).getByText('할일 추가'));
    expect(within(test1).getByText('새 할일')).toBeInTheDocument();
    expect(within(test2).getByText('새 할일')).toBeInTheDocument();

    // 두 번째 컴포넌트에서 할일 추가
    await user.click(within(test2).getByText('할일 추가'));
    expect(within(test1).getAllByText('새 할일')).toHaveLength(2);
    expect(within(test2).getAllByText('새 할일')).toHaveLength(2);

    // 첫 번째 컴포넌트에서 할일 완료
    await user.click(within(test1).getAllByText('완료')[0]);
    expect(within(test1).getByText('완료 취소')).toBeInTheDocument();
    expect(within(test2).getByText('완료 취소')).toBeInTheDocument();

    // 두 번째 컴포넌트에서 할일 삭제
    await user.click(within(test2).getAllByText('삭제')[1]);
    expect(within(test1).getAllByText('새 할일')).toHaveLength(1);
    expect(within(test2).getAllByText('새 할일')).toHaveLength(1);
  });

  it('서로 다른 TodoProvider의 TestComponent들은 상태를 공유하지 않는다', async () => {
    const user = userEvent.setup();
    const test1 = screen.getByTestId('test1');
    const test2 = screen.getByTestId('test2');
    const test3 = screen.getByTestId('test3');

    // 첫 번째 TodoProvider의 TestComponent에서 할일 추가
    await user.click(within(test1).getByText('할일 추가'));
    expect(within(test1).getByText('새 할일')).toBeInTheDocument();
    expect(within(test2).getByText('새 할일')).toBeInTheDocument();
    expect(within(test3).queryByText('새 할일')).not.toBeInTheDocument();

    // 두 번째 TodoProvider의 TestComponent에서 할일 추가
    await user.click(within(test3).getByText('할일 추가'));
    expect(within(test1).queryAllByText('새 할일')).toHaveLength(1);
    expect(within(test2).queryAllByText('새 할일')).toHaveLength(1);
    expect(within(test3).queryAllByText('새 할일')).toHaveLength(1);

    // 첫 번째 TodoProvider의 TestComponent에서 할일 완료
    await user.click(within(test1).getByText('완료'));
    expect(within(test1).getByText('완료 취소')).toBeInTheDocument();
    expect(within(test2).getByText('완료 취소')).toBeInTheDocument();
    expect(within(test3).queryByText('완료 취소')).not.toBeInTheDocument();

    // 두 번째 TodoProvider의 TestComponent에서 할일 삭제
    await user.click(within(test3).getByText('삭제'));
    expect(within(test1).getByText('새 할일')).toBeInTheDocument();
    expect(within(test2).getByText('새 할일')).toBeInTheDocument();
    expect(within(test3).queryByText('새 할일')).not.toBeInTheDocument();
  });
});
// ===========================================================================

// describe('User authentication tests', () => {
//   beforeAll(() => {
//     // 테스트 suite 시작 전 1회 실행
//     // jest.spyOn(global, 'fetch').mockImplementation(/* mock implementation */);
//   });

//   afterAll(() => {
//     // 테스트 suite 종료 후 1회 실행
//     jest.restoreAllMocks();
//   });

//   beforeEach(() => {
//     //   render(
//     //     <TodoProvider>
//     //       <TestComponent />
//     //     </TodoProvider>,
//     //   );
//     localStorage.clear();
//   });

//   afterEach(() => {
//     // 각 테스트 케이스 종료 후 실행
//     jest.clearAllMocks();
//   });

//   // 실제 테스트 케이스들...
// });
