/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { ql } from '@csegames/camelot-unchained';
import { GridStats } from '@csegames/camelot-unchained/lib/components';
import { withGraphQL, GraphQLInjectedProps } from '@csegames/camelot-unchained/lib/graphql/react';

import DescriptionItem from '../DescriptionItem';
import StatListContainer from '../StatListContainer';
import StatListItem from '../StatListItem';
import DataUnavailable from '../DataUnavailable';

export interface GeneralProps extends GraphQLInjectedProps<{ myCharacter: ql.schema.CUCharacter }> {

}

export interface GeneralState {
  searchValue: string;
}

class General extends React.Component<GeneralProps, GeneralState> {
  constructor(props: GeneralProps) {
    super(props);
    this.state = {
      searchValue: '',
    };
  }

  public render() {
    const myCharacter = this.props.graphql.data && this.props.graphql.data.myCharacter;
    if (myCharacter && myCharacter.stats) {
      return (
        <StatListContainer
          onSearchChange={this.onSearchChange}
          searchValue={this.state.searchValue}
          renderContent={() => (
            <GridStats
              statArray={myCharacter.stats}
              searchValue={this.state.searchValue}
              howManyGrids={2}
              shouldRenderEmptyListItems={true}
              renderHeaderItem={() => (
                <DescriptionItem>
                  <header>Name</header>
                  <header>Value</header>
                </DescriptionItem>
              )}
              renderListItem={(item, index) => (
                <StatListItem
                  index={index}
                  statName={item.stat}
                  statValue={item.value}
                  searchValue={this.state.searchValue}
                />
              )}
            />
          )}
        />
      );
    } else {
      return (
        <DataUnavailable wait={150}>
          General stat data is not available at this time.
        </DataUnavailable>
      );
    }
  }

  public onSearchChange = (searchValue: string) => {
    this.setState({ searchValue });
  }
}

const GeneralWithQL = withGraphQL({
  query: `
    {
      myCharacter {
        maxHealth
        maxBlood
        maxStamina
        maxPanic
        stats {
          stat
          value
        }
      }
    }
  `,
})(General);

export default GeneralWithQL;
