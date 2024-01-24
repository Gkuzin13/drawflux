import { act, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalProvider, useModal } from '../modal';

describe('modal context', () => {
  it('opens with provided content', async () => {
    const { result } = renderHook(() => useModal(), { wrapper: ModalProvider });

    await act(async () => {
      result.current.openModal({
        title: 'test title',
        description: 'test description',
      });
    });

    const content = screen.getByTestId(/dialog-content/);

    expect(content).toBeInTheDocument();
    expect(within(content).getByText(/test title/)).toBeInTheDocument();
    expect(within(content).getByText(/test description/)).toBeInTheDocument();
  });

  it('closes by clicking close button', async () => {
    const { result } = renderHook(() => useModal(), { wrapper: ModalProvider });

    await act(async () => {
      result.current.openModal({
        title: 'test title',
        description: 'test description',
      });
    });

    expect(screen.getByTestId(/dialog-content/)).toBeInTheDocument();

    await userEvent.click(screen.getByTestId(/close-dialog-button/));

    expect(screen.queryByTestId(/dialog-content/)).not.toBeInTheDocument();
  });

  it('closes from closeModal', async () => {
    const { result } = renderHook(() => useModal(), { wrapper: ModalProvider });

    await act(async () => {
      result.current.openModal({
        title: 'test title',
        description: 'test description',
      });
    });

    expect(screen.getByTestId(/dialog-content/)).toBeInTheDocument();

    await act(async () => {
      result.current.closeModal();
    });

    expect(screen.queryByTestId(/dialog-content/)).not.toBeInTheDocument();
  });
});
