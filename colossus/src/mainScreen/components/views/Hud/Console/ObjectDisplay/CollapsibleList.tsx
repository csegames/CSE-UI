/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { States, DataMapper } from './types';
import ObjectDisplay from '.';
import { toTitleCase } from '@csegames/library/dist/_baseGame/utils/textUtils';

const Indicator = 'Console-ObjectDisplay-CollapsibleList-Indicator';
const Title = 'Console-ObjectDisplay-CollapsibleList-Title';
const Content = 'Console-ObjectDisplay-CollapsibleList-Content';
const Item = 'Console-ObjectDisplay-CollapsibleList-Item';
const Count = 'Console-ObjectDisplay-CollapsibleList-Count';

const Warn = 'Console-ObjectDisplay-CollapsibleList-Warn';

export interface Props {
  data: any;
  dataMapping?: DataMapper;
  statusMapper?: (value: any) => States;
  keyName: string;
  fullKey: string;
}

class CollapsibleList extends React.Component<Props, { collapsed: boolean }> {
  constructor(props: Props) {
    super(props);
    this.state = {
      collapsed: true
    };
  }
  public render() {
    if (this.props.data == null) return null;

    // any warnings? -- check if any status are not online and put a warning on the title
    let warnings = false;
    if (this.props.dataMapping) {
      for (let i = 0; i < this.props.data.length; ++i) {
        const data = this.props.data[i];
        const keys = Object.keys(data);
        keys.forEach((key) => {
          const mapping = this.props.dataMapping && this.props.dataMapping[this.props.fullKey + '.' + key];
          if (mapping === 'status' || (typeof mapping === 'object' && mapping.type === 'status')) {
            const status = this.props.statusMapper && this.props.statusMapper(data[key]);
            if (status !== 'online') {
              warnings = true;
            }
          }
        });
        if (warnings) break;
      }
    }

    return (
      <div>
        <div className={Title} onClick={this.toggleCollapsed}>
          <span className={Indicator}>{this.state.collapsed ? '+' : '-'}</span>
          {toTitleCase(this.props.keyName)}
          {warnings ? (
            <span className={Warn}>
              <i className='fs-icon-misc-exclamation-triangle' />
            </span>
          ) : null}
          <span className={Count}>{this.props.data.length}</span>
        </div>
        <div className={Content} style={{ display: this.state.collapsed ? 'block' : 'none' }}>
          {this.props.data &&
            this.props.data.map &&
            this.props.data.map((item: any, index: number) => (
              <div className={Item} data-index={index} key={`${this.props.fullKey}[${index}]`}>
                <ObjectDisplay
                  data={item}
                  parentKey={this.props.fullKey}
                  dataMapping={this.props.dataMapping}
                  statusMapper={this.props.statusMapper}
                  key={index}
                />
              </div>
            ))}
        </div>
      </div>
    );
  }

  private toggleCollapsed = () => {
    this.setState((state) => ({ collapsed: !state.collapsed }));
  };
}

export default CollapsibleList;
