/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import gql from 'graphql-tag';
import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { GridStats } from 'cseshared/components/GridStats';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';

import StatListContainer from '../StatListContainer';
import DataUnavailable from '../DataUnavailable';
import TabSubHeader from 'shared/Tabs/TabSubHeader';
import TraitListItem from './TraitListItem';
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

const Container = styled.div`
  display: flex;
`;

const Section = styled.div`
  flex: 1;
`;

export interface TraitsProps {
  searchValue: string;
}

class Traits extends React.Component<TraitsProps> {
  public render() {
    return (
      <GraphQL query={query}>
        {
          (graphql: GraphQLResult<TraitsInfoGQL.Query>) => {
            const myCharacter = graphql.data && graphql.data.myCharacter;
            if (myCharacter && myCharacter.traits) {
              const { boons, banes } = this.getBanesAndBoons(myCharacter.traits);
              const { searchValue } = this.props;
              return (
                <StatListContainer
                  renderContent={() => (
                    <Container>
                      <Section style={{ marginRight: 5 }}>
                        <GridStats
                          statArray={boons}
                          searchValue={this.props.searchValue}
                          howManyGrids={1}
                          shouldRenderEmptyListItems={true}
                          renderHeaderItem={() => (
                            <TabSubHeader useGrayBG color='rgba(65, 172, 233, 0.7)'>Boons</TabSubHeader>
                          )}
                          renderListItem={item => item && <TraitListItem trait={item} searchValue={searchValue} />}
                        />
                      </Section>
                      <Section>
                        <GridStats
                          statArray={banes}
                          searchValue={this.props.searchValue}
                          howManyGrids={1}
                          shouldRenderEmptyListItems={true}
                          renderHeaderItem={() => (
                            <TabSubHeader useGrayBG color='rgba(232, 81, 67, 0.7)'>Banes</TabSubHeader>
                          )}
                          renderListItem={item => item && <TraitListItem trait={item} searchValue={searchValue} />}
                        />
                      </Section>
                    </Container>
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

  private getBanesAndBoons = (traits: TraitsInfoGQL.Traits[]) => {
    const boons: TraitsInfoGQL.Traits[] = [];
    const banes: TraitsInfoGQL.Traits[] = [];

    traits.forEach((trait) => {
      if (trait.points > 0) {
        boons.push(trait);
      }
      if (trait.points < 0) {
        banes.push(trait);
      }
    });

    return {
      boons,
      banes,
    };
  }
}

export default Traits;
