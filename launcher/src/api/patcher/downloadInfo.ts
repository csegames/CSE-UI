import { FailureType } from './failureType';
import { PatcherStatus } from './patcherStatus';

export interface DownloadInfo {
  readonly status: PatcherStatus;
  readonly totalFiles: number;
  readonly completedFiles: number;
  readonly failureType: FailureType;
  readonly rate: number;
  readonly estimate: number;
  readonly remaining: number;
  readonly channelID: number | null;
  readonly started: Date | null;
}
