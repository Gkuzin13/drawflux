import { ZOOM } from '@/constants/zoom';
import { fireEvent, render, screen } from '@testing-library/react';
import ZoomPanel from './ZoomPanel';

describe('ZoomPanel', () => {
  it('should call handleZoomChange when clicked', () => {
    const handleZoomChange = vi.fn();

    render(<ZoomPanel value={100} onZoomChange={handleZoomChange} />);

    const zoomActions = Object.values(ZOOM);

    zoomActions.forEach((action) => {
      fireEvent.click(screen.getByTitle(new RegExp(action.name)));
    });

    expect(handleZoomChange).toHaveBeenCalledTimes(zoomActions.length);
  });
});
