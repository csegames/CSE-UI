/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-06-22 16:05:30
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-20 18:28:52
 */

import * as React from 'react';

import {Tooltip, utils, events} from 'camelot-unchained';
import {StyleDeclaration, StyleSheet, css} from 'aphrodite';

import CurrencyValue from './CurrencyValue';
import InventoryRowActionButton from './InventoryRowActionButton';
import {emptyStackHash, colors, footerInfoIcons, rowActionIcons} from '../../../lib/constants';
import eventNames, {DropItemCallback} from '../../../lib/eventNames';

export interface InventoryFooterStyles extends StyleDeclaration {
  InventoryFooter: React.CSSProperties;
  insetDiv: React.CSSProperties;
  infoSection: React.CSSProperties;
  infoIcon: React.CSSProperties;
  loadingContainer: React.CSSProperties;
  goldIcon: React.CSSProperties;
  itemCountIcon: React.CSSProperties;
  weightIcon: React.CSSProperties;
  addRemoveRowButtonContainer: React.CSSProperties;
}

export const defaultInventoryFooterStyles: InventoryFooterStyles = {
  InventoryFooter: {
    display: 'flex',
    flex: '0 0 auto',
    padding: '5px',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.filterBackgroundColor,
    zIndex: 1,
  },

  insetDiv: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'default',
    fontSize: '20px',
    padding: '5px 10px',
    color: '#ACAAA8',
    marginLeft: '5px',
    minWidth: '55px',
    textAlign: 'center',
    boxShadow: 'inset 0 1px 3px 0 rgba(0, 0, 0, 0.7)',
    backgroundColor: utils.darkenColor(colors.filterBackgroundColor, 5),
  },

  infoSection: {
    display: 'flex',
    alignItems: 'center',
  },

  infoIcon: {
    fontSize: '18px',
    lineHeight: '18px',
    marginRight: '5px',
  },

  goldIcon: {
    color: colors.goldIcon,
  },

  itemCountIcon: {
    color: colors.bagIcon,
  },

  weightIcon: {
    color: colors.weightIcon,
  },

  loadingContainer: {
    justifyContent: 'center',
  },

  addRemoveRowButtonContainer: {

  },
};

export interface InventoryFooterProps {
  styles?: Partial<InventoryFooterStyles>;
  onAddRowClick: () => void;
  onRemoveRowClick: () => void;
  onPruneRowsClick: () => void;
  addRowButtonDisabled: boolean;
  removeRowButtonDisabled: boolean;
  pruneRowsButtonDisabled: boolean;

  currency: number;
  itemCount: number;
  totalMass: number;
}

export interface InventoryFooterState {
  currency: number;
  itemCount: number;
  totalMass: number;
}

class InventoryFooter extends React.Component<InventoryFooterProps, InventoryFooterState> {
  private onDropItemListener: EventListener;

  constructor(props: InventoryFooterProps) {
    super(props);
    this.state = {
      currency: 0,
      itemCount: 0,
      totalMass: 0,
    };
  }

  public render() {
    const style = StyleSheet.create(defaultInventoryFooterStyles);
    const customStyle = StyleSheet.create(this.props.styles || {});

    return (
      <div className={css(style.InventoryFooter, customStyle.InventoryFooter)}>
        <div className={css(style.addRemoveRowButtonContainer, customStyle.addRemoveRowButtonContainer)}>
          <InventoryRowActionButton
            tooltipContent={'Add Empty Row'}
            iconClass={rowActionIcons.addRow}
            onClick={this.props.onAddRowClick}
            disabled={this.props.addRowButtonDisabled}
          />
          <InventoryRowActionButton
            tooltipContent={'Remove Empty Row'}
            iconClass={rowActionIcons.removeRow}
            onClick={this.props.onRemoveRowClick}
            disabled={this.props.removeRowButtonDisabled}
          />
          <InventoryRowActionButton
            tooltipContent={'Prune Empty Rows'}
            iconClass={rowActionIcons.pruneRows}
            onClick={this.props.onPruneRowsClick}
            disabled={this.props.pruneRowsButtonDisabled}
          />
        </div>
        <div>
          <Tooltip content={`Currency: ${this.state.currency.toLocaleString()}`}>
            <div className={css(style.insetDiv, customStyle.insetDiv)}>
              <span className={
                `${footerInfoIcons.gold} ${css(style.infoIcon, customStyle.infoIcon, style.goldIcon, customStyle.goldIcon)}`}
              />
              <CurrencyValue value={this.state.currency} />
            </div>
          </Tooltip>

          <Tooltip content={'Item Count'}>
            <div className={css(style.insetDiv, customStyle.insetDiv)}>
              <span className={
                `${footerInfoIcons.itemCount} ${css(
                  style.infoIcon, customStyle.infoIcon,
                  style.itemCountIcon, customStyle.itemCountIcon,
                )}`} />
              {this.state.itemCount.toString()}
            </div>
          </Tooltip>

          <Tooltip content={`Weight: ${this.state.totalMass.toString()}kg`}>
            <div className={css(style.insetDiv, customStyle.insetDiv)}>
              <span className={`${footerInfoIcons.weight} ${css(
                style.infoIcon, customStyle.infoIcon,
                style.weightIcon, customStyle.weightIcon,
              )}`} />
              {`${this.state.totalMass.toFixed(1)}kg`}
            </div>
          </Tooltip>
        </div>
      </div>
    );
  }

  public componentDidMount() {
    this.onDropItemListener = events.on(eventNames.onDropItem, this.onDropItem);
    this.setBottomInfo();
  }

  public componentWillReceiveProps(nextProps: InventoryFooterProps) {
    if (this.props.currency !== nextProps.currency ||
        this.props.itemCount !== nextProps.itemCount ||
        this.props.totalMass !== nextProps.totalMass) {

      this.setBottomInfo();
    }
  }

  public componentWillUnmount() {
    events.off(this.onDropItemListener);
  }

  private setBottomInfo = () => {
    this.setState((state, props) => {
      return {
        currency: props.currency,
        itemCount: props.itemCount,
        totalMass: props.totalMass,
      };
    });
  }

  private onDropItem = (payload: DropItemCallback) => {
    const item = payload.inventoryItem;
    this.setState((state, props) => {
      return {
        ...state,
        totalMass: state.totalMass - item.stats.item.totalMass,
        itemCount: item.staticDefinition.itemType === 'Ammo' || item.stackHash !== emptyStackHash ?
          state.itemCount : state.itemCount - 1,
      };
    });
  }
}

export default InventoryFooter;
