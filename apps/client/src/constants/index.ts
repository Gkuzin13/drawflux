import type { IconName } from '@/components/Elements/Icon/Icon';

export type Entity<Value = string | number> = {
  name: string;
  value: Value;
  icon: IconName;
};
