/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import gql from 'graphql-tag';
import * as React from 'react';
import styled from 'react-emotion';
import { GridStats } from '@csegames/camelot-unchained/lib/components';
import { withGraphQL, GraphQLInjectedProps } from '@csegames/camelot-unchained/lib/graphql/react';
import { showTooltip, hideTooltip } from 'actions/tooltips';

import DescriptionItem from '../DescriptionItem';
import StatListContainer from '../StatListContainer';
import StatListItem from '../StatListItem';
import DataUnavailable from '../DataUnavailable';
import { GeneralStatsGQL, CharacterStatField } from 'gql/interfaces';

export interface GeneralProps extends GraphQLInjectedProps<GeneralStatsGQL.Query> {

}

const Tooltip = styled('div')`
  max-width: 300px;
  min-width: 200px;
  padding: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
`;

export interface GeneralProps extends GraphQLInjectedProps<GeneralStatsGQL.Query> {
  searchValue: string;
}

class General extends React.PureComponent<GeneralProps> {
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
          renderContent={() => (
            <GridStats
              statArray={myCharacter.stats}
              searchValue={this.props.searchValue}
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
                  item={item}
                  statName={item.stat}
                  statValue={item.value}
                  searchValue={this.props.searchValue}
                  onMouseOver={this.onMouseOver}
                  onMouseLeave={this.onMouseLeave}
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

  private onMouseOver = (event: React.MouseEvent<HTMLDivElement>, item: CharacterStatField) => {
    if (item.description) {
      showTooltip({
        content: <Tooltip>{item.description}</Tooltip>,
        event,
      });
    }
  }

  private onMouseLeave = (e: React.MouseEvent<HTMLDivElement>, item: CharacterStatField) => {
    if (item.description) {
      hideTooltip();
    }
  }
}

const GeneralWithQL = withGraphQL<GeneralProps>({
  query: gql`
    query GeneralStatsGQL {
      myCharacter {
        maxHealth
        maxBlood
        maxStamina
        maxPanic
        stats {
          stat
          value
          description
        }
      }
    }
  `,
})(General);

export default GeneralWithQL;
