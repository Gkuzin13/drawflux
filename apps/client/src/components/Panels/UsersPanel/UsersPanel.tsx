import * as PopoverPrimitive from '@radix-ui/react-popover';
import { memo, useEffect, useRef, useState } from 'react';
import { type User, colors } from 'shared';
import Button from '@/components/Elements/Button/Button';
import ColorsGrid from '@/components/Elements/ColorsGrid/ColorsGrid';
import TextInput from '@/components/Elements/TextInput/TextInput';
import { USER } from '@/constants/app';
import { KEYS } from '@/constants/keys';
import { useAppSelector } from '@/stores/hooks';
import { selectMyUser, selectUsers } from '@/stores/slices/collaboration';
import * as Styled from './UsersPanel.styled';
import Icon from '@/components/Elements/Icon/Icon';

type Props = {
  onUserChange: (user: User) => void;
};

const UsersPanel = ({ onUserChange }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const users = useAppSelector(selectUsers);
  const userId = useAppSelector(selectMyUser);

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
    <PopoverPrimitive.Root onOpenChange={() => setIsEditing(false)}>
      <Styled.Container>
        <Styled.Trigger>
          <Icon name="users" />
        </Styled.Trigger>
      </Styled.Container>
      <PopoverPrimitive.Portal>
        <Styled.Content align="end" sideOffset={4} css={{ minWidth: '$11' }}>
          {users.map((user) => {
            const isCurrentUser = user.id === userId;
            const color = colors[user.color];

            return (
              <Styled.Info key={user.id}>
                {isCurrentUser ? (
                  <PopoverPrimitive.Root>
                    <PopoverPrimitive.Trigger
                      title="Change user color"
                      style={{ color }}
                    >
                      <Styled.Color />
                    </PopoverPrimitive.Trigger>
                    <PopoverPrimitive.Portal>
                      <Styled.Content
                        side="left"
                        align="start"
                        sideOffset={16}
                        alignOffset={-16}
                      >
                        <ColorsGrid
                          value={currentUser.color}
                          onSelect={handleColorSelect}
                        />
                      </Styled.Content>
                    </PopoverPrimitive.Portal>
                  </PopoverPrimitive.Root>
                ) : (
                  <Styled.Color color={color} />
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
                  <Styled.Name>{user.name}</Styled.Name>
                )}
                {isCurrentUser && (
                  <>
                    {!isEditing && <Styled.Indicator>You</Styled.Indicator>}
                    <Button
                      aria-label="Change username"
                      size="xs"
                      color="secondary-light"
                      onClick={() => handleNameChange()}
                      css={{ marginLeft: 'auto' }}
                      squared
                    >
                      {isEditing ? (
                        <Icon name="check" size="sm" />
                      ) : (
                        <Icon name="pencil" size="sm" />
                      )}
                    </Button>
                  </>
                )}
              </Styled.Info>
            );
          })}
        </Styled.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};

export default memo(UsersPanel);
