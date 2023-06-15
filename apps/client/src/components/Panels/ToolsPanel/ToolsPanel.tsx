import { Fragment } from 'react';
import { Divider } from '@/components/core/Divider/Divider';
import { ICON_SIZES } from '@/constants/icon';
import { TOOLS, type Tool } from '@/constants/tool';
import { getKeyTitle } from '@/utils/string';
import { Panel, PanelButton } from '../PanelsStyled';

type Props = {
  activeTool: Tool['value'];
  onToolSelect: (type: Tool['value']) => void;
};

const ToolsPanel = ({ activeTool, onToolSelect }: Props) => {
  return (
    <Panel>
      {TOOLS.map((tool, index) => {
        return (
          <Fragment key={tool.value}>
            <PanelButton
              size="small"
              color={activeTool === tool.value ? 'primary' : 'secondary'}
              title={getKeyTitle(tool.value, [tool.key])}
              onClick={() => onToolSelect(tool.value)}
            >
              {tool.icon({ size: ICON_SIZES.MEDIUM })}
            </PanelButton>
            {index === 1 && <Divider orientation="vertical" />}
          </Fragment>
        );
      })}
    </Panel>
  );
};

export default ToolsPanel;
