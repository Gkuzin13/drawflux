import { useState, createElement, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import { NextUIProvider } from '@nextui-org/react';
import { KonvaEventObject } from 'konva/lib/Node';
import NodeMenu from './components/NodeMenu';
import { Node } from './shared/utils/createNode';
import { selectNodes } from './stores/nodesSlice';
import { useAppDispatch, useAppSelector } from './stores/hooks';
import { ActionType, ACTION_TYPES } from './stores/actions';
import { NodeComponentProps } from './components/types';
import { KEYS } from './shared/keys';
import { CURSOR } from './shared/constants';
import { SHAPES } from './shared/shapes';
import { getElement, NodeStyle } from './shared/element';
import type { MenuItem, NodeType } from './shared/element';
import { IoHandRightOutline } from 'react-icons/io5';
import Konva from 'konva';
import StyleMenu from './components/StyleMenu';

type ToolType = NodeType['type'] | 'hand';

const defaultStyle: NodeStyle = {
  line: 'solid',
  color: 'black',
  size: 'medium',
};

type StyleMenuType = {
  open: boolean;
  style: NodeStyle;
};

const App = () => {
  const [toolType, setToolType] = useState<ToolType>('arrow');
  const [draftNode, setDraftNode] = useState<NodeType | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<MenuItem[] | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [stageScale, setStageScale] = useState(100);
  const [styleMenu, setStyleMenu] = useState<StyleMenuType>({
    open: false,
    style: defaultStyle,
  });
  const { past, present, future } = useAppSelector(selectNodes);

  const nodes = present.nodes;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selected) {
      const node = nodes.find((node) => node.nodeProps.id === selected);

      node && handleNodeChange({ ...node, style: styleMenu.style });
    }
  }, [styleMenu.style]);

  useEffect(() => {
    const handleEscapeKeys = (e: KeyboardEvent) => {
      if (e.key === KEYS.ESCAPE) {
        setDraftNode(null);
        setSelected(null);
      }
    };
    window.addEventListener('keydown', handleEscapeKeys);

    return () => {
      window.removeEventListener('keydown', handleEscapeKeys);
    };
  }, []);

  const onNodeMenuAction = (type: ActionType) => {
    // dispatch({ type, payload: { id: node.nodeProps?.id } });

    setSelected(null);
  };

  const handleOnContextMenu = (
    e: KonvaEventObject<PointerEvent>,
    id: string,
  ) => {
    e.evt.preventDefault();

    const position = e.target.getPosition();

    setMenuPosition({ x: position?.x || 0, y: position?.y || 0 });

    const selectedNode = nodes.find((node) => node.nodeProps.id === id);

    if (selectedNode) {
      // setContextMenu({
      //   ...selectedNode,
      //   menuItems: BASE_M,
      // });
      setSelected(id);
    }
  };

  const updateNodePoints = (x: number, y: number) => {
    setDraftNode((prevNode) => {
      if (!prevNode) return prevNode;

      const updatedNode: NodeType = {
        ...prevNode,
        nodeProps: {
          ...prevNode.nodeProps,
          points: [prevNode.nodeProps.points[0], { x, y }],
        },
      };

      return updatedNode;
    });
  };

  const setCursorStyle = (
    e: KonvaEventObject<MouseEvent | TouchEvent | DragEvent>,
  ) => {
    const stage = e.target.getStage();

    if (!stage) return;

    if (toolType === 'hand') {
      stage.container().style.cursor = CURSOR.GRAB;
      return;
    }

    if (e.target !== stage && !draftNode) {
      const { cursorType } = e.target.attrs;
      const parentCursorStyle = e.target.parent?.attrs.cursorType;

      stage.container().style.cursor =
        cursorType || parentCursorStyle || CURSOR.DEFAULT;
    } else if (draftNode) {
      stage.container().style.cursor = CURSOR.CROSSHAIR;
    } else {
      stage.container().style.cursor = CURSOR.DEFAULT;
    }
  };

  const onMoveStart = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const stage = e.target.getStage();

    const clickedOnEmpty = e.target === stage;

    if (clickedOnEmpty) {
      setSelected(null);
    }

    if (toolType === 'hand') return;

    if (clickedOnEmpty && !selected && !draftNode) {
      const position = e.target.getStage()?.getRelativePointerPosition();

      const newNode = new Node(toolType, position?.x || 0, position?.y || 0);

      setDraftNode(newNode);
    }
  };

  const onMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (draftNode && isDrawable(draftNode.type) && toolType !== 'hand') {
      const position = e.target.getStage()?.getRelativePointerPosition();

      updateNodePoints(position?.x || 0, position?.y || 0);
    }

    setCursorStyle(e);
  };

  const onMoveEnd = () => {
    if (toolType === 'hand') return;

    if (draftNode && isDrawable(draftNode.type)) {
      dispatch({
        type: ACTION_TYPES.ADD_NODE,
        payload: { ...draftNode },
      });

      setDraftNode(null);
    }
  };

  const isDrawable = (nodeType: NodeType['type']) => {
    switch (nodeType) {
      case 'text':
        return false;
      default:
        return true;
    }
  };

  const zoomStageRelativeToPointerPosition = (
    stage: Konva.Stage,
    event: WheelEvent,
  ) => {
    const oldScale = stage.scaleX();
    const pointer = stage.getRelativePointerPosition() || { x: 0, y: 0 };
    const scaleBy = 1.1;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = event.deltaY > 0 ? -1 : 1;

    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.position(newPos);

    setStageScale(Math.round(newScale * 100));
  };

  const onWheel = (e: KonvaEventObject<WheelEvent>) => {
    const stage = e.target.getStage();

    if (e.evt.ctrlKey && stage) {
      e.evt.preventDefault();
      zoomStageRelativeToPointerPosition(stage, e.evt);
    }
  };

  const handleNodeChange = (node: NodeType | null) => {
    if (!node) {
      setDraftNode(null);
      return;
    }
    if (draftNode) {
      dispatch({
        type: ACTION_TYPES.ADD_NODE,
        payload: node,
      });

      setDraftNode(null);
    } else {
      dispatch({
        type: ACTION_TYPES.UPDATE_NODE,
        payload: node,
      });
    }

    console.log(node);
  };

  const onNodeTypeChange = (type: ToolType) => {
    setToolType(type);
    setDraftNode(null);
    setSelected(null);
  };

  const onNodeSelect = (node: NodeType) => {
    setSelected(node.nodeProps.id);

    setStyleMenu({
      open: styleMenu.open,
      style: node?.style,
    });
  };

  const onStyleMenuToggle = () => {
    if (selected) {
      const node = nodes.find((node) => node.nodeProps.id === selected);

      setStyleMenu({
        open: !styleMenu.open,
        style: node?.style,
      });
    } else {
      setStyleMenu({ ...styleMenu, open: !styleMenu.open });
    }
  };

  return (
    <NextUIProvider>
      <>
        <button onClick={() => onNodeTypeChange('hand')}>
          <span>Panning Tool</span>
          <IoHandRightOutline />
        </button>
        {Object.values(SHAPES).map((shape, i) => {
          return (
            <button key={i} onClick={() => onNodeTypeChange(shape.value)}>
              <span>{shape.value}</span>
              {createElement(shape.icon)}
            </button>
          );
        })}
        {styleMenu.open && (
          <StyleMenu
            style={styleMenu.style}
            onStyleChange={(updatedStyle) =>
              setStyleMenu({ ...styleMenu, style: updatedStyle })
            }
          />
        )}
        <button
          onClick={() => dispatch({ type: ACTION_TYPES.DELETE_ALL_NODES })}
        >
          Clear All
        </button>
        <button onClick={onStyleMenuToggle}>Styles</button>
        <div>
          <button
            disabled={!past.length}
            onClick={() => dispatch({ type: ACTION_TYPES.UNDO })}
          >
            Undo
          </button>
          <button
            disabled={!future.length}
            onClick={() => dispatch({ type: ACTION_TYPES.REDO })}
          >
            Redo
          </button>
        </div>
        <div>
          <span>Zoom: {stageScale}%</span>
        </div>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={onMoveStart}
          onMouseMove={onMove}
          onMouseUp={onMoveEnd}
          onWheel={onWheel}
          style={{ backgroundColor: '#fafafa' }}
          draggable={toolType === 'hand'}
        >
          <Layer>
            {[...nodes, draftNode].map((node: NodeType | null) => {
              if (!node) return null;

              return createElement(getElement(node), {
                key: node.nodeProps.id,
                nodeProps: node.nodeProps,
                type: node.type,
                text: node.text,
                style: node.style,
                selected: selected === node.nodeProps.id && toolType !== 'hand',
                draggable: toolType !== 'hand',
                onContextMenu: handleOnContextMenu,
                onSelect: () => onNodeSelect(node),
                onNodeChange: handleNodeChange,
              } as NodeComponentProps);
            })}
          </Layer>
        </Stage>
        <NodeMenu
          isOpen={Boolean(contextMenu)}
          x={menuPosition.x}
          y={menuPosition.y}
          menuItems={contextMenu || []}
          onClose={() => setContextMenu(null)}
          onAction={(key) => onNodeMenuAction(key as ActionType)}
        />
      </>
    </NextUIProvider>
  );
};

export default App;
