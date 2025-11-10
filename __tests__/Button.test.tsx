import Button from '@/components/button/Button';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Button', () => {
  test('renderiza con el texto correcto', () => {
    render(<Button label="Click me" />);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

    test('dispara onClick al hacer clic', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button label="Click me" onClick={handleClick} />);
    await user.click(screen.getByRole('button', { name: /click me/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
}); 