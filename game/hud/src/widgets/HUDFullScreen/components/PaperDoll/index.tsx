/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { bodyParts, client, events } from '@csegames/camelot-unchained';
import { withGraphQL, GraphQLInjectedProps } from '@csegames/camelot-unchained/lib/graphql/react';
import { SecureTradeState } from '@csegames/camelot-unchained/lib/graphql/schema';

import BodyPartHealth, { MaxHealthPartsInfo } from '../ItemShared/BodyPartHealth';
import CharacterAndOrderName from './components/CharacterAndOrderName';
import EquipmentSlots from './components/EquipmentSlots';
import queries from '../../../../gqlDocuments';
import { paperDollIcons } from '../../lib/constants';
import { InventoryItemFragment, EquippedItemFragment } from '../../../../gqlInterfaces';

const Container = styled('div')`
  position: relative;
  display: flex;
  align-items: stretch;
  width: 100%;
  height: 100%;
`;

const PaperdollContainer = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
`;

const BackgroundImage = styled('img')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const CharacterInfoContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0 0 auto;
`;

const ManIcon = styled('img')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: auto;
  height: 650px;
`;

export interface EquippedItemsMap {
  [slotName: string]: any;
}

export interface PaperDollProps extends GraphQLInjectedProps<any> {
  visibleComponent: string;
  inventoryItems: InventoryItemFragment[];
  equippedItems: EquippedItemFragment[];
  onEquippedItemsChange: (equippedItems: EquippedItemFragment[]) => void;
  myTradeState: SecureTradeState;
}

export interface PaperDollState {
  maxHealthParts: MaxHealthPartsInfo;
}

class PaperDoll extends React.Component<PaperDollProps, PaperDollState> {
  private refetchListener: any;
  constructor(props: PaperDollProps) {
    super(props);
    this.state = {
      maxHealthParts: {},
    };
  }
  public render() {
    const myOrder = this.props.graphql.data && this.props.graphql.data.myOrder;
    const myCharacter = this.props.graphql.data && this.props.graphql.data.myCharacter;

    return (
      <Container>
        <BackgroundImage src={'images/paperdollbg.png'} />
        <PaperdollContainer>
          <ManIcon
            src={myCharacter && paperDollIcons[`${myCharacter.gender}${myCharacter.race}`]}
          />
          <CharacterInfoContainer>
            <CharacterAndOrderName
              characterName={myCharacter && myCharacter.name}
              orderName={myOrder ? myOrder.name : ''}
            />
            <BodyPartHealth maxHealthParts={this.state.maxHealthParts} />
          </CharacterInfoContainer>
          <EquipmentSlots
            inventoryItems={this.props.inventoryItems}
            equippedItems={this.props.equippedItems}
            onEquippedItemsChange={this.props.onEquippedItemsChange}
            myTradeState={this.props.myTradeState}
          />
        </PaperdollContainer>
      </Container>
    );
  }

  public componentDidMount() {
    this.initializeMaxHealthParts();
    this.refetchListener = events.on('refetch-character-info', this.refetch);
  }

  public componentWillReceiveProps(nextProps: PaperDollProps) {
    const graphqlData = this.props.graphql && this.props.graphql.data;
    const nextGraphqlData = nextProps.graphql && nextProps.graphql.data;
    if (nextGraphqlData && !_.isEqual(nextGraphqlData.myEquippedItems, graphqlData && graphqlData.myEquippedItems)) {
      this.props.onEquippedItemsChange(nextGraphqlData.myEquippedItems.items);
    }
  }

  public componentWillUnmount() {
    events.off(this.refetchListener);
  }

  private refetch = () => {
    if (this.props.graphql) {
      this.props.graphql.refetch();
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

const PaperDollWithQL = withGraphQL<PaperDollProps>(
  { query: queries.PaperDollContainer },
)(PaperDoll);

export default PaperDollWithQL as any;
