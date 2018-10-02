/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import gql from 'graphql-tag';
import * as React from 'react';
import moment from 'moment';
import styled, { css } from 'react-emotion';

import { GridStats } from '@csegames/camelot-unchained/lib/components';
import { withGraphQL, GraphQLInjectedProps } from '@csegames/camelot-unchained/lib/graphql/react';

import TabSubHeader from '../../../TabSubHeader';
import StatsListContainer from '../StatListContainer';
import DataUnavailable from '../DataUnavailable';
import SessionListItem from './SessionListItem';
import { SessionGQL } from 'gql/interfaces';

export interface SessionProps extends GraphQLInjectedProps<SessionGQL.Query> {
  searchValue: string;
}

export interface SessionState {
  searchValue: string;
}

const HeaderContent = css`
  display: flex;
`;

const HeaderSessionText = styled('header')`
  flex: 2;
  text-transform: uppercase;
`;

const HeaderTimesUsedText = styled('header')`
  flex: 1;
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

class Session extends React.Component<SessionProps> {
  private eventHandles: EventHandle[] = [];
  public render() {
    const myCharacter = this.props.graphql.data && this.props.graphql.data.myCharacter;
    if (myCharacter && myCharacter.session) {
      const sortedStats = myCharacter.session.skillPartsUsed &&
        myCharacter.session.skillPartsUsed.sort((a, b) => b.timesUsed - a.timesUsed);
      const { searchValue } = this.props;
      return (
        <StatsListContainer
          renderContent={() => (
            <GridStats
              statArray={sortedStats}
              searchValue={this.props.searchValue}
              howManyGrids={1}
              shouldRenderEmptyListItems={true}
              renderHeaderItem={() => (
                <TabSubHeader useGrayBG contentClassName={HeaderContent}>
                  <HeaderSessionText>
                    Session started {moment(myCharacter.session.sessionStartDate).fromNow()}
                  </HeaderSessionText>
                  <HeaderTimesUsedText>Times used</HeaderTimesUsedText>
                </TabSubHeader>
              )}
              renderListItem={item => <SessionListItem skillPartUsed={item} searchValue={searchValue} />}
            />
          )}
        />
      );
    }
    return (
      <DataUnavailable wait={150}>
        Session data is not available at this time.
      </DataUnavailable>
    );
  }

  public componentDidMount() {
    this.eventHandles.push(game.on('hudnav--navigate', (name: string) => {
      if (name === 'equippedgear' || name === 'character' || name === 'inventory') {
        this.props.graphql.refetch();
      }
    }));
  }

  public componentWillUnmount() {
    this.eventHandles.forEach(eventHandle => eventHandle.clear());
  }
}

const SessionWithQL = withGraphQL<SessionProps>({
  query: gql`
    query SessionGQL {
      myCharacter {
        session {
          sessionStartDate
          skillPartsUsed {
            skillPart {
              id
              icon
              name
              description
            }
            timesUsed
          }
        }
      }
    }
  `,
}, {
  pollInterval: 30000,
})(Session);

export default SessionWithQL;
