/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import gql from 'graphql-tag';
import * as React from 'react';
import { GridStats, Tooltip } from '@csegames/camelot-unchained/lib/components';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';

import { colors } from '../../../../lib/constants';
import StatListContainer from '../StatListContainer';
import TraitSummary from './TraitSummary';
import DescriptionItem from '../DescriptionItem';
import StatListItem from '../StatListItem';
import DataUnavailable from '../DataUnavailable';
import { TraitsInfoGQL } from 'gql/interfaces';

const query = gql`
  query TraitsInfoGQL {
    myCharacter {
      traits {
        id
        name
        icon
        description
        points
      }
    }
  }
`;

export interface TraitsProps {
}

export interface TraitsState {
  searchValue: string;
}

class Traits extends React.Component<TraitsProps, TraitsState> {
  constructor(props: TraitsProps) {
    super(props);
    this.state = {
      searchValue: '',
    };
  }

  public render() {
    return (
      <GraphQL query={query}>
        {
          (graphql: GraphQLResult<TraitsInfoGQL.Query>) => {
            const myCharacter = graphql.data && graphql.data.myCharacter;
            if (myCharacter && myCharacter.traits) {
              return (
                <StatListContainer
                  onSearchChange={this.onSearchChange}
                  searchValue={this.state.searchValue}
                  renderContent={() => (
                    <GridStats
                      statArray={graphql.data.myCharacter.traits}
                      searchValue={this.state.searchValue}
                      howManyGrids={1}
                      shouldRenderEmptyListItems={true}
                      renderHeaderItem={() => (
                        <DescriptionItem>
                          <header>Name</header>
                          <header>Points</header>
                        </DescriptionItem>
                      )}
                      renderListItem={(item, index) => item && (
                        <Tooltip
                          styles={{
                            Tooltip: {
                              width: '100%',
                            },
                            tooltip: {
                              backgroundColor: 'rgba(0,0,0,0.9)',
                              maxWidth: '500px',
                            },
                          }}
                          content={() => <TraitSummary trait={item} />}
                        >
                          <StatListItem
                            index={index}
                            statName={item.name}
                            statValue={item.points}
                            searchValue={this.state.searchValue}
                            colorOfName={item.points < 0 ? colors.banePrimary : colors.boonPrimary}
                          />
                        </Tooltip>
                      )}
                    />
                  )}
                />
              );
            } else {
              return (
                <DataUnavailable wait={150}>
                  Boons and Bane data not available at this time.
                </DataUnavailable>
              );
            }
          }
        }
      </GraphQL>
    );
  }

  private onSearchChange = (searchValue: string) => {
    this.setState({ searchValue });
  }
}

export default Traits;
