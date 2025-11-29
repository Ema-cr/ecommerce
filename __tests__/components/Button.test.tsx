import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/button/Button';

describe('Button Component', () => {
  it('renders button with label text', () => {
    render(<Button label="Click me" />);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables button when disabled prop is true', () => {
    render(<Button label="Disabled" disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('does not call onClick when button is disabled', () => {
    const handleClick = jest.fn();
    render(<Button label="Disabled" disabled onClick={handleClick} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders with correct type attribute', () => {
    const { rerender } = render(<Button label="Submit" type="submit" />);
    let button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');

    rerender(<Button label="Button" type="button" />);
    button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('has default type="button" when type not specified', () => {
    render(<Button label="Default" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('accepts and applies aria-label attribute', () => {
    render(<Button label="Click" aria-label="Custom label" />);
    const button = screen.getByRole('button', { name: /custom label/i });
    expect(button).toBeInTheDocument();
  });

  it('has proper styling classes', () => {
    render(<Button label="Styled" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-4', 'py-2', 'rounded-md', 'border');
  });
});
