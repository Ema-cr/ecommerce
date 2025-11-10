import { render, screen, fireEvent } from '@testing-library/react';
import Counter from '@/components/counter/Counter';
;

describe('Counter component', () => {
  test('debería renderizar el contador inicial en 0', () => {
    render(<Counter />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('incrementa el contador al hacer clic en +', () => {
    render(<Counter />);
    const incrementButton = screen.getByText('+');
    fireEvent.click(incrementButton);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('decrementa el contador al hacer clic en -', () => {
    render(<Counter />);
    const decrementButton = screen.getByText('-');
    fireEvent.click(decrementButton);
    expect(screen.getByText('-1')).toBeInTheDocument();
  });

  test('resetea el contador al hacer clic en Reset', () => {
    render(<Counter />);
    const incrementButton = screen.getByText('+');
    const resetButton = screen.getByText('Reset');

    // incrementamos un poco
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    expect(screen.getByText('2')).toBeInTheDocument();

    // ahora reseteamos
    fireEvent.click(resetButton);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
