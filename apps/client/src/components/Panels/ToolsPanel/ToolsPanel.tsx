import { Fragment, memo } from 'react';
import Divider from '@/components/Elements/Divider/Divider';
import { TOOLS, type ToolType } from '@/constants/panels/tools';
import { getKeyTitle } from '@/utils/string';
import * as Styled from '../Panels.styled';
import Icon from '@/components/Elements/Icon/Icon';

type Props = {
  activeTool: ToolType;
  onToolSelect: (type: ToolType) => void;
};

const ToolsPanel = ({ activeTool, onToolSelect }: Props) => {
  return (
    <Styled.Panel>
      {TOOLS.map((tool, index) => {
        return (
          <Fragment key={tool.value}>
            <Styled.Button
              size="sm"
              color={activeTool === tool.value ? 'primary' : 'secondary'}
              title={getKeyTitle(tool.name, [tool.key])}
              data-testid={`tool-button-${tool.value}`}
              onClick={() => onToolSelect(tool.value)}
            >
              <Icon name={tool.icon} size="lg" stroke="md" />
            </Styled.Button>
            {index === 1 && (
              <Divider orientation="vertical" css={{ margin: '0 $1' }} />
            )}
          </Fragment>
        );
      })}
    </Styled.Panel>
  );
};

export default memo(ToolsPanel);
