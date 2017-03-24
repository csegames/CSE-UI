/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-03-23 15:49:46
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-11 19:22:52
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';

import { ItemMap, ItemInfo } from '../../services/types/inventoryTypes';
import { CharacterSheetState } from '../../services/session/character';
import InnerOuterContainer from './components/InnerOuterContainer';
import ItemSlot from './components/ItemSlot';

export interface PaperDollStyle extends StyleDeclaration {
  container: React.CSSProperties;
  paperdollContainer: React.CSSProperties;
  itemSlotContainer: React.CSSProperties;
  armorSlots: React.CSSProperties;
  stackedArmorSlots: React.CSSProperties;
  stackedSlotsLeft: React.CSSProperties;
  weaponSlots: React.CSSProperties;
}

export const defaultPaperDollStyle: PaperDollStyle = {
  container: {
    display: 'flex',
    position: 'relative',
    flex: '1 1 auto',
    alignItems: 'stretch',
    backgroundColor: '#1A1A1A',
    width: '40%',
  },

  paperdollContainer: {
    flex: '1 1 auto',
    position: 'relative',
    margin: '20px',
    background: 'url(images/paperdoll-bg.png) no-repeat center center',
    backgroundSize: 'contain',
  },

  itemSlotContainer: {
    margin: '5px',
    cursor: 'pointer',
  },

  armorSlots: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  stackedArmorSlots: {
    display: 'flex',
    alignItems: 'center',
  },

  stackedSlotsLeft: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '10px',
  },

  weaponSlots: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    bottom: 0,
    left: 0,
    right: 0,
  },
};

export interface PaperDollProps {
  styles?: Partial<PaperDollStyle>;
  characterSheetState: CharacterSheetState;
  dispatch?: any;

  // weaponSlotRef: any;
  // skullSlotRef: any;
  // faceSlotRef: any;
  // neckSlotRef: any;
  // chestSlotRef: any;
  // backSlotRef: any;
  // waistSlotRef: any;
  // forearmLeftSlotRef: any;
  // forearmRightSlotRef: any;
  // shoulderLeftSlotRef: any;
  // shoulderRightSlotRef: any;
  // handLeftSlotRef: any;
  // handRightSlotRef: any;
  // shinsSlotRef: any;
  // thighsSlotRef: any;
  // feetSlotRef: any;
}

export interface PaperDollState {
  containerHeight: number;
  armorSlotsHeight: number;
}

