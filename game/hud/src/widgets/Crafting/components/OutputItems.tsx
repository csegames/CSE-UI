/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { GlobalState } from '../services/session/reducer';
import { InventoryItem } from '../services/types';
import { craftingTimeToString, qualityToPercent, roundedMass } from '../services/util';
import Icon from './Icon';

import { StyleSheet, css, merge, outputItems, OutputItemsStyles } from '../styles';

export interface OutputItemsReduxProps {
  dispatch?: (action: any) => void;
  totalCraftingTime?: number;
  outputItems?: InventoryItem[];
  style?: Partial<OutputItemsStyles>;
}

export interface OutputItemsProps extends OutputItemsReduxProps {}

const select = (state: GlobalState, props: OutputItemsProps): OutputItemsReduxProps => {
  return {
    totalCraftingTime: state.job.totalCraftingTime,
    outputItems: state.job.outputItems,
  };
};

const OutputItems = (props: OutputItemsProps) => {
  if (!props.outputItems || !props.outputItems.length) return null;
  const ss = StyleSheet.create(merge({}, outputItems, props.style));
  return (
    <div className={css(ss.outputItems)}>
      <div className={css(ss.title)}>
        <span>Output Info:</span>
        <span className={css(ss.craftingTime)}>
          Crafting Time: {craftingTimeToString(props.totalCraftingTime, true)}
        </span>
      </div>
      {
        props.outputItems.map((item: InventoryItem) => {
          return (
            <div key={item.id} className={css(ss.item)}>
              <Icon className={css(ss.icon)} src={item.static.icon}/>
              <span className={css(ss.name)}>{item.name}</span>
              <span className={css(ss.qty)}>{item.stats.unitCount}</span>
              <span className={css(ss.times)}>
                ({Number(roundedMass(item.stats.weight).toFixed(3))}kg)
              </span>
              <span className={css(ss.name)}>
                @ {qualityToPercent(item.stats.quality) | 0}%
              </span>
            </div>
          );
        })
      }
    </div>
  );
};

export default connect(select)(OutputItems);
