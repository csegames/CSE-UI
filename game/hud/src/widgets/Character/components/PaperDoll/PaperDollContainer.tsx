/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { StyleDeclaration, StyleSheet, css } from 'aphrodite';
import { bodyParts, client, events } from 'camelot-unchained';
import { withGraphQL, GraphQLInjectedProps } from 'camelot-unchained/lib/graphql/react';

import BodyPartHealth, { MaxHealthPartsInfo } from '../BodyPartHealth';
import CharacterAndOrderName from './components/CharacterAndOrderName';
import EquipmentSlots from './components/EquipmentSlots';
import { InventoryItemFragment, EquippedItemFragment } from '../../../../gqlInterfaces';
import queries from '../../../../gqlDocuments';
import { paperDollIcons } from '../../lib/constants';

export interface PaperDollStyle extends StyleDeclaration {
  paperDoll: React.CSSProperties;
  paperdollContainer: React.CSSProperties;
  characterInfoContainer: React.CSSProperties;
  itemSlotContainer: React.CSSProperties;
  backgroundImg: React.CSSProperties;
  manIcon: React.CSSProperties;
}

export const defaultPaperDollStyle: PaperDollStyle = {
  paperDoll: {
    display: 'flex',
    position: 'relative',
    alignItems: 'stretch',
    width: '100%',
    height: '100%',
  },

  paperdollContainer: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    width: '100%',
    height: '100%',
  },

  characterInfoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: '0 0 auto',
  },

  itemSlotContainer: {
    display: 'flex',
    margin: '5px',
    cursor: 'pointer',
  },

  backgroundImg: {
    position: 'absolute',
    pointerEvents: 'none',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 0,
  },

  manIcon: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
    width: 'auto',
    height: '650px',
  },
};

export interface EquippedItemsMap {
  [slotName: string]: any;
}

export interface PaperDollProps extends GraphQLInjectedProps<any> {
  styles?: Partial<PaperDollStyle>;
  visibleComponent: string;
  inventoryItems: InventoryItemFragment[];
  equippedItems: EquippedItemFragment[];
  onEquippedItemsChange: (equippedItems: EquippedItemFragment[]) => void;
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
    const ss = StyleSheet.create({ ...defaultPaperDollStyle, ...this.props.styles });
    const myOrder = this.props.graphql.data && this.props.graphql.data.myOrder;
    const myCharacter = this.props.graphql.data && this.props.graphql.data.myCharacter;

    return this.props.graphql.data ? (
      <div className={css(ss.paperDoll)}>
        <img src={'images/paperdollbg.png'} className={css(ss.backgroundImg)} />
        <div className={css(ss.paperdollContainer)}>
          <img
            className={css(ss.manIcon)}
            src={myCharacter && paperDollIcons[`${myCharacter.gender}${myCharacter.race}`]}
          />
          <div className={css(ss.characterInfoContainer)}>
            <CharacterAndOrderName
              characterName={myCharacter && myCharacter.name}
              orderName={myOrder ? myOrder.name : ''}
            />
            <BodyPartHealth maxHealthParts={this.state.maxHealthParts} />
          </div>
          <EquipmentSlots
            inventoryItems={this.props.inventoryItems}
            equippedItems={this.props.equippedItems}
            onEquippedItemsChange={this.props.onEquippedItemsChange}
          />
        </div>
      </div>
    ) : null;
  }

  public componentDidMount() {
    this.initializeMaxHealthParts();
    this.refetchListener = events.on('refetch-character-info', this.refetch);
  }

  public componentWillReceiveProps(nextProps: PaperDollProps) {
    const graphqlData = this.props.graphql && this.props.graphql.data;
    const nextGraphqlData = nextProps.graphql && nextProps.graphql.data;
    if (!_.isEqual(nextGraphqlData && nextGraphqlData.myEquippedItems, graphqlData && graphqlData.myEquippedItems)) {
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
    const maxHealthParts = this.state.maxHealthParts;
    client.OnCharacterInjuriesChanged((part: number, health: number, maxHealth: number) => {
      maxHealthParts[bodyParts[part]] = maxHealth;
    });
    this.setState({ maxHealthParts });
  }
}

const PaperDollWithQL = withGraphQL<PaperDollProps>(
  { query: queries.PaperDollContainer },
)(PaperDoll);

export default PaperDollWithQL as any;
