'use client';
import React, { useState } from 'react';

function Example() {
  // 상태는 컴포넌트 내부에 있다.
  // 테스트 코드에서는 컴포넌트 단위로 실행한다.

  // 만약 이게 토스트기라면, 상태는 토스트기 내부 깊숙한 . 곳어딘가에 있는 부품에 가깝다.
  // 우리가 토스트기가 . 잘작동하는지 평가하는데 있어서, 그 부품을 보지 않아도 가능하다.

  // 어떻게 평가하는가? 주어진 인터페이스 (손잡이, 버튼, 타이머 등)을 조작해서 정상 동작 여부를 판단할  수 있다.

  //내부 스테이트를 찍어볼 생각을 하는 것은 잘못된 접근이다.,
  //주어진 인터페이스를 조작하여, 정상 결과가 나오는지에 집중하면 된다.

  const [counter, setCounter] = useState(0);

  const increase = () => {
    setCounter(counter + 1);
  };
  const decrease = () => {
    setCounter(counter - 1);
  };

  return (
    <div>
      <span>{counter}</span>
      <button
        onClick={() => {
          increase();
        }}
      >
        plus
      </button>
      <button
        onClick={() => {
          decrease();
        }}
      >
        minus
      </button>
    </div>
  );
}

export default Example;
