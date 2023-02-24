import { createElement } from 'react';
import { TOOLS, Tool } from '../shared/tool';

type Props = {
  onToolSelect: (type: Tool['value']) => void;
};

const ToolsDock = ({ onToolSelect }: Props) => {
  return (
    <div>
      {Object.values(TOOLS).map((shape, i) => {
        return (
          <button key={i} onClick={() => onToolSelect(shape.value)}>
            <span>{shape.value}</span>
            {createElement(shape.icon)}
          </button>
        );
      })}
    </div>
  );
};

export default ToolsDock;
