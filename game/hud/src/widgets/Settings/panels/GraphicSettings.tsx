/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { client, events, DisplayModeConfig } from '@csegames/camelot-unchained';
import { SettingsPanel } from '../components/SettingsPanel';
import { CheckBoxField } from 'UI/CheckBoxField';
import { SliderField } from 'UI/SliderField';
import { DropDownField, DropDownItem } from 'UI/DropDownField';
import { Settings, settingsRenderer } from '../components/settingsRenderer';
import {
  cancel,
  getGraphicsConfig,
  ConfigIndex,
  sendConfigVarChangeMessage,
  SELECT_RESOLUTION_ID,
  FULL_SCREEN_WIDTH_ID,
  FULL_SCREEN_HEIGHT_ID,
  FULL_SCREEN_TOGGLE_ID,
  getResolutions,
} from '../utils/configVars';
import { SelectedDisplayMode } from '../tabs/General';
import { sendSystemMessage } from 'services/actions/system';

function getResolutionString(displayModeConfig: DisplayModeConfig) {
  if (!displayModeConfig || !displayModeConfig.width || !displayModeConfig.height) return 'Not Selected';
  return `${displayModeConfig.width}x${displayModeConfig.height}`;
}

const settings: Settings = {
  'Render Draw Distance':
    { type: SliderField, min: 100, max: 4000, step: 1 },
  'HBAO+ Enabled':
    { type: CheckBoxField },
  'Shadow Quality':
    { type: SliderField, min: 0, max: 4, step: 1 },
  'Shadow Distance':
    { type: SliderField, min: 0, max: 10000, step: 1, logrithmic: true },
  'Shadows Enabled':
    { type: CheckBoxField },
  'Texture Quality':
    { type: SliderField, min: 0, max: 2, step: 1 },
  'Shader Quality':
    { type: SliderField, min: 0, max: 2, step: 1 },
  'Full screen':
    { type: CheckBoxField },
  [SELECT_RESOLUTION_ID]:
    { type: DropDownField },
};

interface GraphicSettingsProps {
  onCancel: () => void;
}
interface GraphicSettingsState {
  graphics: any;
  displayModes: DisplayModeConfig[];
  selectedDisplayMode: SelectedDisplayMode;
}

export class GraphicSettings extends React.PureComponent<GraphicSettingsProps, GraphicSettingsState> {
  private evh: number;
  constructor(props: GraphicSettingsProps) {
    super(props);
    this.state = {
      graphics: null,
      displayModes: [],
      selectedDisplayMode: null,
    };
  }

  public componentDidMount() {
    this.evh = events.on('settings--action', this.onAction);
    this.loadSettings();
  }

  public componentWillUnmount() {
    cancel(ConfigIndex.RENDERING);
    cancel(ConfigIndex.RESOLUTIONS);
    if (this.evh) events.off(this.evh);
  }

  public render() {
    const { graphics } = this.state;
    return (
      <SettingsPanel>
        {settingsRenderer({
          config: graphics,
          settings,
          onToggle: this.onToggle,
          onChange: this.onChange,
          dropDownItemsDictionary: this.getDropDownItemsDictionary(),
          selectedDropDownItemDictionary: this.getSelectedDropDownItemDictionary(),
          onSelectDropdownItem: this.onSelectDropdownItem,
        })}
      </SettingsPanel>
    );
  }

  private loadSettings() {
    getGraphicsConfig((graphics: any, type: ConfigIndex) => {
      if (type === ConfigIndex.RENDERING) {
        // Manually add set resolution config
        const allGraphicConfigs = {
          ...graphics,
          [SELECT_RESOLUTION_ID]: 'Select Resolution',
        };
        const width = (graphics[FULL_SCREEN_WIDTH_ID] as any) | 0;
        const height = (graphics[FULL_SCREEN_HEIGHT_ID] as any) | 0;
        const fullScreen = graphics[FULL_SCREEN_TOGGLE_ID] === 'true';
        this.selectDisplayMode({ width, height, fullScreen });
        this.setState({ graphics: allGraphicConfigs });
      }
    });
    getResolutions((displayModes: any, type: ConfigIndex) => {
      if (type === ConfigIndex.RESOLUTIONS) {
        this.setState({ displayModes });
      }
    });
  }

  private onAction = (args: any) => {
    const type: any = ConfigIndex.RENDERING;
    switch (args.id) {
      case 'apply':
        client.SaveConfigChanges();
        this.changeDisplayMode();
        sendSystemMessage('All configurations have been applied');
        break;
      case 'cancel':
        client.CancelAllConfigChanges(type);
        this.props.onCancel();
        break;
      case 'default':
        client.RestoreConfigDefaults(type);
        client.SaveConfigChanges();
        this.loadSettings();
        break;
    }
  }

  // onToggle is called by radio buttons
  private onToggle = (id: string) => {
    const { graphics, selectedDisplayMode } = this.state;
    const on = graphics[id] === 'true' ? 'false' : 'true';

    if (id === FULL_SCREEN_TOGGLE_ID) {
      const width = selectedDisplayMode ? selectedDisplayMode.width : graphics[FULL_SCREEN_WIDTH_ID] | 0;
      const height = selectedDisplayMode ? selectedDisplayMode.height : graphics[FULL_SCREEN_HEIGHT_ID] | 0;
      this.selectDisplayMode({ width, height, fullScreen: on === 'true' });
    } else {
      client.ChangeConfigVar(id, on);
    }
    this.setState({ graphics: { ...graphics, [id]: on } });
  }

  // onChange is called by sliders
  private onChange = (id: string, value: number) => {
    const { graphics } = this.state;
    if (client.debug) console.log(`graphic set ${id} = ${value}`);
    sendConfigVarChangeMessage(id, value);
    client.ChangeConfigVar(id, `${value}`);
    this.setState({ graphics: { ...graphics, [id]: `${value}` } });
  }

  private getDropDownItemsDictionary = () => {
    return {
      [SELECT_RESOLUTION_ID]: this.state.displayModes.map(config => getResolutionString(config)),
    };
  }

  private getSelectedDropDownItemDictionary = () => {
    return {
      [SELECT_RESOLUTION_ID]: getResolutionString(this.state.selectedDisplayMode),
    };
  }

  // drop down menus call this
  private onSelectDropdownItem = (item: DropDownItem) => {
    const { id, value } = item;
    switch (id) {
      case SELECT_RESOLUTION_ID:
        const { graphics } = this.state;
        const resolutionValues = value.split('x');
        const width = (resolutionValues[0] as any) | 0;
        const height = (resolutionValues[1] as any) | 0;
        // when changing resolution, force full screen
        this.setState({ graphics: { ...graphics, [FULL_SCREEN_TOGGLE_ID]: 'true' } });
        this.selectDisplayMode({ width, height, fullScreen: true });
        break;
    }
  }

  // Tells the client to switch resolution (called when we apply)
  private changeDisplayMode = () => {
    const { selectedDisplayMode } = this.state;
    if (selectedDisplayMode) {
      const { fullScreen, width, height } = selectedDisplayMode;
      client.SetDisplayMode(fullScreen, width, height);
    }
  }

  private selectDisplayMode = (selectedDisplayMode: SelectedDisplayMode) => {
    this.setState({ selectedDisplayMode });
  }
}
