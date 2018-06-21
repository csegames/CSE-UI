/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { client } from '@csegames/camelot-unchained';

import { ConfigIndex, ConfigInfo } from '../OptionsMain';
import ListItem from './ListItem';

export interface AudioOptionsProps {
  activeConfigIndex: number;
  audioConfigs: ConfigInfo[];
  onAudioConfigsChange: (audioConfigs: ConfigInfo[]) => void;
}

export interface AudioOptionsState {
}

export class AudioOptions extends React.Component<AudioOptionsProps, AudioOptionsState> {
  constructor(props: AudioOptionsProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    return (
      <div>
        {this.props.audioConfigs.map((config, i) => {
          if (parseInt(config.value, 10) || config.value === '0') {
            // Number value so use slider
            return (
              <ListItem
                key={config.name}
                name={config.name}
                value={config.value}
                isOddItem={i % 2 !== 0}
                sliderItemInfo={{
                  onChange: val => this.onInputRangeChange(config, val),
                }}
              />
            );
          }
          return (
            <ListItem
              key={config.name}
              name={config.name}
              value={config.value === 'true' ? 'Yes' : 'No'}
              isOddItem={i % 2 !== 0}
              onClick={() => this.onListItemClick(config)}
            />
          );
        })}
      </div>
    );
  }

  public componentDidMount() {
    if (this.props.activeConfigIndex === ConfigIndex.AUDIO) {
      client.GetConfigVars(ConfigIndex.AUDIO);
    }
  }

  private onInputRangeChange = (config: ConfigInfo, val: number) => {
    client.ChangeConfigVar(config.name, `${val}`);
    client.SaveConfigChanges();
    client.GetConfigVars(ConfigIndex.AUDIO);
    this.updateAudioConfigs(config, val);
  }

  private onListItemClick = (config: ConfigInfo) => {
    const oppositeVal = config.value === 'false';
    client.ChangeConfigVar(config.name, `${oppositeVal}`);
    client.SaveConfigChanges();
    this.updateAudioConfigs(config, `${oppositeVal}`);
  }

  private updateAudioConfigs = (config: ConfigInfo, value: any) => {
    const audioConfigs = this.props.audioConfigs;
    const configIndex = _.findIndex(audioConfigs, audioConfig => audioConfig.name === config.name);
    audioConfigs[configIndex] = {
      ...audioConfigs[configIndex],
      value,
    };
    this.props.onAudioConfigsChange(audioConfigs);
  }
}

export default AudioOptions;

