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
import { drawRectangle } from './shared/utils/draw';
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
  const [selectBoxSize, setSelectBoxSize] = useState<IRect | null>(null);
  const [drawing, setDrawing] = useState(false);

  const posStart = useRef<Point>([0, 0]);

  const { past, present, future } = useAppSelector(selectNodes);

  const nodes = present.nodes;

  const dispatch = useAppDispatch();

  const stageRef = useRef<Konva.Stage>(null);
  const selectRectRef = useRef<Konva.Rect>(null);

  useEffect(() => {
    if (selected.length === 1) {
      const node = nodes.find((node) => node.nodeProps.id === selected[0]);

      node && handleNodeChange({ ...node, style: styleMenu });
    }
  }, [styleMenu, selected]);

  useEffect(() => {
    if (!stageRef.current) return;

    switch (toolType) {
      case 'hand':
        stageRef.current.container().style.cursor = CURSOR.GRAB;
        break;
      case 'select':
        stageRef.current.container().style.cursor = CURSOR.DEFAULT;
        break;
      default:
        if (drawing) {
          stageRef.current.container().style.cursor = CURSOR.CROSSHAIR;
        } else {
          stageRef.current.container().style.cursor = CURSOR.DEFAULT;
        }
        break;
    }
  }, [toolType, drawing, stageRef.current]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case KEYS.DELETE:
          if (!selected.length) return;
          dispatch(nodesActions.delete(selected));
          setDraftNode(null);
          break;
        case KEYS.ESCAPE:
          setDraftNode(null);
          setSelected([]);
          break;
        case KEYS.H:
          setToolType('hand');
          setDraftNode(null);
          setSelected([]);
          break;
        case KEYS.V:
          setToolType('select');
          setDraftNode(null);
          setSelected([]);
      }
    };

    if (toolType !== 'text') {
      window.addEventListener('keyup', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keyup', handleKeyDown);
    };
  }, [selected, toolType]);

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

    if (!stage) return;

    const position = stage.getRelativePointerPosition();

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

  const setIntersectingNodes = (stage: Konva.Stage, selectRect: IRect) => {
    if (!selectBoxSize) return;

    const layer = stage.getChildren((child) => child.nodeType === 'Layer')[0];
    const otherChildren = layer.getChildren((child) => child.attrs.id);

    const intersectedChildren = otherChildren.filter((child) => {
      if (child.hasChildren()) {
        const group = child as Konva.Group;

        return group.getChildren().some((c) => {
          return Konva.Util.haveIntersection(selectRect, c.getClientRect());
        });
      }

      return Konva.Util.haveIntersection(selectRect, child.getClientRect());
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
        setSelectBoxSize(
          drawRectangle([posStart.current, [position.x, position.y]]),
        );
        setDrawing(true);
        break;
      case 'text':
        if (!draftNode) {
          setDraftNode(createNode(toolType, [position.x, position.y]));
          break;
        }
        setToolType('select');
        break;
      default:
        if (!draftNode) {
          setDraftNode(createNode(toolType, [position.x, position.y]));
          setDrawing(true);
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

    if (toolType === 'select' && drawing) {
      setSelectBoxSize(
        drawRectangle([posStart.current, [position.x, position.y]]),
      );

      if (stageRef.current && selectRectRef.current) {
        setIntersectingNodes(
          stageRef.current,
          selectRectRef.current.getClientRect(),
        );
      }
    }

    setDraftNode((prevNode) => {
      if (!prevNode) return prevNode;
      return drawNodeByType(prevNode, [position.x, position.y]);
    });
  };

  const onMoveEnd = () => {
    switch (toolType) {
      case 'hand':
        break;
      case 'select':
        setSelectBoxSize(null);
        setDrawing(false);
        break;
      case 'draw':
        if (!draftNode) return;
        dispatch(nodesActions.add([draftNode]));
        setDraftNode(null);
        setDrawing(false);
        break;
      default: {
        if (!drawing) {
          setDraftNode(null);
          break;
        }
        if (!draftNode) return;

        dispatch(nodesActions.add([draftNode]));
        setDraftNode(null);
        setToolType('select');
        setDrawing(false);
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

    if (!sanitizeStageZoom([newScale, newScale])) return;

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    stage.scale({ x: newScale, y: newScale });
    stage.position(newPos);

    setStageScale(Math.round(newScale * 100));
  };

  const sanitizeStageZoom = (zoom: Point) => {
    if (zoom[0] < 0.1 || zoom[1] < 0.1) {
      return false;
    }
    if (zoom[0] > 2.5 || zoom[1] > 2.5) {
      return false;
    }

    return true;
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

  const setCursorOnStageDragEvent = (event: KonvaEventObject<DragEvent>) => {
    const stage = event.target as Konva.Stage;

    if (stage !== event.target.getStage()) return;

    if (event.type === 'dragstart') {
      stage.container().style.cursor = CURSOR.GRABBING;
    } else {
      stage.container().style.cursor = CURSOR.GRAB;
    }
  };

  return (
    <>
      <div style={{ position: 'absolute', zIndex: 1 }}>
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
        onDragStart={setCursorOnStageDragEvent}
        onDragEnd={setCursorOnStageDragEvent}
      >
        <Layer>
          {[...nodes, draftNode].map((node) => {
            if (!node) return null;
            return createElement(getElement(node.type), {
              node,
              key: node.nodeProps.id,
              selected: selected.includes(node.nodeProps.id),
              draggable: toolType !== 'hand',
              onSelect: () => onNodeSelect(node),
              onNodeChange: handleNodeChange,
            } as NodeComponentProps);
          })}
          {selectBoxSize ? (
            <SelectTool rect={selectBoxSize} ref={selectRectRef} />
          ) : null}
          {selectedNodes.length ? (
            <NodeGroupTransformer
              selectedNodes={selectedNodes}
              onDragStart={(nodes) => {
                dispatch(nodesActions.update(nodes));
              }}
              onDragEnd={(nodes) => dispatch(nodesActions.update(nodes))}
            />
          ) : null}
          <Html
            groupProps={{
              x: menuPosition[0],
              y: menuPosition[1],
            }}
          >
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
