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
import { MediaBreakpoints } from 'fullscreen/Crafting/lib/MediaBreakpoints';
import { CraftingResolutionContext } from '../../../CraftingResolutionContext';

export const Container = styled.div`
  position: relative;
  display: flex;
  pointer-events: all;
  width: 100%;
  min-height: 76px;
  max-height: 100px;
  overflow: hidden;
  &:hover {
    opacity: 0.8;
  }

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    max-height: 130px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    max-height: 200px;
  }
`;

const JobTypeIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 50px;
  color: #6B490F;
  opacity: 0.2;
  font-size: 80px;
  z-index: 0;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    font-size: 104px;
    right: 100px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    font-size: 160px;
    right: 150px;
  }
`;

const Info = styled.div`
  position: relative;
  display: flex;
  z-index: 1;
  width: 100%;
  flex: 1;
`;

const FavoriteContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 30px;

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    width: 55px;
  }
`;

const FavoriteImage = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  opacity: 1;
  -webkit-transition: opacity 0.2s;
  transition: opacity 0.2s;

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    width: 41px;
    height: 47px;
  }
`;

const InfoContainer = styled.div`
  width: 50%;
  flex: 2;
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

const Name = styled.div`
  font-family: TradeWinds;
  font-size: 14px;
  color: #0A0706;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    font-size: 18px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    font-size: 28px;
  }
`;

const Description = styled.div`
  font-family: Caveat;
  color: #000000;
  font-size: 16px;
  overflow: hidden;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    font-size: 21px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    font-size: 32px;
  }
`;

const OutputContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 76px;
  height: 76px;
  background: url(../images/crafting/1080/paper-output-frame.png) no-repeat;
  background-size: contain;
  background-position: center center;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    width: 99px;
    height: 99px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    width: 152px;
    height: 152px;
    background: url(../images/crafting/4k/paper-output-frame.png) no-repeat;
    background-size: contain;
    background-position: center center;
  }
`;

const OutputImage = styled.img`
  width: 41px;
  height: 41px;
  object-fit: contain;
  opacity: 0.8;
  cursor: pointer;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    width: 53px;
    height: 53px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    width: 82px;
    height: 82px;
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
      <CraftingResolutionContext.Consumer>
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
      </CraftingResolutionContext.Consumer>
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
