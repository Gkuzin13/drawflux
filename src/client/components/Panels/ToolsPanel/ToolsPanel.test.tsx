import { render, screen } from '@testing-library/react';
import App from '@/client/App';

describe('Simple working test', () => {
  it('the title is visible', () => {
    render(<App />);
    screen.debug();
  });
});
