import { getQuery, queryCache } from './getQuery';

describe('getQuery', () => {
  beforeEach(() => {
    queryCache.clear();
  });

  it('returns the query from cache if it exists', async () => {
    const query = 'SELECT * FROM users';
    queryCache.set('users', query);

    const result = await getQuery('users');
    expect(result).toBe(query);
  });

  it('throws an error if the file does not exist', async () => {
    await expect(getQuery('nonexistent')).rejects.toThrow(
      /Failed to read file/,
    );
  });
});
