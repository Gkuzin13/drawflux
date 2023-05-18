import { beforeEach } from 'vitest';
import * as db from '../db/index';
import { queries } from '../db/queries/index';

beforeEach(() => {
  (async () => {
    const client = await db.getClient();

    try {
      await db.query(queries.createPageTable);
      console.log('create table');
    } catch (error) {
      console.log(error);
    } finally {
      client.release();
    }
  })();
});
