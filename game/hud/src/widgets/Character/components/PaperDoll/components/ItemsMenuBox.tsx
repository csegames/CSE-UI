/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-06-27 17:20:58
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-07-06 14:32:57
 */

import * as React from 'react';
import * as _ from 'lodash';
import { ql, Input, client } from 'camelot-unchained';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';

import PopupMiniInventorySlot from './PopupMiniInventorySlot';
import { displayNames } from '../../../lib/constants';

const containerDimensions = {
  width: 305,
  height: 215,
};

export interface ItemsMenuBoxStyles extends StyleDeclaration {
  itemsMenuContainer: React.CSSProperties;
  itemsMenuHeaderContainer: React.CSSProperties;
  itemsMenuTitleContainer: React.CSSProperties;
  itemsMenuNavContainer: React.CSSProperties;
  slotContainer: React.CSSProperties;
  emptySlot: React.CSSProperties;
  rightNavContainer: React.CSSProperties;
  pageNavButton: React.CSSProperties;
  morePagesHighlight: React.CSSProperties;
  pageNumberText: React.CSSProperties;
  searchInput: React.CSSProperties;
  slotNameText: React.CSSProperties;
}

export const defaultItemsMenuBoxStyle: ItemsMenuBoxStyles = {
  itemsMenuContainer: {
    background: 'linear-gradient(rgba(74, 77, 84, 0.8), rgba(74, 77, 84, 0.4), rgba(74, 77, 84, 0.2))',
    width: `${containerDimensions.width}px`,
    height: `${containerDimensions.height}px`,
    overflow: 'hidden',
    zIndex: 9999,
  },
  itemsMenuHeaderContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  itemsMenuTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '5px',
  },
  itemsMenuNavContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 77, 84, 0.62)',
    padding: '1px 5px',
  },
  slotContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: '5px',
  },
  emptySlot: {
    display: 'flex',
    width: '65px',
    height: '65px',
    backgroundColor: 'rgba(0,0,0,0.6)',
    border: '1px solid #4A4645',
    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.8)',
    marginBottom: '10px',
  },
  rightNavContainer: {
    display: 'flex',
  },
  morePagesHighlight: {
    color: '#E6BD12',
    ':active': {
      textShadow: '1px 1px #000',
    },
  },
  pageNavButton: {
    cursor: 'pointer',
    color: '#BCC1CB',
    fontSize: '14px',
    margin: 0,
    padding: 0,
  },
  pageNumberText: {
    color: '#BCC1CB',
    fontSize: '14px',
    margin: 0,
    padding: 0,
    marginRight: '10px',
  },
  searchInput: {
    height: '20px',
    backgroundColor: 'rgba(179, 183, 192, 0.3)',
    border: '1px solid #B7B8BC',
    color: '#B7B8BC',
    padding: '0 5px',
    '::-webkit-input-placeholder': {
      color: '#B7B8BC',
    },
  },
  slotNameText: {
    fontSize: '18px',
    color: '#BCC1CB',
    margin: 0,
    padding: 0,
  },
};

export interface ItemsMenuBoxProps {
  styles?: Partial<ItemsMenuBoxStyles>;
  top: number;
  left: number;
  visible: boolean;
  slotName: string;
  validItems: Partial<ql.schema.Item>[];
  equippedItem: ql.schema.EquippedItem;
}

export interface ItemsMenuBoxState {
  currentPage: number;
  searchValue: string;
}

class ItemsMenuBox extends React.Component<ItemsMenuBoxProps, ItemsMenuBoxState> {
  private ss: ItemsMenuBoxStyles;

