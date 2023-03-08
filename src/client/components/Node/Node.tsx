import { createElement, memo } from 'react';
import { getElement } from '../../shared/element';
import { NodeComponentProps } from '../types';

const Node = memo(({ node, ...restProps }: NodeComponentProps) => {
  return createElement(getElement(node.type), {
    node,
    ...restProps,
  } as NodeComponentProps);
});

Node.displayName = 'Node';

export default Node;
