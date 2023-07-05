import * as PopoverPrimitive from '@radix-ui/react-popover';
import { memo, useEffect, useRef, useState } from 'react';
import { TbCheck, TbPencil, TbUsers } from 'react-icons/tb';
import { type User, colors } from 'shared';
import Button from '@/components/Elements/Button/Button';
import ColorsGrid from '@/components/Elements/ColorsGrid/ColorsGrid';
import TextInput from '@/components/Elements/TextInput/TextInput';
import { USER } from '@/constants/app';
import { ICON_SIZES } from '@/constants/icon';
import { KEYS } from '@/constants/keys';
import { useAppSelector } from '@/stores/hooks';
import { selectCollaboration } from '@/stores/slices/collaboration';
import * as Styled from './UsersPanel.styled';

type Props = {
  onUserChange: (user: User) => void;
};

const UsersPanel = ({ onUserChange }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const { users, userId } = useAppSelector(selectCollaboration);

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
          <TbUsers size={ICON_SIZES.SMALL} />
        </Styled.Trigger>
      </Styled.Container>
      <PopoverPrimitive.Portal>
        <Styled.Content align="end" sideOffset={4} css={{ minWidth: '$11' }}>
          {users.map((user) => {
            const isCurrentUser = user.id === userId;

            return (
              <Styled.Info key={user.id}>
                {isCurrentUser ? (
                  <PopoverPrimitive.Root>
                    <PopoverPrimitive.Trigger title="Change user color">
                      <Styled.Color
                        color={colors[user.color]}
                        size={ICON_SIZES.LARGE}
                      />
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
                  <Styled.Color
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
                  <Styled.Name>{user.name}</Styled.Name>
                )}
                {isCurrentUser && (
                  <>
                    {!isEditing && <Styled.Indicator>You</Styled.Indicator>}
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
              </Styled.Info>
            );
          })}
        </Styled.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};

export default memo(UsersPanel);
