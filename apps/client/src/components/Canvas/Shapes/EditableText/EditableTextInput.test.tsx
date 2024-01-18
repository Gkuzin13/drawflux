import { Layer, Stage } from 'react-konva';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { createNode } from '@/utils/node';
import EditableTextInput from './EditableTextInput';

describe('EditableTextInput', () => {
  const node = createNode('text', [20, 20]);
  node.text = 'Hello World!';

  const initialValue = node.text as string;

  it('focused when mounted', () => {
    renderWithProviders(
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <EditableTextInput
            node={node}
            initialValue={initialValue}
            onChange={vi.fn}
            onUpdate={vi.fn}
          />
        </Layer>
      </Stage>,
    );

    const textArea = screen.getByTestId(/editable-text-input/);

    expect(textArea).toHaveFocus();
  });

  it('contains the correct textContent', () => {
    renderWithProviders(
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <EditableTextInput
            node={node}
            initialValue={initialValue}
            onChange={vi.fn}
            onUpdate={vi.fn}
          />
        </Layer>
      </Stage>,
    );

    const textArea = screen.getByTestId(/editable-text-input/);

    expect(textArea).toHaveTextContent(node.text as string);
  });

  it('calls onChange when user presses Escape', async () => {
    const onChange = vi.fn();

    const { user } = renderWithProviders(
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <EditableTextInput
            node={node}
            initialValue={initialValue}
            onChange={onChange}
            onUpdate={vi.fn}
          />
        </Layer>
      </Stage>,
    );

    const textArea = screen.getByTestId(/editable-text-input/);

    await user.keyboard('{Escape}');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({
      width: textArea.scrollWidth,
      height: textArea.scrollHeight,
      text: initialValue,
    });
  });

  it('calls onChange when user presses Enter', async () => {
    const onChange = vi.fn();

    const { user } = renderWithProviders(
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <EditableTextInput
            node={node}
            initialValue={initialValue}
            onChange={onChange}
            onUpdate={() => vi.fn()}
          />
        </Layer>
      </Stage>,
    );

    const textArea = screen.getByTestId(/editable-text-input/);

    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({
      width: textArea.scrollWidth,
      height: textArea.scrollHeight,
      text: initialValue,
    });
  });

  it('calls onUpdate when user is typing', async () => {
    const onUpdate = vi.fn();

    const { user } = renderWithProviders(
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <EditableTextInput
            node={node}
            initialValue={initialValue}
            onChange={vi.fn}
            onUpdate={onUpdate}
          />
        </Layer>
      </Stage>,
    );

    await user.keyboard('abc');

    expect(onUpdate).toHaveBeenCalledTimes(3);
    expect(onUpdate).toHaveBeenCalledWith('abc' + initialValue);
  });
});
