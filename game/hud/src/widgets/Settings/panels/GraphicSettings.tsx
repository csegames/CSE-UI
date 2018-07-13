/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { isEqual } from 'lodash';
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
} from '../utils/configVars';
import { SelectedDisplayMode } from '../tabs/General';

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
  selectedDisplayMode: SelectedDisplayMode;
  onSelectedDisplayModeChange: (selectedDisplayMode: SelectedDisplayMode) => void;
}
interface GraphicSettingsState {
  graphics: any;
  displayModes: DisplayModeConfig[];
}

export class GraphicSettings extends React.Component<GraphicSettingsProps, GraphicSettingsState> {
  private evh: number;
  constructor(props: GraphicSettingsProps) {
    super(props);
    this.state = {
      graphics: null,
      displayModes: [],
    };
  }

  public componentDidMount() {
    this.evh = events.on('settings--reload', this.reload);
    this.loadSettings();
    client.RequestDisplayModes();
    client.OnDisplayModesChanged(this.handleDisplayModesChanged);
  }

  public shouldComponentUpdate(nextProps: GraphicSettingsProps, nextState: GraphicSettingsState) {
    return !isEqual(this.props.selectedDisplayMode, nextProps.selectedDisplayMode) ||
      !isEqual(this.state, nextState);
  }

  public componentWillUnmount() {
    cancel(ConfigIndex.RENDERING);
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
        const width = graphics[FULL_SCREEN_WIDTH_ID] && graphics[FULL_SCREEN_WIDTH_ID] | 0;
        const height = graphics[FULL_SCREEN_HEIGHT_ID] && graphics[FULL_SCREEN_HEIGHT_ID] | 0;
        const fullScreen = graphics[FULL_SCREEN_TOGGLE_ID] === 'true';

        this.props.onSelectedDisplayModeChange({ width, height, fullScreen });
        this.setState({ graphics: allGraphicConfigs });
      }
    });
  }

  private reload = (type: ConfigIndex) => {
    if (type === ConfigIndex.RENDERING) {
      this.loadSettings();
    }
  }

  private onToggle = (id: string) => {
    const { graphics } = this.state;
    const on = graphics[id] === 'true' ? 'false' : 'true';

    if (id === FULL_SCREEN_TOGGLE_ID) {
      // Dont call ChangeConfigVar for configs related to Full screen,
      // these will eventually be updated through client.SetDisplayMode
      const width = this.props.selectedDisplayMode ? this.props.selectedDisplayMode.width :
        graphics[FULL_SCREEN_WIDTH_ID] | 0;
      const height = this.props.selectedDisplayMode ? this.props.selectedDisplayMode.height :
        graphics[FULL_SCREEN_HEIGHT_ID] | 0;
      this.props.onSelectedDisplayModeChange({ width, height, fullScreen: on === 'true' });
    } else {
      client.ChangeConfigVar(id, on);
    }
    this.setState({ graphics: Object.assign({}, graphics, { [id]: on }) });
  }

  private onChange = (id: string, value: number) => {
    const { graphics } = this.state;
    if (client.debug) console.log(`graphic set ${id} = ${value}`);
    sendConfigVarChangeMessage(id, value);
    client.ChangeConfigVar(id, `${value}`);
    const allGraphicConfigs = {
      ...graphics,
      [SELECT_RESOLUTION_ID]: 'Select Resolution',
    };
    this.setState({ graphics: Object.assign({}, allGraphicConfigs, { [id]: `${value}` }) });
  }

  private handleDisplayModesChanged = (displayModes: DisplayModeConfig[]) => {
    this.setState(() => {
      return {
        displayModes,
      };
    });
  }

  private getDropDownItemsDictionary = () => {
    const dropDownItems = {
      [SELECT_RESOLUTION_ID]: this.state.displayModes.map(config => getResolutionString(config)),
    };

    return dropDownItems;
  }

  private getSelectedDropDownItemDictionary = () => {
    const selectedDropDownItem = {
      [SELECT_RESOLUTION_ID]: getResolutionString(this.props.selectedDisplayMode),
    };
    return selectedDropDownItem;
  }

  private onSelectDropdownItem = (dropdownItem: DropDownItem) => {
    const { id, value } = dropdownItem;
    switch (id) {
      case SELECT_RESOLUTION_ID: {
        const resolutionValues = value.split('x');
        const width = parseInt(resolutionValues[0], 10);
        const height = parseInt(resolutionValues[1], 10);

        // Automagically toggle full screen if changing selected resolution
        this.setState({
          graphics: {
            ...this.state.graphics,
            [FULL_SCREEN_TOGGLE_ID]: 'true',
          },
        });
        this.props.onSelectedDisplayModeChange({ width, height, fullScreen: true });
        break;
      }
    }
  }
}
