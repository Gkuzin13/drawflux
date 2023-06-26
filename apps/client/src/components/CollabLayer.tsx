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
import { useWebSocket } from '@/contexts/websocket';
import useWSMessage from '@/hooks/useWSMessage';
import { useAppDispatch, useAppSelector } from '@/stores/hooks';
import { selectShare, shareActions } from '@/stores/slices/share';
import { sendMessage } from '@/utils/websocket';
import { type DrawableType, drawTypes } from './Canvas/helpers/draw';
import DraftNode from './Node/DraftNode';
import UserCursor from './UserCursor';

type Props = {
  stageScale: number;
  stageRef: ForwardedRef<Konva.Stage>;
};

type UserCursors = {
  [userId: string]: Point;
};

const CollabLayer = ({ stageScale, stageRef }: Props) => {
  const [userCursors, setUserCursors] = useState<UserCursors>({});
  const [draftNodes, setDraftNodes] = useState<NodeObject[]>([]);

  const { userId, users } = useAppSelector(selectShare);

  const ws = useWebSocket();

  const dispatch = useAppDispatch();

  const collaborators = useMemo(() => {
    return users
      .filter((user) => user.id !== userId)
      .map((user) => {
        if (user.id in userCursors) {
          return { ...user, position: userCursors[user.id] };
        }

        return user;
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

    const handlePointerMove = () => {
      const { x, y } = stage.getRelativePointerPosition();

      const message: WSMessage = {
        type: 'user-move',
        data: { id: userId, position: [x, y] },
      };

      sendMessage(ws.connection, message);
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handlePointerMove);

    return () => {
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('touchmove', handlePointerMove);
    };
  }, [stageRef, ws, userId]);

  useEffect(() => {
    setUserCursors((prevUsers) => {
      const updatedUserCursors = { ...prevUsers };

      users.forEach((user) => {
        if (user.id in prevUsers === false) {
          updatedUserCursors[user.id] = [0, 0];
        }
      });

      return updatedUserCursors;
    });
  }, [users]);

  const handleUserMove = useCallback(
    (user: Extract<WSMessage, { type: 'user-move' }>['data']) => {
      setUserCursors((prevUsers) => {
        if (user.id in prevUsers) {
          return { ...prevUsers, [user.id]: user.position };
        }
        return prevUsers;
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
            return [...prevNodes, data.node];
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
            return prevNodes.filter((n) => n.nodeProps.id !== data.id);
          });
          break;
        }
        case 'user-joined': {
          dispatch(shareActions.addUser(data.user));
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
          dispatch(shareActions.removeUser(data));
          break;
        }
        case 'user-change': {
          dispatch(shareActions.updateUser(data.user));
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
        return <UserCursor key={user.id} user={user} stageScale={stageScale} />;
      })}
    </>
  );
};

export default memo(CollabLayer);
