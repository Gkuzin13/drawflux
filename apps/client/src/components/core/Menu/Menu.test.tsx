import { fireEvent, render, screen } from '@testing-library/react';
import Menu from './Menu';

describe('Menu', () => {
  it('should open the menu, call onAction when item is clicked and close it', () => {
    const onAction = vi.fn();

    render(
      <Menu>
        <Menu.Toggle>Toggle Menu</Menu.Toggle>
        <Menu.Dropdown>
          <Menu.Label>Label</Menu.Label>
          <Menu.Item onItemClick={onAction}>Item</Menu.Item>
        </Menu.Dropdown>
      </Menu>,
    );

    fireEvent.click(screen.getByText(/Toggle Menu/i));
    fireEvent.click(screen.getByText(/Item/i));

    expect(onAction).toBeCalledTimes(1);
    expect(screen.queryByText(/Label/i)).toBeNull();
  });
});
