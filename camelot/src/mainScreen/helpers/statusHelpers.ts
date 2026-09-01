import { StatusState } from '@csegames/library/dist/camelotunchained/game/GameClientModels/StatusState';
import { StatusDef } from '../dataSources/manifest/statusManifest';

// Not sure why, but the StatusData type doesn't resolve correctly if
// I try to do this in one line.
type StatusDefMinus = Omit<StatusDef, 'id'>;
export type StatusData = StatusState & StatusDefMinus & { instanceCount: number };

export const DETERMINATION_BUFF_STRING_ID = 'determination_reset_handler';

export const includesTagCaseInsensitive = (tags: string[], substring: string): boolean =>
  tags.some((tag) => tag.toLowerCase().includes(substring));

export const isStatusBuff = (def: StatusDef | StatusData): boolean => {
  return def?.statusTags ? includesTagCaseInsensitive(def.statusTags, 'friendly') : false;
};

// The same status can briefly appear twice while being reapplied, so React keys must identify
// the instance (id plus startTime), not just the status.
export const getStatusInstanceKey = (status: StatusState): string => `${status.id}-${status.startTime}`;

export type StatusInstanceGroup = StatusState & { instanceCount: number };

// Some statuses (e.g. Exertion) stack by applying multiple separate instances rather than incrementing a
// single instance's Amount stat, and a reapply briefly sends old+new instances of the same status. Collapse
// to one representative instance (the newest) plus its count (from EntityStateService's precomputed
// statusInstanceCounts, so no re-scan of entity.statuses is needed here) so the UI can render one icon either way.
export function getNewestStatusInstances(
  statuses: StatusState[],
  statusInstanceCounts: Record<number, number>
): StatusInstanceGroup[] {
  const newestByID: Record<number, StatusState> = {};
  statuses.forEach((status) => {
    const existing = newestByID[status.id];
    if (!existing || status.startTime > existing.startTime) {
      newestByID[status.id] = status;
    }
  });
  return Object.values(newestByID).map((status) => ({
    ...status,
    instanceCount: statusInstanceCounts[status.id] ?? 1
  }));
}
