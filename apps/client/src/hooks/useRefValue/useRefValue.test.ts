import { renderHook } from '@testing-library/react';
import useRefValue from './useRefValue';

describe('useRefValue', () => {
  it('initializes with the provided initial value', () => {
    const { result } = renderHook(() => useRefValue('hello'));

    const [value] = result.current;

    expect(value.current).toBe('hello');
  });

  it('sets new value', () => {
    const { result } = renderHook(() => useRefValue('hello'));

    const [value, setValue] = result.current;

    setValue('hello world');

    expect(value.current).toBe('hello world');
  });

  it('sets value using a callback function', () => {
    const { result } = renderHook(() => useRefValue('hello'));

    const [value, setValue] = result.current;

    setValue((prevValue) => prevValue + ' world');

    expect(value.current).toBe('hello world');
  });
});
