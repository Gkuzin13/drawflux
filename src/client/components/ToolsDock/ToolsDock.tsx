import { createElement } from 'react';
import { TOOLS, Tool } from '../../shared/tool';
import { ToolsDockContriner } from './ToolsDockStyled';

type Props = {
  onToolSelect: (type: Tool['value']) => void;
};

const ToolsDock = ({ onToolSelect }: Props) => {
  return (
    <ToolsDockContriner>
      {Object.values(TOOLS).map((shape, i) => {
        return (
          <button key={i} onClick={() => onToolSelect(shape.value)}>
            {createElement(shape.icon)}
          </button>
        );
      })}
    </ToolsDockContriner>
  );
};

export default ToolsDock;
