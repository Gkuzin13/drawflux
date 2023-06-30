import { isJsonString } from '../file';

describe('isJsonString', () => {
  it('should return true if provided string is a JSON string', () => {
    expect(isJsonString('{ "foo": "bar" }')).toBe(true);
  });

  it('should return false if provided string is invalid JSON string', () => {
    expect(isJsonString('{"foo": "bar"')).toBe(false);
    expect(isJsonString('{foo: "bar"}')).toBe(false);
  });

  it('should return false if provided an non-string input', () => {
    expect(isJsonString(<never>42)).toBe(false);
    expect(isJsonString(<never>null)).toBe(false);
    expect(isJsonString(<never>undefined)).toBe(false);
    expect(isJsonString(<never>{ string: '{"foo": "bar"}' })).toBe(false);
  });
});
