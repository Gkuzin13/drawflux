/* eslint-disable @typescript-eslint/no-explicit-any */
import { capitalizeFirstLetter, getKeyTitle } from '../string';

describe('capitalizeFirstLetter', () => {
  it('should capitalize the first letter', () => {
    expect(capitalizeFirstLetter('foo')).toEqual('Foo');
    expect(capitalizeFirstLetter('bAR')).toEqual('Bar');
    expect(capitalizeFirstLetter('hello world foo')).toEqual('Hello world foo');
  });

  it('should return an empty string if input is an empty string', () => {
    expect(capitalizeFirstLetter('')).toBe('');
  });

  it('should throw an error if given a non-string input', () => {
    expect(() => capitalizeFirstLetter(<any>42)).toThrow();
    expect(() => capitalizeFirstLetter(<any>null)).toThrow();
    expect(() => capitalizeFirstLetter(<any>undefined)).toThrow();
    expect(() => capitalizeFirstLetter(<any>{ string: 'hello' })).toThrow();
  });
});

describe('getKeyTitle', () => {
  it('should return a formatted string for a single key', () => {
    expect(getKeyTitle('foo', ['bar'])).toBe('Foo — Bar');
  });

  it('should return a formatted string for multiple keys', () => {
    expect(getKeyTitle('foo', ['bar', 'foo'])).toBe('Foo — Bar + Foo');
  });

  it('should return empty string if name is an empty string', () => {
    expect(getKeyTitle('', ['foo', 'bar'])).toBe(' — Foo + Bar');
  });

  it('should return keys as strings when provided with non-string values', () => {
    expect(getKeyTitle('foo', [<any>12, null])).toBe('Foo — 12 + Null');
  });
});
