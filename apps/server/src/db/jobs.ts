import { CronJob } from 'cron';
import type { QueryResult } from 'pg';
import { queries } from './queries/index';
import type { PageRowObject } from './queries/types';
import * as db from './index';

const deleteExpiredPages = new CronJob('0 0 * * *', async () => {
  const client = await db.getClient();

  try {
    const { rowCount }: QueryResult<PageRowObject> = await db.query(
      queries.deletePages,
    );

    console.log(
      `Job: Delete expired pages\n
       at ${new Date()}\n
       Deleted pages: ${rowCount}`,
    );
  } catch (error) {
    console.error(error);
  } finally {
    client.release();
  }
});

export default { deleteExpiredPages };
