/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import moment from 'moment';

import CollapsibleList from './CollapsibleList';
import ObjectProperties from './ObjectProperties';
import { States, DataTypes, DataMapper } from './types';

const Status = styled.div`
  display: inline-block;
  border-radius: 5px;
  border-width: 2px;
  border-style: solid;
  padding: 2px 5px;
  text-transform: uppercase;

  &.online {
    color: lightgreen;
    border-color: darkgreen;
    background-color: green;
  }

  &.offline {
    color: white;
    border-color: darkred;
    background-color: red;
  }

  &.initializing {
    color: tangerine;
    border-color: darkorange;
    background-color: orange;
  }
`;

const Row = styled.div`
  padding: 3px 5px;
  display: flex;
  flex-direction: row;
  > div {
    display: inline-block;
    overflow: hidden;
    word-wrap: break-word;
    flex: 1 1 auto;

  }
  div:first-child {
    width: 140px;
    flex: 0 0 140px;
  }
  &:nth-child(2n) {
    background: #3c3c3c;
  }
  &:nth-child(2n+1) {
    background: #2f2f2f;
  }
`;

const Content = styled.div`
  max-height: 100%;
  overflow-x: hidden;
`;

export interface Props {
  data: any;
  parentKey?: string;
  dataMapping?: DataMapper;
  statusMapper?: (value: any) => States;
  skipFunctions?: boolean;
}

const timeRegex = new RegExp(/\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2]\d|3[0-1])T(?:[0-1]\d|2[0-3]):[0-5]\d:[0-5]\d.\d+Z/);

class StatusItems extends React.Component<Props, undefined> {

  public static defaultProps = {
    data: {},
    parentKey: '',
  };

  public render(): any {
    const keys = Object.keys(this.props.data).sort((a, b) => {
      if (typeof this.props.data[a] === typeof []) return 1;
      if (typeof this.props.data[b] === typeof []) return -1;
      return 0;
    });

    return (
      <Content>
      {
        keys.map((key) => {
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
                  <Row key={key}>
                    <div>{key}</div>
                    <Status
                      title={this.getTitle(key)}
                      className={this.props.statusMapper && this.props.statusMapper(value) || ''}>
                      {value}
                    </Status>
                  </Row>
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

            if (typeof value === typeof('') && timeRegex.test(value)) {
              return (
                <Row key={key}>
                  <div>{key}</div>
                  <div title={value}>{moment(value).fromNow()}</div>
                </Row>
              );
            }

            return (
              <Row key={key}>
                <div>{key}</div>
                <div title={this.getTitle(key)}>{value + ''}</div>
              </Row>
            );
          }
        })
      }
      </Content>
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
    return t && t.type || 'string';
  }

  private getTitle = (key: string): string | undefined => {
    if (!this.props.dataMapping) return undefined;
    const dataKey = this.props.parentKey === '' ? key : this.props.parentKey + '.' + key;
    const t = this.props.dataMapping[dataKey];
    if (typeof t === 'string') {
      return undefined;
    }
    return t && t.title;
  }
}

export default StatusItems;
