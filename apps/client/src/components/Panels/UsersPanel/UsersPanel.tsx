import { memo, useEffect, useRef, useState } from 'react';
import { type User, colors } from 'shared';
import Button from '@/components/Elements/Button/Button';
import ColorsGrid from '@/components/Elements/ColorsGrid/ColorsGrid';
import TextInput from '@/components/Elements/TextInput/TextInput';
import Icon from '@/components/Elements/Icon/Icon';
import { USER } from '@/constants/app';
import { KEYS } from '@/constants/keys';
import { useAppSelector } from '@/stores/hooks';
import { selectThisUser, selectCollaborators } from '@/services/collaboration/slice';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as Styled from './UsersPanel.styled';

type Props = {
  onUserChange: (user: User) => void;
};

const UsersPanel = ({ onUserChange }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const collaborators = useAppSelector(selectCollaborators);
  const thisUser = useAppSelector(selectThisUser);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing, inputRef]);

  const handleColorSelect = (color: User['color']) => {
    if (thisUser) {
      onUserChange({ ...thisUser, color });
    }
  };

  const handleNameChange = () => {
    const value = inputRef.current?.value;

    if (thisUser && value && thisUser.name !== value) {
      onUserChange({ ...thisUser, name: value });
    }

    setIsEditing(!isEditing);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;

    if (key === KEYS.ENTER || key === KEYS.ESCAPE) {
      handleNameChange();
    }
  };

  if (!thisUser) {
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
          {[thisUser, ...collaborators].map((user) => {
            const isCurrentUser = user.id === thisUser.id;
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
                          value={thisUser.color}
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
