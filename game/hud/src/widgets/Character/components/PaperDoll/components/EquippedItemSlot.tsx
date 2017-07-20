/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-03-23 17:42:12
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-04 18:26:46
 */

import * as React from 'react';
import * as _ from 'lodash';

import TooltipContent, { defaultTooltipStyle } from '../../TooltipContent';

import { ListenerInfo, Tooltip, events, ql } from 'camelot-unchained';
import { StyleDeclaration, StyleSheet, css } from 'aphrodite';
import eventNames, { UnequipItemCallback } from '../../../lib/eventNames';
import { Alignment } from './PopupMiniInventory';
import { defaultSlotIcons } from '../../../lib/constants';

export interface EquippedItemSlotStyle extends StyleDeclaration {
  equippedItemSlot: React.CSSProperties;
  popupMiniInventoryVisible: React.CSSProperties;
  itemContainer: React.CSSProperties;
  highlightSlotContainer: React.CSSProperties;
  highlightSlotOverlay: React.CSSProperties;
  defaultSlotIcon: React.CSSProperties;
  slotOverlay: React.CSSProperties;
}

export const defaultEquippedItemSlotStyle: EquippedItemSlotStyle = {
  equippedItemSlot: {
    width: '70px',
    height: '70px',
    border: '1px solid #AAACB1',
    cursor: 'pointer',
    fontSize: '55px',
    lineHeight: '55px',
    backgroundColor: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
  },

  popupMiniInventoryVisible: {
    border: '1px solid yellow',
  },

  itemContainer: {
    position: 'relative',
  },

  slotOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    ':hover': {
      boxShadow: 'inset 0 0 15px rgba(255,255,255,0.3)',
    },
    ':active': {
      boxShadow: 'inset 0 0 15px rgba(0,0,0,0.4)',
    },
  },

  highlightSlotContainer: {
    border: '1px solid yellow',
  },

  highlightSlotOverlay: {
    boxShadow: 'inset 0 0 15px 5px yellow',
  },

  defaultSlotIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.3,
    width: '100%',
    height: '100%',
  },
};

export interface EquippedItemSlotProps {
  styles?: Partial<EquippedItemSlotStyle>;
  providedEquippedItem: ql.schema.EquippedItem;
  slot: { slotName: string, openingSide: Alignment };
}

export interface EquippedItemSlotState {
  itemMenuVisible: boolean;
  highlightSlot: boolean;
  showTooltip: boolean;
}

export class EquippedItemSlot extends React.Component<EquippedItemSlotProps, EquippedItemSlotState> {

  private onHighlightListener: ListenerInfo;
  private onDehighlightListener: ListenerInfo;

  constructor(props: EquippedItemSlotProps) {
    super(props);
    this.state = {
      itemMenuVisible: false,
      highlightSlot: false,
      showTooltip: false,
    };
  }

  public render() {
    const style = StyleSheet.create(defaultEquippedItemSlotStyle);
    const customStyle = StyleSheet.create(this.props.styles || {});
    const equippedItem = this.props.providedEquippedItem;
    const { highlightSlot, showTooltip } = this.state;
    const { slot } = this.props;
    const slotName = slot.slotName;

    const itemId = equippedItem && equippedItem.item.id;
    const iconUrl = equippedItem &&
      equippedItem.item.staticDefinition.iconUrl || `${defaultSlotIcons[slotName]} \
      ${css(style.defaultSlotIcon, customStyle.defaultSlotIcon)}`;
    const placeholderIcon = 'images/unknown-item.jpg';
    const isRightSlot = _.includes(slotName.toLowerCase(), 'right');
    return (
        <Tooltip show={itemId ? showTooltip : false} styles={defaultTooltipStyle} content={() =>
          <TooltipContent
            item={equippedItem.item}
            slotName={slotName && slotName}
            instructions='Right click to unequip'
          />
        }>
          <div
            style={isRightSlot ? { transform: 'scaleX(-1)', webkitTransform: 'scaleX(-1)' } : {}}
            className={css(style.itemContainer, customStyle.itemContainer)}
            onMouseOver={this.onMouseOverItemSlot}
            onMouseLeave={this.onMouseLeave}
            onContextMenu={this.unequipItem}>
            {equippedItem ?
              <img
                src={iconUrl || placeholderIcon}
                className={css(
                  style.equippedItemSlot,
                  customStyle.equippedItemSlot,
                  this.state.itemMenuVisible && style.highlightSlotContainer,
                  this.state.itemMenuVisible && customStyle.highlightSlotContainer,
                )}
              /> :
                <div className={css(
                  style.equippedItemSlot,
                  customStyle.equippedItemSlot,
                  this.state.itemMenuVisible && style.highlightSlotContainer,
                  this.state.itemMenuVisible && customStyle.highlightSlotContainer,
                )}>
                  <div className={`${iconUrl}`} />
                </div>}
            <div className={css(
              style.slotOverlay,
              customStyle.slotOverlay,
              highlightSlot && style.highlightSlotOverlay,
              highlightSlot && customStyle.highlightSlotOverlay,
            )} />
          </div>
        </Tooltip>
    );
  }

  public componentDidMount() {
    this.onHighlightListener = events.on(eventNames.onHighlightSlots, this.onHighlightSlots);
    this.onDehighlightListener = events.on(eventNames.onDehighlightSlots, this.onDehighlightSlots);
  }

  public componentWillUnmount() {
    events.off(this.onHighlightListener);
    events.off(this.onDehighlightListener);
  }

  private unequipItem = () => {
    // Fires off onUnequipItem event
    const equippedItem = this.props.providedEquippedItem;
    const payload: UnequipItemCallback = equippedItem;
    events.fire(eventNames.onUnequipItem, payload);
  }

  private onHighlightSlots = (gearSlots: ql.schema.GearSlotDefRef[]) => {
    if (_.find(gearSlots, (gearSlot: ql.schema.GearSlotDefRef) => this.props.slot.slotName === gearSlot.id)) {
      this.setState({ highlightSlot: true });
    }
  }

  private onDehighlightSlots = () => {
    if (this.state.highlightSlot) this.setState({ highlightSlot: false });
  }

  private onMouseOverItemSlot = () => {
    if (!this.state.itemMenuVisible) {
      this.setState({ showTooltip: true });
    }
  }

  private onMouseLeave = () => {
    this.setState({ showTooltip: false });
  }
}

export default EquippedItemSlot;