export class PaperDoll extends React.Component<PaperDollProps, PaperDollState> {
  constructor(props: PaperDollProps) {
    super(props);
    this.state = {
      containerHeight: 0,
      armorSlotsHeight: 0,
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultPaperDollStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    const { equippedItems, validItems } = this.props.characterSheetState;
    
    return (
      <div
        ref='paperDollContainer'
        className={css(ss.container, custom.container)}>
        <div className={css(ss.paperdollContainer, custom.paperdollContainer)}>
          {this.renderArmorSlots(ss, custom)}
          <div className={css(ss.weaponSlots, ss.weaponSlots)}>
            {this.renderWeaponContainer('weapon')}
            {this.renderWeaponContainer('weapon')}
            {this.renderWeaponContainer('weapon')}
            {this.renderWeaponContainer('weapon')}
            {this.renderWeaponContainer('weapon')}
          </div>
        </div>
      </div>
    );
  }

  private componentDidMount() {
    window.addEventListener('resize', this.setContainerHeights);
    setTimeout(() => {
      this.setContainerHeights();
    }, 1);
  }

  private componentWillUnmount() {
    window.removeEventListener('resize', this.setContainerHeights);
  }

  private setContainerHeights = () => {
    const element = ReactDOM.findDOMNode(this.refs.armorSlotsContainer);
    const container = ReactDOM.findDOMNode(this.refs.paperDollContainer);
    if (element && element.clientHeight !== this.state.armorSlotsHeight) {
      this.setState({ armorSlotsHeight: element.clientHeight });
    }
    if (container && container.clientHeight !== this.state.containerHeight) {
      this.setState({ containerHeight: container.clientHeight });
    }
  }

  private renderWeaponContainer = (slotName: string) => {
    const { equippedItems } = this.props.characterSheetState;
    return (
      <ItemSlot
        dispatch={this.props.dispatch}
        characterSheetState={this.props.characterSheetState}
        item={equippedItems[slotName]}
        slotName={slotName}
        slotType='major'
      />
    );
  }
  
  private renderArmorContainer = (outerSlotName: string, innerSlotName: string) => {
    const { characterSheetState, dispatch } = this.props;
    const ss = StyleSheet.create(defaultPaperDollStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    return (
      <div id={outerSlotName + '-armor-container'} className={css(ss.itemSlotContainer, custom.itemSlotContainer)}>
        <InnerOuterContainer
          dispatch={dispatch}
          characterSheetState={characterSheetState}
          outerSlotName={outerSlotName}
          innerSlotName={innerSlotName}
        />
      </div>
    );
  }

  private renderArmorSlots = (ss: PaperDollStyle, custom: Partial<PaperDollStyle>) => {
    const { containerHeight, armorSlotsHeight } = this.state;
    if (containerHeight >= armorSlotsHeight) {
      return (
        <div
          ref='armorSlotsContainer'
          className={css(ss.armorSlots, custom.armorSlots)}>
            {this.renderArmorContainer('skull', 'skullUnder')}
            {this.renderArmorContainer('face', 'faceUnder')}
            {this.renderArmorContainer('neck', 'neckUnder')}
            {this.renderArmorContainer('shoulderLeft', 'shoulderLeftUnder')}
            {this.renderArmorContainer('shoulderRight', 'shoulderRightUnder')}
            {this.renderArmorContainer('forearmLeft', 'forearmLeftUnder')}
            {this.renderArmorContainer('forearmRight', 'forearmRightUnder')}
            {this.renderArmorContainer('handLeft', 'handLeftUnder')}
            {this.renderArmorContainer('handRight', 'handRightUnder')}
            {this.renderArmorContainer('chest', 'chestUnder')}
            {this.renderArmorContainer('back', 'backUnder')}
            {this.renderArmorContainer('waist', 'waistUnder')}
            {this.renderArmorContainer('thighs', 'thighsUnder')}
            {this.renderArmorContainer('shins', 'shinsUnder')}
            {this.renderArmorContainer('feet', 'feetUnder')}
        </div>
      );
    } else {
      return (
        <div className={css(ss.stackedArmorSlots, custom.stackedArmorSlots)}>
          <div className={css(ss.stackedSlotsLeft, custom.stackedSlotsLeft)}>
            {this.renderArmorContainer('skull', 'skullUnder')}
            {this.renderArmorContainer('neck', 'neckUnder')}
            {this.renderArmorContainer('shoulderLeft', 'shoulderLeftUnder')}
            {this.renderArmorContainer('forearmLeft', 'forearmLeftUnder')}
            {this.renderArmorContainer('handLeft', 'handLeftUnder')}
            {this.renderArmorContainer('chest', 'chestUnder')}
            {this.renderArmorContainer('waist', 'waistUnder')}
            {this.renderArmorContainer('shins', 'shinsUnder')}
          </div>
          <div className={css(ss.armorSlots, custom.armorSlots)}>
            {this.renderArmorContainer('face', 'faceUnder')}
            {this.renderArmorContainer('shoulderRight', 'shoulderRightUnder')}
            {this.renderArmorContainer('forearmRight', 'forearmRightUnder')}
            {this.renderArmorContainer('handRight', 'handRightUnder')}
            {this.renderArmorContainer('back', 'backUnder')}
            {this.renderArmorContainer('thighs', 'thighsUnder')}
            {this.renderArmorContainer('feet', 'feetUnder')}
          </div>
        </div>
      );
    }
  }
}

export default PaperDoll;
