import { createElement } from 'react';
import { getElement } from '../../shared/element';
import { NodeComponentProps } from '../types';

const Node = ({ node, ...restProps }: NodeComponentProps) => {
  return createElement(getElement(node.type), {
    node,
    ...restProps,
  } as NodeComponentProps);
};

export default Node;
