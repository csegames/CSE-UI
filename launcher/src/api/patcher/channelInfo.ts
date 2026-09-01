import { isDate } from 'moment';
import { ChannelStatus } from './channelStatus';

export interface ChannelInfo {
  readonly id: number;
  readonly status: ChannelStatus;
  readonly name: string;
  readonly lastUpdated: Date | null;
}

export function isChannelInfo(value: unknown): value is ChannelInfo {
  if (value === null || typeof value !== 'object') return false;
  const cast = value as ChannelInfo;
  if (typeof cast['id'] !== 'number') return false;
  if (typeof cast['status'] !== 'number') return false;
  if (typeof cast['name'] !== 'string') return false;
  if (cast['lastUpdated'] !== null && !isDate(cast['lastUpdated'])) return false;
  return true;
}
