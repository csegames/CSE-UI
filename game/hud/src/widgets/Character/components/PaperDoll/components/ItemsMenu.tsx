/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-06-08 11:00:27
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-19 17:24:55
 */

import * as React from 'react';
import * as _ from 'lodash';

import { StyleDeclaration, StyleSheet, css } from 'aphrodite';

import { InventoryState } from '../../../services/session/inventoryState';
// import ItemsMenuBox from './ItemsMenuBox';
import { ql } from 'camelot-unchained';

export interface ItemsMenuStyles extends StyleDeclaration {
  itemsMenu: React.CSSProperties;
  armorValidItemsWrapper: React.CSSProperties;
  weaponValidItemsWrapper: React.CSSProperties;
  armorSlotContainer: React.CSSProperties;
  weaponSlotContainer: React.CSSProperties;
  miniValidItemsContainer: React.CSSProperties;
  rightMiniValidItemsContainer: React.CSSProperties;
  miniValidItems: React.CSSProperties;
  validItemsLengthText: React.CSSProperties;
  childContainer: React.CSSProperties;
}

const containerDimensions = {
  width: 305,
  height: 215,
};

const defaultItemsMenuStyle: ItemsMenuStyles = {
  itemsMenu: {
    webkitUserSelect: 'none',
    userSelect: 'none',
  },
  armorValidItemsWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  weaponValidItemsWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  armorSlotContainer: {
    display: 'flex',
  },
  weaponSlotContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  miniValidItemsContainer: {
    display: 'flex',
    flex: '1 1 auto',
    flexWrap: 'wrap',
    width: '50px',
    maxHeight: '25px',
    minHeight: '25px',
  },
  rightMiniValidItemsContainer: {
    display: 'flex',
    flex: '1 1 auto',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    width: '50px',
    maxHeight: '25px',
    minHeight: '25px',
  },
  miniValidItems: {
    width: '10px',
    height: '10px',
    backgroundColor: 'rgba(73, 86, 94, 0.9)',
    margin: '0 1px 1px 1px',
  },
  validItemsLengthText: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'rgba(73, 86, 94, 1)',
    margin: '0 2px',
    padding: 0,
  },
  childContainer: {
    width: '72px',
    height: '72px',
  },
};

export interface ItemsMenuProps {
  styles?: Partial<ItemsMenuStyles>;
  inventoryState: InventoryState;
  visible: boolean;
  slotName: string;
  openingSide: string;
  onMouseEnter: (e: any) => void;
  onMouseLeave: (e: any) => void;
  equippedItem: ql.schema.EquippedItem;
}

export interface ItemsMenuState {
  top: number;
  left: number;
  validItems: Partial<ql.schema.Item>[];
}

class ItemsMenu extends React.Component<ItemsMenuProps, ItemsMenuState> {

  private ss: ItemsMenuStyles;

  constructor(props: ItemsMenuProps) {
    super(props);
    this.state = {
      top: -99999,
      left: -99999,
      validItems: [],
    };
  }

  public render() {
    const ss = this.ss = StyleSheet.create({...defaultItemsMenuStyle, ...this.props.styles});
    
    const { onMouseEnter, onMouseLeave } = this.props;
    // const { top, left, validItems } = this.state;

    return (
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={css(ss.itemsMenu)}>
        {this.renderItemSlotContainer()}
        {/* <ItemsMenuBox
          top={top}
          left={left}
          visible={visible}
          slotName={slotName}
          validItems={validItems}
          equippedItem={equippedItem}
        /> */}
      </div>
    );
  }

  public componentDidMount() {
    window.addEventListener('resize', this.setWindowPosition);
  }

  public componentWillReceiveProps(nextProps: ItemsMenuProps) {
    this.initializeValidItems([]);
  }

