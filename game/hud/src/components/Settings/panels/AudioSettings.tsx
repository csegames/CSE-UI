/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { SettingsPanel } from '../components/SettingsPanel';
import { cancel, getAudioConfig, ConfigIndex } from '../utils/configVars';
import { CheckBoxField } from '../components/CheckBoxField';
import { SliderField } from '../components/SliderField';
import { client, events } from '@csegames/camelot-unchained';
import { Settings, settingsRenderer } from '../components/settingsRenderer';

const settings: Settings = {
  'Main Volume':
    { type: SliderField, min: 0, max: 100, step: 1 },
  'Mute Volume':
    { type: CheckBoxField },
};

interface AudioSettingsProps {
}
interface AudioSettingsState {
  audio: any;
}

export class AudioSettings extends React.PureComponent<AudioSettingsProps, AudioSettingsState> {
  private evh: number;

  constructor(props: AudioSettingsProps) {
    super(props);
    this.state = { audio: null };
  }

  public componentDidMount() {
    this.evh = events.on('settings--reload', this.reload);
    this.loadSettings();
  }

  public componentWillUnmount() {
    cancel(ConfigIndex.AUDIO);
    if (this.evh) events.off(this.evh);
  }

  public render() {
    const { audio } = this.state;
    return (
      <SettingsPanel>
        {settingsRenderer({
          config: audio,
          settings,
          onToggle: this.onToggle,
          onChange: this.onChange,
        })}
      </SettingsPanel>
    );
  }

  private loadSettings() {
    getAudioConfig((audio: any, type: ConfigIndex) => {
      if (type === ConfigIndex.AUDIO) {
        this.setState({ audio });
      }
    });
  }

  private reload = (type: ConfigIndex) => {
    if (type === ConfigIndex.AUDIO) {
      this.loadSettings();
    }
  }

  private onToggle = (id: string) => {
    const { audio } = this.state;
    const on = audio[id] === 'true' ? 'false' : 'true';
    client.ChangeConfigVar(id, on);
    client.SaveConfigChanges();
    this.setState({ audio: Object.assign({}, audio, { [id]: on }) });
  }

  private onChange = (id: string, value: number) => {
    const { audio } = this.state;
    console.log(`audio set ${id} = ${value}`);
    client.ChangeConfigVar(id, `${value}`);
    client.SaveConfigChanges();
    this.setState({ audio: Object.assign({}, audio, { [id]: `${value}` }) });
  }

}
