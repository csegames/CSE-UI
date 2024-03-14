import { Dictionary } from '../_baseGame/types/ObjectMap';
import { DevUIButtonParams } from './DevUIButtonParams';

export type Content = string | Dictionary<Content>;

export interface DevUIPageModel {
  title?: string;
  tabTitle?: string;
  content?: Content;
  pages?: Partial<DevUIPageModel>[];
  buttons?: DevUIButtonParams[];
  data?: Dictionary<any>;
  activeTabIndex?: number;
  script?: string;
}