  public shouldComponentUpdate(nextProps: ItemsMenuProps, nextState: ItemsMenuState) {
    return !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state);
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.setWindowPosition);
  }

  private initializeValidItems = (itemSlots = this.props.inventoryState.itemSlots) => {
    const { slotName } = this.props;
    const validItems: Partial<ql.schema.Item>[] = [];
    if (itemSlots) {
      itemSlots.forEach((inventoryItem) => {
        const itemInfo = inventoryItem.item && inventoryItem.item.staticDefinition;
        if (itemInfo && itemInfo.gearSlotSets) {
          itemInfo.gearSlotSets.forEach((gearSlotSet) => {
            gearSlotSet.gearSlots.forEach((gearSlot) => {
              if (gearSlot.id === slotName) {
                validItems.push(inventoryItem.item);
              }
            });
          });
        }
      });

      this.setState({ validItems });
    }
  }

  private renderItemSlotContainer = () => {
    const ss = this.ss;
    const { slotName, openingSide } = this.props;
    const { validItems } = this.state;

    if (_.includes(openingSide, 'weapon')) {
      return (
        <div className={css(ss.weaponSlotContainer)}>
          <div className={css(ss.weaponValidItemsWrapper)}>
            <div className={css(ss.miniValidItemsContainer)} style={{ marginBottom: '2px' }}>
              {validItems.map((validItem, i) => {
                if (i < 8 && validItem !== null) {
                  return <div key={i} className={css(ss.miniValidItems)} />;
                }
              })}
            </div>
            {validItems.length > 8 &&
              <p className={css(ss.validItemsLengthText)}>
                {validItems.length}
              </p>
            }
          </div>
          <div id={slotName} className={css(ss.childContainer)} onClick={this.setWindowPosition}>
            {this.props.children}
          </div>
        </div>
      );
    }

    if (_.includes(openingSide, 'armor')) {
      if (openingSide === 'armor-rt' || openingSide === 'armor-rb') {
        return (
          <div className={css(ss.armorSlotContainer)}>
            <div id={slotName} className={css(ss.childContainer)} onClick={this.setWindowPosition}>
              {this.props.children}
            </div>
            <div className={css(ss.armorValidItemsWrapper)}>
              <div className={css(ss.miniValidItemsContainer)} style={{ marginLeft: '2px' }}>
                {validItems.map((validItem, i) => {
                  if (i < 8 && validItem !== null) {
                    return <div key={i} className={css(ss.miniValidItems)} />;
                  }
                })}
              </div>
              {validItems.length > 8 &&
                <p className={css(ss.validItemsLengthText)}>
                  {validItems.length}
                </p>
              }
            </div>
          </div>
        );
      } else if (openingSide === 'armor-lt' || openingSide === 'armor-lb') {
        return (
          <div className={css(ss.armorSlotContainer)}>
            <div className={css(ss.armorValidItemsWrapper)}>
              <div className={css(ss.rightMiniValidItemsContainer)} style={{ marginRight: '2px' }}>
                {validItems.map((validItem, i) => {
                  if (i < 8 && validItem !== null) {
                    return <div key={i} className={css(ss.miniValidItems)} />;
                  }
                })}
              </div>
              {validItems.length > 8 &&
                <p className={css(ss.validItemsLengthText)} style={{ alignSelf: 'flex-end' }}>
                  {validItems.length}
                </p>
              }
            </div>
            <div id={slotName} className={css(ss.childContainer)} onClick={this.setWindowPosition}>
              {this.props.children}
            </div>
          </div>
        );
      }
    }
  }

  private setWindowPosition = () => {
    const { slotName, openingSide } = this.props;
    const offsets = document.getElementById(slotName).getBoundingClientRect();
    const { top, left, height, width } = offsets;
    const margin = 15;
    
    switch (openingSide) {
      case 'weapon-tr': {
        this.setState({
          top: top - (containerDimensions.height + margin),
          left,
        });
        break;
      }
      case 'weapon-tl': {
        this.setState({
          top: top - (containerDimensions.height + margin),
          left: left - (containerDimensions.width) + width,
        });
        break;
      }
      case 'armor-rt': {
        this.setState({
          top,
          left: left + width + margin,
        });
        break;
      }
      case 'armor-lt': {
        this.setState({
          top,
          left: left - (containerDimensions.width + margin),
        });
        break;
      }
      case 'armor-rb': {
        this.setState({
          top: top - (containerDimensions.height) + height,
          left: left + width + margin,
        });
        break;
      }
      case 'armor-lb': {
        this.setState({
          top: top - (containerDimensions.height) + height,
          left: left - (containerDimensions.width + margin),
        });
        break;
      }
    }
  }
}

export default ItemsMenu;
