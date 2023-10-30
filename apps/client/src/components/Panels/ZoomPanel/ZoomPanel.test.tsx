import { fireEvent, render, screen } from '@testing-library/react';
import ZoomPanel from './ZoomPanel';

describe('ZoomPanel', () => {
  it('should call handleZoomChange when zoom in clicked', () => {
    const handleZoomChange = vi.fn();

    render(<ZoomPanel value={100} onZoomChange={handleZoomChange} />);

    fireEvent.click(screen.getByTestId('zoom-in-button'));

    expect(handleZoomChange).toHaveBeenCalledTimes(1);
  });

  it('should call handleZoomChange when zoom out clicked', () => {
    const handleZoomChange = vi.fn();

    render(<ZoomPanel value={100} onZoomChange={handleZoomChange} />);

    fireEvent.click(screen.getByTestId('zoom-out-button'));

    expect(handleZoomChange).toHaveBeenCalledTimes(1);
  });

  it('should call handleZoomChange when zoom reset clicked', () => {
    const handleZoomChange = vi.fn();

    render(<ZoomPanel value={120} onZoomChange={handleZoomChange} />);

    fireEvent.click(screen.getByTestId('zoom-reset-button'));

    expect(handleZoomChange).toHaveBeenCalledTimes(1);
  });
});
