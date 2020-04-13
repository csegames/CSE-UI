/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React, { useContext } from 'react';
import * as _ from 'lodash';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';

import { utils } from '@csegames/library/lib/camelotunchained';
import { PageController, PageInfo } from 'cseshared/components/PageController';

import PopupMiniInventorySlot from './PopupMiniInventorySlot';
import TabSubHeader from '../../shared/Tabs/TabSubHeader';
import FilterInput from '../Inventory/components/FilterInput';
import { displaySlotNames, GearSlots, MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';
import { getItemDefinitionName } from 'fullscreen/lib/utils';
import { InventoryItem } from 'gql/interfaces';
import { getScaledValue } from 'hudlib/scale';

// #region MiniInventoryBox constants
const MINI_INVENTORY_BOX_WIDTH = 620;
const MINI_INVENTORY_BOX_HEIGHT = 430;
// #endregion
const MiniInventoryBox = styled.div`
  position: fixed;
  background: linear-gradient(to bottom, rgba(55, 33, 19, 1), rgba(24, 17, 11, 0.9));
  border-image: linear-gradient(to bottom, #623F26, transparent);
  border-style: solid;
  border-top-width: 1px;
  border-left-width: 1px;
  border-right-width: 1px;
  border-bottom-width: 0px;
  width: ${MINI_INVENTORY_BOX_WIDTH}px;
  height: ${MINI_INVENTORY_BOX_HEIGHT}px;
  overflow: hidden;
  z-index: 10;

  @media (max-width: 2560px) {
    width: ${MINI_INVENTORY_BOX_WIDTH * MID_SCALE}px;
    height: ${MINI_INVENTORY_BOX_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${MINI_INVENTORY_BOX_WIDTH * HD_SCALE}px;
    height: ${MINI_INVENTORY_BOX_HEIGHT * HD_SCALE}px;
  }
`;

// #region SubHeaderClass constants
const SUB_HEADER_CLASS_HEIGHT = 70;
// #endregion
const SubHeaderClass = css`
  height: ${SUB_HEADER_CLASS_HEIGHT}px;

  @media (max-width: 2560px) {
    height: ${SUB_HEADER_CLASS_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${SUB_HEADER_CLASS_HEIGHT * HD_SCALE}px;
  }
`;

// #region SubHeaderContentClass constants
const SUB_HEADER_CONTENT_CLASS_LETTER_SPACING = 2;
const SUB_HEADER_CONTENT_CLASS_PADDING_RIGHT = 10;
const SUB_HEADER_CONTENT_CLASS_PADDING_LEFT = 20;
const SUB_HEADER_CONTENT_CLASS_FONT_SIZE = 28;
// #endregion
const SubHeaderContentClass = css`
  padding-right: ${SUB_HEADER_CONTENT_CLASS_PADDING_RIGHT}px;
  padding-left: ${SUB_HEADER_CONTENT_CLASS_PADDING_LEFT}px;
  letter-spacing: ${SUB_HEADER_CONTENT_CLASS_LETTER_SPACING}px;
  font-size: ${SUB_HEADER_CONTENT_CLASS_FONT_SIZE}px;
  text-transform: none;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 2560px) {
    padding-right: ${SUB_HEADER_CONTENT_CLASS_PADDING_RIGHT * MID_SCALE}px;
    padding-left: ${SUB_HEADER_CONTENT_CLASS_PADDING_LEFT * MID_SCALE}px;
    letter-spacing: ${SUB_HEADER_CONTENT_CLASS_LETTER_SPACING * MID_SCALE}px;
    font-size: ${SUB_HEADER_CONTENT_CLASS_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding-right: ${SUB_HEADER_CONTENT_CLASS_PADDING_RIGHT * HD_SCALE}px;
    padding-left: ${SUB_HEADER_CONTENT_CLASS_PADDING_LEFT * HD_SCALE}px;
    letter-spacing: ${SUB_HEADER_CONTENT_CLASS_LETTER_SPACING * HD_SCALE}px;
    font-size: ${SUB_HEADER_CONTENT_CLASS_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region ControllerContainerStyle constants
const CONTROLLER_CONTAINER_STYLE_HEIGHT = 30;
// #endregion
const ControllerContainerStyle = css`
  height: ${CONTROLLER_CONTAINER_STYLE_HEIGHT}px;

  @media (max-width: 2560px) {
    height: ${CONTROLLER_CONTAINER_STYLE_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${CONTROLLER_CONTAINER_STYLE_HEIGHT * HD_SCALE}px;
  }
`;

// #region ControllerContainer constants
const CONTROLLER_CONTAINER_PADDING_VERTICAL = 4;
const CONTROLLER_CONTAIENR_PADDING_HORIZONTAL = 10;
const CONTROLLER_CONTAINER_HEIGHT = 30;
// #endregion
const ControllerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${CONTROLLER_CONTAINER_PADDING_VERTICAL}px ${CONTROLLER_CONTAIENR_PADDING_HORIZONTAL}px;
  height: ${CONTROLLER_CONTAINER_HEIGHT}px;
  background-color: rgba(20, 14, 7, 0.7);

  @media (max-width: 2560px) {
    height: ${CONTROLLER_CONTAINER_HEIGHT * MID_SCALE}px;
    padding: ${CONTROLLER_CONTAINER_PADDING_VERTICAL * MID_SCALE}px ${CONTROLLER_CONTAIENR_PADDING_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${CONTROLLER_CONTAINER_HEIGHT * HD_SCALE}px;
    padding: ${CONTROLLER_CONTAINER_PADDING_VERTICAL * HD_SCALE}px ${CONTROLLER_CONTAIENR_PADDING_HORIZONTAL * HD_SCALE}px;
  }
`;

// #region ItemsContainer constants
const ITEMS_CONTAINER_PADDING = 10;
// #endregion
const ItemsContainer = styled.div`
  padding: ${ITEMS_CONTAINER_PADDING}px;
  height: ${MINI_INVENTORY_BOX_HEIGHT - SUB_HEADER_CLASS_HEIGHT}px;

  @media (max-width: 2560px) {
    padding: ${ITEMS_CONTAINER_PADDING * MID_SCALE}px;
    height: ${(MINI_INVENTORY_BOX_HEIGHT - SUB_HEADER_CLASS_HEIGHT) * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: ${ITEMS_CONTAINER_PADDING * HD_SCALE}px;
    height: ${(MINI_INVENTORY_BOX_HEIGHT - SUB_HEADER_CLASS_HEIGHT) * HD_SCALE}px;
  }
`;

// #region ItemSpacing constants
const ITEM_SPACING_MARGIN_VERTICAL = 1;
const ITEM_SPACING_MARGIN_HORIZONTAL = 5;
// #endregion
const ItemSpacing = styled.div`
  display: inline-block;
  margin: ${ITEM_SPACING_MARGIN_VERTICAL}px ${ITEM_SPACING_MARGIN_HORIZONTAL}px;

  @media (max-width: 2560px) {
    margin: ${ITEM_SPACING_MARGIN_VERTICAL * MID_SCALE}px ${ITEM_SPACING_MARGIN_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin: ${ITEM_SPACING_MARGIN_VERTICAL * HD_SCALE}px ${ITEM_SPACING_MARGIN_HORIZONTAL * HD_SCALE}px;
  }
`;

// #region SlotNameText constants
const SLOT_NAME_TEXT_FONT_SIZE = 28;
// #endregion
const SlotNameText = styled.p`
  font-size: ${SLOT_NAME_TEXT_FONT_SIZE}px;
  color: #D8BFA8;
  margin: 0 !important;
  padding: 0;
  flex: 1;
  white-space: nowrap;

  @media (max-width: 2560px) {
    font-size: ${SLOT_NAME_TEXT_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${SLOT_NAME_TEXT_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region PageNumberText constants
const PAGE_NUMBER_TEXT_MARGIN_BOTTOM = 10;
const PAGE_NUMBER_TEXT_FONT_SIZE = 24;
const PAGE_NUMBER_TEXT_LETTER_SPACING = 4;
// #endregion
const PageNumberText = styled.p`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #D8BFA8;
  margin: 0 ${PAGE_NUMBER_TEXT_MARGIN_BOTTOM}px 0 0 !important;
  font-size: ${PAGE_NUMBER_TEXT_FONT_SIZE}px;
  letter-spacing: ${PAGE_NUMBER_TEXT_LETTER_SPACING}px;

  @media (max-width: 2560px) {
    margin: 0 ${PAGE_NUMBER_TEXT_MARGIN_BOTTOM * MID_SCALE}px 0 0 !important;
    font-size: ${PAGE_NUMBER_TEXT_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${PAGE_NUMBER_TEXT_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin: 0 ${PAGE_NUMBER_TEXT_MARGIN_BOTTOM * HD_SCALE}px 0 0 !important;
    font-size: ${PAGE_NUMBER_TEXT_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${PAGE_NUMBER_TEXT_LETTER_SPACING * HD_SCALE}px;
  }
`;

// #region ControllerButton constants
const CONTROLLER_BUTTON_FONT_SIZE = 24;
const CONTROLLER_BUTTON_LETTER_SPACING = 2;
// #endregion
const ControllerButton = styled.div`
  display: inline-block;
  font-size: ${CONTROLLER_BUTTON_FONT_SIZE}px;
  letter-spacing: ${CONTROLLER_BUTTON_LETTER_SPACING}px;
  color: #D8BFA8;
  cursor: pointer;
  &:active {
    text-shadow: 2px 2px rgba(0, 0, 0, 0.9);
  }

  @media (max-width: 2560px) {
    font-size: ${CONTROLLER_BUTTON_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${CONTROLLER_BUTTON_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${CONTROLLER_BUTTON_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${CONTROLLER_BUTTON_LETTER_SPACING * HD_SCALE}px;
  }
`;

const DisabledControllerButton = css`
  opacity: 0.5;
`;

// #region InputClass constants
const INPUT_CLASS_MARGIN_LEFT = 20;
const INPUT_CLASS_PADDING = 10;
const INPUT_CLASS_HEIGHT = 50;
// #endregion
const InputClass = css`
  margin-left: ${INPUT_CLASS_MARGIN_LEFT}px;
  padding: ${INPUT_CLASS_PADDING}px;
  height: ${INPUT_CLASS_HEIGHT}px;

  @media (max-width: 2560px) {
    margin-left: ${INPUT_CLASS_MARGIN_LEFT * MID_SCALE}px;
    padding: ${INPUT_CLASS_PADDING * MID_SCALE}px;
    height: ${INPUT_CLASS_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-left: ${INPUT_CLASS_MARGIN_LEFT * HD_SCALE}px;
    padding: ${INPUT_CLASS_PADDING * HD_SCALE}px;
    height: ${INPUT_CLASS_HEIGHT * HD_SCALE}px;
  }
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

type Props = { uiContext: UIContext } & PopupMiniInventoryProps;

export interface PopupMiniInventoryState {
  miniInventoryItems: InventoryItem.Fragment[];
  searchValue: string;
  top: number;
  left: number;
}

export class PopupMiniInventory extends React.Component<Props, PopupMiniInventoryState> {
  constructor(props: Props) {
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
          styles={{
            controllerContainer: ControllerContainerStyle,
          }}
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

  public componentWillReceiveProps(nextProps: Props) {
    this.setWindowPosition(nextProps);
    this.initializeMiniInventoryItems(nextProps);
  }

  private initializeMiniInventoryItems = (props: Props) => {
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

  private setWindowPosition = (props: Props) => {
    const { align, offsets } = props;
    const { top, left, height, width } = offsets;
    const containerHeight = getScaledValue(props.uiContext, MINI_INVENTORY_BOX_HEIGHT);
    const containerWidth = getScaledValue(props.uiContext, MINI_INVENTORY_BOX_WIDTH);
    const containerMargin = getScaledValue(props.uiContext, 10);
    this.setState((state, props) => {
      switch (align) {
        case Alignment.WTopRight: {
          return {
            top: top - (containerHeight + containerMargin),
            left,
          };
        }
        case Alignment.WTopLeft: {
          return {
            top: top - (containerHeight + containerMargin),
            left: left - (containerWidth) + width,
          };
        }
        case Alignment.ATopRight: {
          return {
            top,
            left: left + width + containerMargin,
          };
        }
        case Alignment.ATopLeft: {
          return {
            top,
            left: left - (containerWidth + containerMargin),
          };
        }
        case Alignment.ABottomRight: {
          return {
            top: top - (containerHeight) + height,
            left: left + width + containerMargin,
          };
        }
        case Alignment.ABottomLeft: {
          return {
            top: top - (containerHeight) + height,
            left: left - (containerWidth + containerMargin),
          };
        }
      }
    });
  }

  private onSearchChange = (searchValue: string) => {
    this.setState({ searchValue });
  }
}

// tslint:disable-next-line:function-name
function PopupMiniInventoryWithContext(props: PopupMiniInventoryProps) {
  const uiContext = useContext(UIContext);
  return (
    <PopupMiniInventory uiContext={uiContext} {...props} />
  );
}

export default PopupMiniInventoryWithContext;
