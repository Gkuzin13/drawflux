import { NodeType, Point } from '../../shared/element';
import { Layer, Stage } from 'react-konva';
import { useEffect, useMemo, useRef, useState } from 'react';
import Konva from 'konva';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { KonvaEventObject, NodeConfig } from 'konva/lib/Node';
import {
  DEFAULT_MENU,
  DEFAULT_NODE_MENU,
  MenuItem,
  MENU_ACTIONS,
} from '../../shared/menu';
import { IRect } from 'konva/lib/types';
import { createNode } from '../../shared/utils/createNode';
import { drawRectangle } from '../../shared/utils/draw';
import { CURSOR } from '../../shared/cursor';
import { drawFreePath } from '../FreePathDrawable/helpers/drawFreePath';
import { drawArrow } from '../ArrowDrawable/helpers/drawArrow';
import { drawRect } from '../RectDrawable/helpers/drawRect';
import { drawEllipse } from '../EllipseDrawable/helpers/drawEllipse';
import { nodesActions, selectNodes } from '@/client/stores/slices/nodesSlice';
import Node from '../Node/Node';
import SelectTool from '../SelectTool';
import NodeGroupTransformer from '../NodeGroupTransformer/NodeGroupTransformer';
import { Html } from 'react-konva-utils';
import ContextMenu from '../ContextMenu/ContextMenu';
import DraftNode from '../Node/DraftNode';
import {
  controlActions,
  selectControl,
} from '@/client/stores/slices/controlSlice';
import {
  calcNewStagePositionAndScale,
  hasStageScaleReachedLimit,
} from './helpers/zoom';
import { StageConfigState } from '@/client/stores/slices/stageConfigSlice';

type Props = {
  config: NodeConfig;
  containerStyle: React.CSSProperties;
  onConfigChange: (config: Partial<StageConfigState>) => void;
};

type ContextMenuState = {
  items: MenuItem[];
  position: Point;
};

const ShapesStage = ({ config, containerStyle, onConfigChange }: Props) => {
  const [draftNode, setDraftNode] = useState<NodeType | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [selectRect, setSelectRect] = useState<IRect | null>(null);
  const [drawing, setDrawing] = useState(false);

  const { selectedNodeId, nodesInStaging, toolType } =
    useAppSelector(selectControl);

  const nodes = useAppSelector(selectNodes).present.nodes;

  const dispatch = useAppDispatch();

  const moveStartPosition = useRef<Point>([0, 0]);

  const stageRef = useRef<Konva.Stage>(null);
  const selectRectRef = useRef<Konva.Rect>(null);

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
        if (!selectedNodeId) return;
        dispatch(nodesActions.delete([selectedNodeId]));
        break;
      case MENU_ACTIONS.SELECT_ALL:
        dispatch(controlActions.setNodesInStaging(nodes));
        break;
    }

    dispatch(controlActions.unsetSelectedNode());
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
      intersectedChildren.map((child) => child.attrs.id),
    );

    const intersectedNodes = nodes.filter((node) =>
      intersectedIds.has(node.nodeProps.id),
    );

    dispatch(controlActions.setNodesInStaging(intersectedNodes));
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
      dispatch(controlActions.setSelectedNode(node.nodeProps.id));
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

  const onMoveStart = (event: KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (event.type === 'mousedown' && (event.evt as MouseEvent).button !== 0) {
      return;
    }

    const stage = event.target.getStage();

    const clickedOnEmpty = event.target === stage;

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

    dispatch(controlActions.unsetSelectedNode());
    dispatch(controlActions.setNodesInStaging([]));
    setContextMenu(null);
  };

  const onMove = (event: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const stage = event.target.getStage();

    if (!stage || !drawing) return;

    const { x, y } = stage.getRelativePointerPosition();

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
        handleDraftEnd(draftNode, false);
        break;
      case 'text':
        break;
      case 'arrow':
        if (!draftNode || !drawing) return;

        if (!draftNode.nodeProps.points) {
          setDrawing(false);
          setDraftNode(null);
          break;
        }
        handleDraftEnd(draftNode);
        break;
      default: {
        if (!draftNode || !drawing) return;
        handleDraftEnd(draftNode);
      }
    }
  };

  const zoomStageRelativeToPointerPosition = (
    stage: Konva.Stage,
    event: WheelEvent,
  ) => {
    const { position, scale } = calcNewStagePositionAndScale(
      stage.scaleX(),
      stage.getRelativePointerPosition(),
      stage.getPosition(),
      event.deltaY,
    );

    if (!hasStageScaleReachedLimit(scale)) {
      onConfigChange({ scale, position });
    }
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

  const handleNodeChange = (nodes: NodeType[]) => {
    dispatch(nodesActions.update(nodes));
  };

  const handleDraftEnd = (node: NodeType, clearDraftNode = true) => {
    dispatch(nodesActions.add([node]));
    setDrawing(false);

    if (clearDraftNode) {
      setDraftNode(null);
      dispatch(controlActions.setToolType('select'));
    }
  };

  const handleNodePress = (node: NodeType) => {
    dispatch(controlActions.setSelectedNode(node.nodeProps.id));
  };

  return (
    <Stage
      ref={stageRef}
      {...config}
      style={containerStyle}
      draggable={toolType === 'hand'}
      onMouseDown={onMoveStart}
      onMouseMove={onMove}
      onMouseUp={onMoveEnd}
      onTouchStart={onMoveStart}
      onTouchMove={onMove}
      onTouchEnd={onMoveEnd}
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
              selected={selectedNodeId === node.nodeProps.id}
              draggable={toolType !== 'hand'}
              onPress={() => handleNodePress(node)}
              onNodeChange={() => handleNodeChange([node])}
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
            onDragStart={handleNodeChange}
            onDragEnd={handleNodeChange}
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
