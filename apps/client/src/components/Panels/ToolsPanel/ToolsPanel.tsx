import { Fragment } from 'react';
import Divider from '@/components/Elements/Divider/Divider';
import { ICON_SIZES } from '@/constants/icon';
import { TOOLS, type Tool } from '@/constants/panels/tools';
import { getKeyTitle } from '@/utils/string';
import * as Styled from '../Panels.styled';

type Props = {
  activeTool: Tool['value'];
  onToolSelect: (type: Tool['value']) => void;
};

const ToolsPanel = ({ activeTool, onToolSelect }: Props) => {
  return (
    <Styled.Panel>
      {TOOLS.map((tool, index) => {
        return (
          <Fragment key={tool.value}>
            <Styled.Button
              size="small"
              color={activeTool === tool.value ? 'primary' : 'secondary'}
              title={getKeyTitle(tool.value, [tool.key])}
              onClick={() => onToolSelect(tool.value)}
            >
              {tool.icon({ size: ICON_SIZES.MEDIUM })}
            </Styled.Button>
            {index === 1 && <Divider orientation="vertical" />}
          </Fragment>
        );
      })}
    </Styled.Panel>
  );
};

export default ToolsPanel;
