import { Fragment, memo } from 'react';
import { TOOLS, type ToolType } from '@/constants/panels/tools';
import { createKeyTitle } from '@/utils/string';
import Icon from '@/components/Elements/Icon/Icon';
import * as Styled from './ToolsPanel.styled';
import * as PanelStyled from '../Panels.styled';

type Props = {
  activeTool: ToolType;
  onToolSelect: (type: ToolType) => void;
};

const ToolsPanel = ({ activeTool, onToolSelect }: Props) => {
  return (
    <Styled.Container>
      {TOOLS.map((tool) => {
        return (
          <Fragment key={tool.value}>
            <PanelStyled.Button
              size="sm"
              color={activeTool === tool.value ? 'primary' : 'secondary'}
              title={createKeyTitle(tool.name, [tool.key])}
              data-testid={`tool-button-${tool.value}`}
              onClick={() => onToolSelect(tool.value)}
            >
              <Icon name={tool.icon} />
            </PanelStyled.Button>
            {tool.value === 'hand' && (
              <Styled.ToolsDivider orientation="vertical" />
            )}
          </Fragment>
        );
      })}
    </Styled.Container>
  );
};

export default memo(ToolsPanel);
