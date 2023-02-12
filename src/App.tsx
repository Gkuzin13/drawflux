import {
  CURSOR_STYLES,
  DraftMode,
  Node,
  NodeMapItem,
  NODES_MAP,
  NodeType,
  NODE_TYPES,
} from './shared/constants/base';
import React, { createElement, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import { NextUIProvider } from '@nextui-org/react';
import { useState } from 'react';
import { ESCAPE_KEY } from './shared/constants/event-keys';
import { KonvaEventObject } from 'konva/lib/Node';
import NodeMenu from './components/NodeMenu';
import { createNode } from './shared/utils/createNode';
import { ActionTypes, ACTION_TYPES, useStageStore } from './stores/nodesSlice';
import { getPointerPosition } from './shared/utils/lib';

type ActiveNodeMenu = Node & Pick<NodeMapItem, 'menuItems'>;

type DraftNode = {
  draftMode: DraftMode;
  node: Node;
};

const defaultNode = NODE_TYPES.EDITABLE_TEXT;

const App = () => {
  const [draftNodeType, setDraftNodeType] = useState<NodeType>(defaultNode);
  const [draftNode, setDraftNode] = React.useState<DraftNode | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ActiveNodeMenu | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const { nodes, dispatch } = useStageStore();

  useEffect(() => {
    const handleEscapeKeys = (e: any) => {
      if (e.key === ESCAPE_KEY) {
        setSelected(null);
      }
    };
    window.addEventListener('keydown', handleEscapeKeys);

    return () => {
      window.removeEventListener('keydown', handleEscapeKeys);
    };
  }, []);

  const onNodeMenuAction = (type: ActionTypes) => {
    let node = { ...contextMenu };

    delete node.menuItems;

    dispatch({ type, payload: contextMenu as Node });

    setSelected(null);
  };

  const handleOnContextMenu = (
    e: KonvaEventObject<PointerEvent>,
    id: string,
  ) => {
    e.evt.preventDefault();

    const position = getPointerPosition(e.target);

    setMenuPosition({ x: position?.x || 0, y: position?.y || 0 });

    const selectedNode = nodes.find((node) => node.nodeProps.id === id);

    if (selectedNode) {
      setContextMenu({
        ...selectedNode,
        menuItems: NODES_MAP[selectedNode.type].menuItems,
      });
      setSelected(id);
    }
  };

  const updateNodePoints = (x: number, y: number) => {
    setDraftNode((prevState) => {
      if (!prevState?.node) return prevState;

      const { node } = prevState;

      const updatedNode: Node = {
        type: node.type,
        text: node.text,
        nodeProps: {
          ...node.nodeProps,
          points: [node.nodeProps.points[0], { x, y }],
        },
      };

      return {
        ...prevState,
        node: updatedNode,
      };
    });
  };

  const setCursorStyle = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const stage = e.target.getStage();

    if (!stage) return;

    if (e.target !== stage && !draftNode) {
      const { cursorType } = e.target.attrs;
      const parentCursorStyle = e.target.parent?.attrs.cursorType;

      stage.container().style.cursor =
        cursorType || parentCursorStyle || CURSOR_STYLES.DEFAULT;
    } else {
      stage.container().style.cursor = CURSOR_STYLES.DEFAULT;
    }
  };

  const onMoveStart = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const stage = e.target.getStage();

    const clickedOnEmpty = e.target === stage;

    if (clickedOnEmpty) {
      setSelected(null);
    }

    if (clickedOnEmpty && !selected) {
      const position = getPointerPosition(stage);

      const newNode = createNode({
        type: draftNodeType,
        x: position?.x || 0,
        y: position?.y || 0,
      });

      const { draftMode } = NODES_MAP[draftNodeType];

      setDraftNode({ draftMode, node: newNode });
    }
  };

  const onMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (draftNode?.node && draftNode.draftMode === 'drawing') {
      const position = getPointerPosition(e.target);

      updateNodePoints(position?.x || 0, position?.y || 0);
    }

    setCursorStyle(e);
  };

  const onMoveEnd = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (draftNode?.node && draftNode.draftMode === 'drawing') {
      dispatch({ type: ACTION_TYPES.ADD, payload: draftNode.node });

      setDraftNode(null);
    }
  };

  const handleNodeChange = (node: Node) => {
    setDraftNode(null);

    if (draftNode?.node) {
      dispatch({
        type: ACTION_TYPES.ADD,
        payload: node,
      });
    } else {
      dispatch({
        type: ACTION_TYPES.UPDATE,
        payload: node,
      });
    }
  };

  const handleSelected = (id: string) => {
    setSelected(id);
  };

  const onNodeTypeChange = (type: NodeType) => {
    setDraftNodeType(type);
    setDraftNode(null);
    setSelected(null);
  };

  function getComponentProps(node: Node) {
    return {
      key: node.nodeProps.id,
      nodeProps: node.nodeProps,
      type: node.type,
      text: node.text,
      isSelected: selected === node.nodeProps.id,
      onContextMenu: handleOnContextMenu,
      onSelect: () => handleSelected(node.nodeProps.id),
      onNodeChange: handleNodeChange,
    };
  }

  return (
    <NextUIProvider>
      <>
        {Object.values(NODE_TYPES).map((mode, i) => {
          return (
            <button key={i} onClick={() => onNodeTypeChange(mode)}>
              {mode}
            </button>
          );
        })}
        <button onClick={() => dispatch({ type: ACTION_TYPES.DELETE_ALL })}>
          Clear All
        </button>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={onMoveStart}
          onMouseMove={onMove}
          onMouseUp={onMoveEnd}
        >
          <Layer>
            {[...nodes, draftNode?.node].map((node) => {
              if (!node) return null;

              return createElement(
                NODES_MAP[node.type]?.component,
                getComponentProps(node),
              );
            })}
          </Layer>
        </Stage>
        <NodeMenu
          isOpen={Boolean(contextMenu)}
          x={menuPosition.x}
          y={menuPosition.y}
          menuItems={contextMenu?.menuItems || []}
          onClose={() => setContextMenu(null)}
          onAction={(key) => onNodeMenuAction(key as ActionTypes)}
        />
      </>
    </NextUIProvider>
  );
};

export default App;
