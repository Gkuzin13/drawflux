import type Konva from 'konva';
import {
  type ForwardedRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { WSMessage, NodeObject, Point } from 'shared';
import { WS_THROTTLE_MS } from '@/constants/app';
import { useWebSocket } from '@/contexts/websocket';
import useWSMessage from '@/hooks/useWSMessage';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import {
  selectCollaboration,
  collaborationActions,
} from '@/stores/slices/collaboration';
import { throttleFn } from '@/utils/throttle';
import { sendMessage } from '@/utils/websocket';
import { type DrawableType, drawTypes } from '../DrawingCanvas/helpers/draw';
import DraftNode from '../Node/DraftNode';
import UserCursor from './UserCursor/UserCursor';

type Props = {
  stageScale: number;
  stageRef: ForwardedRef<Konva.Stage>;
  isDrawing: boolean;
};

type UserCursors = {
  [userId: string]: Point;
};

const CollabLayer = ({ stageScale, stageRef, isDrawing }: Props) => {
  const [userCursors, setUserCursors] = useState<UserCursors>({});
  const [draftNodes, setDraftNodes] = useState<NodeObject[]>([]);

  const { userId, users } = useAppSelector(selectCollaboration);

  const ws = useWebSocket();

  const dispatch = useAppDispatch();

  const collaborators = useMemo(() => {
    return users
      .filter((user) => user.id !== userId && user.id in userCursors)
      .map((user) => {
        return { ...user, position: userCursors[user.id] };
      });
  }, [users, userId, userCursors]);

  useEffect(() => {
    if (
      typeof stageRef === 'function' ||
      !stageRef?.current ||
      !ws?.isConnected ||
      !userId
    ) {
      return;
    }

    const stage = stageRef.current;
    const container = stage.container();

    const handlePointerMove = throttleFn(() => {
      const { x, y } = stage.getRelativePointerPosition();

      const message: WSMessage = {
        type: 'user-move',
        data: { id: userId, position: [x, y] },
      };

      sendMessage(ws.connection, message);
    }, WS_THROTTLE_MS);

    if (!isDrawing) {
      container.addEventListener('mousemove', handlePointerMove);
      container.addEventListener('touchmove', handlePointerMove);
    } else {
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('touchmove', handlePointerMove);
    }

    return () => {
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('touchmove', handlePointerMove);
    };
  }, [stageRef, ws, userId, isDrawing]);

  const handleUserMove = useCallback(
    (user: Extract<WSMessage, { type: 'user-move' }>['data']) => {
      setUserCursors((prevUsers) => {
        return { ...prevUsers, [user.id]: user.position };
      });
    },
    [],
  );

  const handleMessages = useCallback(
    (message: WSMessage) => {
      const { type, data } = message;

      switch (type) {
        case 'draft-add': {
          setDraftNodes((prevNodes) => {
            return [...prevNodes, data];
          });
          break;
        }
        case 'draft-draw': {
          const drawFn = drawTypes[data.type as DrawableType];

          setDraftNodes((prevNodes) => {
            const nodeToUpdate = prevNodes.find(
              (node) => node.nodeProps.id === data.nodeId,
            );

            if (!nodeToUpdate) return prevNodes;

            const updatedNode = drawFn(
              nodeToUpdate,
              data.position.start,
              data.position.current,
            );

            return prevNodes.map((node) => {
              if (node.nodeProps.id === data.nodeId) {
                return updatedNode;
              }

              return node;
            });
          });

          handleUserMove({ id: data.userId, position: data.position.current });
          break;
        }
        case 'draft-end': {
          setDraftNodes((prevNodes) => {
            return prevNodes.filter(
              (n) => n.nodeProps.id !== data.nodeProps.id,
            );
          });
          break;
        }
        case 'user-move': {
          handleUserMove(data);
          break;
        }
        case 'user-left': {
          setUserCursors((prevUsers) => {
            const userCursorsCopy = { ...prevUsers };
            delete userCursorsCopy[data.id];

            return userCursorsCopy;
          });
          dispatch(collaborationActions.removeUser(data));
          break;
        }
      }
    },
    [dispatch, handleUserMove],
  );

  useWSMessage(ws?.connection, handleMessages, [handleMessages, ws]);

  return (
    <>
      {draftNodes.map((node) => {
        return (
          <DraftNode
            key={node.nodeProps.id}
            node={node}
            onDraftEnd={() => null}
          />
        );
      })}
      {collaborators.map((user) => {
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

export default memo(CollabLayer);
