import { globalCss } from '@stitches/react';

export const globalStyle = globalCss({
  '@font-face': [
    {
      fontFamily: 'Heebo',
      fontDisplay: 'swap',
      fontStyle: 'normal',
      fontWeight: 400,
      src: "url('../fonts/Heebo-Regular.woff2') format('woff2')",
    },
    {
      fontFamily: 'Klee One',
      fontStyle: 'normal',
      fontDisplay: 'swap',
      src: "url('../fonts/Klee-One-Regular.woff2') format('woff2')",
    },
  ],
  body: {
    fontFamily: 'Heebo, sans-serif',
    overflow: 'hidden',
    color: '$black',
    backgroundColor: '$canvas-bg',
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
