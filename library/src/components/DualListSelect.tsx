/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-16 10:39:21
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-04-07 15:39:58
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { merge, clone } from 'lodash';
import RaisedButton from './RaisedButton';
import Input from './Input';


export interface DualListSelectStyle extends StyleDeclaration {
  container: React.CSSProperties;
  listSection: React.CSSProperties;
  listBox: React.CSSProperties;
  listItem: React.CSSProperties;
  selectedListItem: React.CSSProperties;
  buttons: React.CSSProperties;
  button: React.CSSProperties;
  filter: React.CSSProperties;
}

export const defaultDualListSelectStyle: DualListSelectStyle = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },

  listSection: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    alignItems: 'stretch',
    alignContent: 'stretch',
  },

  listBox: {
    flex: '1 1 auto',
    border: 'solid 1px rgba(255, 255, 255, 0.2)',
    borderTop: '0',
    overflowY: 'auto',
    overflowX: 'hidden',
  },

  listItem: {
    cursor: 'pointer',
    userSelect: 'none',
    padding: '1px 15px',
  },

  selectedListItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },

  buttons: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    margin: '10px',
  },

  filter: {
    flex: '0 0 auto',
  },
};

export interface DualListSelectItems {
  [id: string]: JSX.Element;
}

export interface DualListSelectProps {
  items: DualListSelectItems;
  labelLeft?: string;
  labelRight?: string;
  styles?: Partial<DualListSelectStyle>;
}

export interface DualListSelectState {
  leftItems: DualListSelectItems;
  rightItems: DualListSelectItems;
  leftFilter: string;
  rightFilter: string;
  filteredLeftItems: DualListSelectItems;
  filteredRightItems: DualListSelectItems;
  leftSelectedItemKey: string;
  rightSelectedItemKey: string;
}

export class DualListSelect extends React.Component<DualListSelectProps, DualListSelectState> {

  private leftInputRef: HTMLInputElement = null;
  private rightInputRef: HTMLInputElement = null;

  constructor(props: DualListSelectProps) {
    super(props);
    this.state = {
      leftItems: clone(props.items),
      rightItems: {},
      leftFilter: '',
      rightFilter: '',
      filteredLeftItems: clone(props.items),
      filteredRightItems: {},
      leftSelectedItemKey: '',
      rightSelectedItemKey: '',
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultDualListSelectStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    return (
      <div className={css(ss.container, custom.container)}>

        <div className={css(ss.listSection, custom.listSection)}>
          <div className={css(ss.filter, custom.filter)}>
            <Input type='text'
                   label={this.props.labelLeft || ''}
                   inputRef={(r: HTMLInputElement) => this.leftInputRef = r}
                   placeholder={'Filter'}
                   onChange={this.onLeftFilterTextChanged}></Input>
          </div>
          <div className={css(ss.listBox, custom.listBox)}>
            {this.renderLeftItems(ss, custom)}
          </div>
        </div>

        <div className={css(ss.buttons, custom.buttons)}>
          <RaisedButton
            styles={{
              button:
                merge(defaultDualListSelectStyle.button, this.props.styles ? this.props.styles.button : null || {}),
            }}
            onClick={this.selectAll}>
            <i className='fa fa-angle-double-right'></i>
          </RaisedButton>
          <RaisedButton
            styles={{
              button:
                merge(defaultDualListSelectStyle.button, this.props.styles ? this.props.styles.button : null || {}),
            }}
            onClick={() => this.selectItem()}>
            <i className='fa fa-angle-right'></i>
          </RaisedButton>
          <RaisedButton
            styles={{
              button:
                merge(defaultDualListSelectStyle.button, this.props.styles ? this.props.styles.button : null || {}),
            }}
            onClick={() => this.removeItem()}>
            <i className='fa fa-angle-left'></i>
          </RaisedButton>
          <RaisedButton
            styles={{
              button:
                merge(defaultDualListSelectStyle.button, this.props.styles ? this.props.styles.button : null || {}),
            }}
            onClick={this.removeAll}>
            <i className='fa fa-angle-double-left'></i>
          </RaisedButton>
        </div>

        <div className={css(ss.listSection, custom.listSection)}>
          <div className={css(ss.filter, custom.filter)}>
            <Input type='text'
                   label={this.props.labelRight || ''}
                   inputRef={(r: HTMLInputElement) => this.rightInputRef = r}
                   placeholder={'Filter'}
                   onChange={this.onRightFilterTextChanged}></Input>
          </div>
          <div className={css(ss.listBox, custom.listBox)}>
            {this.renderRightItems(ss, custom)}
          </div>
        </div>

      </div>
    );
  }

  public getRightItems = () => {
    return clone(this.state.rightItems);
  }

  public getLeftItems = () => {
    return clone(this.state.leftItems);
  }

  public getRightKeys = () => {
    const keys: string[] = [];
    for (const key in this.state.rightItems) {
      keys.push(key);
    }
    return keys;
  }

  public getLeftKeys = () => {
    const keys: string[] = [];
    for (const key in this.state.leftItems) {
      keys.push(key);
    }
    return keys;
  }

  private onLeftFilterTextChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.filterLeftItems(e.target.value);
  }

