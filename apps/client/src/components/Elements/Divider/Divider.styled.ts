import * as Seperator from '@radix-ui/react-separator';
import { styled } from 'shared';

export const Root = styled(Seperator.Root, {
  backgroundColor: '$secondary',
  alignSelf: 'center',
  '&[data-orientation=horizontal]': {
    height: '1px',
    width: '100%',
  },
  '&[data-orientation=vertical]': {
    height: 'calc(100% - $sizes$2)',
    width: '1px',
  },
});
