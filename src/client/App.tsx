import { useState, createElement, useEffect, useRef } from 'react';
import { Stage, Layer, Group } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import NodeMenu from './components/NodeMenu';
import { createNode } from './shared/utils/createNode';
import { selectNodes, nodesActions } from './stores/nodesSlice';
import { useAppDispatch, useAppSelector } from './stores/hooks';
import { NodeComponentProps } from './components/types';
import { KEYS } from './shared/keys';
import { CURSOR } from './shared/cursor';
import { getElement, NodeStyle, Point } from './shared/element';
import Konva from 'konva';
import StylesDock from './components/StylesDock/StylesDock';
import type { MenuItem, NodeType } from './shared/element';
import SelectTool from './components/SelectTool';
import { normalizePoints } from './shared/utils/draw';
import NodeTransformer from './components/NodeTransformer';
import { IRect } from 'konva/lib/types';
import ToolsDock from './components/ToolsDock';
import { Tool } from './shared/tool';
import ControlDock from './components/ControlDock';
import { getAnchorsPosition } from './components/ArrowDrawable/helpers/getAnchorsPosition';
import { drawArrow } from './components/ArrowDrawable/helpers/drawArrow';
import { drawRect } from './components/RectDrawable/helpers/drawRect';
import { drawEllipse } from './components/EllipseDrawable/helpers/drawEllipse';
import { drawFreePath } from './components/FreePathDrawable/helpers/drawFreePath';

const defaultStyle: NodeStyle = {
  line: 'solid',
  color: 'black',
  size: 'medium',
};

