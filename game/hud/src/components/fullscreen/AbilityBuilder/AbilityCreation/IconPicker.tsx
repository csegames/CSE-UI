/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import convert from 'xml-js';
import { styled } from '@csegames/linaria/react';
import { AbilityType } from '..';
import { hidePopup } from 'actions/popup';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';
import { request } from '@csegames/camelot-unchained/lib/utils/request';

const ICONS_URL = 'http://camelot-unchained.s3.amazonaws.com/?prefix=game/4/icons/skills';

// #region Container constants
const CONTAINER_HEIGHT = 600;
// #endregion
const Container = styled.div`
  position: absolute;
  right: 0px;
  left: 0px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 80%;
  height: ${CONTAINER_HEIGHT}px;
  background: black;
  z-index: 9999;
  transition: top 0.3s;

  &:before {
    content: '';
    z-index: -1;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border: 1px solid #EAD5F2;
    box-shadow: inset 0 0 10px 2px #704E9E, 0 0 10px 2px #6A46B3;
  }

  &.Melee:before {
    filter: hue-rotate(110deg);
  }

  &.Archery:before {
    filter: hue-rotate(-75deg);
  }

  &.Shout:before {
    filter: hue-rotate(135deg);
  }

  &.Throwing:before {
    filter: hue-rotate(-135deg);
  }

  @media (max-width: 2560px) {
    height: ${CONTAINER_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${CONTAINER_HEIGHT * HD_SCALE}px;
  }
`;

// const Overlay = styled.div`
//   position: absolute;
//   top: 0;
//   right: 0;
//   bottom: 0;
//   left: 0;
//   background: rgba(0, 0, 0, 0.5);
//   z-index: 8;
// `;

// #region ContentContainer constants
const CONTENT_CONTAINER_PADDING = 10;
const CONTENT_CONTAINER_MARGIN = 10;
// #endregion
const ContentContainer = styled.div`
  width: calc(100% - ${(CONTENT_CONTAINER_MARGIN + CONTENT_CONTAINER_PADDING) * 2}px);
  height: calc(100% - ${(CONTENT_CONTAINER_MARGIN + CONTENT_CONTAINER_PADDING) * 2}px);
  padding: ${CONTENT_CONTAINER_PADDING}px;
  margin: ${CONTENT_CONTAINER_MARGIN}px ${CONTENT_CONTAINER_MARGIN * 2}px;
  overflow: auto;

  @meida (max-width: 2560px) {
    width: calc(100% - ${((CONTENT_CONTAINER_MARGIN * MID_SCALE) + (CONTENT_CONTAINER_PADDING * MID_SCALE)) * 2}px);
    height: calc(100% - ${((CONTENT_CONTAINER_MARGIN * MID_SCALE) + (CONTENT_CONTAINER_PADDING * MID_SCALE)) * 2}px);
    padding: ${CONTENT_CONTAINER_PADDING * MID_SCALE}px;
    margin: ${CONTENT_CONTAINER_MARGIN * MID_SCALE}px ${(CONTENT_CONTAINER_MARGIN * MID_SCALE) * 2}px;
  }

  @media (max-width: 1920px) {
    width: calc(100% - ${((CONTENT_CONTAINER_MARGIN * HD_SCALE) + (CONTENT_CONTAINER_PADDING * HD_SCALE)) * 2}px);
    height: calc(100% - ${((CONTENT_CONTAINER_MARGIN * HD_SCALE) + (CONTENT_CONTAINER_PADDING * HD_SCALE)) * 2}px);
    padding: ${CONTENT_CONTAINER_PADDING * HD_SCALE}px;
    margin: ${CONTENT_CONTAINER_MARGIN * HD_SCALE}px ${(CONTENT_CONTAINER_MARGIN * HD_SCALE) * 2}px;
  }
`;

// #region Icon constants
const ICON_DIMENSIONS = 100;
const ICON_MARGIN = 5;
// #endregion
const Icon = styled.img`
  width: ${ICON_DIMENSIONS}px;
  height: ${ICON_DIMENSIONS}px;
  margin: ${ICON_MARGIN}px;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    filter: brightness(150%);
  }

  @media (max-width: 2560px) {
    width: ${ICON_DIMENSIONS * MID_SCALE}px;
    height: ${ICON_DIMENSIONS * MID_SCALE}px;
    margin: ${ICON_MARGIN * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${ICON_DIMENSIONS * HD_SCALE}px;
    height: ${ICON_DIMENSIONS * HD_SCALE}px;
    margin: ${ICON_MARGIN * HD_SCALE}px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

// #region LoadingIcon constants
const LOADING_ICON_DIMENSIONS = 300;
// #endregion
const LoadingIcon = styled.video`
  width: ${LOADING_ICON_DIMENSIONS}px;
  height: ${LOADING_ICON_DIMENSIONS}px;
  object-fit: cover;
  filter: brightness(0) invert(1);
  opacity: 0.2;

  @media (max-width: 2560px) {
    width: ${LOADING_ICON_DIMENSIONS * MID_SCALE}px;
    height: ${LOADING_ICON_DIMENSIONS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${LOADING_ICON_DIMENSIONS * HD_SCALE}px;
    height: ${LOADING_ICON_DIMENSIONS * HD_SCALE}px;
  }
`;

export interface Props {
  top: number;
  selectedAbilityType: AbilityType;
  onIconClick: (icon: string) => void;
  onCloseIconPicker: () => void;
}

export interface State {
  icons: string[];
  loading: boolean;
}

export class IconPicker extends React.PureComponent<Props, State> {
  private mouseOver: boolean;
  constructor(props: Props) {
    super(props);
    this.state = {
      icons: [],
      loading: true,
    };
  }

  public render() {
    return (
      <>
        {/* <Overlay onClick={this.props.onCloseIconPicker} /> */}
        <Container
          style={{ top: this.props.top }}
          className={this.props.selectedAbilityType.name}
          onMouseOver={this.onMouseOver}
          onMouseLeave={this.onMouseLeave}>
          {this.state.loading &&
            <LoadingContainer>
              <LoadingIcon src='images/loading-realms.webm' autoPlay loop muted />
            </LoadingContainer>
          }
          {!this.state.loading &&
            <ContentContainer className={'cse-ui-scroller-thumbonly'}>
              {this.state.icons.map(icon => <Icon src={icon} onClick={() => this.onIconClick(icon)} />)}
            </ContentContainer>
          }
        </Container>
      </>
    );
  }

  public componentDidMount() {
    this.initializeIcons();
    window.addEventListener('mousedown', this.handleMouseDown);
  }

  public componentWillUnmount() {
    window.removeEventListener('mousedown', this.handleMouseDown);
  }

  private onMouseOver = () => {
    this.mouseOver = true;
  }

  private onMouseLeave = () => {
    this.mouseOver = false;
  }

  private handleMouseDown = () => {
    if (this.mouseOver) return;

    this.props.onCloseIconPicker();
  }

  private initializeIcons = async () => {
    const res = await request('get', ICONS_URL);

    // Comes in as xml. Need to convert to json.
    const data = JSON.parse(convert.xml2json(res.data));
    const icons: string[] = [];
    const elements = data.elements[0].elements;
    elements.slice(5, elements.length).forEach((element: any) => {
      icons.push('http://camelot-unchained.s3.amazonaws.com/' + element.elements[0].elements[0].text);
    });
    this.setState({ icons, loading: false });
  }

  private onIconClick = (icon: string) => {
    hidePopup();
    this.props.onIconClick(icon);
  }
}
