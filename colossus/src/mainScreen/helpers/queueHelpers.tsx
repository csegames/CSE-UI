import { Queue } from '@csegames/library/dist/hordetest/graphql/schema';

export const getSelectedQueueID = (
  selectedQueueID: string | null,
  defaultQueueID: string | null,
  queues: Queue[]
): string | null => {
  if (selectedQueueID !== null) {
    return selectedQueueID;
  }
  if (defaultQueueID !== null) {
    return defaultQueueID;
  }
  const queue = queues.find((q) => q.enabled && q.displayAlias !== null);
  if (queue) {
    return queue.queueID;
  }
  return null;
};
