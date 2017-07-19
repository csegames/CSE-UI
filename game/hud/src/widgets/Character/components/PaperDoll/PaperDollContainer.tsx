/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-03-23 15:49:46
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-19 17:04:14
 */

import * as React from 'react';

import BodyPartHealth, { MaxHealthPartsInfo } from './components/BodyPartHealth';
import { InjectedGraphQLProps, graphql } from 'react-apollo';
import { StyleDeclaration, StyleSheet, css } from 'aphrodite';
import { bodyParts, client, events } from 'camelot-unchained';

import CharacterAndOrderName from './components/CharacterAndOrderName';
import EquipmentSlots from './components/EquipmentSlots';
import LoadingContainer from '../LoadingContainer';
import { PaperDollContainerQuery } from '../../../../gqlInterfaces';
import queries from '../../../../gqlDocuments';

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
    width: '300px',
    height: '650px',
  },
};

export interface EquippedItemsMap {
  [slotName: string]: any;
}

export interface PaperDollProps extends InjectedGraphQLProps<PaperDollContainerQuery> {
  styles?: Partial<PaperDollStyle>;
}

export interface PaperDollState {
  maxHealthParts: MaxHealthPartsInfo;
}

class PaperDoll extends React.Component<PaperDollProps, PaperDollState> {
  // private visible: boolean;
  // private fetchInterval: any;

  constructor(props: PaperDollProps) {
    super(props);
    this.state = {
      maxHealthParts: {},
    };
  }
  public render() {
    const ss = StyleSheet.create({ ...defaultPaperDollStyle, ...this.props.styles });
    const { myEquippedItems, myCharacter, myOrder } = this.props.data;
    
    return (
      <div className={css(ss.paperDoll)}>
        <img src={'images/paperdollbg.png'} className={css(ss.backgroundImg)} />
        {this.props.data.loading && !myEquippedItems ?
          <LoadingContainer /> :
        
          <div className={css(ss.paperdollContainer)}>
            <img src={'images/paperdoll-man.png'} className={css(ss.manIcon)} />
            <div className={css(ss.characterInfoContainer)}>
              <CharacterAndOrderName
                characterName={myCharacter && myCharacter.name}
                orderName={myOrder ? myOrder.name : ''}
              />
              <BodyPartHealth maxHealthParts={this.state.maxHealthParts} />
            </div>
            <EquipmentSlots equippedItems={myEquippedItems as any} />
          </div>
        }
      </div>
    );
  }

  public componentDidMount() {
    this.initializeMaxHealthParts();
    events.on('hudnav--navigate', this.refetchData);
  }

  private refetchData = (name?: string) => {
    if (name === 'inventory' || name === 'equippedgear' || name === 'character') {
      this.props.data.refetch();
      // if (this.visible) {
      //   this.visible = false;
      //   clearInterval(this.fetchInterval);
      // } else {
      //   this.visible = true;
      //   this.fetchInterval = setInterval(() => this.props.data.refetch(), 5000);
      // }
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

const PaperDollWithQL = graphql(queries.PaperDollContainer as any)(PaperDoll);

export default PaperDollWithQL;
