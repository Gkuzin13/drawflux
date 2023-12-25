import { fireEvent, render, screen } from '@testing-library/react';
import ZoomPanel from './ZoomPanel';
import { ZOOM } from '@/constants/panels/zoom';
import { DEFAULT_ZOOM_VALUE } from '@/constants/app';

describe('ZoomPanel', () => {
  it('should call handleZoomChange when zoom in clicked', () => {
    const handleZoomChange = vi.fn();

    render(
      <ZoomPanel value={DEFAULT_ZOOM_VALUE} onZoomChange={handleZoomChange} />,
    );

    fireEvent.click(screen.getByTestId('zoom-in-button'));

    expect(handleZoomChange).toHaveBeenCalledTimes(1);
    expect(handleZoomChange).toHaveBeenCalledWith(ZOOM.in.value);
  });

  it('should call handleZoomChange when zoom out clicked', () => {
    const handleZoomChange = vi.fn();

    render(
      <ZoomPanel value={DEFAULT_ZOOM_VALUE} onZoomChange={handleZoomChange} />,
    );

    fireEvent.click(screen.getByTestId('zoom-out-button'));

    expect(handleZoomChange).toHaveBeenCalledTimes(1);
    expect(handleZoomChange).toHaveBeenCalledWith(ZOOM.out.value);
  });

  it('should call handleZoomChange when zoom reset clicked', () => {
    const handleZoomChange = vi.fn();

    render(
      <ZoomPanel value={1.5} onZoomChange={handleZoomChange} />,
    );

    fireEvent.click(screen.getByTestId('zoom-reset-button'));

    expect(handleZoomChange).toHaveBeenCalledTimes(1);
    expect(handleZoomChange).toHaveBeenCalledWith(ZOOM.reset.value);
  });
});
