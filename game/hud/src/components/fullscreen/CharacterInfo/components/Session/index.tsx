/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import gql from 'graphql-tag';
import * as React from 'react';
import moment from 'moment';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';

import { GridStats } from '@csegames/camelot-unchained/lib/components';
import { withGraphQL, GraphQLInjectedProps } from '@csegames/camelot-unchained/lib/graphql/react';

import TabSubHeader from 'shared/Tabs/TabSubHeader';
import StatsListContainer from '../StatListContainer';
import DataUnavailable from '../DataUnavailable';
import SessionListItem from './SessionListItem';
import { SessionGQL } from 'gql/interfaces';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

export interface SessionProps extends GraphQLInjectedProps<SessionGQL.Query> {
  searchValue: string;
}

export interface SessionState {
  searchValue: string;
}

const HeaderContent = css`
  display: flex;
`;

// #region HeaderSessionText constants
const HEADER_SESSION_TEXT_FONT_SIZE = 32;
// #endregion
const HeaderSessionText = styled.header`
  flex: 2;
  text-transform: uppercase;
  font-size: ${HEADER_SESSION_TEXT_FONT_SIZE}px;

  @media (max-width: 2560px) {
    font-size: ${HEADER_SESSION_TEXT_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${HEADER_SESSION_TEXT_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region HeaderTimesUsedText constants
const HEADER_TIMES_USED_TEXT_FONT_SIZE = 28;
const HEADER_TIMES_USED_TEXT_LETTER_SPACING = 2;
// #endregion
const HeaderTimesUsedText = styled.header`
  flex: 1;
  font-size: ${HEADER_TIMES_USED_TEXT_FONT_SIZE}px;
  letter-spacing: ${HEADER_TIMES_USED_TEXT_LETTER_SPACING}px;
  text-transform: uppercase;

  @media (max-width: 2560px) {
    font-size: ${HEADER_TIMES_USED_TEXT_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${HEADER_TIMES_USED_TEXT_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${HEADER_TIMES_USED_TEXT_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${HEADER_TIMES_USED_TEXT_LETTER_SPACING * HD_SCALE}px;
  }
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
    this.eventHandles.push(game.on('navigate', (name: string) => {
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
