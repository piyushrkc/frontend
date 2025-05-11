// src/components/ui/__tests__/button.test.tsx
import React from 'react';
import { render, screen } from '@/tests/test-utils';
import userEvent from '@testing-library/user-event';
import Button from '../button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click Me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary-600');
    expect(button).not.toBeDisabled();
  });

  it('renders with custom className', () => {
    render(
      <Button className="custom-class">
        Custom Button
      </Button>
    );
    
    const button = screen.getByRole('button', { name: /custom button/i });
    expect(button).toHaveClass('custom-class');
  });

  it('renders as disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    
    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50 cursor-not-allowed');
  });

  it('renders with different variants', () => {
    const { rerender } = render(
      <Button variant="secondary">Secondary Button</Button>
    );
    
    let button = screen.getByRole('button', { name: /secondary button/i });
    expect(button).toHaveClass('bg-secondary-600');
    
    rerender(<Button variant="danger">Danger Button</Button>);
    button = screen.getByRole('button', { name: /danger button/i });
    expect(button).toHaveClass('bg-red-600');
    
    rerender(<Button variant="outline">Outline Button</Button>);
    button = screen.getByRole('button', { name: /outline button/i });
    expect(button).toHaveClass('border-2');
    expect(button).not.toHaveClass('bg-primary-600');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(
      <Button size="sm">Small Button</Button>
    );
    
    let button = screen.getByRole('button', { name: /small button/i });
    expect(button).toHaveClass('px-3 py-1.5 text-sm');
    
    rerender(<Button size="md">Medium Button</Button>);
    button = screen.getByRole('button', { name: /medium button/i });
    expect(button).toHaveClass('px-4 py-2 text-base');
    
    rerender(<Button size="lg">Large Button</Button>);
    button = screen.getByRole('button', { name: /large button/i });
    expect(button).toHaveClass('px-6 py-3 text-lg');
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(
      <Button onClick={handleClick}>
        Clickable Button
      </Button>
    );
    
    const button = screen.getByRole('button', { name: /clickable button/i });
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with loading state', () => {
    render(<Button isLoading>Loading Button</Button>);
    
    const button = screen.getByRole('button', { name: /loading button/i });
    expect(button).toBeDisabled();
    
    // Check if the loading spinner is rendered
    const loadingSpinner = screen.getByTestId('loading-spinner');
    expect(loadingSpinner).toBeInTheDocument();
  });

  it('renders as full width when fullWidth prop is true', () => {
    render(<Button fullWidth>Full Width Button</Button>);
    
    const button = screen.getByRole('button', { name: /full width button/i });
    expect(button).toHaveClass('w-full');
  });
});