/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { isEqual } from 'lodash';
import { styled } from '@csegames/linaria/react';
import { ItemDefRef, VoxJobType } from 'gql/interfaces';
import { CraftingContext } from '../../../CraftingContext';
import { GroupLogData } from '../index';

import CraftHistory from './CraftHistory';
import LogNotes from './LogNotes';
import { JobIdentifierToVoxJobGroupLog } from '../../../CraftingBase';
import {
  getGroupLogDescription,
  getFavoriteIcon,
  getJobTypeIcon,
} from '../../../lib/utils';
import { MediaBreakpoints } from 'fullscreen/Crafting/lib/MediaBreakpoints';
import { CraftingResolutionContext } from '../../../CraftingResolutionContext';

const Container = styled.div`
  position: relative;
`;

const Name = styled.div`
  font-family: TradeWinds;
  font-size: 18px;
  color: #0A0706;
  pointer-events: none;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    font-size: 21px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    font-size: 36px;
  }
`;

const JobTypeIcon = styled.div`
  position: absolute;
  right: -20px;
  color: #6B490F;
  opacity: 0.1;
  font-size: 150px;
  z-index: 0;
  pointer-events: none;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    font-size: 195px;
    opacity: 0.2;
  }


  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    font-size: 300px;
    opacity: 0.2;
  }
`;

const Info = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 1;
`;

const Description = styled.div`
  font-family: Caveat;
  color: #000000;
  font-size: 16px;
  margin-bottom: 10px;
  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    font-size: 21px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    font-size: 32px;
  }
`;

const SubHeader = styled.div`
  font-family: TradeWinds;
  font-size: 14px;
  color: #0A0706;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    font-size: 18px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    font-size: 28px;
  }
`;

const FavoriteContainer = styled.div`
  position: absolute;
  left: -25px;
  display: flex;
  justify-content: center;
  width: 30px;
  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    width: 55px;
    left: -45px;
  }
`;

const FavoriteImage = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  opacity: 1;
  -webkit-transition: opacity 0.2s;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.8;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    width: 40px;
    height: 40px;
  }
`;

export interface ComponentProps {
  jobNumber: number;
  jobIdentifier: string;
  selectedGroupLog: GroupLogData;
  recipeItem: ItemDefRef.Fragment;
}

export interface InjectedProps {
  jobIdentifierToVoxJobGroupLog: JobIdentifierToVoxJobGroupLog;
  onFavoriteClick: (jobIdentifier: string, jobType: VoxJobType) => void;
}

export type Props = ComponentProps & InjectedProps;

class FullView extends React.Component<Props> {
  public render() {
    const { recipeItem, selectedGroupLog, jobNumber, jobIdentifier } = this.props;
    const groupLog = this.getLog();
    const notCrafted = groupLog.timesCrafted === 0;

    return (
      <CraftingResolutionContext.Consumer>
        {({ isUHD }) => (
          <Container>
            <JobTypeIcon className={getJobTypeIcon(this.props.selectedGroupLog.log.jobType)} />
            <Info>
              <FavoriteContainer>
                {!notCrafted &&
                  <FavoriteImage src={getFavoriteIcon(groupLog, isUHD())} onClick={this.onFavoriteClick} />
                }
              </FavoriteContainer>
              <Name>{recipeItem.name}</Name>
              <Description>{getGroupLogDescription(groupLog)}</Description>
              <LogNotes
                groupLog={groupLog}
                disabled={notCrafted}
                placeholder={notCrafted && 'Craft this to write notes!'}
              />
              <SubHeader>Craft History</SubHeader>
              <CraftHistory
                jobNumber={jobNumber}
                jobIdentifier={jobIdentifier}
                groupLogData={selectedGroupLog}
                groupLog={groupLog}
              />
            </Info>
          </Container>
        )}
      </CraftingResolutionContext.Consumer>
    );
  }

  public shouldComponentUpdate(nextProps: Props) {
    return this.props.jobIdentifier !== nextProps.jobIdentifier ||
      !isEqual(this.props.jobIdentifierToVoxJobGroupLog, nextProps.jobIdentifierToVoxJobGroupLog);
  }

  private getLog = () => {
    return this.props.jobIdentifierToVoxJobGroupLog[this.props.jobIdentifier] || this.props.selectedGroupLog.log;
  }

  private onFavoriteClick = () => {
    const groupLog = this.getLog();
    this.props.onFavoriteClick(this.props.jobIdentifier, groupLog.jobType);
  }
}

class FullViewWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <CraftingContext.Consumer>
        {({
          jobIdentifierToVoxJobGroupLog,
          onToggleFavoriteVoxJobGroupLog,
        }) => {
          return (
            <FullView
              {...this.props}
              jobIdentifierToVoxJobGroupLog={jobIdentifierToVoxJobGroupLog}
              onFavoriteClick={onToggleFavoriteVoxJobGroupLog}
            />
          );
        }}
      </CraftingContext.Consumer>
    );
  }
}

export default FullViewWithInjectedContext;
