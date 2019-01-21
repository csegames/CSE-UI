/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled, { css, cx } from 'react-emotion';
import { CollapsingList } from '@csegames/camelot-unchained/lib/components';
import { GroupArray } from './index';
import BattleGroupListItem from './BattleGroupListItem';

const Container = styled('div')`
  position: relative;
  user-select: none;
  pointer-events: all;
  width: 100%;
  padding: 3px;
  background:
    linear-gradient(
      to bottom left,
      rgba(196, 157, 108, 0.1),
      rgba(196, 157, 108, 0.25),
      rgba(0, 0, 0, 0.5) 70%,
      rgba(0, 0, 0, 0.9) 90%
    ),
    url(images/battlegroups/battlegroup-bg.png);
  box-shadow: inset 0 -5px 50px 7px rgba(0,0,0,0.8);
  border-image: linear-gradient(to bottom, rgba(65, 65, 65, 1), rgba(0, 0, 0, 0));
  border-image-slice: 1;
  border-width: 1px;
  border-style: solid;
  &:before {
    content: '';
    position: absolute;
    top: -1px;
    left: -2px;
    width: 43px;
    height: 43px;
    background: url(images/battlegroups/ornament-top-left.png) no-repeat;
  }

  &:after {
    content: '';
    position: absolute;
    top: -1px;
    right: -2px;
    width: 43px;
    height: 43px;
    background: url(images/battlegroups/ornament-top-right.png) no-repeat;
  }
`;

const BottomTear = styled('div')`
  position: absolute;
  right: -1px;
  left: -1px;
  bottom: -40px;
  height: 40px;
  background: url(images/battlegroups/bottom-tear.png) no-repeat;
  background-size: cover;
`;

const WarbandName = styled('span')`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
`;

const CollapseButton = styled('div')`
  font-family: Caudex;
  color: white;
  width: 15px;
`;

export interface BattleGroupListStyle {
  collapsingList: string;
  title: string;
  listBody: string;
  listContainer: string;
  warbandTitle: string;
  collapsedWarbandTitle: string;
  warbandList: string;
  collapseButton: string;
}

export const defaultBattleGroupListStyle: BattleGroupListStyle = {
  collapsingList: css`
    width: 100%;
    height: 100%;
    border-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0));
    border-image-slice: 1;
    border-width: 1px;
    border-style: solid;
  `,

  title: css`
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 30px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.9);
    border-image: linear-gradient(to right, rgba(176, 176, 175, 0) 5%, rgba(176, 176, 175, 0.7), rgba(176, 176, 175, 0) 95%);
    border-image-slice: 1;
    border-width: 1px;
    color: white;
    cursor: pointer;
    font-size: 14px;
    letter-spacing: 1px;
    `,

  listBody: css`
    height: 300px;
    padding: 0 5px 0 10px;
  `,

  listContainer: css`
    width: 100%;
    height: 100%;
    max-height: 45vh;
    min-width: 125px;
    padding-right: 5px;
    overflow-y: scroll;
  `,

  warbandTitle: css`
    display: flex;
    width: 100%;
    font-size: 12px;
    font-family: TitilliumWeb;
    color: #FFDD88;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.9);
    &:hover: {
      color: #FFD156;
    };
  `,

  collapsedWarbandTitle: css`
    color: #AB945B;
  `,

  warbandList: css`
    margin-left: 15px;
  `,

  collapseButton: css`
    font-family: Caudex;
  `,
};

export interface BattleGroupListProps {
  styles?: Partial<BattleGroupListStyle>;
  groups: GroupArray[];
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
    const memberCount = this.getMemberCount();
    return (
      <Container>
        <CollapsingList
          title={`Battlegroup (${memberCount})`}
          items={this.props.groups}
          onToggleCollapse={this.onToggleCollapse}
          styles={{
            container: defaultBattleGroupListStyle.collapsingList,
            listContainer: cx('cse-ui-scroller-thumbonly', defaultBattleGroupListStyle.listContainer),
            title: defaultBattleGroupListStyle.title,
            body: defaultBattleGroupListStyle.listBody,
            collapseButton: defaultBattleGroupListStyle.collapseButton,
          }}
          renderListItem={(listItem: GroupArray, i) => {
            return (
              <CollapsingList
                key={listItem.title + i}
                title={collapsed => (
                  <>
                    <CollapseButton>{collapsed ? '+' : '-'}</CollapseButton>
                    <WarbandName>{listItem.title}</WarbandName> ({listItem.items.length})
                  </>
                )}
                items={listItem.items}
                renderListItem={(listItem: GroupMemberState) => (
                  <BattleGroupListItem item={listItem} />
                )}
                styles={{
                  title: defaultBattleGroupListStyle.warbandTitle,
                  collapsedTitle: defaultBattleGroupListStyle.collapsedWarbandTitle,
                }}
              />
            );
          }}
        />
        {!this.state.collapsed && <BottomTear />}
      </Container>
    );
  }

  private getMemberCount = () => {
    let memberCount = 0;
    this.props.groups.forEach((group) => {
      memberCount += group.items.length;
    });

    return memberCount;
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

