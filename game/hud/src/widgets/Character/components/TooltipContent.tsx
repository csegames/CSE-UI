/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-07-05 15:22:16
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-21 17:45:44
 */

import * as React from 'react';
import * as _ from 'lodash';

import { StyleDeclaration, StyleSheet, css } from 'aphrodite';

import TooltipArmorInfo from './TooltipArmorInfo';
import { prettifyText } from '../lib/utils';
import { InventoryItemFragment } from '../../../gqlInterfaces';

export const defaultTooltipStyle = {
  tooltip: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    maxWidth: '450px',
    maxHeight: '750px',
  },
  tooltipFixed: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    width: '450px',
    maxWidth: '450px',
    maxHeight: '750px',
  },
};

export interface TooltipContentStyle extends StyleDeclaration {
  tooltipContent: React.CSSProperties;
  loadingContainer: React.CSSProperties;
  slotNameText: React.CSSProperties;
  primaryInfo: React.CSSProperties;
  weaponInfo: React.CSSProperties;
  statNumber: React.CSSProperties;
  regularText: React.CSSProperties;
  instructionText: React.CSSProperties;
  itemTitle: React.CSSProperties;
}

export const defaultTooltipContentStyle: TooltipContentStyle = {
  tooltipContent: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '400px',
    maxHeight: '750px',
    overflow: 'hidden',
  },

  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '400px',
    maxHeight: '750px',
    overflow: 'hidden',
  },

  primaryInfo: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    maxHeight: '50%',
    maxWidth: '100%',
  },

  weaponInfo: {
    columnCount: 2,
    webkitColumnCount: 2,
    maxHeight: '50%',
    maxWidth: '100%',
  },

  slotNameText: {
    fontSize: '14px',
    color: 'gray',
    margin: 0,
    padding: 0,
  },

  statNumber: {
    display: 'inline',
    color: '#08d922',
    fontSize: '14px',
    margin: 0,
    padding: 0,
  },

  regularText: {
    display: 'inline',
    fontSize: '14px',
    color: 'white',
    margin: 0,
    padding: 0,
  },

  instructionText: {
    display: 'inline',
    fontSize: '14px',
    color: 'yellow',
    marginTop: '10px',
    marginBottom: 0,
    padding: 0,
  },

  itemTitle: {
    fontSize: '22px',
    color: 'orange',
    margin: 0,
    padding: 0,
  },
};

export interface TooltipContentProps {
  item: InventoryItemFragment;
  instructions?: string;
  styles?: Partial<TooltipContentStyle>;
  slotName?: string;
  gearSlots?: any;
  shouldOnlyShowPrimaryInfo?: boolean;
}

export interface TooltipContentState {
  item: InventoryItemFragment;
}

class TooltipContent extends React.Component<TooltipContentProps, TooltipContentState> {
  constructor(props: TooltipContentProps) {
    super(props);
    this.state = {
      item: this.props.item,
    };
  }

  public render() {
    const style = StyleSheet.create(defaultTooltipContentStyle);
    const customStyle = StyleSheet.create(this.props.styles || {});

    const { slotName, instructions, gearSlots, shouldOnlyShowPrimaryInfo } = this.props;

    const item = this.state.item;
    const itemInfo = item && item.staticDefinition && item.staticDefinition;
    const stats = item && item.stats && item.stats;

    return (
      <div className={css(style.tooltipContent, customStyle.tooltipContent)}>
        <div className={css(style.primaryInfo, customStyle.primaryInfo)}>
          <p className={css(style.itemTitle, customStyle.itemTitle)}>{itemInfo.name}</p>
          <p className={css(style.regularText, customStyle.regularText)}>{itemInfo.description}</p>
          <p className={css(style.regularText, customStyle.regularText)}>{itemInfo.itemType}</p>
          {!shouldOnlyShowPrimaryInfo && !slotName && itemInfo.gearSlotSets &&
            <p id='item-slot-name' className={css(style.slotNameText, customStyle.slotNameText)}>
              {itemInfo.gearSlotSets.map((gearSlots: any) => {
                Object.keys(gearSlots).map((slot) => {
                  const slotName = gearSlots[slot].id;
                  if (itemInfo.gearSlotSets.indexOf(slotName) !== itemInfo.gearSlotSets.length - 1) {
                    return `${prettifyText(slotName)}, `;
                  }
                  return prettifyText(slotName);
                });
              })}
            </p>
          }
          {!shouldOnlyShowPrimaryInfo && slotName &&
            <p id='item-slot-name' className={css(style.slotNameText, customStyle.slotNameText)}>
              {prettifyText(slotName)}
            </p>
          }
          <p className={css(style.regularText, customStyle.regularText)}>Resource ID: {item.id}</p>
          {!shouldOnlyShowPrimaryInfo && stats && Object.keys(stats.item).map((statType: string, i: number) => {
            if (!_.isObject(stats.item[statType]) && !_.includes(statType, 'typename')) {
              return stats.item[statType] > 0 && (
                <p key={i} id={statType} className={css(style.regularText, customStyle.regularText)}>
                  {prettifyText(statType)}: {stats.item[statType]}
                </p>
              );
            }
          })}
        </div>
        {!shouldOnlyShowPrimaryInfo && stats && stats.armor &&
          <TooltipArmorInfo
            item={item as any}
            slotName={slotName}
            gearSlots={gearSlots}
          />
        }
        {!shouldOnlyShowPrimaryInfo && stats && stats.weapon &&
          <div className={css(style.weaponInfo, customStyle.weaponInfo)}>
            {Object.keys(stats['weapon']).sort((a, b) => a.localeCompare(b)).map((stat: string, i: number) => {
              if (stats['weapon'][stat] > 0) {
                return (
                  <div key={i} id={stat}>
                    <p className={css(style.statNumber, customStyle.statNumber)}>{stats['weapon'][stat]} </p>
                    <p className={css(style.regularText, customStyle.regularText)}>{prettifyText(stat)}</p>
                  </div>
                );
              }
            })}
          </div>
        }
        {!shouldOnlyShowPrimaryInfo && item.staticDefinition.gearSlotSets.length > 0 && !slotName &&
            <div>
              <p className={css(style.slotNameText, customStyle.slotNameText)}>Can equip to: </p>
              {item.staticDefinition.gearSlotSets.map((gearSlotSet, index) => (
                <div key={index}>
                  <p className={css(style.slotNameText, customStyle.slotNameText)}>
                    {gearSlotSet.gearSlots.map((slot, i) =>
                      i < gearSlotSet.gearSlots.length - 1 ? `${prettifyText(slot.id)}, ` : prettifyText(slot.id))}
                  </p>
                  {item.staticDefinition.gearSlotSets.length - 1 > index &&
                    <p className={css(style.slotNameText, customStyle.slotNameText)}>OR</p>}
                </div>
              ))}
            </div>
          }
        {instructions && <p className={css(style.instructionText, customStyle.instructionText)}>{instructions}</p>}
      </div>
    );
  }
}

export default TooltipContent;
