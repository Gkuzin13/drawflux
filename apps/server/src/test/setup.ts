import { beforeAll } from 'vitest';
import * as db from '../db/index';
import { queries } from '../db/queries/index';

beforeAll(() => {
  (async () => {
    const client = await db.getClient();

    try {
      await db.query(queries.createPageTable);
    } catch (error) {
      console.log(error);
    } finally {
      client.release();
    }
  })();
});
