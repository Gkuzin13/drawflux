import { CronJob } from 'cron';
import * as db from '@/database/index';

const query = `DELETE FROM pages WHERE created_at < now()-'24 hours'::interval RETURNING *;`;

export const deleteExpiredPages = new CronJob('0 0 * * *', async () => {
  const client = await db.getClient();

  try {
    const { rowCount } = await db.query(query);

    console.log(
      `Job: Delete expired pages daily at 0:00\n
       at ${new Date()}\n
       Deleted pages: ${rowCount}`,
    );
  } catch (error) {
    console.error(error);
  } finally {
    client.release();
  }
});
