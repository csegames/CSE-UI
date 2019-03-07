/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import moment from 'moment';
import { styled } from '@csegames/linaria/react';
import { VoxJob, VoxJobState } from 'gql/interfaces';
import { getJobContext, getNearestVoxEntityID, isNearbyVox } from 'fullscreen/Crafting/lib/utils';
import { MediaBreakpoints } from 'services/session/MediaBreakpoints';
import { CraftingContext } from '../../CraftingContext';

const Container = styled.div`
  width: 100%;
  pointer-events: none;
`;

const InfoBG = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 70%;
  height: 70%;
  background: url(../images/crafting/1080/output-text-still-ring.png) no-repeat;
  background-size: contain;
  background-position: center;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 12;

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    background: url(../images/crafting/4k/output-text-still-ring.png) no-repeat;
    background-size: contain;
    background-position: center;
  }
`;

const InfoContainer = styled.div`
  position: relative;
  z-index: 13;
  pointer-events: none;
  margin-top: -10px;
`;

const InfoItem = styled.div`
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: Caudex;
  z-index: 13;
  text-align: center;
  color: #B1FFF3;
  @media (min-width: ${MediaBreakpoints.UHD}px) {
    font-size: 24px;
  }
  @media (max-width: ${MediaBreakpoints.SmallScreen}px) {
    font-size: 10px;
  }
`;

export interface ComponentProps {
  jobNumber: number;
}

export interface InjectedProps {
  voxEntityID: string;
  voxJob: VoxJob.Fragment;
}

export type Props = ComponentProps & InjectedProps;

class OutputInfo extends React.PureComponent<Props> {
  public render() {
    const { voxJob, voxEntityID } = this.props;
    return (
      <Container>
        <InfoBG>
          {voxJob && voxJob.jobState === VoxJobState.Finished &&
            <InfoContainer>
              <InfoItem>Complete</InfoItem>
            </InfoContainer>
          }
          {isNearbyVox(voxEntityID) && !voxJob &&
            <InfoContainer>
              <InfoItem>Select a Job</InfoItem>
            </InfoContainer>
          }
          {voxJob && voxJob.jobState !== VoxJobState.Finished && voxJob.jobState !== VoxJobState.Running &&
            <InfoContainer>
              <InfoItem>
                {voxJob && voxJob.outputItems.length > 0 ? 'Ready' : 'Not ready'}
              </InfoItem>
              {voxJob &&
                <InfoItem>
                  Time: {moment.utc(voxJob.totalCraftingTime * 1000).format('HH:mm:ss')}
                </InfoItem>
              }
              {voxJob &&
                <InfoItem>
                  End Quality: {(voxJob.endQuality * 100).toFixed(0)}%
                </InfoItem>
              }
            </InfoContainer>
          }
        </InfoBG>
      </Container>
    );
  }
}

class OutputInfoWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    const JobContext = getJobContext(this.props.jobNumber);
    return (
      <CraftingContext.Consumer>
        {({ crafting }) => (
          <JobContext.Consumer>
            {({ voxJob }) => (
              <OutputInfo {...this.props} voxJob={voxJob} voxEntityID={getNearestVoxEntityID(crafting)} />
            )}
          </JobContext.Consumer>
        )}
      </CraftingContext.Consumer>
    );
  }
}

export default OutputInfoWithInjectedContext;
