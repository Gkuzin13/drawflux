import { useState, createElement, useEffect, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import ContextMenu from './components/ContextMenu/ContextMenu';
import { createNode } from './shared/utils/createNode';
import { selectNodes, nodesActions } from './stores/nodesSlice';
import { useAppDispatch, useAppSelector } from './stores/hooks';
import { NodeComponentProps } from './components/types';
import { KEYS } from './shared/keys';
import { CURSOR } from './shared/cursor';
import { getElement, NodeStyle, Point } from './shared/element';
import Konva from 'konva';
import StylesDock from './components/StylesDock/StylesDock';
import type { NodeType } from './shared/element';
import SelectTool from './components/SelectTool';
import { normalizePoints } from './shared/utils/draw';
import { IRect } from 'konva/lib/types';
import ToolsDock from './components/ToolsDock';
import { Tool } from './shared/tool';
import ControlDock from './components/ControlDock';
import { drawArrow } from './components/ArrowDrawable/helpers/drawArrow';
import { drawRect } from './components/RectDrawable/helpers/drawRect';
import { drawEllipse } from './components/EllipseDrawable/helpers/drawEllipse';
import { drawFreePath } from './components/FreePathDrawable/helpers/drawFreePath';
import {
  DEFAULT_MENU,
  DEFAULT_NODE_MENU,
  MenuItem,
  MENU_ACTIONS,
} from './shared/menu';
import { Html } from 'react-konva-utils';
import NodeGroupTransformer from './components/NodeGroupTransformer/NodeGroupTransformer';

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
  const [menuPosition, setMenuPosition] = useState<Point>([0, 0]);
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

  useEffect(() => {
    if (selected.length === 1) {
      const node = nodes.find((node) => node.nodeProps.id === selected[0]);

      node && handleNodeChange({ ...node, style: styleMenu });
    }
  }, [styleMenu, selected]);

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

  const onNodeMenuAction = (key: MenuItem['key']) => {
    switch (key) {
      case MENU_ACTIONS.DELETE_NODE:
        dispatch(nodesActions.delete(selected));
        break;
      case MENU_ACTIONS.SELECT_ALL:
        setSelectedNodes(nodes);
        break;
    }

    setSelected([]);
    setContextMenu(null);
  };

  const handleOnContextMenu = (e: KonvaEventObject<PointerEvent>) => {
    e.evt.preventDefault();

    const stage = e.target.getStage();

    const position = stage && stage.getRelativePointerPosition();

    if (!position) return;

    setMenuPosition([position.x, position.y]);

    const clickedOnEmpty = e.target === e.target.getStage();

    if (clickedOnEmpty) {
      setContextMenu(DEFAULT_MENU);
      return;
    }

    function getNodeId(
      target: KonvaEventObject<PointerEvent>['target'],
      currentNodes: NodeType[],
    ) {
      const group = e.target.parent;

      const node = currentNodes.find(
        (node) => node.nodeProps.id === group?.attrs.id,
      );

      return node?.nodeProps.id || (target.attrs?.id as string) || null;
    }

    const id = getNodeId(e.target, nodes);

    if (id) {
      setSelected([id]);
      setContextMenu(DEFAULT_NODE_MENU);
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
    const mouseEvent = e.evt as MouseEvent;

    if (mouseEvent.button !== 0) return;

    const stage = e.target.getStage();

    const clickedOnEmpty = e.target === stage;

    if (clickedOnEmpty && contextMenu) {
      setContextMenu(null);
      return;
    }

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
    setContextMenu(null);
  };

  const onMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const position = e.target.getStage()?.getRelativePointerPosition();

    if (!position) return;

    switch (toolType) {
      case 'hand':
        break;
      case 'select':
        if (stageRef.current) {
          setIntersectingNodes(stageRef.current);
        }

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
          if (!prevNode) return prevNode;
          return drawNodeByType(prevNode, [position.x, position.y]);
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
        if (draftNode) {
          dispatch(nodesActions.add([draftNode]));
          setDraftNode(null);
          setDrawing(false);
          setToolType('select');
        }
      }
    }
  };

  const zoomStageRelativeToPointerPosition = (
    stage: Konva.Stage,
    event: WheelEvent,
  ) => {
    const oldScale = stage.scaleX();
    const pointer = stage.getRelativePointerPosition();
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
      setDraftNode(null);

      if (!node.text) {
        return;
      }

      dispatch(nodesActions.add([node]));
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
        onContextMenu={handleOnContextMenu}
        onWheel={onWheel}
        style={{ backgroundColor: '#fafafa' }}
        draggable={toolType === 'hand'}
      >
        <Layer>
          {[...nodes, draftNode].map((node) => {
            if (!node) return null;

            const visible = !selectedNodes.some(
              (n) => n.nodeProps.id === node.nodeProps.id,
            );

            return createElement(getElement(node.type), {
              node: {
                ...node,
                nodeProps: { ...node.nodeProps, visible },
              },
              key: node.nodeProps.id,
              selected: selected.includes(node.nodeProps.id),
              draggable: toolType !== 'hand',
              onSelect: () => onNodeSelect(node),
              onNodeChange: handleNodeChange,
            } as NodeComponentProps);
          })}
          {selectBoxSize ? <SelectTool points={selectBoxSize} /> : null}
          {selectedNodes.length ? (
            <NodeGroupTransformer selectedNodes={selectedNodes} />
          ) : null}
          <Html groupProps={{ x: menuPosition[0], y: menuPosition[1] }}>
            {contextMenu && (
              <ContextMenu
                menuItems={contextMenu}
                onAction={onNodeMenuAction}
              />
            )}
          </Html>
        </Layer>
      </Stage>
    </>
  );
};

export default App;
