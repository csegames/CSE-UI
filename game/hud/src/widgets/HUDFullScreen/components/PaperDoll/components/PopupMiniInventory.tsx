/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled, { css } from 'react-emotion';

import { PageController, PageInfo, Input } from '@csegames/camelot-unchained';

import PopupMiniInventorySlot from './PopupMiniInventorySlot';
import { displaySlotNames, colors } from '../../../lib/constants';
import { getItemDefinitionName, requestUIKeydown, releaseUIKeydown } from '../../../lib/utils';
import { InventoryItemFragment } from '../../../../../gqlInterfaces';

const containerDimensions = {
  width: 320,
  height: 225,
};

const MiniInventoryBox = styled('div')`
  position: fixed;
  background: linear-gradient(rgba(74, 77, 84, 0.8), rgba(74, 77, 84, 0.4), rgba(74, 77, 84, 0.2));
  width: ${containerDimensions.width}px;
  height: ${containerDimensions.height}px;
  overflow: hidden;
  z-index: 10;
`;

const HeaderContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  padding: 5px;
`;

const ControllerContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 5px;
  height: 15px;
  background-color: rgba(74, 77, 84, 0.5);
`;

const ItemsContainer = styled('div')`
  padding: 5px;
  height: ${containerDimensions.height - 30}px;
`;

const ItemSpacing = styled('div')`
  display: inline-block;
  margin: 0.5px 2.5px;
`;

const SlotNameText = styled('p')`
  font-size: 18px;
  color: #BCC1CB;
  margin: 0 !important;
  padding: 0;
`;

const PageNumberText = styled('p')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  margin: 0 5px 0 0 !important;
`;

const ControllerButton = styled('div')`
  display: inline-block;
  font-sizE: 15px;
  color: ${colors.goldIcon};
  &:active {
    text-shadow: 2px 2px rgba(0, 0, 0, 0.9);
  }
`;

const DisabledControllerButton = css`
  color: white;