  constructor(props: ItemsMenuBoxProps) {
    super(props);
    this.state = {
      searchValue: '',
      currentPage: 1,
    };
  }
  public render() {
    const ss = this.ss = StyleSheet.create({ ...defaultItemsMenuBoxStyle, ...this.props.styles });
    const { visible, validItems, slotName, top, left } = this.props;
    const { searchValue, currentPage } = this.state;

    const filteredValidItems = validItems.filter((item) => {
      return _.includes(item.staticDefinition.name.toLowerCase(), searchValue.toLowerCase());
    });
    const pageLength = Math.ceil(filteredValidItems.length / 8) || 1;
    return (
      visible && <div
        className={css(ss.itemsMenuContainer)}
        style={{ position: 'fixed', top, left }}>
        <div className={css(ss.itemsMenuHeaderContainer)}>
          <div className={css(ss.itemsMenuTitleContainer)}>
            <p className={css(ss.slotNameText)}>{displayNames[slotName]}</p>
            <Input
              onChange={(e: any) => this.onSearchChange(e, pageLength)}
              placeholder={'Filter'}
              value={searchValue}
              onFocus={() => client.RequestInputOwnership()}
              onBlur={() => client.ReleaseInputOwnership()}
              styles={{ input: defaultItemsMenuBoxStyle.searchInput }}
            />
          </div>
          <div className={css(ss.itemsMenuNavContainer)}>
            <div className={css(ss.pageNavButton, currentPage > 1 && ss.morePagesHighlight)}
              onClick={this.prevPage}>
                {'< Prev'}
            </div>
            <div className={css(ss.rightNavContainer)}>
              <p className={css(ss.pageNumberText)}>
                {currentPage} / {pageLength}
              </p>
              <div className={css(ss.pageNavButton, currentPage < pageLength && ss.morePagesHighlight )}
              onClick={this.nextPage}>
                {'Next >'}
              </div>
            </div>
          </div>
        </div>
        {this.renderValidItems(filteredValidItems)}
      </div>
    );
  }

  private renderValidItems = (validItems: Partial<ql.schema.Item>[]) => {
    const ss = this.ss;
    const { equippedItem } = this.props;
    const { currentPage } = this.state;
    const emptySlots = [];
    let gearSlots: any = [];

    const difference = validItems.length <= 8 ? 8 - validItems.length :
      Math.ceil(validItems.length / 8) * 8 - validItems.length;

    for (let i = 0; i < difference; i++) {
      emptySlots.push(null);
    }
    
    return (
      <div className={css(ss.slotContainer)}>
        {validItems.map((inventoryItem: Partial<ql.schema.Item>, itemIndex: number) => {
          const shouldBelongOnPage = itemIndex + 1 <= (currentPage * 8) && itemIndex + 1 > ((currentPage * 8) - 8);
          if (shouldBelongOnPage) {
            inventoryItem.staticDefinition.gearSlotSets.forEach((gearSlotSet) => {
              _.find(gearSlotSet.gearSlots, (slot) => {
                if (slot.id === this.props.slotName) {
                  gearSlots = gearSlotSet.gearSlots;
                }
              });
            });
            return (
              <PopupMiniInventorySlot
                key={itemIndex}
                item={inventoryItem as any}
                gearSlots={gearSlots}
                equippedItem={equippedItem}
              />
            );
          }
        })}
        {emptySlots.map((emptySlot, i) => {
          return <div key={i} className={css(ss.emptySlot)} />;
        })}
      </div>
    );
  }

  private onSearchChange = (e: any, pageLength: number) => {
    const { currentPage } = this.state;
    if (currentPage !== 1) {
      this.setState({ searchValue: e.target.value, currentPage: 1 });
    } else {
      this.setState({ searchValue: e.target.value });
    }
  }

  private nextPage = () => {
    const { currentPage } = this.state;
    if (currentPage < this.props.validItems.length / 8) {
      this.setState({ currentPage: currentPage + 1 });
    }
  }

  private prevPage = () => {
    const { currentPage } = this.state;
    if (currentPage > 1) {
      this.setState({ currentPage: currentPage - 1 });
    }
  }
}

export default ItemsMenuBox;
