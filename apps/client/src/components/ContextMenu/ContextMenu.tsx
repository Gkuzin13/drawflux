import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import NodeMenu from './NodeMenu';
import CanvasMenu from './CanvasMenu';
import useActionManager from './actionManager';
import * as Styled from './ContextMenu.styled';
import type { CanvasMenuAction } from './CanvasMenu';
import type { NodeMenuAction } from './NodeMenu';

export type ContextMenuType = keyof typeof menus;
export type ContextMenuAction = NodeMenuAction | CanvasMenuAction;

type RootProps = {
  menuType: ContextMenuType;
  onContextMenuOpen: (open: boolean) => void;
  children: React.ReactNode;
};

type TriggerProps = ContextMenuPrimitive.ContextMenuTriggerProps;

const menus = {
  'node-menu': NodeMenu,
  'canvas-menu': CanvasMenu,
};

const Trigger = ({ children }: TriggerProps) => {
  return (
    <ContextMenuPrimitive.Trigger>{children}</ContextMenuPrimitive.Trigger>
  );
};

const ContextMenu = ({ menuType, onContextMenuOpen, children }: RootProps) => {
  const dispatchMenuAction = useActionManager();

  const MenuComponent = menus[menuType];

  return (
    <ContextMenuPrimitive.Root onOpenChange={onContextMenuOpen}>
      {children}
      <ContextMenuPrimitive.Portal>
        <Styled.Content data-testid="context-menu">
          <MenuComponent onAction={dispatchMenuAction} />
        </Styled.Content>
      </ContextMenuPrimitive.Portal>
    </ContextMenuPrimitive.Root>
  );
};

ContextMenu.Trigger = Trigger;

export default ContextMenu;
