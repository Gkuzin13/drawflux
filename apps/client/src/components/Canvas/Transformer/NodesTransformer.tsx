import { memo, useEffect, useMemo, useRef } from 'react';
import useThemeColors from '@/hooks/useThemeColors';
import { getPointsAbsolutePosition } from '@/utils/position';
import { TRANSFORMER } from '@/constants/shape';
import { Transformer } from 'react-konva';
import { normalizeTransformerSize } from './helpers';
import { getNodeSize } from '../Shapes/EditableText/helpers/size';
import { getEllipseRadius } from '../Shapes/EllipseDrawable/helpers/calc';
import { getRectSize } from '../Shapes/RectDrawable/helpers/calc';
import type Konva from 'konva';
import type { NodeObject, Point } from 'shared';

type Props = {
  selectedNodes: NodeObject[];
  stageScale: number;
  onNodesChange: (nodes: NodeObject[]) => void;
};

const NodesTransformer = ({
  selectedNodes,
  stageScale,
  onNodesChange,
}: Props) => {
  const themeColors = useThemeColors();

  const transformerRef = useRef<Konva.Transformer>(null);

  const onlySingleNode = selectedNodes.length === 1;
  const hasMultipleNodes = selectedNodes.length > 1;

  /**
   * arrow node has it's own transformer, but we still need to render this one
   * for snap line guides calculations
   */
  const onlyArrowNode = onlySingleNode && selectedNodes[0].type === 'arrow';

  const enabledAnchors = useMemo(() => {
    if (onlySingleNode) {
      if (selectedNodes[0].type === 'text') {
        return ['middle-left', 'middle-right'];
      }
      return undefined;
    }
    return [];
  }, [selectedNodes, onlySingleNode]);

  const keepRatio = useMemo(() => {
    if (onlySingleNode) {
      const nodeType = selectedNodes[0].type;

      if (nodeType === 'rectangle' || nodeType === 'ellipse') {
        return false;
      }
    }
    return true;
  }, [selectedNodes, onlySingleNode]);

  useEffect(() => {
    if (!transformerRef.current) {
      return;
    }

    const layer = transformerRef.current.getLayer() as Konva.Layer;
    const nodeIds = new Set(selectedNodes.map(({ nodeProps }) => nodeProps.id));
    const nodes = layer.find((node: Konva.Node) => nodeIds.has(node.id()));

    transformerRef.current.nodes(nodes);
    transformerRef.current.moveToTop();
    layer.batchDraw();
  }, [selectedNodes]);

  const handleDragStart = (event: Konva.KonvaEventObject<DragEvent>) => {
    if (!onlyArrowNode) {
      event.target.visible(false);
    }
  };

  const handleDragEnd = (event: Konva.KonvaEventObject<DragEvent>) => {
    const transformer = transformerRef.current;

    if (!transformer) {
      return;
    }

    const elements = new Map(
      transformer.nodes().map((node) => [node.id(), node]),
    );

    const updatedNodes: NodeObject[] = [];

    for (const node of selectedNodes) {
      const element = elements.get(node.nodeProps.id);

      if (!element) {
        continue;
      }

      if (node.type === 'arrow' || node.type === 'draw') {
        const stage = element.getStage() as Konva.Stage;
        const points = [
          node.nodeProps.point,
          ...(node.nodeProps.points ?? [node.nodeProps.point]),
        ];

        const [firstPoint, ...restPoints] = getPointsAbsolutePosition(
          points,
          element,
          stage,
        );

        updatedNodes.push({
          ...node,
          nodeProps: {
            ...node.nodeProps,
            point: firstPoint,
            points: restPoints,
          },
        });

        element.position({ x: 0, y: 0 });
        continue;
      }

      updatedNodes.push({
        ...node,
        nodeProps: {
          ...node.nodeProps,
          point: [element.x(), element.y()] as Point,
        },
      });
    }

    onNodesChange(updatedNodes);

    if (!onlyArrowNode) {
      event.target.visible(true);
    }
  };

  const handleTransformStart = () => {
    const activeAnchor = transformerRef.current?.getActiveAnchor();

    if (activeAnchor === 'rotater' && hasMultipleNodes) {
      transformerRef.current?.visible(false);
    }
  };

  const handleTransformEnd = () => {
    const transformer = transformerRef.current;
    const stage = transformer?.getStage();

    if (!transformer || !stage) {
      return;
    }

    const elements = new Map(
      transformer.nodes().map((node) => [node.id(), node]),
    );

    const updatedNodes: NodeObject[] = [];

    for (const node of selectedNodes) {
      const element = elements.get(node.nodeProps.id);

      if (!element) {
        continue;
      }

      switch (node.type) {
        case 'arrow': {
          const points = [
            node.nodeProps.point,
            ...(node.nodeProps.points ?? [node.nodeProps.point]),
          ];

          const [firstPoint, ...restPoints] = getPointsAbsolutePosition(
            points,
            element,
            stage,
          );

          updatedNodes.push({
            ...node,
            nodeProps: {
              ...node.nodeProps,
              point: firstPoint,
              points: restPoints,
            },
          });

          element.scale({ x: 1, y: 1 });
          element.position({ x: 0, y: 0 });
          element.rotation(0);
          break;
        }
        case 'draw': {
          const points = node.nodeProps.points ?? [];

          const updatedPoints = getPointsAbsolutePosition(
            points,
            element,
            stage,
          );

          updatedNodes.push({
            ...node,
            nodeProps: {
              ...node.nodeProps,
              point: updatedPoints[0],
              points: updatedPoints,
            },
          });

          element.scale({ x: 1, y: 1 });
          element.position({ x: 0, y: 0 });
          element.rotation(0);
          break;
        }
        case 'ellipse': {
          const ellipse = element as Konva.Ellipse;
          const { radiusX, radiusY } = getEllipseRadius(ellipse);

          updatedNodes.push({
            ...node,
            nodeProps: {
              ...node.nodeProps,
              point: [ellipse.x(), ellipse.y()],
              width: radiusX,
              height: radiusY,
              rotation: ellipse.rotation(),
            },
          });

          ellipse.scale({ x: 1, y: 1 });
          break;
        }
        case 'text': {
          const textNode = element as Konva.Text;
          const joinedText = textNode.textArr
            .map(({ text }) => text)
            .join('\n');

          updatedNodes.push({
            ...node,
            text: joinedText,
            nodeProps: {
              ...node.nodeProps,
              point: [textNode.x(), textNode.y()],
              width: getNodeSize(textNode.width(), textNode.scaleX()),
              height: getNodeSize(textNode.height(), textNode.scaleY()),
              rotation: textNode.rotation(),
            },
          });

          textNode.scale({ x: 1, y: 1 });
          break;
        }
        case 'rectangle': {
          const rect = element as Konva.Rect;
          const { width, height } = getRectSize(rect);

          updatedNodes.push({
            ...node,
            nodeProps: {
              ...node.nodeProps,
              point: [rect.x(), rect.y()],
              width,
              height,
              rotation: rect.rotation(),
            },
          });

          rect.scale({ x: 1, y: 1 });
        }
      }
    }

    onNodesChange(updatedNodes);

    transformerRef.current?.visible(true);
  };

  return (
    <Transformer
      ref={transformerRef}
      name={TRANSFORMER.NAME}
      anchorFill={themeColors['canvas-bg'].value}
      anchorStroke={TRANSFORMER.BORDER_STROKE}
      borderStroke={TRANSFORMER.BORDER_STROKE}
      anchorStrokeWidth={TRANSFORMER.ANCHOR_STROKE_WIDTH}
      anchorSize={TRANSFORMER.ANCHOR_SIZE}
      anchorCornerRadius={TRANSFORMER.ANCHOR_CORNER_RADIUS}
      padding={TRANSFORMER.PADDING * stageScale}
      rotateAnchorOffset={TRANSFORMER.ROTATION_ANCHOR_OFFSET}
      rotationSnaps={TRANSFORMER.ROTATION_SNAPS}
      rotateLineVisible={false}
      ignoreStroke={true}
      shouldOverdrawWholeArea={true}
      rotateAnchorCursor="grab"
      enabledAnchors={enabledAnchors}
      keepRatio={keepRatio}
      visible={!onlyArrowNode}
      boundBoxFunc={normalizeTransformerSize}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTransformStart={handleTransformStart}
      onTransformEnd={handleTransformEnd}
    />
  );
};

export default memo(NodesTransformer);
