import { act, renderHook, screen } from '@testing-library/react';
import { ModalProvider, useModal } from '../modal';

describe('modal context', () => {
  it('opens dialog with provided content', async () => {
    const { result } = renderHook(() => useModal(), { wrapper: ModalProvider });

    await act(async () => {
      result.current.open({ title: 'title', description: 'description' });
    });

    expect(result.current.opened).toBe(true);
    expect(result.current.content).toEqual({
      title: 'title',
      description: 'description',
    });

    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('description')).toBeInTheDocument();
  });
});
