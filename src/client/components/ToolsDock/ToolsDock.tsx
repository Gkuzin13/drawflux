import { capitalizeFirstLetter } from '@/client/shared/utils/string';
import { createElement } from 'react';
import { TOOLS, Tool } from '../../shared/constants/tool';
import { ToolsDockContriner } from './ToolsDockStyled';

type Props = {
  onToolSelect: (type: Tool['value']) => void;
};

const ToolsDock = ({ onToolSelect }: Props) => {
  const getToolTitle = (tool: Tool) => {
    return `${capitalizeFirstLetter(tool.value)} — ${tool.key.toUpperCase()}`;
  };

  return (
    <ToolsDockContriner>
      {Object.values(TOOLS).map((tool, i) => {
        return (
          <button
            key={i}
            title={getToolTitle(tool)}
            onClick={() => onToolSelect(tool.value)}
          >
            {createElement(tool.icon)}
          </button>
        );
      })}
    </ToolsDockContriner>
  );
};

export default ToolsDock;
