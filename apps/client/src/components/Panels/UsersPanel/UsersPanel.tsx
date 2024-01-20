import { memo } from 'react';
import ColorsGrid from '@/components/Elements/ColorsGrid/ColorsGrid';
import TextInput from '@/components/Elements/TextInput/TextInput';
import Icon from '@/components/Elements/Icon/Icon';
import Text from '@/components/Elements/Text/Text';
import Popover from '@/components/Elements/Popover/Popover';
import { USER } from '@/constants/app';
import { KEYS } from '@/constants/keys';
import { useAppSelector } from '@/stores/hooks';
import useDisclosure from '@/hooks/useDisclosure/useDisclosure';
import useThemeColors from '@/hooks/useThemeColors';
import useAutoFocus from '@/hooks/useAutoFocus/useAutoFocus';
import { getColorValue } from '@/utils/shape';
import {
  selectThisUser,
  selectCollaborators,
} from '@/services/collaboration/slice';
import * as Styled from './UsersPanel.styled';
import type { User } from 'shared';
import type { IconName } from '@/components/Elements/Icon/Icon';

type Props = {
  onUserChange: (user: User) => void;
};

type EditableUserInfoProps = {
  name: string;
  color: User['color'];
  onColorSelect: (color: User['color']) => void;
  onNameChange: (value: string) => void;
};

type UserInfoProps = {
  user: User;
};

const EditableUserInfo = ({
  name,
  color,
  onColorSelect,
  onNameChange,
}: EditableUserInfoProps) => {
  const [isEditing, setIsEditing] = useDisclosure();

  const themeColors = useThemeColors();

  const inputRef = useAutoFocus<HTMLInputElement>([isEditing]);

  const handleNameChange = () => {
    const value = inputRef.current?.value;

    if (value && name !== value) {
      onNameChange(value);
    }
  };

  const handleIsEditingToggle = () => {
    if (isEditing) {
      handleNameChange();
    }

    setIsEditing.toggle();
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
    
    if (event.key === KEYS.ENTER || event.key === KEYS.ESCAPE) {
      handleIsEditingToggle();
    }
  };

  const editButtonAriaLabel = isEditing ? 'Save username' : 'Change username';
  const editButtonIcon: IconName = isEditing ? 'check' : 'pencil';

  return (
    <Styled.Info>
      <Popover>
        <Styled.ColorChangeTrigger
          title="Change user color"
          style={{ color: getColorValue(color, themeColors) }}
        >
          <Styled.Color />
        </Styled.ColorChangeTrigger>
        <Popover.Portal>
          <Styled.ColorsPopoverContent
            side="left"
            align="start"
            sideOffset={20}
            alignOffset={-10}
          >
            <ColorsGrid value={color} onSelect={onColorSelect} />
          </Styled.ColorsPopoverContent>
        </Popover.Portal>
      </Popover>
      {isEditing && (
        <TextInput
          ref={inputRef}
          label="username"
          id="username"
          name="username"
          size={USER.maxNameLength}
          maxLength={USER.maxNameLength}
          defaultValue={name}
          onKeyDown={handleInputKeyDown}
        />
      )}
      {!isEditing && (
        <>
          <Text size="xs">{name}</Text>
          <Text size="xs" color="gray500">
            You
          </Text>
        </>
      )}
      <Styled.EditUsernameButton
        aria-label={editButtonAriaLabel}
        size="xs"
        color="secondary-light"
        onClick={handleIsEditingToggle}
        editing={isEditing}
        squared
      >
        <Icon name={editButtonIcon} size="sm" />
      </Styled.EditUsernameButton>
    </Styled.Info>
  );
};

const UserInfo = ({ user }: UserInfoProps) => {
  const themeColors = useThemeColors();

  return (
    <Styled.Info>
      <Styled.Color color={getColorValue(user.color, themeColors)} />
      <Text size="xs">{user.name}</Text>
    </Styled.Info>
  );
};

const UsersPanel = ({ onUserChange }: Props) => {
  const collaborators = useAppSelector(selectCollaborators);
  const thisUser = useAppSelector(selectThisUser);

  const handleColorSelect = (color: User['color']) => {
    if (thisUser) {
      onUserChange({ ...thisUser, color });
    }
  };

  const handleNameChange = (name: string) => {
    if (thisUser) {
      onUserChange({ ...thisUser, name });
    }
  };

  if (!thisUser) {
    return null;
  }

  return (
    <Popover>
      <Styled.Container>
        <Styled.Trigger>
          <Icon name="users" />
        </Styled.Trigger>
      </Styled.Container>
      <Popover.Portal>
        <Styled.PopoverContent align="end" sideOffset={14} alignOffset={-4}>
          <EditableUserInfo
            name={thisUser.name}
            color={thisUser.color}
            onColorSelect={handleColorSelect}
            onNameChange={handleNameChange}
          />
          {collaborators.map((user) => {
            return <UserInfo key={user.id} user={user} />;
          })}
        </Styled.PopoverContent>
      </Popover.Portal>
    </Popover>
  );
};

export default memo(UsersPanel);
