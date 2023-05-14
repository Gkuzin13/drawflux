import { fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { useClickAway } from './useClickAway';

describe('useClickAway', () => {
  const Target = ({ handler }: { handler: () => void }) => {
    const ref = useRef(null);

    useClickAway(ref, handler);

    return <div ref={ref} data-testid="inside-element"></div>;
  };

  it('should call the handler when clicked outside the ref element', async () => {
    const handler = vi.fn();

    render(
      <>
        <Target handler={handler} />
        <div data-testid="outside-element"></div>
      </>,
    );

    const insideElement = screen.getByTestId(/inside-element/);
    const outsideElement = screen.getByTestId(/outside-element/);

    fireEvent.mouseDown(outsideElement);
    expect(handler).toHaveBeenCalledTimes(1);

    fireEvent.mouseDown(insideElement);
    expect(handler).toHaveBeenCalledTimes(1);

    fireEvent.touchStart(outsideElement);
    expect(handler).toHaveBeenCalledTimes(2);

    fireEvent.touchStart(insideElement);
    expect(handler).toHaveBeenCalledTimes(2);
  });
});
