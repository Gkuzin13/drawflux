import React, { createElement, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import { NextUIProvider } from '@nextui-org/react';
import { useState } from 'react';
import { ESCAPE_KEY } from './shared/constants/event-keys';
import { KonvaEventObject } from 'konva/lib/Node';
import {
  Node,
  NodeMapItem,
  NODES_MAP,
  NodeType,
  NODE_TYPES,
} from './shared/constants/base';
import NodeMenu from './components/NodeMenu';
import { createNode } from './shared/utils/createNode';
import { ActionTypes, ACTION_TYPES, useStageStore } from './stores/nodesSlice';
import Konva from 'konva';

type ActiveNodeMenu = Node & Pick<NodeMapItem, 'menuItems'>;

const App = () => {
  const [newNode, setNewNode] = React.useState<Node | null>(null);
  const [mode, setMode] = React.useState<NodeType>(NODE_TYPES.EDITABLE_TEXT);
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
  };

  const handleOnContextMenu = (
    e: KonvaEventObject<PointerEvent>,
    id: string,
  ) => {
    e.evt.preventDefault();

    const position = e.target?.getStage()?.getPointerPosition();

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

  const updateNewNodeProps = (x: number, y: number) => {
    setNewNode((prevState) => {
      if (!prevState) return prevState;
      return {
        ...prevState,
        nodeProps: {
          ...prevState.nodeProps,
          points: [prevState.nodeProps.points[0], { x, y }],
        },
      };
    });
  };

  const onMouseDown = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();

    if (clickedOnEmpty) {
      setSelected(null);
    }

    if (clickedOnEmpty && !selected) {
      const { x, y } = e.target.getStage().getPointerPosition();

      setNewNode(createNode({ type: mode, x, y }));

      console.log('mousedown: adding new node state', newNode);
    }
  };

  const onMouseMove = (e: any) => {
    if (newNode && NODES_MAP[newNode.type].isDrawable) {
      const { x, y } = e.target.getStage().getPointerPosition();

      updateNewNodeProps(x, y);

      console.log('mousemove: updating new node points and props');
    }
  };

  const onMouseUp = (e: any) => {
    if (newNode) {
      const { x, y } = e.target.getStage().getPointerPosition();

      updateNewNodeProps(x, y);

      if (newNode.type === 'Editable Text' && !newNode.text?.length) {
        setNewNode(null);

        return;
      }

      dispatch({ type: ACTION_TYPES.ADD, payload: newNode });

      setNewNode(null);
      console.log('mouseup: adding node to list', nodes);
    }
  };

  const handleNodeChange = (changedNode: Node) => {
    setNewNode(null);

    if (changedNode.nodeProps.id === newNode?.nodeProps.id) {
      dispatch({
        type: ACTION_TYPES.ADD,
        payload: changedNode,
      });
    } else {
      dispatch({
        type: ACTION_TYPES.UPDATE,
        payload: changedNode,
      });
    }

    console.log('updating nodes state', changedNode);
  };

  const handleSelected = (id: string) => {
    setSelected(id);
  };

  return (
    <NextUIProvider>
      <>
        {Object.values(NODE_TYPES).map((mode, i) => {
          return (
            <button key={i} onClick={() => setMode(mode)}>
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
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
        >
          <Layer>
            {[...nodes, newNode].map((drawable, i) => {
              if (!drawable) return null;

              const element = NODES_MAP[drawable.type]?.component;

              return (
                element &&
                createElement(element, {
                  key: drawable.nodeProps.id,
                  nodeProps: drawable.nodeProps,
                  type: drawable.type,
                  text: drawable.text,
                  isSelected: selected === drawable.nodeProps.id,
                  onContextMenu: handleOnContextMenu,
                  onSelect: () => handleSelected(drawable.nodeProps.id),
                  onNodeChange: handleNodeChange,
                })
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
