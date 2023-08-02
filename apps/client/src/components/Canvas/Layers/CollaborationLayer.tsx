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
  selectUsers,
  selectMyUser,
  collaborationActions,
} from '@/stores/slices/collaboration';
import { throttleFn } from '@/utils/timed';
import { drawNodeByType } from '../DrawingCanvas/helpers/draw';
import DraftNode from '../Node/DraftNode';
import UserCursor from '../UserCursor';

type Props = {
  stageScale: number;
  stageRef: ForwardedRef<Konva.Stage>;
  isDrawing: boolean;
};

type UserCursors = {
  [userId: string]: Point;
};

const Collaboration = ({ stageScale, stageRef, isDrawing }: Props) => {
  const [userCursors, setUserCursors] = useState<UserCursors>({});
  const [draftNodes, setDraftNodes] = useState<NodeObject[]>([]);

  const users = useAppSelector(selectUsers);
  const userId = useAppSelector(selectMyUser);

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
      !ws.isConnected ||
      !userId
    ) {
      return;
    }

    const stage = stageRef.current;
    const container = stage.container();

    const handlePointerMove = throttleFn(() => {
      if (isDrawing) {
        return;
      }

      const { x, y } = stage.getRelativePointerPosition();

      ws.send({ type: 'user-move', data: { id: userId, position: [x, y] } });
    }, WS_THROTTLE_MS);

    container.addEventListener('pointermove', handlePointerMove);

    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
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
          setDraftNodes((prevNodes) => {
            const nodeToUpdate = prevNodes.find(
              (node) => node.nodeProps.id === data.nodeId,
            );

            if (!nodeToUpdate) return prevNodes;

            const drawedNode = drawNodeByType({
              node: nodeToUpdate,
              position: data.position,
            });

            return prevNodes.map((node) =>
              node.nodeProps.id === data.nodeId ? drawedNode : node,
            );
          });

          handleUserMove({ id: data.userId, position: data.position.current });
          break;
        }
        case 'draft-end': {
          setDraftNodes((prevNodes) => {
            return prevNodes.filter(
              (node) => node.nodeProps.id !== data.nodeProps.id,
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

  useWSMessage(ws.connection, handleMessages, [handleMessages]);

  return (
    <>
      {draftNodes.map((node) => {
        return (
          <DraftNode
            key={node.nodeProps.id}
            node={node}
            stageScale={stageScale}
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

export default memo(Collaboration);
