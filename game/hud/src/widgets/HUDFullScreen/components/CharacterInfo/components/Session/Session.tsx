/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import gql from 'graphql-tag';
import * as React from 'react';
import moment from 'moment';
import * as events from '@csegames/camelot-unchained/lib/events';
import { Tooltip, GridStats } from '@csegames/camelot-unchained/lib/components';
import { withGraphQL, GraphQLInjectedProps } from '@csegames/camelot-unchained/lib/graphql/react';

import StatsListContainer from '../StatListContainer';
import DescriptionItem from '../DescriptionItem';
import StatListItem from '../StatListItem';
import DataUnavailable from '../DataUnavailable';
import { SessionGQL } from 'gql/interfaces';

export interface SessionProps extends GraphQLInjectedProps<SessionGQL.Query> {

}

export interface SessionState {
  searchValue: string;
}

class Session extends React.Component<SessionProps, SessionState> {
  private visibilityListener: number;
  constructor(props: SessionProps) {
    super(props);
    this.state = {
      searchValue: '',
    };
  }

  public render() {
    const myCharacter = this.props.graphql.data && this.props.graphql.data.myCharacter;
    if (myCharacter && myCharacter.session) {
      return (
        <StatsListContainer
          onSearchChange={this.onSearchChange}
          searchValue={this.state.searchValue}
          renderContent={() => (
            <GridStats
              statArray={myCharacter.session.skillPartsUsed}
              searchValue={this.state.searchValue}
              howManyGrids={1}
              shouldRenderEmptyListItems={true}
              renderHeaderItem={() => (
                <DescriptionItem>
                  <header>Name</header>
                  <header>Session started {moment(myCharacter.session.sessionStartDate).fromNow()}</header>
                  <header>Times used</header>
                </DescriptionItem>
              )}
              renderListItem={(item, index) => {
                return (
                  <Tooltip
                    styles={{
                      Tooltip: {
                        width: '100%',
                      },
                    }}
                    content={() => (
                      <img src={item.skillPart.icon} />
                    )}>
                    <StatListItem
                      index={index}
                      statName={item.skillPart.name}
                      statValue={item.timesUsed}
                      searchValue={this.state.searchValue}
                    />
                  </Tooltip>
                );
              }}
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
    this.visibilityListener = events.on('hudnav--navigate', (name: string) => {
      if (name === 'equippedgear' || name === 'character' || name === 'inventory') {
        this.props.graphql.refetch();
      }
    });
  }

  public componentWillUnmount() {
    events.off(this.visibilityListener);
  }

  private onSearchChange = (searchValue: string) => {
    this.setState({ searchValue });
  }
}

const SessionWithQL = withGraphQL({
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
