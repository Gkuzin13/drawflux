/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  capitalizeFirstLetter,
  createKeyTitle,
  createTitle,
  hexToRGBa,
} from '../string';

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

describe('createKeyTitle', () => {
  it('should return a formatted string for a single key', () => {
    expect(createKeyTitle('foo', ['bar'])).toBe('Foo — Bar');
  });

  it('should return a formatted string for multiple keys', () => {
    expect(createKeyTitle('foo', ['bar', 'foo'])).toBe('Foo — Bar + Foo');
  });

  it('should return empty string if name is an empty string', () => {
    expect(createKeyTitle('', ['foo', 'bar'])).toBe(' — Foo + Bar');
  });

  it('should return keys as strings when provided with non-string values', () => {
    expect(createKeyTitle('foo', [<any>12, null])).toBe('Foo — 12 + Null');
  });
});

describe('createTitle', () => {
  it('returns a formatted title', () => {
    expect(createTitle('foo', 'bar')).toBe('foo — bar');
  });
});

describe('hexToRGBa', () => {
  it('return a hex color to rgba', () => {
    expect(hexToRGBa('#FFFFFF')).toEqual('rgba(255, 255, 255, 1)');
  });

  it('returns a hex color with provided alpha to rgba', () => {
    expect(hexToRGBa('#FFFFFF', 0.5)).toEqual('rgba(255, 255, 255, 0.5)');
  });
});
