/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as moment from 'moment';

import CollapsibleList from './CollapsibleList';
import ObjectProperties from './ObjectProperties';
import { States, DataTypes, DataMapper } from './types';

const Status = 'Console-ObjectDisplay-Status';
const Row = 'Console-ObjectDisplay-Row';

const Content = 'Console-ObjectDisplay-Content';

export interface Props {
  data: any;
  parentKey?: string;
  dataMapping?: DataMapper;
  statusMapper?: (value: any) => States;
  skipFunctions?: boolean;
}

const timeRegex = new RegExp(
  /\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2]\d|3[0-1])T(?:[0-1]\d|2[0-3]):[0-5]\d:[0-5]\d.\d+Z/
);

class StatusItems extends React.Component<Props, undefined> {
  public static defaultProps = {
    data: {},
    parentKey: ''
  };

  public render(): any {
    const keys = Object.keys(this.props.data).sort((a, b) => {
      if (typeof this.props.data[a] === typeof []) return 1;
      if (typeof this.props.data[b] === typeof []) return -1;
      return 0;
    });

    return (
      <div className={Content}>
        {keys.map((key) => {
          if (key === 'Name') return null;

          const value = this.props.data[key];

          if (this.props.skipFunctions && value && typeof value === 'function') {
            return null;
          }

          if (value && Array.isArray(value)) {
            return (
              <CollapsibleList
                data={value}
                keyName={key}
                fullKey={this.props.parentKey === '' ? key : this.props.parentKey + '.' + key}
                key={key}
                dataMapping={this.props.dataMapping}
                statusMapper={this.props.statusMapper}
              />
            );
          }

          if (this.props.dataMapping) {
            const mappedType = this.getMappedType(key);

            switch (mappedType) {
              case 'status':
                return (
                  <div className={Row} key={key}>
                    <div>{key}</div>
                    <div
                      className={`${Status} ${(this.props.statusMapper && this.props.statusMapper(value)) || ''}`}
                      title={this.getTitle(key)}
                    >
                      {value}
                    </div>
                  </div>
                );
            }
          }

          if (value && typeof value === typeof {}) {
            return (
              <div key={key}>
                <ObjectProperties
                  data={value}
                  title={key}
                  fullKey={this.props.parentKey + '.' + key}
                  statusMapper={this.props.statusMapper}
                  dataMapping={this.props.dataMapping}
                />
              </div>
            );
          } else {
            if (typeof value === typeof '' && timeRegex.test(value)) {
              return (
                <div className={Row} key={key}>
                  <div>{key}</div>
                  <div title={value}>{moment(value).fromNow()}</div>
                </div>
              );
            }

            return (
              <div className={Row} key={key}>
                <div>{key}</div>
                <div title={this.getTitle(key)}>{value + ''}</div>
              </div>
            );
          }
        })}
      </div>
    );
  }

  public shouldComponentUpdate() {
    return true;
  }

  private getMappedType = (key: string): DataTypes => {
    if (!this.props.dataMapping) return 'string';
    const dataKey = this.props.parentKey === '' ? key : this.props.parentKey + '.' + key;
    const t = this.props.dataMapping[dataKey];
    if (typeof t === 'string') {
      return t;
    }
    return (t && t.type) || 'string';
  };

  private getTitle = (key: string): string | undefined => {
    if (!this.props.dataMapping) return undefined;
    const dataKey = this.props.parentKey === '' ? key : this.props.parentKey + '.' + key;
    const t = this.props.dataMapping[dataKey];
    if (typeof t === 'string') {
      return undefined;
    }
    return t && t.title;
  };
}

export default StatusItems;
