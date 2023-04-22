import app from './app.js';
import * as db from './db/index.js';
import jobs from './db/jobs.js';
import { queries } from './db/queries/index.js';

await (async () => {
  const client = await db.getClient();

  try {
    await db.query(queries.createPageTable);
  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }
})();

jobs.deleteExpiredPages.start();

const port = process.env.PORT || 7456;

app.listen(Number(port), '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`App is listening on http://localhost:${port}`);
});
