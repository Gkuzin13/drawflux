import { SharePageParams } from './params';
import { BadRequestError } from '../utils/errors';

export type ServerResponse = {
  error?: typeof BadRequestError;
  data?: SharePageParams;
};
