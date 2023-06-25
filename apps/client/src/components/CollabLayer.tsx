import type Konva from 'konva';
import {
  type ForwardedRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { WSMessage, NodeObject, User } from 'shared';
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

const CollabLayer = ({ stageScale, stageRef }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [draftNodes, setDraftNodes] = useState<NodeObject[]>([]);

  const { userId } = useAppSelector(selectShare);
  const ws = useWebSocket();

  const dispatch = useAppDispatch();

  const collaborators = useMemo(() => {
    return users.filter((user) => user.id !== userId);
  }, [users, userId]);

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
    container.addEventListener('mousemove', handlePointerMove);

    return () => {
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mousemove', handlePointerMove);
    };
  }, [stageRef, ws, userId]);

  const handleUserMove = useCallback(
    (data: Extract<WSMessage, { type: 'user-move' }>['data']) => {
      setUsers((prevUsers) => {
        const userToUpdate = prevUsers.find((user) => user.id === data.id);

        if (!userToUpdate) {
          return prevUsers;
        }

        const updatedUser: User = {
          id: data.id,
          position: data.position,
          color: userToUpdate.color,
          name: userToUpdate.name,
        };

        return prevUsers.map((user) => {
          return data.id === user.id ? updatedUser : user;
        });
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
        case 'room-joined': {
          setUsers(data.users);
          break;
        }
        case 'user-joined': {
          setUsers((prevUsers) => {
            return [...prevUsers, data.user];
          });
          dispatch(shareActions.addUser(data.user));
          break;
        }
        case 'user-move': {
          handleUserMove(data);
          break;
        }
        case 'user-left': {
          setUsers((prevUsers) => {
            return prevUsers.filter((user) => user.id !== data.id);
          });
          dispatch(shareActions.removeUser(data));
          break;
        }
        case 'user-change': {
          setUsers((prevUsers) => {
            return prevUsers.map((user) => {
              if (user.id === data.user.id) {
                return { ...user, ...data.user };
              }
              return user;
            });
          });

          dispatch(shareActions.updateUser(data.user));
          break;
        }
      }
    },
    [handleUserMove, dispatch],
  );

  useWSMessage({
    connection: ws?.connection,
    isConnected: ws?.isConnected,
    onMessage: handleMessages,
  });

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
