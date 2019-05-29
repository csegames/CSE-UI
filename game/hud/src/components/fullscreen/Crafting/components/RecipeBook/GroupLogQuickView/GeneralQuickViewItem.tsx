/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { ItemDefRef } from 'gql/interfaces';
import { getGroupLogDescription, getJobTypeIcon, getFavoriteIcon } from '../../../lib/utils';
import { GroupLogData } from '../index';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_MIN_HEIGHT = 152;
export const CONTAINER_MAX_HEIGHT = 200;
// #endregion
export const Container = styled.div`
  position: relative;
  display: flex;
  pointer-events: all;
  width: 100%;
  min-height: ${CONTAINER_MIN_HEIGHT}px;
  max-height: ${CONTAINER_MAX_HEIGHT}px;
  overflow: hidden;
  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 2560px) {
    min-height: ${CONTAINER_MIN_HEIGHT * MID_SCALE}px;
    max-height: ${CONTAINER_MAX_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    min-height: ${CONTAINER_MIN_HEIGHT * HD_SCALE}px;
    max-height: ${CONTAINER_MAX_HEIGHT * HD_SCALE}px;
  }
`;

// #region JobTypeIcon constants
const JOB_TYPE_ICON_TOP = 10;
const JOB_TYPE_ICON_RIGHT = 100;
const JOB_TYPE_ICON_FONT_SIZE = 160;
// #endregion
const JobTypeIcon = styled.div`
  position: absolute;
  top: ${JOB_TYPE_ICON_TOP}px;
  right: ${JOB_TYPE_ICON_RIGHT}px;
  font-size: ${JOB_TYPE_ICON_FONT_SIZE}px;
  color: #6B490F;
  opacity: 0.2;
  z-index: 0;

  @media (max-width: 2560px) {
    top: ${JOB_TYPE_ICON_TOP * MID_SCALE}px;
    right: ${JOB_TYPE_ICON_RIGHT * MID_SCALE}px;
    font-size: ${JOB_TYPE_ICON_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${JOB_TYPE_ICON_TOP * HD_SCALE}px;
    right: ${JOB_TYPE_ICON_RIGHT * HD_SCALE}px;
    font-size: ${JOB_TYPE_ICON_FONT_SIZE * HD_SCALE}px;
  }
`;

const Info = styled.div`
  position: relative;
  display: flex;
  z-index: 1;
  width: 100%;
  flex: 1;
`;

// #region FavoriteContainer constants
const FAVORITE_CONTAINER_WIDTH = 60;
// #endregion
const FavoriteContainer = styled.div`
  display: flex;
  justify-content: center;
  width: ${FAVORITE_CONTAINER_WIDTH}px;

  @media (max-width: 2560px) {
    width: ${FAVORITE_CONTAINER_WIDTH * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${FAVORITE_CONTAINER_WIDTH * HD_SCALE}px;
  }
`;

// #region FavoriteImage constants
const FAVORITE_IMAGE_DIMENSIONS = 40;
// #endregion
const FavoriteImage = styled.img`
  width: ${FAVORITE_IMAGE_DIMENSIONS}px;
  height: ${FAVORITE_IMAGE_DIMENSIONS}px;
  cursor: pointer;
  opacity: 1;
  -webkit-transition: opacity 0.2s;
  transition: opacity 0.2s;

  @media (max-width: 2560px) {
    width: ${FAVORITE_IMAGE_DIMENSIONS * MID_SCALE}px;
    height: ${FAVORITE_IMAGE_DIMENSIONS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${FAVORITE_IMAGE_DIMENSIONS * HD_SCALE}px;
    height: ${FAVORITE_IMAGE_DIMENSIONS * HD_SCALE}px;
  }
`;

