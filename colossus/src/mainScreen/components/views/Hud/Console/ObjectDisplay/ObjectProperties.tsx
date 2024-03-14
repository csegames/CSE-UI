/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { States, DataMapper } from './types';
import ObjectDisplay from '.';
import { toTitleCase } from '@csegames/library/dist/_baseGame/utils/textUtils';

const Title = 'Console-ObjectDisplay-ObjectProperties-Title';

const Indicator = 'Console-ObjectDisplay-ObjectProperties-Indicator';

export interface Props {
  data: any;
  fullKey: string;
  dataMapping?: DataMapper;
  statusMapper?: (value: any) => States;
  title: string;
}

export interface State {
  collapsed: boolean;
}

class StatusObject extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      collapsed: true
    };
  }
  public render() {
    return (
      <section>
        <div className={Title} onClick={this.toggleCollapsed}>
          <span className={Indicator}>{this.state.collapsed ? '+' : '-'}</span>
          {toTitleCase(this.props.title || '')}
        </div>
        {this.state.collapsed ? null : (
          <ObjectDisplay
            data={this.props.data}
            parentKey={this.props.fullKey}
            dataMapping={this.props.dataMapping}
            statusMapper={this.props.statusMapper}
          />
        )}
      </section>
    );
  }

  private toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
}

export default StatusObject;
