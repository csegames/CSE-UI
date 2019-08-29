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
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Icon constants
const ICON_FONT_SIZE = 40;
// #endregion
const Icon = styled.div`
  font-size: ${ICON_FONT_SIZE}px;
  color: #F2CEA8;
  -webkit-filter: drop-shadow(0 0 10px #F2CEA8) brightness(110%);
  filter: drop-shadow(0 0 10px #F2CEA8) brightness(110%);
  text-align: center;

  @media (max-width: 2560px) {
    font-size: ${ICON_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${ICON_FONT_SIZE * HD_SCALE}px;
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
