import { MENU_PANEL_ACTIONS } from '@/constants/menu';
import { fireEvent, render, screen } from '@testing-library/react';
import MenuPanel from './MenuPanel';

describe('MenuPanel', () => {
  const toggleRegexp = /Toggle Menu/i;
  const menuContentRegexp = /menu-panel-content/i;

  it('should open and close the menu', () => {
    render(<MenuPanel onAction={vi.fn()} />);

    const toggleButton = screen.getByTitle(toggleRegexp);

    fireEvent.click(toggleButton);
    expect(screen.getByTestId(menuContentRegexp)).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.queryByTestId(menuContentRegexp)).toBeNull();
  });

  it('should close the menu on click away', () => {
    const { container } = render(<MenuPanel onAction={vi.fn()} />);

    const toggleButton = screen.getByTitle(toggleRegexp);

    fireEvent.click(toggleButton);

    fireEvent.mouseDown(container);

    expect(screen.queryByTestId(menuContentRegexp)).toBeNull();
  });

  it('should open the menu, call onAction and close it', () => {
    const onAction = vi.fn();

    render(<MenuPanel onAction={onAction} />);

    const toggleButton = screen.getByTitle(toggleRegexp);

    fireEvent.click(toggleButton);

    fireEvent.click(
      screen.getByTitle(new RegExp(MENU_PANEL_ACTIONS[0].name, 'i')),
    );

    expect(onAction).toBeCalledTimes(1);
    expect(screen.queryByTestId(menuContentRegexp)).toBeNull();
  });
});
