import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Example from './Example';

describe('Example', () => {
  it('renders Example', () => {
    // Example.tsx주석 참고
    render(<Example></Example>);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
