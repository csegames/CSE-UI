/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { css, cx } from 'react-emotion';
import { CollapsingList } from 'cseshared/components/CollapsingList';
import { GroupArray } from './index';
import BattleGroupListItem from './BattleGroupListItem';

const Container = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 5px;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  border-width: 2px;
  border-style: solid;
  border-image: linear-gradient(to bottom,
    ${(props: { color: string } & React.HTMLProps<HTMLDivElement>) => props.color}, transparent);
  border-image-slice: 1;
  background: url(../images/item-tooltips/bg.png);
  background-size: cover;
  -webkit-mask-image: url(../images/item-tooltips/ui-mask.png);
  -webkit-mask-size: cover;
  &:before {
    content: '';
    position: absolute;
    top: 0px;
    left: 0px;
    background: url(../images/item-tooltips/ornament_left.png);
    width: 35px;
    height: 35px;
  }
  &:after {
    content: '';
    position: absolute;
    top: 0px;
    right: 0px;
    background: url(../images/item-tooltips/ornament_right.png);
    width: 35px;
    height: 35px;
  }

  transition: opacity 0.5s ease;
  opacity: 0;
  &.mouseOver {
    opacity: 1;
  }
`;

const HeaderOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  background: linear-gradient(to right, ${(props: {color: string}) => props.color}, transparent);
  box-shadow: inset 0 0 20px 2px rgba(0,0,0,0.8);
  height: 106px;
  &:after {
    content: '';
    position: absolute;
    height: 106px;
    left: 0;
    right: 0;
    bottom: 0;
    background: url(../images/item-tooltips/title_viel.png);
    background-size: cover;
    background-repeat: no-repeat;
  }
`;

const WarbandTitle = styled.div`
  text-shadow: 0px 0px 3px black, 0px 0px 3px black, 0px 0px 3px black,0px 0px 3px black,0px 0px 3px black;
`;

const WarbandName = styled.span`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  text-shadow: 0px 0px 3px black, 0px 0px 3px black, 0px 0px 3px black,0px 0px 3px black,0px 0px 3px black;
`;

const CollapseButton = styled.div`
  font-family: Caudex;
  color: white;
  width: 15px;
  text-shadow: 0px 0px 3px black, 0px 0px 3px black, 0px 0px 3px black,0px 0px 3px black,0px 0px 3px black;
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
  `,

  title: css`
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 30px;
    text-shadow: 0px 0px 3px black, 0px 0px 3px black, 0px 0px 3px black,0px 0px 3px black,0px 0px 3px black;
    border-image: linear-gradient(to right, rgba(176, 176, 175, 0) 5%, rgba(176, 176, 175, 0.7), rgba(176, 176, 175, 0) 95%);
    border-image-slice: 1;
    border-width: 1px;
    color: white;
    cursor: pointer;
    font-size: 14px;
    letter-spacing: 1px;
    `,

  listBody: css`
    height: auto;
    padding: 0 5px 20px 10px;
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
    text-shadow: 0px 0px 3px black, 0px 0px 3px black, 0px 0px 3px black,0px 0px 3px black,0px 0px 3px black;
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
  mouseOver: boolean;
  collapsed: boolean;
}

export class BattleGroupListView extends React.PureComponent<BattleGroupListProps, BattleGroupListState> {
  private mouseLeaveTimeout: number;
  constructor(props: BattleGroupListProps) {
    super(props);
    this.state = {
      mouseOver: false,
      collapsed: false,
    };
  }

  public render() {
    const memberCount = this.getMemberCount();
    return (
      <UIContext.Consumer>
        {(ui) => {
          const color = ui.currentTheme().toolTips.color[camelotunchained.game.selfPlayerState.faction];
          return (
            <Container onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave}>
              <Background color={color} className={this.state.mouseOver ? 'mouseOver' : ''}>
                <HeaderOverlay color={color} />
              </Background>
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
                        <WarbandTitle>
                          <CollapseButton>{collapsed ? '+' : '-'}</CollapseButton>
                          <WarbandName>{listItem.title}</WarbandName> ({listItem.items.length})
                        </WarbandTitle>
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
            </Container>
          );
        }}
      </UIContext.Consumer>
    );
  }

  private getMemberCount = () => {
    let memberCount = 0;
    this.props.groups.forEach((group) => {
      memberCount += group.items.length;
    });

    return memberCount;
  }

  private onMouseOver = () => {
    if (this.mouseLeaveTimeout) {
      window.clearTimeout(this.mouseLeaveTimeout);
      this.mouseLeaveTimeout = null;
    }

    if (!this.state.mouseOver) {
      this.setState({ mouseOver: true });
    }
  }

  private onMouseLeave = () => {
    this.mouseLeaveTimeout = window.setTimeout(() => {
      this.setState({ mouseOver: false });
    }, 1000);
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

export default BattleGroupListView;

