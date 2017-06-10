/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-06-10 22:11:42
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-10 23:20:16
 */

import * as React from 'react';
import { connect } from 'react-redux';
import Select from '../Select';
import Label from '../Label';
import { GlobalState } from '../../services/session/reducer';
import { InventoryItem } from '../../services/types';

import { StyleSheet, css, merge, outputItems, OutputItemsStyles } from '../../styles';

export interface OutputItemsReduxProps {
  dispatch?: (action: any) => void;
  endin?: number;
  outputItems?: InventoryItem[];
  style?: Partial<OutputItemsStyles>;
}

export interface OutputItemsProps extends OutputItemsReduxProps {}
interface OutputItemsState {}

const select = (state: GlobalState, props: OutputItemsProps) : OutputItemsReduxProps => {
  return {
    endin: state.job.endin,
    outputItems: state.job.outputItems,
  };
};

const OutputItems = (props: OutputItemsProps) => {
  if (!props.outputItems || !props.outputItems.length) return null;
  const ss = StyleSheet.create(merge({}, outputItems, props.style));
  return (
    <div className={'output-items ' + css(ss.container)}>
      <div className={'output-title ' + css(ss.title)}>
        <span>Output Info:-</span>
        <span className={css(ss.craftingTime)}>Crafting Time: {props.endin} seconds</span>
      </div>
      {
        props.outputItems.map((item: InventoryItem) => {
          return (
            <div key={item.id} className={'output-item ' + css(ss.item)}>
              <img className={css(ss.icon)} src={item.static.icon}/>
              <span className={css(ss.qty)}>{item.stats.unitCount}</span>
              <span className={css(ss.times)}>x</span>
              <span className={css(ss.name)}>{item.name} @ {(item.stats.quality * 100) | 0}%</span>
            </div>
          );
        })
      }
    </div>
  );
};

export default connect(select)(OutputItems);
