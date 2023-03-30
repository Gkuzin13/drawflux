import { NodeStyle } from '@/client/shared/constants/element';
import { COLOR, LINE, SIZE, ANIMATED } from '@/client/shared/constants/style';
import { createNode } from '@/client/shared/utils/node';
import { fireEvent, render, screen } from '@testing-library/react';
import StylePanel from './StylePanel';

describe('StylePanel', () => {
  const mockNode = createNode('rectangle', [0, 0]);

  it('animated button is disabled when line is solid', () => {
    render(
      <StylePanel
        style={mockNode.style}
        enabledOptions={{ line: true, size: true }}
        onStyleChange={vi.fn()}
      />,
    );

    const animatedButton = screen.getByTitle(new RegExp(ANIMATED.name, 'i'));

    expect(animatedButton).toBeDisabled();
  });

  it('animated button is disabled when line is not solid', () => {
    const style: NodeStyle = { ...mockNode.style, line: [16, 8] };

    render(
      <StylePanel
        style={style}
        enabledOptions={{ line: true, size: true }}
        onStyleChange={vi.fn()}
      />,
    );

    const animatedButton = screen.getByTitle(new RegExp(ANIMATED.name, 'i'));

    expect(animatedButton).not.toBeDisabled();
  });

  it('calls handleStyleChange when clicked', () => {
    const handleStyleChange = vi.fn();

    const style: NodeStyle = { ...mockNode.style, line: [16, 8] };

    render(
      <StylePanel
        style={style}
        enabledOptions={{ line: true, size: true }}
        onStyleChange={handleStyleChange}
      />,
    );

    const styleValues = [
      ...COLOR,
      ...Object.values(LINE),
      ...Object.values(SIZE),
      ANIMATED,
    ];

    styleValues.forEach(({ name }) => {
      fireEvent.click(screen.getByTitle(new RegExp(`^${name}$`, 'i')));
    });

    expect(handleStyleChange).toBeCalledTimes(styleValues.length);
  });
});
