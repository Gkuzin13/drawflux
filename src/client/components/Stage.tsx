import { NodeStyle, NodeType, Point } from '../shared/element';
import { Layer, Stage } from 'react-konva';
import { useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { useAppDispatch } from '../stores/hooks';
import { Tool } from '../shared/tool';
import { KonvaEventObject } from 'konva/lib/Node';
import {
  DEFAULT_MENU,
  DEFAULT_NODE_MENU,
  MenuItem,
  MENU_ACTIONS,
} from '../shared/menu';
import { IRect } from 'konva/lib/types';
import { createNode } from '../shared/utils/createNode';
import { drawRectangle } from '../shared/utils/draw';
import { CURSOR } from '../shared/cursor';
import { drawFreePath } from './FreePathDrawable/helpers/drawFreePath';
import { drawArrow } from './ArrowDrawable/helpers/drawArrow';
import { drawRect } from './RectDrawable/helpers/drawRect';
import { drawEllipse } from './EllipseDrawable/helpers/drawEllipse';
import { nodesActions } from '../stores/nodesSlice';
import Node from './Node/Node';
import SelectTool from './SelectTool';
import NodeGroupTransformer from './NodeGroupTransformer/NodeGroupTransformer';
import { Html } from 'react-konva-utils';
import ContextMenu from './ContextMenu/ContextMenu';
import DraftNode from './Node/DraftNode';

type Props = {
  nodes: NodeType[];
  width: number;
  height: number;
  toolType: Tool['value'];
  styleMenu: NodeStyle;
  onDraftEnd: () => void;
  onStageZoomChange: (scale: number) => void;
  onNodeSelect: (node: NodeType) => void;
};

type ContextMenuState = {
  items: MenuItem[];
  position: Point;
};

const ShapesStage = ({
  nodes,
  width,
  height,
  toolType,
  styleMenu,
  onStageZoomChange,
  onDraftEnd,
  onNodeSelect,
}: Props) => {
  const [draftNode, setDraftNode] = useState<NodeType | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [selectRect, setSelectRect] = useState<IRect | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeType | null>(null);
  const [nodesInStaging, setNodesInStaging] = useState<NodeType[]>([]);
  const [drawing, setDrawing] = useState(false);

  const moveStartPosition = useRef<Point>([0, 0]);

  const stageRef = useRef<Konva.Stage>(null);
  const selectRectRef = useRef<Konva.Rect>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selectedNode) {
      dispatch(nodesActions.update([{ ...selectedNode, style: styleMenu }]));
    }
  }, [styleMenu]);

  useEffect(() => {
    if (!stageRef.current) return;

    const stage = stageRef.current;

    switch (toolType) {
      case 'hand':
        stage.container().style.cursor = CURSOR.GRAB;
        break;
      case 'select':
        stage.container().style.cursor = CURSOR.DEFAULT;
        break;
      default:
        if (drawing) {
          stage.container().style.cursor = CURSOR.CROSSHAIR;
        } else {
          stage.container().style.cursor = CURSOR.DEFAULT;
        }
    }
  }, [toolType, drawing, stageRef.current]);

  const onNodeMenuAction = (key: MenuItem['key']) => {
    switch (key) {
      case MENU_ACTIONS.DELETE_NODE:
        if (!selectedNode) return;
        dispatch(nodesActions.delete([selectedNode.nodeProps.id]));
        break;
      case MENU_ACTIONS.SELECT_ALL:
        setNodesInStaging(nodes);
        break;
    }

    setSelectedNode(null);
    setContextMenu(null);
  };

  const setIntersectingNodes = (stage: Konva.Stage, selectRect: IRect) => {
    const layer = stage.getChildren((child) => child.nodeType === 'Layer')[0];
    const children = layer.getChildren((child) => child.attrs.id);

    const intersectedChildren = children.filter((child) => {
      if (child.hasChildren()) {
        const group = child as Konva.Group;

        return group.getChildren().some((c) => {
          return Konva.Util.haveIntersection(selectRect, c.getClientRect());
        });
      }

      return Konva.Util.haveIntersection(selectRect, child.getClientRect());
    });

    const intersectedIds = new Set<string>(
      intersectedChildren.map(({ attrs }) => attrs.id),
    );

    setNodesInStaging(
      nodes.filter((node) => intersectedIds.has(node.nodeProps.id)),
    );
  };

  const handleOnContextMenu = (e: KonvaEventObject<PointerEvent>) => {
    e.evt.preventDefault();

    const stage = e.target.getStage() as Konva.Stage;
    const position = stage.getRelativePointerPosition();

    const clickedOnEmpty = e.target === stage;

    if (clickedOnEmpty) {
      setContextMenu({
        items: DEFAULT_MENU,
        position: [position.x, position.y],
      });
      return;
    }

    const isGroup = e.target.parent?.nodeType === 'Group';

    const shape = isGroup ? e.target.parent : e.target;

    const node = nodes.find((node) => node.nodeProps.id === shape?.attrs.id);

    if (node) {
      setSelectedNode(node);
      setContextMenu({
        items: DEFAULT_NODE_MENU,
        position: [position.x, position.y],
      });
    }
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
        return drawRect(node, moveStartPosition.current, position);
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
    if ((e.evt as MouseEvent).button !== 0) return;

    const stage = e.target.getStage();

    const clickedOnEmpty = e.target === stage;

    if (!clickedOnEmpty) {
      return;
    }

    if (clickedOnEmpty && contextMenu) {
      setContextMenu(null);
      return;
    }

    const { x, y } = stage.getRelativePointerPosition();

    moveStartPosition.current = [x, y];

    switch (toolType) {
      case 'hand':
        return;
      case 'select':
        setSelectRect(drawRectangle([moveStartPosition.current, [x, y]]));
        setDrawing(true);
        break;
      case 'text':
        setDraftNode(createNode(toolType, [x, y]));
        break;
      default:
        setDraftNode(createNode(toolType, [x, y]));
        setDrawing(true);
        break;
    }

    setSelectedNode(null);
    setNodesInStaging([]);
    setContextMenu(null);
  };

  const onMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const stage = e.target.getStage();

    if (!stage) return;

    const { x, y } = stage.getRelativePointerPosition();

    if (!drawing) return;

    if (toolType === 'select' && selectRectRef.current) {
      setSelectRect(drawRectangle([moveStartPosition.current, [x, y]]));
      setIntersectingNodes(stage, selectRectRef.current.getClientRect());
      return;
    }

    setDraftNode((prevNode) => {
      return prevNode ? drawNodeByType(prevNode, [x, y]) : prevNode;
    });
  };

  const onMoveEnd = () => {
    switch (toolType) {
      case 'select':
        setSelectRect(null);
        setDrawing(false);
        break;
      case 'draw':
        if (!draftNode) return;
        dispatch(nodesActions.add([draftNode]));
        setDrawing(false);
        break;
      case 'text':
        break;
      default: {
        if (!draftNode) return;

        dispatch(nodesActions.add([draftNode]));
        onDraftEnd();
        setDrawing(false);
      }
    }

    if (draftNode) {
      setDraftNode(null);
    }
  };

  const handleNodeChange = (node: NodeType) => {
    dispatch(nodesActions.update([node]));
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

    onStageZoomChange(newScale);
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

  const handleStageOnWheel = (e: KonvaEventObject<WheelEvent>) => {
    const stage = e.target.getStage();

    if (e.evt.ctrlKey && stage) {
      e.evt.preventDefault();
      zoomStageRelativeToPointerPosition(stage, e.evt);
    }
  };

  const handleStageDragEvent = (event: KonvaEventObject<DragEvent>) => {
    const stage = event.target as Konva.Stage;

    if (stage !== event.target.getStage()) return;

    if (event.type === 'dragstart') {
      stage.container().style.cursor = CURSOR.GRABBING;
    } else {
      stage.container().style.cursor = CURSOR.GRAB;
    }
  };

  const handleNodeGroupDrag = (updatedNodes: NodeType[]) => {
    dispatch(nodesActions.update(updatedNodes));
  };

  const handleDraftEnd = (node: NodeType) => {
    dispatch(nodesActions.add([node]));
    setDraftNode(null);
    onDraftEnd();
  };

  const handleNodePress = (node: NodeType) => {
    setSelectedNode(node);
    onNodeSelect(node);
  };

  return (
    <Stage
      ref={stageRef}
      width={width}
      height={height}
      style={{ backgroundColor: '#fafafa' }}
      draggable={toolType === 'hand'}
      onMouseDown={onMoveStart}
      onMouseMove={onMove}
      onMouseUp={onMoveEnd}
      onContextMenu={handleOnContextMenu}
      onWheel={handleStageOnWheel}
      onDragStart={handleStageDragEvent}
      onDragEnd={handleStageDragEvent}
    >
      <Layer>
        {nodes.map((node) => {
          return (
            <Node
              key={node.nodeProps.id}
              node={node}
              selected={selectedNode?.nodeProps.id === node.nodeProps.id}
              draggable={toolType !== 'hand'}
              onPress={() => handleNodePress(node)}
              onNodeChange={handleNodeChange}
            />
          );
        })}
        {draftNode && (
          <DraftNode node={draftNode} onDraftEnd={handleDraftEnd} />
        )}
        {selectRect ? (
          <SelectTool rect={selectRect} ref={selectRectRef} />
        ) : null}
        {nodesInStaging.length ? (
          <NodeGroupTransformer
            selectedNodes={nodesInStaging}
            onDragStart={handleNodeGroupDrag}
            onDragEnd={handleNodeGroupDrag}
          />
        ) : null}
        <Html
          groupProps={{
            x: contextMenu?.position[0],
            y: contextMenu?.position[1],
          }}
        >
          {contextMenu && (
            <ContextMenu
              menuItems={contextMenu.items}
              onAction={onNodeMenuAction}
            />
          )}
        </Html>
      </Layer>
    </Stage>
  );
};

export default ShapesStage;
