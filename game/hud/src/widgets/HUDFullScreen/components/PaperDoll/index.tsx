/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import gql from 'graphql-tag';
import * as React from 'react';
import styled from 'react-emotion';
import { bodyParts, client, events } from '@csegames/camelot-unchained';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';

import BodyPartHealth, { MaxHealthPartsInfo } from '../ItemShared/BodyPartHealth';
import CharacterAndOrderName from './components/CharacterAndOrderName';
import EquipmentSlots from './components/EquipmentSlots';
import { getPaperDollBG } from '../../lib/utils';
import { EquippedItem, PaperDollContainerGQL } from 'gql/interfaces';
import { EquippedItemFragment } from 'gql/fragments/EquippedItemFragment';

const paperDollContainerQuery = gql`
  query PaperDollContainerGQL {
    myEquippedItems {
      items {
        ...EquippedItem
      }
    }
  }
  ${EquippedItemFragment}
`;

const Container = styled('div')`
  position: relative;
  display: flex;
  align-items: stretch;
  width: 100%;
  height: 100%;
  background: url(${(props: { backgroundImg: string }) => props.backgroundImg}) no-repeat;
  background-size: cover;
  &:before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 65%;
    background: url(images/paperdoll/bg/bg-veil.png) no-repeat;
    background-size: cover;
  }
`;

const NameBackground = styled('div')`
  position: absolute;
  top: -23px;
  left: 0;
  height: 167px;
  width: 400px;
  background: url(images/paperdoll/name-bg-splash.png) no-repeat;
  background-size: contain;
`;

const PaperdollContainer = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
`;

const CharacterInfoContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  margin-top: 20px;
`;

export interface EquippedItemsMap {
  [slotName: string]: any;
}

export interface PaperDollProps {
  onEquippedItemsChange: (equippedItems: EquippedItem.Fragment[]) => void;
}

export interface PaperDollState {
  maxHealthParts: MaxHealthPartsInfo;
}

class PaperDoll extends React.Component<PaperDollProps, PaperDollState> {
  private refetchListener: number;
  private paperdollBG: string;
  private graphql: GraphQLResult<PaperDollContainerGQL.Query>;
  constructor(props: PaperDollProps) {
    super(props);
    this.state = {
      maxHealthParts: {},
    };

    this.paperdollBG = getPaperDollBG(client.playerState.faction);
  }
  public render() {
    return (
      <GraphQL query={{ query: paperDollContainerQuery }} onQueryResult={this.handleQueryResult}>
        {(graphql: GraphQLResult<PaperDollContainerGQL.Query>) => {
          this.graphql = graphql;
          return (
            <Container backgroundImg={this.paperdollBG}>
              <NameBackground />
              <PaperdollContainer>
                <CharacterInfoContainer>
                  <CharacterAndOrderName characterName={client.playerState.name} />
                  <BodyPartHealth maxHealthParts={this.state.maxHealthParts} />
                </CharacterInfoContainer>
                <EquipmentSlots onEquippedItemsChange={this.props.onEquippedItemsChange} />
              </PaperdollContainer>
            </Container>
          );
        }}
      </GraphQL>
    );
  }

  public componentDidMount() {
    this.initializeMaxHealthParts();
    this.refetchListener = events.on('refetch-character-info', this.refetch);
  }

  public componentWillUnmount() {
    events.off(this.refetchListener);
  }

  private handleQueryResult = (graphql: GraphQLResult<PaperDollContainerGQL.Query>) => {
    if (graphql.loading || !graphql.data || !graphql.data.myEquippedItems) return graphql;

    this.props.onEquippedItemsChange(graphql.data.myEquippedItems.items);
    return graphql;
  }

  private refetch = () => {
    if (this.graphql) {
      this.graphql.refetch();
    }
  }

  private initializeMaxHealthParts = () => {
    const maxHealthParts = {};
    client.playerState.health.forEach((part, i) => {
      maxHealthParts[bodyParts[i]] = part.max;
    });

    this.setState({ maxHealthParts });
  }
}

export default PaperDoll;
