import { fireEvent, render, screen } from '@testing-library/react';
import Popover from './Popover';

describe('Popover', () => {
  it('should open dropdown correctly', () => {
    render(
      <Popover>
        <Popover.Toggle>Toggle</Popover.Toggle>
        <Popover.Dropdown>Popover Content</Popover.Dropdown>
      </Popover>,
    );

    fireEvent.click(screen.getByText(/Toggle/i));

    expect(screen.getByText(/Popover Content/i)).toBeInTheDocument();
  });

  it('should be initially opened and close on click away', async () => {
    const { container } = render(
      <Popover initiallyOpened={true}>
        <Popover.Toggle>Toggle</Popover.Toggle>
        <Popover.Dropdown>
          <div>Popover Content</div>
        </Popover.Dropdown>
      </Popover>,
    );

    expect(screen.getByText(/Popover Content/i)).toBeInTheDocument();

    fireEvent.mouseDown(container);
    fireEvent.touchStart(container);

    expect(screen.queryByText(/Popover Content/i)).toBeNull();
  });
});
