/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Item } from '@csegames/library/dist/camelotunchained/graphql/schema';
import TooltipSource from '../TooltipSource';
import { refreshItems } from '../items/itemUtils';
import { getInventoryMinEmptyRows } from './inventoryUtils';
import { modifyInventoryEmptyRows, updateInventoryEmptyRows } from '../../redux/inventorySlice';

const Root = 'HUD-InventoryFooter-Root';
const Buttons = 'HUD-InventoryFooter-Buttons';
const Vector = 'HUD-InventoryFooter-Vector';
const Node = 'HUD-InventoryFooter-Node';
const Button = 'HUD-InventoryFooter-Button';
const Icon = 'HUD-InventoryFooter-Icon';

interface ReactProps {
  gridElement?: HTMLElement;
}

interface InjectedProps {
  inventoryItems: Item[];
  itemCount: number | null;
  hudWidth: number;
  hudHeight: number;
  itemsPerRow: number | null;
  emptyRows: number;
  searchValue: string;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AInventoryFooter extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <div className={Root}>
        <div className={Buttons}>
          <TooltipSource
            className={Node}
            tooltipParams={{
              id: 'Inventory-AddRow',
              content: 'Add Empty Row'
            }}
          >
            <svg
              className={`${Button} ${Vector}`}
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 448 512'
              onClick={this.addRow.bind(this)}
            >
              <path
                fill='#998675'
                d='M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z'
              />
            </svg>
          </TooltipSource>
          <TooltipSource
            className={Node}
            tooltipParams={{
              id: 'Inventory-RemoveRow',
              content: 'Remove Empty Row'
            }}
          >
            <svg
              className={`${Button} ${Vector}`}
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 448 512'
              onClick={this.removeRow.bind(this)}
            >
              <path
                fill='#998675'
                d='M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z'
              />
            </svg>
          </TooltipSource>
          <TooltipSource
            className={Node}
            tooltipParams={{
              id: 'Inventory-PruneRows',
              content: 'Prune Empty Rows'
            }}
          >
            <svg
              className={`${Button} ${Vector}`}
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 448 512'
              onClick={this.pruneRows.bind(this)}
            >
              <path
                fill='#998675'
                d='M160 64c0-17.7-14.3-32-32-32s-32 14.3-32 32v64H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32V64zM32 320c-17.7 0-32 14.3-32 32s14.3 32 32 32H96v64c0 17.7 14.3 32 32 32s32-14.3 32-32V352c0-17.7-14.3-32-32-32H32zM352 64c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H352V64zM320 320c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32s32-14.3 32-32V384h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H320z'
              />
            </svg>
          </TooltipSource>
          <TooltipSource
            className={Node}
            tooltipParams={{
              id: 'Inventory-Refresh',
              content: 'Refresh'
            }}
          >
            <svg
              className={`${Button} ${Vector}`}
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 512 512'
              onClick={this.refresh.bind(this)}
            >
              <path
                fill='#998675'
                d='M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H352c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V80c0-17.7-14.3-32-32-32s-32 14.3-32 32v35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V432c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H160c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z'
              />
            </svg>
          </TooltipSource>
        </div>
        <TooltipSource
          className={Node}
          tooltipParams={{
            id: 'Inventory-ItemCount',
            content: `Item Count: ${this.props.itemCount}`
          }}
        >
          <div className={`${Icon} icon-ui-bag`} />
          <span>{this.props.itemCount}</span>
        </TooltipSource>
      </div>
    );
  }

  refresh(): void {
    refreshItems();
  }

  addRow(): void {
    this.props.dispatch(modifyInventoryEmptyRows(1));
  }

  removeRow(): void {
    const minEmptyRows = this.props.gridElement
      ? getInventoryMinEmptyRows(
          this.props.gridElement,
          this.props.inventoryItems,
          this.props.searchValue,
          this.props.itemsPerRow,
          this.props.hudWidth,
          this.props.hudHeight
        )
      : 0;
    if (this.props.emptyRows > minEmptyRows) {
      this.props.dispatch(modifyInventoryEmptyRows(-1));
    }
  }

  pruneRows(): void {
    const minEmptyRows = this.props.gridElement
      ? getInventoryMinEmptyRows(
          this.props.gridElement,
          this.props.inventoryItems,
          this.props.searchValue,
          this.props.itemsPerRow,
          this.props.hudWidth,
          this.props.hudHeight
        )
      : 0;
    this.props.dispatch(updateInventoryEmptyRows(minEmptyRows));
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    inventoryItems: state.inventory.items ?? [],
    itemCount: state.inventory.itemCount,
    hudWidth: state.hud.hudWidth,
    hudHeight: state.hud.hudHeight,
    itemsPerRow: state.inventory.itemsPerRow,
    emptyRows: state.inventory.emptyRows,
    searchValue: state.inventory.searchValue
  };
};

export const InventoryFooter = connect(mapStateToProps)(AInventoryFooter);
