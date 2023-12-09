import { memo, useCallback, useEffect, useState } from 'react';
import { WS_THROTTLE_MS } from '@/constants/app';
import { useWebSocket } from '@/contexts/websocket';
import useWSMessage from '@/hooks/useWSMessage';
import { useAppSelector } from '@/stores/hooks';
import { selectUsers, selectMyUser } from '@/stores/slices/collaboration';
import { throttleFn } from '@/utils/timed';
import NodeDraft from '../Node/NodeDraft';
import UserCursor from '../UserCursor';
import useDrafts from '@/hooks/useDrafts';
import { noop } from '@/utils/is';
import type { NodeObject, Point } from 'shared';
import type Konva from 'konva';
import type { ForwardedRef } from 'react';

type Props = {
  stageScale: number;
  stageRef: ForwardedRef<Konva.Stage>;
  isDrawing: boolean;
};

type UserPosition = { [id: string]: Point };

const Collaboration = ({ stageScale, stageRef, isDrawing }: Props) => {
  const [userPositions, setUserPositions] = useState<UserPosition>({});
  const [drafts, dispatchDrafts] = useDrafts();

  const nodeDrafts = drafts.map(({ node }) => node);

  const room = useAppSelector(selectUsers);
  const thisUserId = useAppSelector(selectMyUser);

  const ws = useWebSocket();

  const users = room.map((user) => {
    if (user.id in userPositions) {
      return { ...user, position: userPositions[user.id] };
    }
    return null;
  });

  useEffect(() => {
    if (
      typeof stageRef === 'function' ||
      !stageRef?.current ||
      !ws.isConnected ||
      !thisUserId
    ) {
      return;
    }

    const stage = stageRef.current;
    const container = stage.container();

    const handlePointerMove = throttleFn(() => {
      if (isDrawing) {
        return;
      }

      const { x, y } = stage.getRelativePointerPosition() ?? { x: 0, y: 0 };

      ws.send({
        type: 'user-move',
        data: { id: thisUserId, position: [x, y] },
      });
    }, WS_THROTTLE_MS);

    container.addEventListener('pointermove', handlePointerMove);

    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
    };
  }, [stageRef, ws, thisUserId, isDrawing]);

  useWSMessage(ws.connection, ({ type, data }) => {
    switch (type) {
      case 'draft-create': {
        dispatchDrafts({ type: 'add', payload: { node: data.node } });
        break;
      }
      case 'draft-draw': {
        const { nodeId, position, userId } = data;

        dispatchDrafts({ type: 'draw', payload: { nodeId, position } });
        setUserPositions((prevPositions) => ({
          ...prevPositions,
          [userId]: position.current,
        }));
        break;
      }
      case 'draft-finish': {
        dispatchDrafts({
          type: 'finish',
          payload: { nodeId: data.node.nodeProps.id },
        });
        break;
      }
      case 'draft-finish-keep': {
        dispatchDrafts({
          type: 'finish-keep',
          payload: { nodeId: data.node.nodeProps.id },
        });
        break;
      }
      case 'user-move': {
        setUserPositions((prevPositions) => ({
          ...prevPositions,
          [data.id]: data.position,
        }));
        break;
      }
    }
  });

  const handleNodeSelfDelete = useCallback(
    (node: NodeObject) => {
      const isDrawing = drafts.some(
        (draft) =>
          draft.node.nodeProps.id === node.nodeProps.id && draft.drawing,
      );

      if (!isDrawing) {
        dispatchDrafts({
          type: 'finish',
          payload: { nodeId: node.nodeProps.id },
        });
      }
    },
    [drafts, dispatchDrafts],
  );

  return (
    <>
      {nodeDrafts.map((node) => {
        return (
          <NodeDraft
            key={node.nodeProps.id}
            node={node}
            stageScale={stageScale}
            onNodeChange={noop}
            onNodeDelete={handleNodeSelfDelete}
          />
        );
      })}
      {users.map((user) => {
        if (!user) return null;

        return (
          <UserCursor
            key={user.id}
            name={user.name}
            color={user.color}
            position={user.position}
            stageScale={stageScale}
          />
        );
      })}
    </>
  );
};

export default memo(Collaboration);
