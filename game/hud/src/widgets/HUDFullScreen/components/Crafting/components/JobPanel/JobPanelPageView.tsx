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
import { MediaBreakpoints } from 'services/session/MediaBreakpoints';

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
  background: url(../images/crafting/1080/glow-bg.png);
  background-size: cover;
  pointer-events: none;
  @media (min-width: ${MediaBreakpoints.UHD}px) {
    background: url(../images/crafting/4k/glow-bg.png);
    background-size: cover;
  }
`;

const LeftBGRing = styled.div`
  position: absolute;
  left: -40%;
  bottom: 140px;
  max-width: 312px;
  max-height: 312px;
  width: 100%;
  height: 40%;
  background: url(../images/crafting/1080/rings.png) no-repeat;
  background-size: contain;
  @media (min-width: ${MediaBreakpoints.UHD}px) {
    max-width: 950px;
    max-height: 950px;
    left: -35%;
    bottom: 220px;
    background: url(../images/crafting/4k/rings.png) no-repeat;
    background-size: contain;
  }
`;

const RightBGRing = styled.div`
  position: absolute;
  right: -40%;
  bottom: 140px;
  max-width: 312px;
  max-height: 312px;
  width: 100%;
  height: 40%;
  background: url(../images/crafting/1080/rings.png) no-repeat;
  background-size: contain;
  background-position: right;
  @media (min-width: ${MediaBreakpoints.UHD}px) {
    max-width: 950px;
    max-height: 950px;
    right: -35%;
    bottom: 220px;
    background: url(../images/crafting/4k/rings.png) no-repeat;
    background-size: contain;
    background-position: right;
  }
`;

const LeftCrystal = styled.div`
  position: absolute;
  background: url(../images/crafting/1080/left-crystal.png);
  background-size: cover;
  max-width: 260px;
  max-height: 386px;
  height: 50%;
  width: 100%;
  left: -100px;
  bottom: 150px;
  pointer-events: none;

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    background: url(../images/crafting/4k/left-crystal.png);
    background-size: cover;
    max-width: 624px;
    max-height: 926px;
    left: -200px;
    bottom: 250px;
  }
`;

const RightCrystal = styled.div`
  position: absolute;
  background: url(../images/crafting/1080/right-crystal.png);
  background-size: cover;
  max-width: 260px;
  max-height: 386px;
  height: 50%;
  width: 100%;
  right: -100px;
  bottom: 150px;
  pointer-events: none;

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    background: url(../images/crafting/4k/right-crystal.png);
    background-size: cover;
    max-width: 624px;
    max-height: 926px;
    right: -200px;
    bottom: 250px;
  }
`;

const ClearJobPosition = styled.div`
  position: fixed;
  top: 107px;
  left: 14px;
  @media (min-width: ${MediaBreakpoints.UHD}px) {
    top: 197px;
    left: 30px;
  }
`;

const JobIndicatorPosition = styled.div`
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  margin: auto;
`;

const OutputMainRing = styled.div`
  position: absolute;
  bottom: -10%;
  left: -13.5%;
  margin: auto;
  width: 130%;
  height: 130%;
  background: url(../images/crafting/1080/output-main-ring-shadow.png) no-repeat;
  background-position: center 0%;
  background-size: cover;
  z-index: 11;
  pointer-events: none;
  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: url(../images/crafting/1080/output-main-ring.png) no-repeat;
    background-position: center 0%;
    background-size: cover;
    right: 5px;
    z-index: 11;
  }

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    background: url(../images/crafting/4k/output-main-ring-shadow.png) no-repeat;
    background-position: center 0%;
    background-size: cover;
    &:before {
      background: url(../images/crafting/4k/output-main-ring.png) no-repeat;
      background-position: center 0%;
      background-size: cover;
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

// const WheelContainer = styled.div`
//   position: relative;
//   width: 100%;
//   height: 100%;
//   left: -2%;
//   z-index: 11;
//   &:before {
//     content: '';
//     position: absolute;
//     width: 100%;
//     height: 100%;
//     background: url(../images/crafting/1080/output-main-ring-shadow.png) no-repeat;
//     background-position: center 0%;
//     background-size: cover;
//   }

//   @media (min-width: ${MediaBreakpoints.UHD}px) {
//     &:before {
//       background: url(../images/crafting/4k/output-main-ring-shadow.png) no-repeat;
//       background-position: center 0%;
//       background-size: cover;
//     }
//   }
// `;

const ButtonContainer = styled.div`
  position: absolute;
  width: 100%;
  bottom: -170px;
  display: flex;
  pointer-events: none;
  z-index: 12;
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
