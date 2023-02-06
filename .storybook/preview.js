import { themes } from '@storybook/theming';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  layout: 'centered',
  backgrounds: {
    default: 'dark',
    values: [
      {
        name: 'dark',
        value: '#1a1a1a',
      },
      {
        name: 'light',
        value: '#F8F8F8',
      },
    ],
  },
  darkMode: {
    dark: { ...themes.dark, appBg: '#0d0d0d' },
    current: 'dark',
    stylePreview: true,
  },
};
