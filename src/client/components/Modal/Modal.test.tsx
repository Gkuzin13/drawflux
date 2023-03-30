import { fireEvent, render, screen } from '@testing-library/react';
import Modal from './Modal';

describe('Modal', () => {
  it('should call handleClose on click close', () => {
    const handleClose = vi.fn();

    render(<Modal title="foo" message="bar" onClose={handleClose} />);

    fireEvent.click(screen.getByTitle(/Close/i));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should call handleClose on click away', async () => {
    const handleClose = vi.fn();

    const { container } = render(
      <Modal title="foo" message="bar" onClose={handleClose} />,
    );

    fireEvent.mouseDown(container);
    fireEvent.touchStart(container);

    expect(handleClose).toHaveBeenCalledTimes(2);
  });
});
