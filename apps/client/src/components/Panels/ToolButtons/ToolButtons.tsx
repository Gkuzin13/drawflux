import { Fragment, memo } from 'react';
import { TOOLS } from '@/constants/panels';
import { createKeyTitle } from '@/utils/string';
import Icon from '@/components/Elements/Icon/Icon';
import * as PanelStyled from '../Panels.styled';
import * as Styled from './ToolButtons.styled';
import type { ToolType } from '@/constants/app';

type Props = {
  activeTool: ToolType;
  onToolSelect: (type: ToolType) => void;
};

const ToolButtons = ({ activeTool, onToolSelect }: Props) => {
  return (
    <>
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
    </>
  );
};

export default memo(ToolButtons);
