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

const Container = styled.div`
  padding: 0 20px;
  height: 100%;
  overflow-y: auto;
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