const InfoContainer = styled.div`
  width: 50%;
  flex: 2;
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

// #region Name constants
const NAME_FONT_SIZE = 28;
// #endregion
const Name = styled.div`
  font-family: TradeWinds;
  font-size: ${NAME_FONT_SIZE}px;
  color: #0A0706;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;

  @media (max-width: 2560px) {
    font-size: ${NAME_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${NAME_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region Description constants
const DESCRIPTION_FONT_SIZE = 32;
// #endregion
const Description = styled.div`
  font-family: Caveat;
  color: #000000;
  font-size: ${DESCRIPTION_FONT_SIZE}px;
  overflow: hidden;

  @media (max-width: 2560px) {
    font-size: ${DESCRIPTION_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${DESCRIPTION_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region OutputContainer constants
const OUTPUT_CONTAINER_DIMENSIONS = 152;
// #endregion
const OutputContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${OUTPUT_CONTAINER_DIMENSIONS}px;
  height: ${OUTPUT_CONTAINER_DIMENSIONS}px;
  background-image: url(../images/crafting/uhd/paper-output-frame.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;

  @media (max-width: 2560px) {
    width: ${OUTPUT_CONTAINER_DIMENSIONS * MID_SCALE}px;
    height: ${OUTPUT_CONTAINER_DIMENSIONS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${OUTPUT_CONTAINER_DIMENSIONS * HD_SCALE}px;
    height: ${OUTPUT_CONTAINER_DIMENSIONS * HD_SCALE}px;
    background-image: url(../images/crafting/hd/paper-output-frame.png);
  }
`;

// #region OutputImage constants
const OUTPUT_IMAGE_DIMENSIONS = 82;
// #endregion
const OutputImage = styled.img`
  width: ${OUTPUT_IMAGE_DIMENSIONS}px;
  height: ${OUTPUT_IMAGE_DIMENSIONS}px;
  object-fit: contain;
  opacity: 0.8;
  cursor: pointer;

  @media (max-width: 2560px) {
    width: ${OUTPUT_IMAGE_DIMENSIONS * MID_SCALE}px;
    height: ${OUTPUT_IMAGE_DIMENSIONS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${OUTPUT_IMAGE_DIMENSIONS * HD_SCALE}px;
    height: ${OUTPUT_IMAGE_DIMENSIONS * HD_SCALE}px;
  }
`;

const NotCraftedText = styled.div`
  color: #7d0503;
`;

export interface Props {
  shouldTransform: boolean;
  groupLog: GroupLogData;
  onClick: (groupLog: GroupLogData) => void;
  onFavoriteClick: () => void;
  onOutputMouseOver: (e: MouseEvent, recipeItem: ItemDefRef.Fragment) => void;
  onOutputMouseLeave: () => void;
}

class GeneralQuickViewItem extends React.Component<Props> {
  public render() {
    const { groupLog, shouldTransform } = this.props;
    const notCrafted = groupLog.log.timesCrafted === 0;

    return (
      <UIContext.Consumer>
        {({ isUHD }) => {
          return (
            <Container style={{
              transform: shouldTransform ? 'rotate(180deg)' : 'none',
            }}>
              <JobTypeIcon className={getJobTypeIcon(groupLog.log.jobType)} />
              <Info>
                <FavoriteContainer>
                  {!notCrafted &&
                    <FavoriteImage
                      src={getFavoriteIcon(groupLog.log, isUHD())}
                      onClick={this.props.onFavoriteClick}
                    />
                  }
                </FavoriteContainer>
                <InfoContainer onClick={this.onClick}>
                  <Name>
                    {groupLog.recipeItem.name}
                    {notCrafted && <NotCraftedText>(Not Crafted)</NotCraftedText>}
                  </Name>
                  <Description>
                    {getGroupLogDescription(groupLog.log)}
                  </Description>
                </InfoContainer>
                <OutputContainer  onClick={this.onClick}>
                  <OutputImage
                    src={groupLog.recipeItem.iconUrl}
                    onMouseOver={this.onOutputMouseOver}
                    onMouseLeave={this.props.onOutputMouseLeave}
                  />
                </OutputContainer>
              </Info>
            </Container>
          );
        }}
      </UIContext.Consumer>
    );
  }

  private onClick = () => {
    this.props.onClick(this.props.groupLog);
  }

  private onOutputMouseOver = (e: React.MouseEvent) => {
    this.props.onOutputMouseOver(e as any, this.props.groupLog.recipeItem);
  }
}

export default GeneralQuickViewItem;
