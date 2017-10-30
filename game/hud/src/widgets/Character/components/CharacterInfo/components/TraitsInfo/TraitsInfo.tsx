/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { ql } from 'camelot-unchained';
import { GridStats, Tooltip } from 'camelot-unchained/lib/components';
import { withGraphQL, GraphQLInjectedProps } from 'camelot-unchained/lib/graphql/react';

import { colors } from '../../../../lib/constants';
import StatListContainer from '../StatListContainer';
import TraitSummary from './TraitSummary';
import DescriptionItem from '../DescriptionItem';
import StatListItem from '../StatListItem';
import DataUnavailable from '../DataUnavailable';

export interface TraitsProps extends GraphQLInjectedProps<{ myCharacter: ql.schema.CUCharacter }> {
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
    const myCharacter = this.props.graphql.data && this.props.graphql.data.myCharacter;
    if (myCharacter && myCharacter.traits) {
      return (
        <StatListContainer
          onSearchChange={this.onSearchChange}
          searchValue={this.state.searchValue}
          renderContent={() => (
            <GridStats
              statArray={this.props.graphql.data.myCharacter.traits}
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

  private onSearchChange = (searchValue: string) => {
    this.setState({ searchValue });
  }
}

const TraitsInfoWithQL = withGraphQL(`
  query TraitsInfo {
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
`)(Traits);

export default TraitsInfoWithQL;
