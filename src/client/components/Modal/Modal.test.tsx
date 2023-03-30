import { fireEvent, render, screen } from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
  it('should call handleClose', () => {
    const handleClose = vi.fn();
    render(<Modal title="foo" message="bar" onClose={handleClose} />);

    fireEvent.click(screen.getByTitle(/Close/i));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
