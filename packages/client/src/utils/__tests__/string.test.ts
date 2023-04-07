/* eslint-disable @typescript-eslint/no-explicit-any */
import { capitalizeFirstLetter, getKeyTitle, isJsonString } from '../string';

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

describe('isJsonString', () => {
  it('should return true if provided string is a JSON string', () => {
    expect(isJsonString('{ "foo": "bar" }')).toBe(true);
  });

  it('should return false if provided string is invalid JSON string', () => {
    expect(isJsonString('{"foo": "bar"')).toBe(false);
    expect(isJsonString('{foo: "bar"}')).toBe(false);
  });

  it('should return false if provided an non-string input', () => {
    expect(isJsonString(<any>42)).toBe(false);
    expect(isJsonString(<any>null)).toBe(false);
    expect(isJsonString(<any>undefined)).toBe(false);
    expect(isJsonString(<any>{ string: '{"foo": "bar"}' })).toBe(false);
  });
});
