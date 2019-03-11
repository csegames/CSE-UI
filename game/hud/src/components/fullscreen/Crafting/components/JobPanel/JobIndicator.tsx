/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { VoxJobType } from 'gql/interfaces';
import { getJobTypeIcon } from '../../lib/utils';
import { MediaBreakpoints } from 'fullscreen/Crafting/lib/MediaBreakpoints';

const Icon = styled.div`
  font-size: 20px;
  color: #F2CEA8;
  -webkit-filter: drop-shadow(0 0 10px #F2CEA8) brightness(110%);
  filter: drop-shadow(0 0 10px #F2CEA8) brightness(110%);
  text-align: center;

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    font-size: 26px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    font-size: 40px;
  }
`;

export interface Props {
  jobType: VoxJobType;
}

class JobIndicator extends React.PureComponent<Props> {
  public render() {
    return (
      <Icon className={getJobTypeIcon(this.props.jobType)} />
    );
  }
}

export default JobIndicator;
