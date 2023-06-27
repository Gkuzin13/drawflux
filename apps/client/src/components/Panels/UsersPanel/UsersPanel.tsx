import * as Popover from '@radix-ui/react-popover';
import { useEffect, useRef, useState } from 'react';
import { TbCheck, TbPencil, TbUsers } from 'react-icons/tb';
import { type User, colors } from 'shared';
import Button from '@/components/core/Button/Button';
import TextInput from '@/components/core/TextInput/TextInput';
import { USER } from '@/constants/app';
import { ICON_SIZES } from '@/constants/icon';
import { KEYS } from '@/constants/keys';
import { useAppSelector } from '@/stores/hooks';
import { selectShare } from '@/stores/slices/share';
import ColorsGrid from '../../ColorsGrid/ColorsGrid';
import {
  UsersPanelContainer,
  UsersPanelContent,
  UserInfo,
  UserIndicator,
  UsersPanelTrigger,
  UserName,
  UserColor,
} from './UsersPanelStyled';

type Props = {
  onUserChange: (user: User) => void;
};

const UsersPanel = ({ onUserChange }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const { users, userId } = useAppSelector(selectShare);

  const inputRef = useRef<HTMLInputElement>(null);

  const currentUser = users.find((user) => user.id === userId);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing, inputRef]);

  const handleColorSelect = (color: User['color']) => {
    if (currentUser) {
      onUserChange({ ...currentUser, color });
    }
  };

  const handleNameChange = () => {
    const value = inputRef.current?.value;

    if (currentUser && value && currentUser.name !== value) {
      onUserChange({ ...currentUser, name: value });
    }

    setIsEditing(!isEditing);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;

    if (key === KEYS.ENTER || key === KEYS.ESCAPE) {
      handleNameChange();
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Popover.Root onOpenChange={() => setIsEditing(false)}>
      <UsersPanelContainer>
        <UsersPanelTrigger>
          <TbUsers size={ICON_SIZES.SMALL} />
        </UsersPanelTrigger>
      </UsersPanelContainer>
      <Popover.Portal>
        <UsersPanelContent align="end" sideOffset={4} css={{ minWidth: '$11' }}>
          {users.map((user) => {
            const isCurrentUser = user.id === userId;

            return (
              <UserInfo key={user.id}>
                {isCurrentUser ? (
                  <Popover.Root>
                    <Popover.Trigger title="Change user color">
                      <UserColor
                        color={colors[user.color]}
                        size={ICON_SIZES.LARGE}
                      />
                    </Popover.Trigger>
                    <Popover.Portal>
                      <UsersPanelContent
                        side="left"
                        align="start"
                        sideOffset={16}
                        alignOffset={-16}
                      >
                        <ColorsGrid
                          value={currentUser.color}
                          onSelect={handleColorSelect}
                        />
                      </UsersPanelContent>
                    </Popover.Portal>
                  </Popover.Root>
                ) : (
                  <UserColor
                    color={colors[user.color]}
                    size={ICON_SIZES.LARGE}
                  />
                )}
                {isCurrentUser && isEditing ? (
                  <TextInput
                    ref={inputRef}
                    label="username"
                    id="username"
                    name="username"
                    size={USER.maxNameLength}
                    maxLength={USER.maxNameLength}
                    defaultValue={user.name}
                    onKeyDown={handleInputKeyDown}
                  />
                ) : (
                  <UserName>{user.name}</UserName>
                )}
                {isCurrentUser && (
                  <>
                    {!isEditing && <UserIndicator>You</UserIndicator>}
                    <Button
                      aria-label="Change username"
                      size="extra-small"
                      color="secondary-light"
                      onClick={() => handleNameChange()}
                      css={{ marginLeft: 'auto' }}
                      squared
                    >
                      {isEditing ? (
                        <TbCheck size={ICON_SIZES.SMALL} />
                      ) : (
                        <TbPencil size={ICON_SIZES.SMALL} />
                      )}
                    </Button>
                  </>
                )}
              </UserInfo>
            );
          })}
        </UsersPanelContent>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default UsersPanel;
