import * as queries from '@/features/Page/queries/index';

export async function findPage(id: string) {
  try {
    return (await queries.getPage(id)).page;
  } catch (error) {
    return null;
  }
}