const App = () => {
  const [toolType, setToolType] = useState<Tool['value']>('arrow');
  const [draftNode, setDraftNode] = useState<NodeType | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<MenuItem[] | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [stageScale, setStageScale] = useState(100);
  const [styleMenu, setStyleMenu] = useState<NodeStyle>(defaultStyle);
  const [selectedNodes, setSelectedNodes] = useState<NodeType[]>([]);
  const [selectBoxSize, setSelectBoxSize] = useState<Point[] | null>(null);
  const [drawing, setDrawing] = useState(false);

  const posStart = useRef<Point>([0, 0]);

  const { past, present, future } = useAppSelector(selectNodes);

  const nodes = present.nodes;

  const dispatch = useAppDispatch();

  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const nodeRef = useRef(null);

  useEffect(() => {
    if (selectBoxSize && transformerRef.current && nodeRef.current) {
      transformerRef.current.nodes([nodeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectBoxSize]);

  useEffect(() => {
    if (selected.length === 1) {
      const node = nodes.find((node) => node.nodeProps.id === selected[0]);

      node && handleNodeChange({ ...node, style: styleMenu });
    }
  }, [styleMenu]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case KEYS.DELETE:
          if (!selected.length) return;
          dispatch(nodesActions.delete(selected));
          setDraftNode(null);
          break;
        case KEYS.ESCAPE:
          setDraftNode(null);
          setSelected([]);
          break;
      }
    };
    window.addEventListener('keyup', handleKeyDown);

    return () => {
      window.removeEventListener('keyup', handleKeyDown);
    };
  }, [selected]);

  const onNodeMenuAction = () => {
    // dispatch({ type, payload: { id: node.nodeProps?.id } });

    setSelected([]);
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
      setSelected([id]);
    }
  };

  const setCursorStyle = (
    e: KonvaEventObject<MouseEvent | TouchEvent | DragEvent>,
  ) => {
    const stage = e.target.getStage();

    if (!stage) return;

    if (drawing) {
      stage.container().style.cursor = CURSOR.CROSSHAIR;
      return;
    }

    if (toolType === 'hand') {
      stage.container().style.cursor = CURSOR.GRAB;
      return;
    }

    if (toolType === 'select') {
      const isOverNode = e.target !== stage;

      if (isOverNode) {
        stage.container().style.cursor =
          e.target.attrs?.cursorType || CURSOR.ALL_SCROLL;
        return;
      }

      stage.container().style.cursor = CURSOR.DEFAULT;
    }
  };

  function haveIntersection(p1: Point, p2: Point, nodeRect: IRect) {
    return Konva.Util.haveIntersection(
      { x: p1[0], y: p1[1], width: p2[0] - p1[0], height: p2[1] - p1[1] },
      nodeRect,
    );
  }

  const setIntersectingNodes = (stage: Konva.Stage) => {
    if (!selectBoxSize) return;

    const layer = stage.getChildren((child) => child.nodeType === 'Layer')[0];
    const otherChildren = layer.getChildren((child) => child.attrs.id);

    const [p1, p2] = normalizePoints(selectBoxSize[0], selectBoxSize[1]);

    const intersectedChildren = otherChildren.filter((child) => {
      if (child.hasChildren()) {
        const group = child as Konva.Group;
        return group.getChildren().some((c) => {
          return haveIntersection(p1, p2, c.getClientRect());
        });
      }
      return haveIntersection(p1, p2, child.getClientRect());
    });

    const childrenIds = new Set<string>(
      intersectedChildren.map(({ attrs }) => attrs.id),
    );

    setSelectedNodes(
      nodes.filter((node) => childrenIds.has(node.nodeProps.id)),
    );
  };

  const drawNodeByType = (node: NodeType, position: Point): NodeType => {
    switch (node.type) {
      case 'draw': {
        return drawFreePath(node, position);
      }
      case 'arrow': {
        return drawArrow(node, position);
      }
      case 'rectangle': {
        return drawRect(node, posStart.current, position);
      }
      case 'ellipse': {
        return drawEllipse(node, position);
      }
      default: {
        return node;
      }
    }
  };

  const onMoveStart = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const stage = e.target.getStage();

    const clickedOnEmpty = e.target === stage;

    if (!clickedOnEmpty) {
      return;
    }

    const position = e.target.getStage()?.getRelativePointerPosition();

    if (!position) return;

    posStart.current = [position.x, position.y];

    switch (toolType) {
      case 'hand':
        break;
      case 'select':
        setSelectBoxSize([posStart.current, [position.x, position.y]]);
        break;
      default:
        if (!draftNode) {
          setDraftNode(createNode(toolType, [position.x, position.y]));
          break;
        }
        setToolType('select');
    }

    setSelected([]);
    setSelectedNodes([]);
  };

  const onMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const position = e.target.getStage()?.getRelativePointerPosition();

    if (!position) return;

    switch (toolType) {
      case 'hand':
        break;
      case 'select':
        const stage = stageRef.current;

        stage && setIntersectingNodes(stage);

        setSelectBoxSize((prevSize) => {
          if (!prevSize) return prevSize;

          return [prevSize[0], [position.x, position.y]];
        });
        break;
      case 'text':
        break;
      default:
        if (!draftNode) {
          setDrawing(false);
          break;
        }

        setDraftNode((prevNode) => {
          return prevNode
            ? drawNodeByType(prevNode, [position.x, position.y])
            : prevNode;
        });

        setDrawing(true);
    }

    setCursorStyle(e);
  };

  const onMoveEnd = () => {
    switch (toolType) {
      case 'hand':
        break;
      case 'select':
        setSelectBoxSize(null);
        break;
      default: {
        if (!drawing) {
          setDraftNode(null);
          break;
        }
        dispatch(nodesActions.add([draftNode!]));
        setDraftNode(null);
        setDrawing(false);
        setToolType('select');
      }
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
      setToolType('select');
      return;
    }

    if (draftNode?.nodeProps.id === node.nodeProps.id) {
      if (!node.text) {
        setDraftNode(null);
        return;
      }

      dispatch(nodesActions.add([node]));
      setDraftNode(null);
      setToolType('select');
      return;
    }

    dispatch(nodesActions.update([node]));
  };

  const onNodeTypeChange = (type: Tool['value']) => {
    setToolType(type);
    setDraftNode(null);
    setSelected([]);
  };

  const onNodeSelect = (node: NodeType) => {
    setSelected([node.nodeProps.id]);
    setStyleMenu(node.style);
  };

  const onGroupDragStart = (event: KonvaEventObject<DragEvent>) => {
    const group = event.target as Konva.Group & Konva.Shape;

    const nodeMap = new Map<string, NodeType>();

    selectedNodes.forEach((node) => nodeMap.set(node.nodeProps.id, node));

    const hiddenNodes = group
      .getChildren()
      .map((child) => {
        const node = nodeMap.get(child.attrs.id);

        if (!node) return null;

        return { ...node, nodeProps: { ...node.nodeProps, visible: false } };
      })
      .filter((node) => node) as NodeType[];

    dispatch(nodesActions.update(hiddenNodes));
  };

  const onGroupDragEnd = (event: KonvaEventObject<DragEvent>) => {
    const group = event.target as Konva.Group & Konva.Shape;

    const nodeMap = new Map<string, NodeType>();

    selectedNodes.forEach((node) => nodeMap.set(node.nodeProps.id, node));

    const updatedNodes = group
      .getChildren()
      .map((child) => {
        const node = nodeMap.get(child.attrs.id);

        if (!node) return null;

        if (node.type === 'arrow' && child.hasChildren()) {
          const updatedPoints = getAnchorsPosition(
            child as Konva.Group & Konva.Shape,
          );

          return {
            ...node,
            nodeProps: {
              ...node.nodeProps,
              point: updatedPoints[0],
              points: [updatedPoints[1], updatedPoints[2]],
              visible: true,
            },
          };
        }

        const { x, y } = child.getAbsolutePosition();

        return {
          ...node,
          nodeProps: { ...node.nodeProps, point: [x, y], visible: true },
        };
      })
      .filter(Boolean) as NodeType[];

    dispatch(nodesActions.update(updatedNodes));
  };

  return (
    <>
      <ToolsDock onToolSelect={onNodeTypeChange} />
      <StylesDock
        style={styleMenu}
        onStyleChange={(updatedStyle) => setStyleMenu(updatedStyle)}
      />
      <ControlDock
        onHistoryControl={(type) => dispatch({ type })}
        onNodesControl={dispatch}
        undoDisabled={!past.length}
        redoDisabled={!future.length}
      />
      <div>
        <span>Zoom: {stageScale}%</span>
      </div>
      <Stage
        ref={stageRef}
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
          {[...nodes, draftNode].map((node) => {
            if (!node) return null;

            return createElement(getElement(node), {
              ...node,
              nodeProps: {
                ...node.nodeProps,
                visible: !selectedNodes.some(
                  (n) => n.nodeProps.id === node.nodeProps.id,
                ),
              },
              key: node.nodeProps.id,
              selected: selected.includes(node.nodeProps.id),
              draggable: toolType !== 'hand',
              onContextMenu: handleOnContextMenu,
              onSelect: () => onNodeSelect(node),
              onNodeChange: handleNodeChange,
            } as NodeComponentProps);
          })}
          {selectBoxSize ? <SelectTool points={selectBoxSize} /> : null}
          {selectedNodes.length ? (
            <Group
              ref={nodeRef}
              onDragEnd={onGroupDragEnd}
              onDragStart={onGroupDragStart}
            >
              {selectedNodes.map((node) => {
                return createElement(getElement(node), {
                  key: `group-${node.nodeProps.id}`,
                  ...node,
                  selected: false,
                  draggable: false,
                  onContextMenu: () => null,
                  onSelect: () => null,
                  onNodeChange: () => null,
                } as NodeComponentProps);
              })}
            </Group>
          ) : null}
          {selectedNodes.length ? (
            <NodeTransformer
              ref={transformerRef}
              transformerConfig={{ enabledAnchors: [] }}
            />
          ) : null}
        </Layer>
      </Stage>
      <NodeMenu
        isOpen={Boolean(contextMenu)}
        x={menuPosition.x}
        y={menuPosition.y}
        menuItems={contextMenu || []}
        onClose={() => setContextMenu(null)}
        onAction={(key) => onNodeMenuAction()}
      />
    </>
  );
};

export default App;
