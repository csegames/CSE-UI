/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import { GroupLogData } from '../index';
import FullView from './FullView';
import { MID_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_PADDING_HORIZONTAL = 40;
// #endregion
const Container = styled.div`
  padding: 0 ${CONTAINER_PADDING_HORIZONTAL}px;
  height: 100%;
  overflow-y: auto;

  @media (max-width: 2560px) {
    padding: 0 ${CONTAINER_PADDING_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: 0 ${CONTAINER_PADDING_HORIZONTAL * MID_SCALE}px;
  }
`;

export interface Props {
  jobNumber: number;
  selectedGroupLog: GroupLogData;
}

export interface State {
  currentPage: number;
}

class JobLogFullView extends React.Component<Props, State> {
  public render() {
    const { selectedGroupLog, jobNumber } = this.props;
    return (
      <Container className='cse-ui-scroller-thumbonly-brown'>
        <FullView
          jobNumber={jobNumber}
          jobIdentifier={selectedGroupLog.log.jobIdentifier}
          selectedGroupLog={selectedGroupLog}
          recipeItem={selectedGroupLog.recipeItem}
        />
      </Container>
    );
  }
}

export default JobLogFullView;
