/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-08-23 17:32:57
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-24 18:01:10
 */

import * as React from 'react';
import * as _ from 'lodash';

import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { client } from 'camelot-unchained';
import ListItem from './ListItem';
import { ConfigIndex, ConfigInfo } from '../OptionsMain';

export interface RenderingOptionsStyle extends StyleDeclaration {
  RenderingOptions: React.CSSProperties;
}

export const defaultRenderingOptionsStyle: RenderingOptionsStyle = {
  RenderingOptions: {
    
  },
};

export interface RenderingOptionsProps {
  styles?: Partial<RenderingOptionsStyle>;
  activeConfigIndex: number;
  renderingConfigs: ConfigInfo[];
  onRenderConfigsChange: (renderingConfigs: ConfigInfo[]) => void;
}

export class RenderingOptions extends React.Component<RenderingOptionsProps, {}> {
  constructor(props: RenderingOptionsProps) {
    super(props);
    this.state = {
      renderingConfigs: [],
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultRenderingOptionsStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    return (
      <div className={css(ss.RenderingOptions, custom.RenderingOptions)}>
        {this.props.renderingConfigs.map((config, index) => {
          const isOddItem = index % 2 !== 0;
          if (parseInt(config.value, 10) || config.value === '0') {
            const minMax = config.name === 'Shadow Distance' ? { min: 0, max: 10000 } :
              config.name === 'Shadow Quality' ? { min: 0, max: 4 } :
              config.name === 'Render Draw Distance' ? { min: 100, max: 4000 } :
              { min: 0, max: 2 };

            return (
              <ListItem
                key={config.name}
                name={config.name}
                value={config.value}
                sliderItemInfo={{
                  onChange: val => this.onInputRangeChange(config, val),
                  min: minMax.min,
                  max: minMax.max,
                }}
                isOddItem={isOddItem}
              />
            );
          }
          return (
            <ListItem
              key={config.name}
              name={config.name}
              value={config.value === 'true' ? 'Yes' : 'No'}
              onClick={() => this.onListItemClick(config)}
              isOddItem={isOddItem}
            />
          );
        })}
      </div>
    );
  }

  public componentDidMount() {
    if (this.props.activeConfigIndex === ConfigIndex.RENDERING) {
      client.GetConfigVars(ConfigIndex.RENDERING);
    }
  }

  private onInputRangeChange = (config: ConfigInfo, val: number) => {
    client.ChangeConfigVar(config.name, `${val}`);
    client.SaveConfigChanges();
    this.updateAudioConfigs(config, `${val}`);
  }

  private onListItemClick = (config: ConfigInfo) => {
    const oppositeVal = config.value === 'false';
    client.ChangeConfigVar(config.name, `${oppositeVal}`);
    client.SaveConfigChanges();
    this.updateAudioConfigs(config, `${oppositeVal}`);
  }

  private updateAudioConfigs = (config: ConfigInfo, value: any) => {
    const renderingConfigs = this.props.renderingConfigs;
    const configIndex = _.findIndex(renderingConfigs, renderingConfig => renderingConfig.name === config.name);
    renderingConfigs[configIndex] = {
      ...renderingConfigs[configIndex],
      value,
    };
    this.props.onRenderConfigsChange(renderingConfigs);
  }
}

export default RenderingOptions;

