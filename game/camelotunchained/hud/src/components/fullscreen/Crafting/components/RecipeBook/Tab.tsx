/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { isEqual } from 'lodash';
import { styled } from '@csegames/linaria/react';
import { prettifyText } from 'fullscreen/lib/utils';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_MIN_WIDTH = 40;
const CONTAINER_HEIGHT = 54;
const CONTAINER_PADDING_TOP = 4;
const CONTAINER_PADDING_HORIZONTAL = 20;
const CONTAINER_FONT_SIZE = 24;
const CONTAINER_MARGIN_LEFT = -10;

const ORNAMENT_ALIGNMENT = -2;
const ORNAMENT_LEFT_WIDTH = 18;
const ORNAMENT_RIGHT_WIDTH = 32;
const ORNAMENT_HEIGHT = 26;
// #endregion
const Container = styled.div`
  position: relative;
  min-width: ${CONTAINER_MIN_WIDTH}px;
  height: ${CONTAINER_HEIGHT}px;
  padding: ${CONTAINER_PADDING_TOP}px ${CONTAINER_PADDING_HORIZONTAL}px 0 ${CONTAINER_PADDING_HORIZONTAL}px;
  font-size: ${CONTAINER_FONT_SIZE}px;
  margin-left: ${CONTAINER_MARGIN_LEFT}px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  font-family: Caudex;
  color: #B19A8E;
  background-size: cover;
  background-repeat: no-repeat;
  box-shadow: 2px 0px 2px rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(103, 95, 89, 0.5);
  cursor: pointer;
  transition: margin-top 0.1s;

  &:hover {
    filter: brightness(130%);
    -webkit-filter: brightness(130%);
  }

  &:before {
    content: '';
    position: absolute;
    top: ${ORNAMENT_ALIGNMENT}px;
    left: ${ORNAMENT_ALIGNMENT}px;
    width: ${ORNAMENT_LEFT_WIDTH}px;
    height: ${ORNAMENT_HEIGHT}px;
    background-image: url(../images/crafting/uhd/bookmark-ornament-left-corner.png);
    background-repeat: no-repeat;
    background-size: contain;
  }

  &:after {
    content: '';
    position: absolute;
    top: ${ORNAMENT_ALIGNMENT}px;
    right: ${ORNAMENT_ALIGNMENT}px;
    width: ${ORNAMENT_RIGHT_WIDTH}px;
    height: ${ORNAMENT_HEIGHT}px;
    background-image: url(../images/crafting/uhd/bookmark-ornament-right-corner.png);
    background-repeat: no-repeat;
    background-size: contain;
  }

  &.selected {
    z-index: 10;
    margin-top: -1px;
    filter: brightness(200%);
  }

  &.recent {
    background-image: url(../images/crafting/hd/bookmark-recent-bg.png);
  }

  &.favorites {
    background-image: url(../images/crafting/hd/bookmark-favorite-bg.png);
  }

  &.category {
    background-image: url(../images/crafting/hd/bookmark-category-bg.png);
  }

  &.notes,
  &.select {
    background-image: url(../images/crafting/hd/bookmark-notes-bg.png);
  }

  @media (max-width: 2560px) {
    min-width: ${CONTAINER_MIN_WIDTH * MID_SCALE}px;
    height: ${CONTAINER_HEIGHT * MID_SCALE}px;
    padding: ${CONTAINER_PADDING_TOP * MID_SCALE}px ${CONTAINER_PADDING_HORIZONTAL * MID_SCALE}px 0
    ${CONTAINER_PADDING_HORIZONTAL * MID_SCALE}px;
    font-size: ${CONTAINER_FONT_SIZE * MID_SCALE}px;
    margin-left: ${CONTAINER_MARGIN_LEFT * MID_SCALE}px;

    &:before {
      top: ${ORNAMENT_ALIGNMENT * MID_SCALE}px;
      left: ${ORNAMENT_ALIGNMENT * MID_SCALE}px;
      width: ${ORNAMENT_LEFT_WIDTH * MID_SCALE}px;
      height: ${ORNAMENT_HEIGHT * MID_SCALE}px;
    }

    &:after {
      top: ${ORNAMENT_ALIGNMENT * MID_SCALE}px;
      right: ${ORNAMENT_ALIGNMENT * MID_SCALE}px;
      width: ${ORNAMENT_RIGHT_WIDTH * MID_SCALE}px;
      height: ${ORNAMENT_HEIGHT * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    min-width: ${CONTAINER_MIN_WIDTH * HD_SCALE}px;
    height: ${CONTAINER_HEIGHT * HD_SCALE}px;
    padding: ${CONTAINER_PADDING_TOP * HD_SCALE}px ${CONTAINER_PADDING_HORIZONTAL * HD_SCALE}px 0
    ${CONTAINER_PADDING_HORIZONTAL * HD_SCALE}px;
    font-size: ${CONTAINER_FONT_SIZE * HD_SCALE}px;
    margin-left: ${CONTAINER_MARGIN_LEFT * HD_SCALE}px;

    &:before {
      top: ${ORNAMENT_ALIGNMENT * HD_SCALE}px;
      left: ${ORNAMENT_ALIGNMENT * HD_SCALE}px;
      width: ${ORNAMENT_LEFT_WIDTH * HD_SCALE}px;
      height: ${ORNAMENT_HEIGHT * HD_SCALE}px;
      background-image: url(../images/crafting/hd/bookmark-ornament-left-corner.png);
    }

    &:after {
      top: ${ORNAMENT_ALIGNMENT * HD_SCALE}px;
      right: ${ORNAMENT_ALIGNMENT * HD_SCALE}px;
      width: ${ORNAMENT_RIGHT_WIDTH * HD_SCALE}px;
      height: ${ORNAMENT_HEIGHT * HD_SCALE}px;
      background-image: url(../images/crafting/hd/bookmark-ornament-right-corner.png);
    }
  }
`;

export enum Routes {
  Recent = 'recent',
  Favorites = 'favorites',
  Category = 'category',
  Notes = 'notes',
  Select = 'select',
}

export interface ComponentProps {
  route: Routes;
  selectedRoute: Routes;
  onClick: (route: Routes) => void;
}

export interface InjectedProps {
  resolution: { width: number, height: number };
}

export type Props = ComponentProps & InjectedProps;

export interface State {
  miniVersion: boolean;
}

class Tab extends React.Component<Props, State> {
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
  }

  public componentDidUpdate(prevProps: Props) {
    if (!isEqual(prevProps.resolution, this.props.resolution)) {
      this.handleMiniVersion();
    }
  }

  private handleMiniVersion = () => {
    const { resolution } = this.props;
    const screenWidth = resolution.width;

    if (!this.state.miniVersion && (screenWidth <= 1600 || screenWidth <= 2550)) {
      this.setState({ miniVersion: true });
    } else {
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

class TabWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <UIContext.Consumer>
        {({ resolution }) => (
          <Tab {...this.props} resolution={resolution} />
        )}
      </UIContext.Consumer>
    );
  }
}

export default TabWithInjectedContext;
