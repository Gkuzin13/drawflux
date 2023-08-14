/**
 * switch to happy-dom to bypass issue when jsdom is not receiving passed options through pointer fireEvent
 * https://github.com/testing-library/dom-testing-library/issues/558
 * @vitest-environment happy-dom
 */
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { renderWithProviders } from '@/test/test-utils';
import App from '@/App';

describe('select a tool and create an element', () => {
  it('rectangle', async () => {
    const { container, store } = renderWithProviders(<App />);

    const canvas = container.querySelector('canvas') as HTMLCanvasElement;

    // select rectangle tool
    await act(async () => {
      const tool = screen.getByTestId(/tool-button-rectangle/);
      tool.click();
    });

    // start at [10, 20]
    fireEvent.pointerDown(canvas, { clientX: 10, clientY: 20 });

    // move to [30, 40]
    fireEvent.pointerMove(canvas, { clientX: 30, clientY: 40 });

    // stop at last position
    fireEvent.pointerUp(canvas);

    const canvasState = store.getState().canvas.present;
    const node = canvasState.nodes[0];

    expect(canvasState.nodes).toHaveLength(1);
    expect(node.type).toEqual('rectangle');
    expect(node.nodeProps.point).toEqual([10, 20]);
    expect(node.nodeProps.width).toEqual(20); // 30 - 10;
    expect(node.nodeProps.height).toEqual(20); // 40 - 20;
  });

  it('ellipse', async () => {
    const { container, store } = renderWithProviders(<App />);

    const canvas = container.querySelector('canvas') as HTMLCanvasElement;

    // select ellipse tool
    await act(async () => {
      const tool = screen.getByTestId(/tool-button-ellipse/);
      tool.click();
    });

    // start at [10, 20]
    fireEvent.pointerDown(canvas, { clientX: 10, clientY: 20 });

    // move to [30, 40]
    fireEvent.pointerMove(canvas, { clientX: 30, clientY: 40 });

    // stop at last position
    fireEvent.pointerUp(canvas);

    const canvasState = store.getState().canvas.present;
    const node = canvasState.nodes[0];

    expect(canvasState.nodes).toHaveLength(1);
    expect(node.type).toEqual('ellipse');
    expect(node.nodeProps.point).toEqual([10, 20]);
    expect(node.nodeProps.width).toEqual(20); // 30 - 10;
    expect(node.nodeProps.height).toEqual(20); // 40 - 20;
  });

  it('arrow', async () => {
    const { container, store } = renderWithProviders(<App />);

    const canvas = container.querySelector('canvas') as HTMLCanvasElement;

    // select arrow tool
    await act(async () => {
      const tool = screen.getByTestId(/tool-button-arrow/);
      tool.click();
    });

    // start at [10, 20]
    fireEvent.pointerDown(canvas, { clientX: 10, clientY: 20 });

    // move to [30, 40]
    fireEvent.pointerMove(canvas, { clientX: 30, clientY: 40 });

    // stop at last position
    fireEvent.pointerUp(canvas);

    const canvasState = store.getState().canvas.present;
    const node = canvasState.nodes[0];

    expect(canvasState.nodes).toHaveLength(1);
    expect(node.type).toEqual('arrow');
    expect(node.nodeProps.point).toEqual([10, 20]);
    expect(node.nodeProps.points).toEqual([[30, 40]]);
  });

  it('draw', async () => {
    const { container, store } = renderWithProviders(<App />);

    const canvas = container.querySelector('canvas') as HTMLCanvasElement;

    // select draw tool
    await act(async () => {
      const tool = screen.getByTestId(/tool-button-draw/);
      tool.click();
    });

    // start at [10, 20]
    fireEvent.pointerDown(canvas, { clientX: 10, clientY: 20 });

    // move to [30, 40]
    fireEvent.pointerMove(canvas, { clientX: 30, clientY: 40 });

    // stop at last position
    fireEvent.pointerUp(canvas);

    const canvasState = store.getState().canvas.present;
    const node = canvasState.nodes[0];

    expect(canvasState.nodes).toHaveLength(1);
    expect(node.type).toEqual('draw');
    expect(node.nodeProps.point).toEqual([10, 20]);
    expect(node.nodeProps.points).toEqual([[30, 40]]);
  });

  it('text', async () => {
    const { container, store } = renderWithProviders(<App />);

    const canvas = container.querySelector('canvas') as HTMLCanvasElement;

    // select text tool
    await act(async () => {
      const tool = screen.getByTestId(/tool-button-text/);
      tool.click();
    });

    // press at [10, 20]
    fireEvent.pointerDown(canvas, { clientX: 10, clientY: 20 });
    fireEvent.pointerUp(canvas);

    // type 'Hello World!' and press enter
    await userEvent.type(screen.getByRole('textbox'), 'Hello World!{enter}');

    const canvasState = store.getState().canvas.present;
    const node = canvasState.nodes[0];

    expect(canvasState.nodes).toHaveLength(1);
    expect(node.type).toEqual('text');
    expect(node.nodeProps.point).toEqual([10, 20]);
    expect(node.text).toEqual('Hello World!');
  });
});
