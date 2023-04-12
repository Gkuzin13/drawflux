import { createElement, Fragment } from 'react';
import Button from '@/components/core/Button/Button';
import { Divider } from '@/components/core/Divider/Divider';
import { ICON_SIZES } from '@/constants/icon';
import { TOOLS, type Tool } from '@/constants/tool';
import { getKeyTitle } from '@/utils/string';
import { ToolsPanelContainer, ToolsPanelRow } from './ToolsPanelStyled';

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
