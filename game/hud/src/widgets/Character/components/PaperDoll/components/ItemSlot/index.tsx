/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-03-23 17:42:12
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-12 11:56:24
 */

import * as React from 'react';
import * as _ from 'lodash';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { Tooltip, Flyout, FlyoutContentProps } from 'camelot-unchained';

import { ItemMap, ItemInfo } from '../../../../services/types/inventoryTypes';
import TooltipContent, { defaultTooltipStyle } from '../../../TooltipContent';
import {
  CharacterSheetState,
  onEquipItem,
  onUnequipItem,
  onFocusPotentialCharacterSlots,
  onDefocusPotentialCharacterSlots,
} from '../../../../services/session/character';

export interface ItemSlotStyle extends StyleDeclaration {
  majorContainer: React.CSSProperties;
  minorContainer: React.CSSProperties;
  potentialSlotContainer: React.CSSProperties;
  selected: React.CSSProperties;
  selectItem: React.CSSProperties;
  flyoutHeaderText: React.CSSProperties;
  flyoutNoItemsText: React.CSSProperties;
  flyoutContainer: React.CSSProperties;
  flyoutContentContainer: React.CSSProperties;
}

export const defaultItemSlotStyle: ItemSlotStyle = {
  majorContainer: {
    width: '55px',
    height: '55px',
    border: '2px solid white',
    display: 'flex',
    cursor: 'pointer',
    marginRight: '5px',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },

  minorContainer: {
    width: '45px',
    height: '45px',
    border: '2px solid white',
    display: 'flex',
    cursor: 'pointer',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },

  potentialSlotContainer: {
    border: '2px solid yellow',
  },

  selected: {
    flex: '1 1 auto',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
  },

  selectItem: {
    flex: '1 1 auto',
    cursor: 'pointer',
  },

  flyoutHeaderText: {
    fontSize: '22px',
    color: '#333',
    marginBottom: '10px',
    marginTop: 0,
    padding: 0,
  },

  flyoutNoItemsText: {
    fontSize: '18px',
    color: 'white',
    margin: 0,
    padding: 0,
  },

  flyoutContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    padding: '5px',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },

  flyoutContentContainer: {
    display: 'flex',
    flexDirection: 'row',
  },

  potentialItemSlot: {
    width: '50px',
    height: '50px',
    border: '2px solid white',
    margin: '3px',
    cursor: 'pointer',
  },
};

export interface ItemSlotProps {
  item: ItemInfo;
  styles?: Partial<ItemSlotStyle>;
  characterSheetState: CharacterSheetState;
  slotName: string;
  slotType: 'major' | 'minor';
  hideTooltips?: boolean;
  dispatch?: any;
}

export interface ItemSlotState {
}

export class ItemSlot extends React.Component<ItemSlotProps, ItemSlotState> {
  
  private rotate: any;

  constructor(props: ItemSlotProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultItemSlotStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    const { item, slotType, hideTooltips, slotName, characterSheetState } = this.props;
    const { potentialCharacterSlots } = characterSheetState;

    if (item) {
      const isPotentialGearSlot = _.isEqual(potentialCharacterSlots, item.gearSlot);
      const containerClass = isPotentialGearSlot && slotType === 'major' ?
        css(ss.majorContainer, custom.majorContainer, ss.potentialSlotContainer, custom.potentialSlotContainer) :
        isPotentialGearSlot && slotType === 'minor' ?
        css(ss.minorContainer, custom.minorContainer, ss.potentialSlotContainer, custom.potentialSlotContainer) :
        !isPotentialGearSlot && slotType === 'major' ?
        css(ss.majorContainer, custom.majorContainer) :
        css(ss.minorContainer, custom.minorContainer);

      return (
        <div>
          <Flyout content={props => this.renderFlyoutItems(props)}>
            <Tooltip
              styles={hideTooltips ? {
                tooltip: {
                  display: 'none',
                },
              } : defaultTooltipStyle}
              content={() => <TooltipContent item={item} slotName={slotName} instructions='Double click to unequip'/>}>
                
                  <div
                    id={`${slotType}-container${isPotentialGearSlot ? '-potential-slot' : ''}`}
                    onDoubleClick={this.onUnequipItem}
                    className={containerClass}>
                    {
                      <img
                        id={item.id}
                        src={isPotentialGearSlot ? '../../interface-lib/images/skillbar/active-frame.gif' : ''}
                        className={css(ss.selected, custom.selected)}
                        style={{ backgroundImage: `url(${item.icon})` }}
                        width='100%'
                        height='100%'
                      />
                    }
                  </div>            
            </Tooltip>
          </Flyout>
        </div>
      );
    } else {
      return (
        <div id={'empty-container'}>
          <Flyout content={props => this.renderFlyoutItems(props)}>
            <div className={slotType === 'major' ? css(ss.majorContainer, custom.majorContainer) :
              css(ss.minorContainer, custom.minorContainer)} />
          </Flyout>
        </div>
      );
    }
  }

  private renderFlyoutItems = (flyoutProps: FlyoutContentProps) => {
    const ss = StyleSheet.create(defaultItemSlotStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    const { slotName } = this.props;
    const { validItems } = this.props.characterSheetState;
    
    return (
      <div className={css(ss.flyoutContainer, custom.flyoutContainer)}>
        <p className={css(ss.flyoutHeaderText, custom.flyoutHeaderText)}>{this.prettifySlotName(slotName)}</p>
        <div className={css(ss.flyoutContentContainer, custom.flyoutContentContainer)}>
          {validItems[slotName] && Object.keys(validItems[slotName]).map((itemId: string, i: number) => {
            const item = validItems[slotName][itemId];
            return (
              <Tooltip key={i} styles={defaultTooltipStyle} content={() => <TooltipContent item={item} />}>
                <img
                  src={item.icon}
                  onClick={() => this.onEquipItem(item, flyoutProps)}
                  onMouseOver={() => this.focusCharacterSlots(item)}
                  onMouseLeave={() => this.defocusCharacterSlots(item)}
                  className={css(ss.potentialItemSlot, custom.potentialItemSlot)} />
              </Tooltip>
            );
          })}
          {!validItems[slotName] &&
            <p className={css(ss.flyoutNoItemsText, custom.flyoutNoItemsText)}>
              You do not have any items
            </p>
          }
        </div>
      </div>
    );
  }

  private focusCharacterSlots = (item: ItemInfo) => {
    this.rotate = setTimeout(() => {
      const { characterSheetState, dispatch } = this.props;
      const shouldDispatchFocusSlots = item.stats && !_.isEqual(item.gearSlot, characterSheetState.potentialCharacterSlots);
      if (shouldDispatchFocusSlots) dispatch(onFocusPotentialCharacterSlots({ item }));
    }, 3000);
  }

  private defocusCharacterSlots = (item: ItemInfo) => {
    const { characterSheetState, dispatch } = this.props;
    clearTimeout(this.rotate);
    if (item.stats && characterSheetState.potentialCharacterSlots.length !== 0) dispatch(onDefocusPotentialCharacterSlots());
  }

  private onEquipItem = (item: ItemInfo, flyoutProps: FlyoutContentProps) => {
    this.props.dispatch(onEquipItem({ item }));
    this.defocusCharacterSlots(item);
    flyoutProps.close();
  }

  private onUnequipItem = () => {
    this.props.dispatch(onUnequipItem({
      item: this.props.item,
      slot: this.props.slotName,
    }));
  }

  private selectItem = (id: string) => {
    this.setState({selected: id});
  }

  private prettifySlotName = (slotName: string) => {
    return slotName.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => { return str.toUpperCase(); });
  }
}

export default ItemSlot;
