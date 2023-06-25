import { memo, useCallback, useMemo, useState } from 'react';
import type { WSMessage, NodeObject, User } from 'shared';
import useWSMessage from '@/hooks/useWSMessage';
import { useAppSelector } from '@/stores/hooks';
import { selectShare } from '@/stores/slices/share';
import { useWebSocket } from '@/webSocketContext';
import { type DrawableType, drawTypes } from './Canvas/helpers/draw';
import CollaboratorCursor from './CollaboratorCursor';
import DraftNode from './Node/DraftNode';

type Props = {
  stageScale: number;
};

const CollabLayer = ({ stageScale }: Props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [draftNodes, setDraftNodes] = useState<NodeObject[]>([]);

  const { userId } = useAppSelector(selectShare);

  const ws = useWebSocket();

  const handleMessages = useCallback((message: WSMessage) => {
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
            (node) => node.nodeProps.id === data.id,
          );

          if (!nodeToUpdate) return prevNodes;

          const updatedNode = drawFn(
            nodeToUpdate,
            data.position.start,
            data.position.current,
          );
          return prevNodes.map((node) => {
            if (node.nodeProps.id === data.id) {
              return updatedNode;
            }

            return node;
          });
        });

        break;
      }
      case 'draft-text-update': {
        setDraftNodes((prevNodes) => {
          return prevNodes.map((node) => {
            if (node.nodeProps.id === data.id) {
              return { ...node, text: data.text };
            }

            return node;
          });
        });
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
        break;
      }
      case 'user-move': {
        setUsers((prevUsers) => {
          const userToUpdate = prevUsers.find((user) => user.id === data.id);

          if (!userToUpdate) {
            return prevUsers;
          }

          const updatedUser = {
            id: data.id,
            position: data.position,
            color: userToUpdate.color,
            name: userToUpdate.name,
          };

          return prevUsers.map((user) => {
            return data.id === user.id ? updatedUser : user;
          });
        });
      }
    }
  }, []);

  useWSMessage({
    connection: ws?.connection,
    isConnected: ws?.isConnected,
    onMessage: handleMessages,
  });

  const collaborators = useMemo(() => {
    return users.filter((user) => user.id !== userId);
  }, [users, userId]);

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
          <CollaboratorCursor
            key={user.id}
            user={user}
            stageScale={stageScale}
          />
        );
      })}
    </>
  );
};

export default memo(CollabLayer);
