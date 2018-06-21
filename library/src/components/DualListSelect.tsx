/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { merge, clone } from 'lodash';
import styled, { css } from 'react-emotion';

import RaisedButton from './RaisedButton';
import Input from './Input';


export interface DualListSelectStyle {
  container: React.CSSProperties;
  listSection: React.CSSProperties;
  listBox: React.CSSProperties;
  listItem: React.CSSProperties;
  selectedListItem: React.CSSProperties;
  buttons: React.CSSProperties;
  button: React.CSSProperties;
  filter: React.CSSProperties;
}

const Container = styled('div')`
  display: flex;
  justify-content: center;
  align-content: center;
`;

const ListSection = styled('div')`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: stretch;
  align-content: stretch;
`;

const ListBox = styled('div')`
  cursor: pointer;
  user-select: none;
  padding: 1px 15px;
`;

const ListItem = styled('div')`
  cursor: pointer;
  user-select: none;
  padding: 1px 15px;
`;

const SelectedListItem = css`
  background-color: rgba(0, 0, 0, 0.2);
`;

const Buttons = styled('div')`
  display: flex;
  flex-direction: column;
  padding: 10px;
  justify-content: center;
  align-items: center;
`;

const Filter = styled('div')`
  flex: 0;
`;

const defaultButtonStyle = {
  margin: 10,
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
    const customStyle = this.props.styles || {};
    return (
      <Container style={customStyle.container}>

        <ListSection style={customStyle.listSection}>
          <Filter style={customStyle.filter}>
            <Input
              type='text'
              label={this.props.labelLeft || ''}
              inputRef={(r: HTMLInputElement) => this.leftInputRef = r}
              placeholder={'Filter'}
              onChange={this.onLeftFilterTextChanged}>
            </Input>
          </Filter>
          <ListBox style={customStyle.listBox}>
            {this.renderLeftItems(customStyle)}
          </ListBox>
        </ListSection>

        <Buttons>
          <RaisedButton
            styles={{
              button:
                merge({  }, this.props.styles ? this.props.styles.button : null || {}),
            }}
            onClick={this.selectAll}>
            <i className='fa fa-angle-double-right'></i>
          </RaisedButton>
          <RaisedButton
            styles={{ button: merge(defaultButtonStyle, this.props.styles ? this.props.styles.button : null || {}) }}
            onClick={() => this.selectItem()}>
            <i className='fa fa-angle-right'></i>
          </RaisedButton>
          <RaisedButton
            styles={{ button: merge(defaultButtonStyle, this.props.styles ? this.props.styles.button : null || {}) }}
            onClick={() => this.removeItem()}>
            <i className='fa fa-angle-left'></i>
          </RaisedButton>
          <RaisedButton
            styles={{ button: merge(defaultButtonStyle, this.props.styles ? this.props.styles.button : null || {}) }}
            onClick={this.removeAll}>
            <i className='fa fa-angle-double-left'></i>
          </RaisedButton>
        </Buttons>

        <ListSection style={customStyle.listSection}>
          <Filter style={customStyle.filter}>
            <Input
              type='text'
              label={this.props.labelRight || ''}
              inputRef={(r: HTMLInputElement) => this.rightInputRef = r}
              placeholder={'Filter'}
              onChange={this.onRightFilterTextChanged}>
            </Input>
          </Filter>
          <ListBox style={customStyle.listBox}>
            {this.renderRightItems(customStyle)}
          </ListBox>
        </ListSection>

      </Container>
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

  private renderLeftItems = (customStyle: Partial<DualListSelectStyle>) => {
    const items: JSX.Element[] = [];
    for (const key in this.state.filteredLeftItems) {
      items.push((
        <ListItem
          key={key}
          style={key === this.state.leftSelectedItemKey ?
            {...customStyle.listItem, ...customStyle.selectedListItem} : customStyle.listItem}
          className={key === this.state.leftSelectedItemKey ? SelectedListItem : ''}
          onClick={() => this.setState({ leftSelectedItemKey: key })}
          onDoubleClick={() => this.selectItem(key)}>
            {this.state.filteredLeftItems[key]}
        </ListItem>
      ));
    }
    return items;
  }

  private renderRightItems = (customStyle: Partial<DualListSelectStyle>) => {
    const items: JSX.Element[] = [];
    for (const key in this.state.filteredRightItems) {
      items.push((
        <ListItem
          key={key}
          style={key === this.state.rightSelectedItemKey ?
            {...customStyle.listItem, ...customStyle.selectedListItem} : customStyle.listItem}
          className={key === this.state.rightSelectedItemKey ? SelectedListItem : ''}
          onClick={() => this.setState({ rightSelectedItemKey: key })}
          onDoubleClick={() => this.removeItem(key)}>
            {this.state.filteredRightItems[key]}
        </ListItem>
      ));
    }
    return items;
  }
}

export default DualListSelect;
