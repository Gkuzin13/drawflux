import { ICON_SIZES } from '@/client/shared/styles/theme';
import { capitalizeFirstLetter } from '@/client/shared/utils/string';
import { createElement, Fragment } from 'react';
import { TOOLS, Tool } from '@/client/shared/constants/tool';
import Button from '@/client/components/Button/Button';
import { Divider } from '@/client/components/Divider/Divider';
import { ToolsPanelContainer, ToolsPanelRow } from './ToolsPanelStyled';

type Props = {
  activeTool: Tool['value'];
  onToolSelect: (type: Tool['value']) => void;
};

const ToolsPanel = ({ activeTool, onToolSelect }: Props) => {
  const getToolTitle = (tool: Tool) => {
    return `${capitalizeFirstLetter(tool.value)} — ${tool.key.toUpperCase()}`;
  };

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
                title={getToolTitle(tool)}
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