  private onRightFilterTextChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.filterRightItems(e.target.value);
  }

  // remove from left add to right
  private selectItem = (selectKey?: string) => {
    const key = selectKey || this.state.leftSelectedItemKey;

    const leftItems = clone(this.state.leftItems);
    const rightItems = clone(this.state.rightItems);

    const item = clone(leftItems[key]);
    rightItems[key] = item;
    delete leftItems[key];
    this.setState({
      rightItems,
      leftItems,
      filteredRightItems: rightItems,
      filteredLeftItems: leftItems,
      leftFilter: '',
      rightFilter: '',
      leftSelectedItemKey: '',
    });

    this.leftInputRef.value = '';
  }

  // remove from right
  private removeItem = (selectKey?: string) => {
    const key = selectKey || this.state.rightSelectedItemKey;

    const leftItems = clone(this.state.leftItems);
    const rightItems = clone(this.state.rightItems);

    const item = clone(rightItems[key]);
    leftItems[key] = item;
    delete rightItems[key];
    this.setState({
      rightItems,
      leftItems,
      filteredRightItems: rightItems,
      filteredLeftItems: leftItems,
      leftFilter: '',
      rightFilter: '',
      rightSelectedItemKey: '',
    });

    this.rightInputRef.value = '';
  }

  private selectAll = () => {
    const rightItems = clone(this.state.rightItems);
    for (const key in this.state.leftItems) {
      rightItems[key] = clone(this.state.leftItems[key]);
    }

    this.setState({
      rightItems,
      leftItems: {},
      filteredRightItems: rightItems,
      filteredLeftItems: {},
      leftFilter: '',
      rightFilter: '',
      rightSelectedItemKey: '',
    });
    this.rightInputRef.value = '';
  }

  private removeAll = () => {
    const leftItems = clone(this.state.leftItems);
    for (const key in this.state.rightItems) {
      leftItems[key] = clone(this.state.rightItems[key]);
    }

    this.setState({
      leftItems,
      rightItems: {},
      filteredRightItems: {},
      filteredLeftItems: leftItems,
      leftFilter: '',
      rightFilter: '',
      rightSelectedItemKey: '',
    });
    this.rightInputRef.value = '';
  }

  private filterRightItems = (rightFilter: string) => {
    if (rightFilter === '') {
      this.setState({
        rightFilter,
        filteredRightItems: this.state.rightItems,
      });
      return;
    }
    const filteredRightItems: any = {};

    for (const key in this.state.rightItems) {
      if (key.indexOf(rightFilter) === -1) continue;
      filteredRightItems[key] = this.state.rightItems[key];
    }

    this.setState({
      rightFilter,
      filteredRightItems,
    });
  }

  private filterLeftItems = (leftFilter: string) => {
    if (leftFilter === '') {
      this.setState({
        leftFilter,
        filteredLeftItems: this.state.leftItems,
      });
      return;
    }
    const filteredLeftItems: any = {};

    for (const key in this.state.leftItems) {
      if (key.indexOf(leftFilter) === -1) continue;
      filteredLeftItems[key] = this.state.leftItems[key];
    }

    this.setState({
      leftFilter,
      filteredLeftItems,
    });
  }

  private renderLeftItems = (ss: DualListSelectStyle, custom: Partial<DualListSelectStyle>) => {
    const items: JSX.Element[] = [];
    for (const key in this.state.filteredLeftItems) {
      items.push((
        <div key={key}
             className={key === this.state.leftSelectedItemKey ?
               css(ss.listItem, ss.selectedListItem, custom.listItem, custom.selectedListItem) :
               css(ss.listItem, custom.listItem)}
             onClick={() => this.setState({ leftSelectedItemKey: key })}
             onDoubleClick={() => this.selectItem(key)}>
          {this.state.filteredLeftItems[key]}
        </div>
      ));
    }
    return items;
  }

  private renderRightItems = (ss: DualListSelectStyle, custom: Partial<DualListSelectStyle>) => {
    const items: JSX.Element[] = [];
    for (const key in this.state.filteredRightItems) {
      items.push((
        <div key={key}
             className={key === this.state.rightSelectedItemKey ?
               css(ss.listItem, ss.selectedListItem, custom.listItem, custom.selectedListItem) :
               css(ss.listItem, custom.listItem)}
             onClick={() => this.setState({ rightSelectedItemKey: key })}
             onDoubleClick={() => this.removeItem(key)}>
          {this.state.filteredRightItems[key]}
        </div>
      ));
    }
    return items;
  }
}

export default DualListSelect;
