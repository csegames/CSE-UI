/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import { utils } from '@csegames/camelot-unchained';
import { CollapsingList } from '@csegames/camelot-unchained/lib/components';
import BattleGroupListItem from './BattleGroupListItem';

const Container = styled('div')`
  webkit-user-select: none;
  user-select: none;
  pointer-events: all;
  color: white;
  width: 100%;
  height: 100%;
`;

const WarbandTitle = styled('div')`
  display: ${(props: any) => props.display};
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 18px;
  font-weight: bold;
  color: #EED07B;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.9);
  &:hover {
    color: ${utils.lightenColor('#EED07B', 20)};
  };
`;

const FooterContainer = styled('div')`
  width: 100%;
`;

const FooterDivider = styled('div')`
  height: 1px;
  width: 100%;
  background: linear-gradient(left, transparent, #737257, transparent);
  marginTop: 5px;
  marginBottom: 5px;
`;

const AddNewGroupButton = styled('div')`
  cursor: pointer;
  font-size: 16px;
  color: #C4C4C4;
  margin-left: 10px;
  &:hover {
    color: ${utils.lightenColor('#C4C4C4', 20)}
  }
`;

export interface BattleGroupListStyle {
  collapsingList: string;
  title: string;
  listBody: string;
  listContainer: string;
  warbandTitle: string;
  warbandList: string;
}

export const defaultBattleGroupListStyle: BattleGroupListStyle = {
  collapsingList: css`
    height: 100%;
  `,

  title: css`
    display: flex;
    align-items: center;
    padding: 0 15px;
    height: 30px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.9);
    background: url(images/battlegroups/header-chrome.png) no-repeat, url(images/battlegroups/header.png) 100% no-repeat;
    border-bottom: 1px solid ${utils.lightenColor('#202020', 30)};
    color: white;
    cursor: pointer;
    font-size: 14px;
  `,

  listBody: css`
    height: 100%;
    padding: 0 0 70px 0;
    background: linear-gradient(to bottom left, rgba(0,0,0,1), rgba(0,0,0,0.7), rgba(0,0,0,0.3), rgba(0,0,0,0.2),
      rgba(0,0,0,0.3), rgba(0,0,0,0.5), rgba(0,0,0,1)), url(images/battlegroups/bg-pattern.jpg);
    box-shadow: inset 0 0 40px 5px rgba(0,0,0,0.6);
    mask-image: url(images/battlegroups/bg-mask.png);
    mask-size: 140px 100%;
  `,

  listContainer: css`
    width: 100%;
    height: 100%;
    max-height: 45vh;
    min-width: 125px;
    overflow: auto;
    background: url(images/battlegroups/left-side-bar.png) no-repeat;
    &::-webkit-scrollbar: {
      width: 2px;
    };
    &::-webkit-scrollbar-track: {
      background-color: transparent;
    };
    &::-webkit-scrollbar-thumb: {
      background-color: linear-gradient(rgba(0,0,0,1), rgba(144,137,116,1), rgba(0,0,0,1));
    };
  `,

  warbandTitle: css`
    font-size: 18px;
    font-weight: bold;
    color: #EED07B;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.9);
    &:hover: {
      color: ${utils.lightenColor('#EED07B', 20)};
    };
  `,

  warbandList: css`
    margin-left: 15px;
  `,
};

export interface BattleGroupListProps {
  styles?: Partial<BattleGroupListStyle>;
  groups: any[];
}

export interface BattleGroupListState {
  collapsed: boolean;
}

export class BattleGroupList extends React.PureComponent<BattleGroupListProps, BattleGroupListState> {
  constructor(props: BattleGroupListProps) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }

  public render() {
    return (
      <Container>
        <CollapsingList
          title='Battlegroup'
          items={this.props.groups}
          onToggleCollapse={this.onToggleCollapse}
          styles={{
            container: defaultBattleGroupListStyle.collapsingList,
            listContainer: defaultBattleGroupListStyle.listContainer,
            title: defaultBattleGroupListStyle.title,
            body: defaultBattleGroupListStyle.listBody,
          }}
          renderListItem={(listItem) => {
            return (
              <WarbandTitle display={this.state.collapsed ? 'none' : 'block'}>
                <CollapsingList
                  key={listItem}
                  title={listItem.title}
                  items={listItem.items}
                  renderListItem={listItem => <BattleGroupListItem item={listItem} />}
                  styles={{
                    title: defaultBattleGroupListStyle.warbandTitle,
                  }}
                />
              </WarbandTitle>
            );
          }}
          renderListFooter={() => (
            <FooterContainer>
              <FooterDivider />
              <AddNewGroupButton>+ Add New Group</AddNewGroupButton>
            </FooterContainer>
          )}
        />
      </Container>
    );
  }

  private onToggleCollapse = () => {
    this.setState((state, props) => {
      if (state.collapsed) {
        // Show
        return {
          collapsed: false,
        };
      } else {
        // Hide
        return {
          collapsed: true,
        };
      }
    });
  }
}

export default BattleGroupList;

