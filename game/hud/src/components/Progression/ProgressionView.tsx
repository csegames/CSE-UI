/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { isEmpty } from 'lodash';
import { Spinner } from '@csegames/camelot-unchained';
import { CharacterProgressionData } from '@csegames/camelot-unchained/lib/graphql/schema';
import { GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import ObjectDisplay from '../ObjectDisplay';
import RewardsView from './RewardsView';


const Container = styled('div')`
  position: relative;
  pointer-events: all;
  width: 500px;
  height: 400px;
  padding: 20px;
  background-color: gray;
  color: white;
`;

const LoadingContainer = styled('div')`
  position: relative;
  pointer-events: all;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 500px;
  height: 400px;
  padding: 20px;
  background-color: gray;
  color: white;
`;

const ObjectDisplayContainer = styled('div')`
  display: flex;
  flex-direction: column;
  height: 90%;
`;

const CloseButton = styled('div')`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 12px;
  height: 12px;
  background: url(images/inventory/close-button-grey.png) no-repeat;
  cursor: pointer;
  &:hover {
    -webkit-filter: drop-shadow(2px 2px 2px rgba(255, 255, 255, 0.9));
  }
  &:active {
    -webkit-filter: drop-shadow(2px 2px 2px rgba(255, 255, 255, 1));
  }
`;

export interface Props {
  graphql: GraphQLResult<{ myprogression: CharacterProgressionData }>;
  logIDs: string[];
  onCloseClick: () => void;
  onCollectClick: () => void;
  collected: boolean;
  collecting: boolean;
}

export interface State {

}

class ProgressionView extends React.Component<Props, State> {
  public render() {
    const { graphql } = this.props;
    if (this.props.collecting) {
      return (
        <LoadingContainer>
          <CloseButton onClick={this.props.onCloseClick} />
          <div>Collecting...</div>
          <Spinner />
        </LoadingContainer>
      );
    }

    if (graphql.lastError && graphql.lastError !== 'OK') {
      return (
        <LoadingContainer>
          <CloseButton onClick={this.props.onCloseClick} />
          <div>{graphql.lastError}</div>
        </LoadingContainer>
      );
    }

    if (graphql.loading || !graphql.data || !graphql.data.myprogression) {
      return (
        <LoadingContainer>
          <CloseButton onClick={this.props.onCloseClick} />
          <div>Loading...</div>
          <Spinner />
        </LoadingContainer>
      );
    }

    if (this.props.collected || isEmpty(graphql.data.myprogression.unCollectedDayLogs)) {
      return (
        <LoadingContainer>
          <CloseButton onClick={this.props.onCloseClick} />
          <div>All progression packages have been collected</div>
        </LoadingContainer>
      );
    }

    return (
      <Container>
        <CloseButton onClick={this.props.onCloseClick} />
        <ObjectDisplayContainer>
          <ObjectDisplay data={graphql.data.myprogression} skipFunctions />
          {graphql.data.myprogression.unCollectedDayLogs.map((uncollectedDay) => {
            return (
              <RewardsView key={uncollectedDay.id} logID={uncollectedDay.id} />
            );
          })}
        </ObjectDisplayContainer>
        <button onClick={this.props.onCollectClick}>Collect All</button>
      </Container>
    );
  }
}

export default ProgressionView;
