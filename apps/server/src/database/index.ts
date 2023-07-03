import pg from 'pg';
import type { PoolClient, QueryConfig } from 'pg';
import config from '@/config';

const poolClient = new pg.Pool({
  connectionString: config.isProduction ? config.pgConnectionUri : undefined,
});

export async function query<
  Return extends pg.QueryResultRow,
  Values extends string[],
>(text: string, values?: Values) {
  const start = new Date().getTime();
  const res = await poolClient.query<Return, Values>(text, values);
  const duration = new Date().getTime() - start;

  console.log('Executed query', { text, duration, rows: res.rows });

  return res;
}

export async function getClient() {
  interface MonkeyPatchedPoolClient extends PoolClient {
    lastQuery: QueryConfig[];
  }

  const client = (await poolClient.connect()) as MonkeyPatchedPoolClient;

  const query = client.query;
  const release = client.release;

  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
    console.error(
      `The last executed query on this client was: ${client.lastQuery}`,
    );
  }, 5000);

  // Temporary fix
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client.query = (...args: any): any => {
    client.lastQuery = args;
    return query.apply(client, args);
  };

  client.release = () => {
    clearTimeout(timeout);

    // set the methods back to their old un-monkey-patched version
    client.query = query;
    client.release = release;

    return release.apply(client);
  };

  return client as PoolClient;
}
