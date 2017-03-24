/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-03-23 15:27:25
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-11 19:13:44
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import { events } from 'camelot-unchained';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import PaperDoll from '../PaperDoll';
import TabPanel from '../TabPanel';
import { ItemInfo } from '../../services/types/inventoryTypes';
import {
  onEquipItem,
  onFocusPotentialCharacterSlots,
  onDefocusPotentialCharacterSlots,
  CharacterSheetState,
} from '../../services/session/character';
import { TabPanelState } from '../../services/session/tabpanel';

// tslint:disable-next-line
const dragula = require('react-dragula');

export interface CharacterMainStyle extends StyleDeclaration {
  container: React.CSSProperties;
}

export const defaultCharacterMainStyle: CharacterMainStyle = {
  container: {
    position: 'fixed',
    left: '0',
    top: '0',
    width: '100%',
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'hidden',
    backgroundColor: '#333',
    display: 'flex',
    alignItems: 'stretch',
    '-webkit-userselect': 'none',
  },
};

export interface CharacterMainProps {
  styles?: Partial<CharacterMainStyle>;
  characterSheetState: CharacterSheetState;
  tabPanelState: TabPanelState;
  dispatch?: any;

}

export interface CharacterMainState {
  initial: boolean;
  refs: {
    inventory: any;
    weapon: any;
    skull: any;
    face: any;
    neck: any;
    chest: any;
    back: any;
    waist: any;
    forearmLeft: any;
    forearmRight: any;
    shoulderLeft: any;
    shoulderRight: any;
    handLeft: any;
    handRight: any;
    shins: any;
    thighs: any;
    feet: any;
  };
}

export class CharacterMain extends React.Component<CharacterMainProps, CharacterMainState> {

  private ordersCopy: any;

  constructor(props: CharacterMainProps) {
    super(props);
    this.state = {
      initial: true,
      refs: {} as any,
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultCharacterMainStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    const { refs } = this.state;
    const { characterSheetState, tabPanelState, dispatch } = this.props;
    
    return (
      <div className={css(ss.container, custom.container)}>
        <PaperDoll
          characterSheetState={characterSheetState}
          dispatch={dispatch}
        />
        <TabPanel
          dispatch={dispatch}
          tabPanelState={tabPanelState}
          characterSheetState={characterSheetState}
          inventoryRef={(ref: any) => this.updateRef(ref, 'inventory')}
          styles={{
            tabs: {
              padding: '10px',
              cursor: 'pointer',
            },
          }} />
      </div>
    );
  }

  private componentDidUpdate(nextProps: CharacterMainProps, nextState: CharacterMainState) {
    // // initialize drag n drop
    // if (this.state.initial && !_.isEmpty(this.state.refs) && this.state.refs.inventory) {
    //     const {
    //       inventory,
    //       weapon,
    //       skull,
    //       face,
    //       neck,
    //       chest,
    //       back,
    //       waist,
    //       forearmLeft,
    //       forearmRight,
    //       shoulderLeft,
    //       shoulderRight,
    //       handLeft,
    //       handRight,
    //       shins,
    //       thighs,
    //       feet,
    //     } = this.state.refs;

    //     const drake = dragula([inventory, weapon, skull, face, neck, chest, back, waist, forearmLeft, forearmRight,
    //       shoulderLeft, shoulderRight, handLeft, handRight, shins, thighs, feet], {
    //       invalid: (el: Element, handle: Element) => {
    //         if (el && this.getItemFromDom(el)) {
    //           return false;
    //         }
    //         return true;
    //       },
    //     }).on('drop', (el: Element, target: Element, source: Element, sibling: Element) => {

    //       const inventoryItem = this.getItemFromDom(el);
    //       const equippedItem = this.getEquippedItemFromDom(sibling);
    //       if (this.canEquip(inventoryItem, equippedItem)) {
    //         drake.cancel(true);
    //         this.props.dispatch(onEquipItem({ item: inventoryItem }));
            
    //       } else {
    //         drake.cancel(true);
    //       }

    //     }).on('over', (el: Element, container: Element) => {
          
    //     });
        
    //     this.setState({ initial: false });
    // }
  }

  private canEquip = (item: ItemInfo, characterSlot: ItemInfo) => {
    if (item && characterSlot && item.gearSlot && characterSlot.gearSlot) {
      let canEquip = false;
      item.gearSlot.forEach((itemSlot: string) => {
        characterSlot.gearSlot.forEach((slot: string) => {
          if (itemSlot === slot) {
            canEquip = true;
          }
        });
      });
      return canEquip;
    }
    return false;
  }

  private getItemFromDom = (el: Element): ItemInfo => {
    const { inventoryItems } = this.props.characterSheetState;
    let inventoryItem;
    const divs = el.getElementsByTagName('div');

    Object.keys(inventoryItems).forEach((itemType: string) => {
      if (inventoryItems[itemType][el.id]) {
        inventoryItem = inventoryItems[itemType][el.id];
      } else {
        for (let i = 0; i < divs.length; i++) {
          const item = inventoryItems[itemType][divs[i].id];
          if (item) {
            inventoryItem = item;
          }
        }
      }
    });
    
    return inventoryItem;
  }

  private getEquippedItemFromDom = (el: Element): ItemInfo => {
    const { equippedItems } = this.props.characterSheetState;
    let equippedItem;
    const divs = el.getElementsByTagName('div');

    Object.keys(equippedItems).forEach((slotType: string) => {
      if (equippedItems[slotType].id === el.id) {
        equippedItem = equippedItems[slotType];
      } else {
        for (let i = 0; i < divs.length; i++) {
          const item = equippedItems[slotType];
          if (item.id === divs[i].id) {
            equippedItem = item;
          }
        }
      }
    });
    return equippedItem;
  }

  private updateRef = (ref: any, refType: string) => {
    const refs = this.state.refs;
    if (!refs[refType] && ref) {
      refs[refType] = ref;
      this.setState({ refs });
    }
  }
}

export default CharacterMain;
