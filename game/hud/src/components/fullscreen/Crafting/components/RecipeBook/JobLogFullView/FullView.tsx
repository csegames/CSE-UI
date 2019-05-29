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
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const Container = styled.div`
  position: relative;
`;

// #region Name constants
const NAME_FONT_SIZE = 36;
// #endregion
const Name = styled.div`
  font-family: TradeWinds;
  font-size: ${NAME_FONT_SIZE}px;
  color: #0A0706;
  pointer-events: none;

  @media (max-width: 2560px) {
    font-size: ${NAME_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${NAME_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region JobTypeIcon constants
const JOB_TYPE_ICON_RIGHT = -40;
const JOB_TYPE_ICON_FONT_SIZE = 300;
// #endregion
const JobTypeIcon = styled.div`
  position: absolute;
  right: ${JOB_TYPE_ICON_RIGHT}px;
  font-size: ${JOB_TYPE_ICON_FONT_SIZE}px;
  color: #6B490F;
  opacity: 0.1;
  z-index: 0;
  pointer-events: none;

  @media (max-width: 2560px) {
    right: ${JOB_TYPE_ICON_RIGHT * MID_SCALE}px;
    font-size: ${JOB_TYPE_ICON_FONT_SIZE * MID_SCALE}px;
    opacity: 0.2;
  }


  @media (max-width: 1920px) {
    right: ${JOB_TYPE_ICON_RIGHT * HD_SCALE}px;
    font-size: ${JOB_TYPE_ICON_FONT_SIZE * HD_SCALE}px;
    opacity: 0.2;
  }
`;

const Info = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 1;
`;

// #region Description constants
const DESCRIPTION_FONT_SIZE = 32;
const DESCRIPTION_MARGIN_BOTTOM = 20;
// #endregion
const Description = styled.div`
  font-family: Caveat;
  color: #000000;
  font-size: ${DESCRIPTION_FONT_SIZE}px;
  margin-bottom: ${DESCRIPTION_MARGIN_BOTTOM}px;

  @media (max-width: 2560px) {
    font-size: ${DESCRIPTION_FONT_SIZE * MID_SCALE}px;
    margin-bottom: ${DESCRIPTION_MARGIN_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${DESCRIPTION_FONT_SIZE * MID_SCALE}px;
    margin-bottom: ${DESCRIPTION_MARGIN_BOTTOM * MID_SCALE}px;
  }
`;

// #region SubHeader constants
const SUB_HEADER_FONT_SIZE = 28;
// #endregion
const SubHeader = styled.div`
  font-family: TradeWinds;
  color: #0A0706;
  font-size: ${SUB_HEADER_FONT_SIZE}px;

  @media (max-width: 2560px) {
    font-size: ${SUB_HEADER_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${SUB_HEADER_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region FavoriteContainer constants
const FAVORITE_CONTAINER_LEFT = -50;
const FAVORITE_CONTAINER_WIDTH = 60;
// #endregion
const FavoriteContainer = styled.div`
  position: absolute;
  left: ${FAVORITE_CONTAINER_LEFT}px;
  width: ${FAVORITE_CONTAINER_WIDTH}px;
  display: flex;
  justify-content: center;

  @media (max-width: 2560px) {
    left: ${FAVORITE_CONTAINER_LEFT * MID_SCALE}px;
    width: ${FAVORITE_CONTAINER_WIDTH * MID_SCALE}px;
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
  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 2560px) {
    width: ${FAVORITE_IMAGE_DIMENSIONS * MID_SCALE}px;
    height: ${FAVORITE_IMAGE_DIMENSIONS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${FAVORITE_IMAGE_DIMENSIONS * HD_SCALE}px;
    height: ${FAVORITE_IMAGE_DIMENSIONS * HD_SCALE}px;
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
      <UIContext.Consumer>
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
      </UIContext.Consumer>
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
