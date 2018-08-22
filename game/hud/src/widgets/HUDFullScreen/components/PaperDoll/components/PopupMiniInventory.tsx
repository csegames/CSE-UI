/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';

import { utils, PageController, PageInfo } from '@csegames/camelot-unchained';

import PopupMiniInventorySlot from './PopupMiniInventorySlot';
import TabSubHeader from '../../TabSubHeader';
import FilterInput from '../../Inventory/components/FilterInput';
import { displaySlotNames, GearSlots } from '../../../lib/constants';
import { getItemDefinitionName } from '../../../lib/utils';
import { InventoryItem } from 'gql/interfaces';

const containerDimensions = {
  width: 310,
  height: 215,
};

const MiniInventoryBox = styled.div`
  position: fixed;
  background: linear-gradient(to bottom, rgba(55, 33, 19, 1), rgba(24, 17, 11, 0.9));
  border-image: linear-gradient(to bottom, #623F26, transparent);
  border-style: solid;
  border-top-width: 1px;
  border-left-width: 1px;
  border-right-width: 1px;
  border-bottom-width: 0px;
  width: ${containerDimensions.width}px;
  height: ${containerDimensions.height}px;
  overflow: hidden;
  z-index: 10;
`;

const SubHeaderClass = css`
  height: 35px;
`;

const SubHeaderContentClass = css`
  padding: 0 5px 0 10px;
  letter-spacing: 1px;
  font-size: 14px;
  text-transform: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ControllerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 5px;
  height: 15px;
  background-color: rgba(20, 14, 7, 0.7);
`;

const ItemsContainer = styled.div`
  padding: 5px;
  height: ${containerDimensions.height - 30}px;
`;

const ItemSpacing = styled.div`
  display: inline-block;
  margin: 0.5px 2.5px;
`;

const SlotNameText = styled.p`
  font-size: 14px;
  color: #D8BFA8;
  margin: 0 !important;
  padding: 0;
`;

const PageNumberText = styled.p`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 5px 0 0 !important;
  color: #D8BFA8;
  font-size: 12px;
  letter-spacing: 2px;
`;

const ControllerButton = styled.div`
  display: inline-block;
  font-size: 12px;
  letter-spacing: 1px;
  color: #D8BFA8;
  cursor: pointer;
  &:active {
    text-shadow: 2px 2px rgba(0, 0, 0, 0.9);
  }
`;

const DisabledControllerButton = css`
  opacity: 0.5;
`;

const InputClass = css`
  margin-left: 10px;
  padding: 5px;
  height: 25px;
`;

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
  slotName: GearSlots;
  inventoryItems: InventoryItem.Fragment[];
  offsets: ClientRect;
  onMouseOver: () => void;
  onMouseLeave: () => void;
}

export interface PopupMiniInventoryState {
  miniInventoryItems: InventoryItem.Fragment[];
  searchValue: string;
  top: number;
  left: number;
}

export class PopupMiniInventory extends React.Component<PopupMiniInventoryProps, PopupMiniInventoryState> {
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
      return utils.doesSearchInclude(this.state.searchValue, getItemDefinitionName(item));
    });
    const amountOfPages = Math.ceil(miniInventoryItems.length / 8) + (miniInventoryItems.length % 8 > 0 ? 1 : 0) || 1;
    const arrayOfPages: InventoryItem.Fragment[][] = [];
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
          <ItemsContainer key={index}>
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
      <MiniInventoryBox
        style={{ top: this.state.top, left: this.state.left }}
        onMouseOver={this.props.onMouseOver}
        onMouseLeave={this.props.onMouseLeave}>
        <TabSubHeader className={SubHeaderClass} contentClassName={SubHeaderContentClass}>
          <SlotNameText>{displaySlotNames[this.props.slotName]}</SlotNameText>
          <FilterInput
            className={InputClass}
            onFilterChanged={this.onSearchChange}
            filterText={this.state.searchValue}
          />
        </TabSubHeader>
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
    );
  }

  public componentDidMount() {
    this.setWindowPosition(this.props);
    this.initializeMiniInventoryItems(this.props);
  }

  public componentWillReceiveProps(nextProps: PopupMiniInventoryProps) {
    this.setWindowPosition(nextProps);
    this.initializeMiniInventoryItems(nextProps);
  }

  private initializeMiniInventoryItems = (props: PopupMiniInventoryProps) => {
    const { slotName, inventoryItems } = props;
    const miniInventoryItems: InventoryItem.Fragment[] = [];
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

  private setWindowPosition = (props: PopupMiniInventoryProps) => {
    const { align, offsets } = props;
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

  private onSearchChange = (searchValue: string) => {
    this.setState({ searchValue });
  }
}

export default PopupMiniInventory;

