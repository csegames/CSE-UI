/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { SettingsPanel } from '../components/SettingsPanel';
import { cancel, getGraphicsConfig, ConfigIndex } from '../utils/configVars';
import { CheckBoxField } from '../components/CheckBoxField';
import { SliderField } from '../components/SliderField';
import { client, events } from '@csegames/camelot-unchained';
import { Settings, settingsRenderer } from '../components/settingsRenderer';

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
};

interface GraphicSettingsProps {
}
interface GraphicSettingsState {
  graphics: any;
}

export class GraphicSettings extends React.PureComponent<GraphicSettingsProps, GraphicSettingsState> {
  private evh: number;
  constructor(props: GraphicSettingsProps) {
    super(props);
    this.state = { graphics: null };
  }

  public componentDidMount() {
    this.evh = events.on('settings--reload', this.reload);
    this.loadSettings();
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
        })}
      </SettingsPanel>
    );
  }

  private loadSettings() {
    getGraphicsConfig((graphics: any, type: ConfigIndex) => {
      if (type === ConfigIndex.RENDERING) {
        this.setState({ graphics });
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
    client.ChangeConfigVar(id, on);
    client.SaveConfigChanges();
    this.setState({ graphics: Object.assign({}, graphics, { [id]: on }) });
  }

  private onChange = (id: string, value: number) => {
    const { graphics } = this.state;
    console.log(`graphic set ${id} = ${value}`);
    client.ChangeConfigVar(id, `${value}`);
    client.SaveConfigChanges();
    this.setState({ graphics: Object.assign({}, graphics, { [id]: `${value}` }) });
  }

}
