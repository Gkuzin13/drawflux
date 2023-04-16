import { fireEvent, render, screen } from '@testing-library/react';
import ControlPanel from './ControlPanel';

describe('ControlPanel', () => {
  it('calls handleControl when clicked', () => {
    const handleControl = vi.fn();

    render(
      <ControlPanel
        enabledControls={{ undo: true, redo: true, deleteSelectedNodes: true }}
        onControl={handleControl}
      />,
    );

    fireEvent.click(screen.getByTitle(/Redo/));
    fireEvent.click(screen.getByTitle(/Undo/));
    fireEvent.click(screen.getByTitle(/Delete/));

    expect(handleControl).toBeCalledTimes(3);
  });
});
