/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-07-05 15:22:16
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-07-06 14:49:13
 */

import * as React from 'react';
import * as _ from 'lodash';

import { InjectedGraphQLProps, graphql } from 'react-apollo';
import { Spinner, client } from 'camelot-unchained';
import { StyleDeclaration, StyleSheet, css } from 'aphrodite';

import { ItemInfoQuery } from '../../../../gqlInterfaces';
import TooltipArmorInfo from '../TooltipArmorInfo';
import { prettifySlotName } from '../../lib/utils';
import queries from '../../../../gqlDocuments';

export const defaultTooltipStyle = {
  tooltip: {
    backgroundColor: 'rgba(0,0,0,0.9)',
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

export interface TooltipContentProps extends InjectedGraphQLProps<ItemInfoQuery> {
  itemId: string;
  instructions?: string;
  styles?: Partial<TooltipContentStyle>;
  slotName?: string;
  gearSlots?: any;
  shouldOnlyShowPrimaryInfo?: boolean;
}

class TooltipContent extends React.Component<TooltipContentProps, {}> {
  public render() {
    const style = StyleSheet.create(defaultTooltipContentStyle);
    const customStyle = StyleSheet.create(this.props.styles || {});

    const { slotName, instructions, data, gearSlots, shouldOnlyShowPrimaryInfo } = this.props;

    const item = data.item;
    const itemInfo = item && item.staticDefinition;
    const stats = item && item.stats;

    return (
      !item ?
      <div className={css(style.loadingContainer, customStyle.loadingContainer)}><Spinner /></div> :
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
                    return `${prettifySlotName(slotName)}, `;
                  }
                  return prettifySlotName(slotName);
                });
              })}
            </p>
          }
          {!shouldOnlyShowPrimaryInfo && slotName &&
            <p id='item-slot-name' className={css(style.slotNameText, customStyle.slotNameText)}>
              {prettifySlotName(slotName)}
            </p>
          }
          <p className={css(style.regularText, customStyle.regularText)}>Resource ID: {item.id}</p>
          {!shouldOnlyShowPrimaryInfo && stats && Object.keys(stats.item).map((statType: string, i: number) => {
            if (!_.isObject(stats.item[statType]) && !_.includes(statType, 'typename')) {
              return (
                <p key={i} id={statType} className={css(style.regularText, customStyle.regularText)}>
                  {prettifySlotName(statType)}: {stats.item[statType]}
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
                    <p className={css(style.regularText, customStyle.regularText)}>{prettifySlotName(stat)}</p>
                  </div>
                );
              }
            })}
          </div>
        }
        {instructions && <p className={css(style.instructionText, customStyle.instructionText)}>{instructions}</p>}
      </div>
    );
  }
}

const TooltipContentWithQL = graphql(queries.ItemInfoQuery as any, {
  options: (props: TooltipContentProps) => ({
    variables: {
      id: props.itemId,
      shard: client.shardID,
    },
  }),
})(TooltipContent);

export default TooltipContentWithQL;
