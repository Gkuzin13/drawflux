import { globalCss } from '@stitches/react';

export const globalStyle = globalCss({
  body: {
    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
    fontSmooth: 'antialiased',
    overflow: 'hidden',
  },
  '*:where(:not(html, iframe, canvas, img, svg, video, audio):not(svg *, symbol *))':
    {
      all: 'unset',
      display: 'revert',
    },
  '*,*::before,*::after': {
    boxSizing: 'border-box',
  },
  'a, button': {
    cursor: 'pointer',
  },
  'ol, ul, menu': {
    listStyle: 'none',
  },
  img: {
    maxInlineSize: '100%',
    maxBlockSize: '100%',
  },
  input: {
    WebkitUserSelect: 'auto',
  },
  textarea: {
    WebkitUserSelect: 'auto',
    whiteSpace: 'revert',
  },
  '::placeholder': {
    color: 'unset',
  },
  ':where(dialog:modal)': {
    all: 'revert',
  },
});
