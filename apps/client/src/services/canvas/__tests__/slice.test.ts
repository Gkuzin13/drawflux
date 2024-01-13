import reducer, {
  type CanvasSliceState,
  canvasActions,
  initialState,
} from '../slice';
import { nodesGenerator } from '@/test/data-generators';
import type { AppState, ToolType } from '@/constants/app';
import type { NodeObject, StageConfig } from 'shared';

describe('canvas slice', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('sets the state', () => {
    const stateToSet: AppState['page'] = {
      nodes: nodesGenerator(5),
      stageConfig: { position: { x: 50, y: 50 }, scale: 0.5 },
      selectedNodeIds: {},
      toolType: 'select',
    };

    const state = reducer(undefined, canvasActions.set(stateToSet));

    expect(state).toEqual({ ...initialState, ...stateToSet });
  });

  /**
   * order of the nodes is important
   */

  it('adds nodes', () => {
    const nodes = nodesGenerator(5, 'ellipse');

    const state = reducer(undefined, canvasActions.addNodes(nodes));

    expect(state).toEqual({ ...initialState, nodes });
  });

  it('updates nodes', () => {
    const nodes = nodesGenerator(5, 'ellipse');

    const updatedNodes: NodeObject[] = [
      { ...nodes[0], style: { ...nodes[0].style, animated: true } },
      { ...nodes[2], style: { ...nodes[2].style, animated: true } },
    ];

    const previousState: CanvasSliceState = { ...initialState, nodes };

    const state = reducer(
      previousState,
      canvasActions.updateNodes(updatedNodes),
    );

    expect(state).toEqual({
      ...previousState,
      nodes: [updatedNodes[0], nodes[1], updatedNodes[1], nodes[3], nodes[4]],
    });
  });

  it('deletes nodes and unselects them', () => {
    const nodes = nodesGenerator(5, 'ellipse');
    const nodesIdsToDelete = [nodes[0].nodeProps.id, nodes[2].nodeProps.id];

    const previousState: CanvasSliceState = {
      ...initialState,
      nodes,
      selectedNodeIds: Object.fromEntries(
        nodesIdsToDelete.map((nodeId) => [nodeId, true]),
      ),
    };

    const state = reducer(
      previousState,
      canvasActions.deleteNodes(nodesIdsToDelete),
    );

    expect(state).toEqual({
      ...previousState,
      nodes: [nodes[1], nodes[3], nodes[4]],
      selectedNodeIds: {},
    });
  });

  it('should copy nodes', () => {
    const nodes = nodesGenerator(5, 'ellipse');

    const previousState: CanvasSliceState = {
      ...initialState,
      nodes,
      selectedNodeIds: {
        [nodes[0].nodeProps.id]: true,
        [nodes[2].nodeProps.id]: true,
      },
    };

    const state = reducer(previousState, canvasActions.copyNodes());

    expect(state).toEqual({
      ...previousState,
      copiedNodes: expect.arrayContaining([
        {
          ...nodes[0],
          nodeProps: { ...nodes[0].nodeProps, id: expect.any(String) },
        },
        {
          ...nodes[2],
          nodeProps: { ...nodes[2].nodeProps, id: expect.any(String) },
        },
      ]),
    });
  });

  it('sets tool type', () => {
    const toolType: ToolType = 'arrow';

    const state = reducer(initialState, canvasActions.setToolType(toolType));

    expect(state).toEqual({ ...initialState, toolType });
  });

  it('sets stage config', () => {
    const stageConfig: StageConfig = {
      position: { x: 50, y: 50 },
      scale: 0.5,
    };

    const state = reducer(
      initialState,
      canvasActions.setStageConfig(stageConfig),
    );

    expect(state).toEqual({
      ...initialState,
      stageConfig,
    });
  });

  it('sets selected nodes ids', () => {
    const nodes = nodesGenerator(5, 'ellipse');
    const selectedNodeIds: CanvasSliceState['selectedNodeIds'] = {
      [nodes[0].nodeProps.id]: true,
      [nodes[1].nodeProps.id]: true,
    };

    const previousState: CanvasSliceState = {
      ...initialState,
      nodes,
    };

    const state = reducer(
      previousState,
      canvasActions.setSelectedNodeIds(Object.keys(selectedNodeIds)),
    );

    expect(state).toEqual({ ...previousState, selectedNodeIds });

    const stateWithoutSelectedNodesIds = reducer(
      previousState,
      canvasActions.setSelectedNodeIds([]),
    );

    expect(stateWithoutSelectedNodesIds).toEqual({
      ...previousState,
      selectedNodeIds: {},
    });
  });

  it('selects all nodes', () => {
    const nodes = nodesGenerator(5, 'ellipse');

    const previousState: CanvasSliceState = {
      ...initialState,
      nodes,
    };

    const state = reducer(previousState, canvasActions.selectAllNodes());

    expect(state).toEqual({
      ...previousState,
      selectedNodeIds: Object.fromEntries(
        nodes.map((node) => [node.nodeProps.id, true]),
      ),
    });
  });
});
