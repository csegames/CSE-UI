/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { prettifyText } from '../../../../lib/utils';
import { MediaBreakpoints } from 'services/session/MediaBreakpoints';

const Container = styled.div`
  position: relative;
  min-width: 20px;
  height: 27px;
  padding: 2px 10px 0 10px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  font-family: Caudex;
  font-size: 12px;
  color: #B19A8E;
  background-size: cover;
  background-repeat: no-repeat;
  box-shadow: 2px 0px 2px rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(103, 95, 89, 0.5);
  margin-left: -5px;
  cursor: pointer;
  margin-top: 2;
  transition: margin-top 0.1s;

  &:hover {
    filter: brightness(130%);
    -webkit-filter: brightness(130%);
  }

  &:before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    width: 9px;
    height: 13px;
    background: url(../images/crafting/1080/bookmark-ornament-left-corner.png);
  }

  &:after {
    content: '';
    position: absolute;
    top: -1px;
    right: -1px;
    width: 16px;
    height: 13px;
    background: url(../images/crafting/1080/bookmark-ornament-right-corner.png);
  }

  &.selected {
    z-index: 10;
    margin-top: -1px;
    filter: brightness(200%);
  }

  &.recent {
    background-image: url(../images/crafting/1080/bookmark-recent-bg.png);
  }

  &.favorites {
    background-image: url(../images/crafting/1080/bookmark-favorite-bg.png);
  }

  &.category {
    background-image: url(../images/crafting/1080/bookmark-category-bg.png);
  }

  &.notes,
  &.select {
    background-image: url(../images/crafting/1080/bookmark-notes-bg.png);
  }

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    font-size: 24px;
    height: 60px;
    padding: 6px 20px 0 20px;
  }
`;

export enum Routes {
  Recent = 'recent',
  Favorites = 'favorites',
  Category = 'category',
  Notes = 'notes',
  Select = 'select',
}

export interface Props {
  route: Routes;
  selectedRoute: Routes;
  onClick: (route: Routes) => void;
}

export interface State {
  miniVersion: boolean;
}

class Tab extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      miniVersion: false,
    };
  }

  public render() {
    const { route, selectedRoute } = this.props;
    return (
      <Container
        className={`${route} ${selectedRoute === route ? 'selected' : ''}`}
        onClick={this.onClick}>
        {this.getTabText()}
      </Container>
    );
  }

  public componentDidMount() {
    this.handleMiniVersion();
    window.addEventListener('resize', this.handleMiniVersion);
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleMiniVersion);
  }

  private handleMiniVersion = () => {
    const screenWidth = window.innerWidth;

    if (!this.state.miniVersion && screenWidth <= 1600) {
      this.setState({ miniVersion: true });
    }

    if (this.state.miniVersion && screenWidth > 1600) {
      this.setState({ miniVersion: false });
    }
  }

  private getTabText = () => {
    const prettifiedRouteName = prettifyText(this.props.route);
    if (this.state.miniVersion) {
      return `${prettifiedRouteName.substring(0, 3)}.`;
    }

    return prettifiedRouteName;
  }

  private onClick = () => {
    this.props.onClick(this.props.route);
  }
}

export default Tab;
