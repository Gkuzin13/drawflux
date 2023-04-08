import { ICON_SIZES } from '@/constants/icon';
import { createElement, Fragment } from 'react';
import { TOOLS, Tool } from '@/constants/tool';
import Button from '@/components/core/Button/Button';
import { Divider } from '@/components/core/Divider/Divider';
import { ToolsPanelContainer, ToolsPanelRow } from './ToolsPanelStyled';
import { getKeyTitle } from '@/utils/string';

type Props = {
  activeTool: Tool['value'];
  onToolSelect: (type: Tool['value']) => void;
};

const ToolsPanel = ({ activeTool, onToolSelect }: Props) => {
  return (
    <ToolsPanelContainer>
      <ToolsPanelRow>
        {TOOLS.map((tool, index) => {
          return (
            <Fragment key={tool.value}>
              <Button
                color={activeTool === tool.value ? 'primary' : 'secondary'}
                size="small"
                squared={true}
                title={getKeyTitle(tool.value, [tool.key.replace(/Key/i, '')])}
                onClick={() => onToolSelect(tool.value)}
              >
                {createElement(tool.icon, { size: ICON_SIZES.MEDIUM })}
              </Button>
              {index === 1 && <Divider />}
            </Fragment>
          );
        })}
      </ToolsPanelRow>
    </ToolsPanelContainer>
  );
};

export default ToolsPanel;