`;


export const defaultPopupMiniInventoryStyle = {
  searchInput: {
    flex: '0 0 auto',
    height: '20px',
    backgroundColor: 'rgba(179, 183, 192, 0.3)',
    border: '1px solid #B7B8BC',
    color: '#B7B8BC',
    padding: '0 5px',
    '::-webkit-input-placeholder': {
      color: '#B7B8BC',
    },
  },
};

export enum Alignment {
  Armor = 1 << 0,
  Weapon = 1 << 1,
  Top = 1 << 2,
  Bottom = 1 << 3,
  Left = 1 << 4,
  Right = 1 << 5,
  TopRight = Alignment.Top | Alignment.Right,
  TopLeft = Alignment.Top | Alignment.Left,
  BottomRight = Alignment.Bottom | Alignment.Right,
  BottomLeft = Alignment.Bottom | Alignment.Left,

  WTopRight = Alignment.TopRight | Alignment.Weapon,
  WTopLeft = Alignment.TopLeft | Alignment.Weapon,
  ATopRight = Alignment.TopRight | Alignment.Armor,
  ATopLeft = Alignment.TopLeft | Alignment.Armor,
  ABottomRight = Alignment.BottomRight | Alignment.Armor,
  ABottomLeft = Alignment.BottomLeft | Alignment.Armor,
}

export interface PopupMiniInventoryProps {
  align: Alignment;
  slotName: string;
  inventoryItems: InventoryItemFragment[];
  visible: boolean;
  onVisibilityChange: (slotName: string) => void;
}

export interface PopupMiniInventoryState {
  miniInventoryItems: InventoryItemFragment[];
  searchValue: string;
  top: number;
  left: number;
}

export class PopupMiniInventory extends React.Component<PopupMiniInventoryProps, PopupMiniInventoryState> {
  private mouseOver: boolean;

  constructor(props: PopupMiniInventoryProps) {
    super(props);
    this.state = {
      miniInventoryItems: [],
      searchValue: '',
      top: 0,
      left: 0,
    };
  }

  public render() {
    const miniInventoryItems = _.filter(this.state.miniInventoryItems, (item) => {
      return _.includes(getItemDefinitionName(item), this.state.searchValue);
    });
    const amountOfPages = Math.ceil(miniInventoryItems.length / 8) + (miniInventoryItems.length % 8 > 0 ? 1 : 0) || 1;
    const arrayOfPages: InventoryItemFragment[][] = [];
    let nextIndex = 0;

    if (amountOfPages > 1) {
      for (let i = 1; i < amountOfPages; i++) {
        const items = miniInventoryItems.slice(nextIndex, nextIndex + 8);
        if (items.length === 8) {
          arrayOfPages.push(items);
          nextIndex += 8;
        } else {
          arrayOfPages.push([...items, ..._.fill(Array(8 - items.length), '' as any)]);
        }
      }
    } else {
      arrayOfPages.push([..._.fill(Array(8), '' as any)]);
    }

    const pages: PageInfo<{active: boolean}>[] = arrayOfPages.map((items, index) => {
      return {
        render: () => (
          <ItemsContainer>
            {items.map((item) => {
              const gearSlots = item && _.find(item.staticDefinition.gearSlotSets, (gearSlotSet): any =>
                _.find(gearSlotSet.gearSlots, gearSlot => gearSlot.id === this.props.slotName)).gearSlots;
              return (
                <ItemSpacing>
                  <PopupMiniInventorySlot item={item} gearSlots={gearSlots as any} />
                </ItemSpacing>
              );
            })}
          </ItemsContainer>
        ),
      };
    });

    return (
      <div>
        <div
          id={this.props.slotName}
          onClick={this.toggleVisibility}
          onMouseOver={() => this.mouseOver = true}
          onMouseLeave={() => this.mouseOver = false}>
          {this.props.children}
        </div>
        {this.props.visible &&
        <MiniInventoryBox
          style={{ top: this.state.top, left: this.state.left }}
          onMouseOver={() => this.mouseOver = true}
          onMouseLeave={() => this.mouseOver = false}>
          <HeaderContainer>
            <SlotNameText>{displaySlotNames[this.props.slotName]}</SlotNameText>
            <Input
              placeholder={'Filter'}
              styles={{
                input: defaultPopupMiniInventoryStyle.searchInput,
              }}
              onClick={() => requestUIKeydown()}
              onBlur={() => releaseUIKeydown()}
              onChange={this.onSearchChange}
              value={this.state.searchValue}
            />
          </HeaderContainer>
          <PageController
            pages={pages}
            renderPageController={(state, props, onNextPageClick, onPrevPageClick) => {
              const moreNext = state.activePageIndex < pages.length - 1;
              const morePrev = state.activePageIndex > 0;
              return (
                <ControllerContainer>
                  <ControllerButton className={!morePrev ? DisabledControllerButton : ''} onClick={onPrevPageClick}>
                    {'< Prev'}
                  </ControllerButton>
                  <PageNumberText>{state.activePageIndex + 1} / {pages.length}</PageNumberText>
                  <ControllerButton className={!moreNext ? DisabledControllerButton : ''} onClick={onNextPageClick}>
                    {'Next >'}
                  </ControllerButton>
                </ControllerContainer>
              );
            }}
          />
        </MiniInventoryBox>
        }
      </div>
    );
  }

  public componentDidMount() {
    this.initializeMiniInventoryItems(this.props.inventoryItems);
    window.addEventListener('resize', this.setWindowPosition);
    window.addEventListener('mousedown', this.onMouseDown);
  }

  public shouldComponentUpdate(nextProps: PopupMiniInventoryProps, nextState: PopupMiniInventoryState) {
    return !_.isEqual(nextProps, this.props) ||
      !_.isEqual(nextState, this.state);
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.setWindowPosition);
    window.removeEventListener('mousedown', this.onMouseDown);
  }

  public componentWillReceiveProps(nextProps: PopupMiniInventoryProps) {
    this.initializeMiniInventoryItems(nextProps.inventoryItems);
  }

  private initializeMiniInventoryItems = (inventoryItems: InventoryItemFragment[]) => {
    const { slotName } = this.props;
    const miniInventoryItems: InventoryItemFragment[] = [];
    if (inventoryItems) {
      inventoryItems.forEach((inventoryItem) => {
        const itemInfo = inventoryItem && inventoryItem.staticDefinition;
        if (itemInfo && itemInfo.gearSlotSets) {
          itemInfo.gearSlotSets.forEach((gearSlotSet) => {
            gearSlotSet.gearSlots.forEach((gearSlot) => {
              if (gearSlot.id === slotName) {
                miniInventoryItems.push(inventoryItem);
              }
            });
          });
        }
      });
      this.setState({ miniInventoryItems });
    }
  }

  private setWindowPosition = () => {
    const { slotName, align } = this.props;
    const offsets = document.getElementById(slotName).getBoundingClientRect();
    const { top, left, height, width } = offsets;
    const margin = 5;
    this.setState((state, props) => {
      switch (align) {
        case Alignment.WTopRight: {
          return {
            top: top - (containerDimensions.height + margin),
            left,
          };
        }
        case Alignment.WTopLeft: {
          return {
            top: top - (containerDimensions.height + margin),
            left: left - (containerDimensions.width) + width,
          };
        }
        case Alignment.ATopRight: {
          return {
            top,
            left: left + width + margin,
          };
        }
        case Alignment.ATopLeft: {
          return {
            top,
            left: left - (containerDimensions.width + margin),
          };
        }
        case Alignment.ABottomRight: {
          return {
            top: top - (containerDimensions.height) + height,
            left: left + width + margin,
          };
        }
        case Alignment.ABottomLeft: {
          return {
            top: top - (containerDimensions.height) + height,
            left: left - (containerDimensions.width + margin),
          };
        }
      }
    });
  }

  private toggleVisibility = () => {
    this.props.onVisibilityChange(this.props.slotName);
    this.setWindowPosition();
  }

  private onSearchChange = (e: any) => {
    this.setState({ searchValue: e.target.value });
  }

  private onMouseDown = () => {
    if (!this.mouseOver && this.props.visible) {
      this.props.onVisibilityChange(this.props.slotName);
    }
  }
}

export default PopupMiniInventory;
