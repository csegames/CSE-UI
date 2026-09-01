import { ChannelInfo } from './channelInfo';
import { DownloadInfo } from './downloadInfo';
import { LoginInfo } from './loginInfo';
import { ShardOverride } from './shardOverride';

type Password = string;

export interface Patcher {
  readonly apiHost: string;
  readonly accessToken: string | null;
  readonly shardOverride: ShardOverride | null;
  readonly login: LoginInfo | null;
  readonly download: DownloadInfo | null;
  readonly channels: Record<string, ChannelInfo>;
  readonly lastLoginUpdate: number | undefined;
  readonly lastStatusUpdate: number | undefined;
  readonly lastTokenUpdate: number | undefined;

  performLogin(email: string, password: Password, rememberMe: boolean): void;
  forgetUser(): void;
  launchChannel(id: number, args: string): void;
  installChannel(id: number): void;
  uninstallChannel(id: number): void;

  attachChannelUpdateListener(listener: (info: ChannelInfo) => void): number;
  attachDownloadUpdateListener(listener: (info: DownloadInfo) => void): number;
  attachLoginUpdateListener(listener: (info: LoginInfo) => void): number;
  attachTokenUpdateListener(listener: (accessToken: string | null) => void): number;
  detachListener(handle: number): void;
}
