/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import { ContextState } from './JobPanelContext';
import ClearJob from '../ActionButtons/ClearJob';
import StartJob from '../ActionButtons/StartJob';
import JobStartedOverlay from './JobStartedOverlay';
import JobFinishedOveraly from './JobFinishedOverlay';
import JobIndicator from './JobIndicator';
import InputItems from '../InputItems';
import Infusions from '../Infusions';
import OutputItems from '../OutputItems';
import OutputInfo from '../OutputItems/OutputInfo';
import NoVoxOverlay from './NoVoxOverlay';
import { canStartJob, shouldShowClearButton, isNearbyVox } from '../../lib/utils';
import { VoxJobState } from 'gql/interfaces';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const Container = styled.div`
  position: relative;
  display: flex;
  color: white;
  height: 100%;
  width: 100%;
`;

const CraftingJobContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const BGGlow = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  background-image: url(../images/crafting/uhd/glow-bg.png);
  background-size: cover;
  pointer-events: none;

  @media (max-width: 1920px) {
    background-image: url(../images/crafting/hd/glow-bg.png);
  }
`;

// #region BGRing constants
const BG_RING_BOTTOM = 280;
const BG_RING_MAX_DIMENSIONS = 624;
// #endregion
const LeftBGRing = styled.div`
  position: absolute;
  left: -40%;
  bottom: ${BG_RING_BOTTOM}px;
  max-width: ${BG_RING_MAX_DIMENSIONS}px;
  max-height: ${BG_RING_MAX_DIMENSIONS}px;
  width: 100%;
  height: 40%;
  background-image: url(../images/crafting/uhd/rings.png);
  background-repeat: no-repeat;
  background-size: contain;

  @media (max-width: 2560px) {
    bottom: ${BG_RING_BOTTOM * MID_SCALE}px;
    max-width: ${BG_RING_MAX_DIMENSIONS * MID_SCALE}px;
    max-height: ${BG_RING_MAX_DIMENSIONS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    max-width: ${BG_RING_MAX_DIMENSIONS * HD_SCALE}px;
    max-height: ${BG_RING_MAX_DIMENSIONS * HD_SCALE}px;
    bottom: ${BG_RING_BOTTOM * HD_SCALE}px;
    background-image: url(../images/crafting/hd/rings.png);
  }
`;

const RightBGRing = styled.div`
  position: absolute;
  right: -40%;
  bottom: ${BG_RING_BOTTOM}px;
  max-width: ${BG_RING_MAX_DIMENSIONS}px;
  max-height: 312px;
  width: 100%;
  height: 40%;
  background-image: url(../images/crafting/uhd/rings.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: right;

  @media (max-width: 2560px) {
    max-width: ${BG_RING_MAX_DIMENSIONS * MID_SCALE}px;
    max-height: ${BG_RING_MAX_DIMENSIONS * MID_SCALE}px;
    bottom: ${BG_RING_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    max-width: ${BG_RING_MAX_DIMENSIONS * HD_SCALE}px;
    max-height: ${BG_RING_MAX_DIMENSIONS * HD_SCALE}px;
    bottom: ${BG_RING_BOTTOM * HD_SCALE}px;
    background-image: url(../images/crafting/hd/rings.png);
  }
`;

// #region Crystal constants
const CRYSTAL_MAX_WIDTH = 520;
const CRYSTAL_MAX_HEIGHT = 772;
const CRYSTAL_HORIZONTAL = -200;
const CRYSTAL_BOTTOM = 300;
// #endregion
const LeftCrystal = styled.div`
  position: absolute;
  background-image: url(../images/crafting/uhd/left-crystal.png);
  background-size: cover;
  max-width: ${CRYSTAL_MAX_WIDTH}px;
  max-height: ${CRYSTAL_MAX_HEIGHT}px;
  left: ${CRYSTAL_HORIZONTAL}px;
  bottom: ${CRYSTAL_BOTTOM}px;
  height: 50%;
  width: 100%;
  pointer-events: none;

  @media (max-width: 2560px) {
    max-width: ${CRYSTAL_MAX_WIDTH * MID_SCALE}px;
    max-height: ${CRYSTAL_MAX_HEIGHT * MID_SCALE}px;
    left: ${CRYSTAL_HORIZONTAL * MID_SCALE}px;
    bottom: ${CRYSTAL_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    background-image: url(../images/crafting/hd/left-crystal.png);
    max-width: ${CRYSTAL_MAX_WIDTH * HD_SCALE}px;
    max-height: ${CRYSTAL_MAX_HEIGHT * HD_SCALE}px;
    left: ${CRYSTAL_HORIZONTAL * HD_SCALE}px;
    bottom: ${CRYSTAL_BOTTOM * HD_SCALE}px;
  }
`;

const RightCrystal = styled.div`
  position: absolute;
  background-image: url(../images/crafting/uhd/right-crystal.png);
  background-size: cover;
  max-width: ${CRYSTAL_MAX_WIDTH}px;
  max-height: ${CRYSTAL_MAX_HEIGHT}px;
  right: ${CRYSTAL_HORIZONTAL}px;
  bottom: ${CRYSTAL_BOTTOM}px;
  height: 50%;
  width: 100%;
  pointer-events: none;

  @media (max-width: 2560px) {
    max-width: ${CRYSTAL_MAX_WIDTH * MID_SCALE}px;
    max-height: ${CRYSTAL_MAX_HEIGHT * MID_SCALE}px;
    right: ${CRYSTAL_HORIZONTAL * MID_SCALE}px;
    bottom: ${CRYSTAL_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    background-image: url(../images/crafting/hd/right-crystal.png);
    max-width: ${CRYSTAL_MAX_WIDTH * HD_SCALE}px;
    max-height: ${CRYSTAL_MAX_HEIGHT * HD_SCALE}px;
    right: ${CRYSTAL_HORIZONTAL * HD_SCALE}px;
    bottom: ${CRYSTAL_BOTTOM * HD_SCALE}px;
  }
`;

// #region ClearJobPosition constants
const CLEAR_JOB_POSITION_TOP = -30;
const CLEAR_JOB_POSITION_LEFT = 28;
// #endregion
const ClearJobPosition = styled.div`
  position: absolute;
  top: ${CLEAR_JOB_POSITION_TOP}px;
  left: ${CLEAR_JOB_POSITION_LEFT}px;

  @media (max-width: 2560px) {
    top: ${CLEAR_JOB_POSITION_TOP * MID_SCALE}px;
    left: ${CLEAR_JOB_POSITION_LEFT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${CLEAR_JOB_POSITION_TOP * HD_SCALE}px;
    left: ${CLEAR_JOB_POSITION_LEFT * HD_SCALE}px;
  }
`;

const JobIndicatorPosition = styled.div`
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  margin: auto;
`;

// #region OutputMainRing constants
const OUTPUT_MAIN_RING_RIGHT = 10;
// #endregion
const OutputMainRing = styled.div`
  position: absolute;
  bottom: -10%;
  left: -13.5%;
  margin: auto;
  width: 130%;
  height: 130%;
  background-image: url(../images/crafting/uhd/output-main-ring-shadow.png);
  background-repeat: no-repeat;
  background-position: center 0%;
  background-size: cover;
  z-index: 11;
  pointer-events: none;

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: url(../images/crafting/uhd/output-main-ring.png);
    background-position: center 0%;
    background-size: cover;
    right: ${OUTPUT_MAIN_RING_RIGHT}px;
    z-index: 11;
  }

  @media (max-width: 2560px) {
    &:before {
      right: ${OUTPUT_MAIN_RING_RIGHT * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    background-image: url(../images/crafting/hd/output-main-ring-shadow.png);
    background-repeat: no-repeat;
    &:before {
      right: ${OUTPUT_MAIN_RING_RIGHT * HD_SCALE}px;
      background-image: url(../images/crafting/hd/output-main-ring.png);
      background-repeat: no-repeat;
    }
  }
`;

const JobOutputContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const InputContainer = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: 50%;
`;

const InputSection = styled.div`
  flex: 1;
  width: 50%;
  height: 100%;
`;

const OutputContainer = styled.div`
  flex: 1;
  z-index: 13
  pointer-events: none;
`;

// #region ButtonContainer constants
const BUTTON_CONTAINER_BOTTOM = -340;
// #endregion
const ButtonContainer = styled.div`
  position: absolute;
  width: 100%;
  bottom: ${BUTTON_CONTAINER_BOTTOM}px;
  display: flex;
  pointer-events: none;
  z-index: 12;

  @media (max-width: 2560px) {
    bottom: ${BUTTON_CONTAINER_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    bottom: ${BUTTON_CONTAINER_BOTTOM * HD_SCALE}px;
  }
`;

export interface Props extends ContextState {
  voxEntityID: string;
  jobNumber: number;
}

export interface State {
}

class JobPanelPageView extends React.Component<Props, State> {
  public render() {
    const { jobNumber, voxJob, voxEntityID } = this.props;
    return (
      <Container>
        <CraftingJobContainer>
          <ClearJobPosition>
            <ClearJob jobNumber={jobNumber} canClear={shouldShowClearButton(voxJob)} />
          </ClearJobPosition>

          {voxJob &&
            <JobIndicatorPosition>
              <JobIndicator jobType={voxJob.jobType} />
            </JobIndicatorPosition>
          }

          <InputContainer>
            <InputSection>
              <InputItems jobNumber={jobNumber} />
            </InputSection>
            <InputSection>
              <Infusions />
            </InputSection>
          </InputContainer>

          <LeftCrystal />
          <RightCrystal />
          <LeftBGRing />
          <RightBGRing />
          <BGGlow />

          <JobOutputContainer>
            <OutputContainer>
              <OutputItems jobNumber={jobNumber} />
            </OutputContainer>
            <OutputMainRing />

            <OutputInfo jobNumber={jobNumber} />
          </JobOutputContainer>
          <ButtonContainer>
            <StartJob jobNumber={jobNumber} canStart={canStartJob(voxJob)} />
          </ButtonContainer>
        </CraftingJobContainer>
        {voxJob && voxJob.jobState === VoxJobState.Finished && <JobFinishedOveraly jobNumber={jobNumber} />}
        {voxJob && voxJob.jobState === VoxJobState.Running &&
          <JobStartedOverlay jobNumber={jobNumber} voxJob={voxJob} onJobFinish={this.props.refetchVoxJob} />
        }
        {!isNearbyVox(voxEntityID) && <NoVoxOverlay />}
      </Container>
    );
  }
}

export default JobPanelPageView;
