import { DevUIPageModel } from './DevUIPageModel';

export interface RootPageModel extends Partial<DevUIPageModel> {
  width: number;
  height: number;
  x: number;
  y: number;
  visible: boolean;
  maximized: boolean;
  background?: string;
  showCloseButton?: boolean;
  showMaximizeButton?: boolean;
}
