/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { SettingsPanel } from '../components/SettingsPanel';
import { cancel, getInputConfig, ConfigIndex } from '../utils/configVars';
import { CheckBoxField } from '../components/CheckBoxField';
import { SettingsHeading } from '../components/SettingsHeading';
import { client, events } from '@csegames/camelot-unchained';
import { Settings, settingsRenderer } from '../components/settingsRenderer';

const settings: Settings = {
  'Graphics Settings': { type: SettingsHeading },
  'Invert Right Stick Y': { type: CheckBoxField },
  'Invert Right Stick X': { type: CheckBoxField },
  'Invert Left Stick Y': { type: CheckBoxField },
  'Invert Left Stick X': { type: CheckBoxField },
  'Camera Settings': { type: SettingsHeading },
  'Invert Camera Mouse Y': { type: CheckBoxField },
  'Invert Camera Mouse X': { type: CheckBoxField },
};

interface InputSettingsProps {
}
interface InputSettingsState {
  inputs: any;
}

export class InputSettings extends React.PureComponent<InputSettingsProps, InputSettingsState> {
  private evh: number;
  constructor(props: InputSettingsProps) {
    super(props);
    this.state = { inputs: null };
  }

  public componentDidMount() {
    this.evh = events.on('settings--reload', this.reload);
    this.loadSettings();
  }

  public componentWillUnmount() {
    cancel(ConfigIndex.INPUT);
    if (this.evh) events.off(this.evh);
  }

  public render() {
    const { inputs } = this.state;
    return (
      <SettingsPanel>
        {settingsRenderer({
          config: inputs,
          settings,
          onToggle: this.onToggle,
        })}
      </SettingsPanel>
    );
  }

  private loadSettings() {
    getInputConfig((inputs: any, type: ConfigIndex) => {
      if (type === ConfigIndex.INPUT) {
        this.setState({ inputs });
      }
    });
  }

  private reload = (type: ConfigIndex) => {
    if (type === ConfigIndex.INPUT) {
      this.loadSettings();
    }
  }

  private onToggle = (id: string) => {
    const { inputs } = this.state;
    const on = inputs[id] === 'true' ? 'false' : 'true';
    console.log(`graphic set ${id} = ${on}`);
    client.ChangeConfigVar(id, on);
    client.SaveConfigChanges();
    this.setState({ inputs: Object.assign({}, inputs, { [id]: on }) });
  }
}
