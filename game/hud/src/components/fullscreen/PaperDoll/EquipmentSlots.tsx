/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { styled } from '@csegames/linaria/react';
import { css } from '@csegames/linaria';

import EquippedItemSlot from './EquippedItemSlot';
import PopupMiniInventory, { Alignment } from './PopupMiniInventory';
import { GearSlots, MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';
import { getEquippedDataTransfer, FullScreenContext } from 'fullscreen/lib/utils';
import eventNames, {
  EquipItemPayload,
  UnequipItemPayload,
  UpdateInventoryItemsPayload,
} from 'fullscreen/lib/itemEvents';
import { InventoryItem, EquippedItem, SecureTradeState } from 'gql/interfaces';
import { InventoryContext } from '../ItemShared/InventoryContext';
import { hideTooltip } from 'actions/tooltips';
import { makeEquipItemRequest } from '../ItemShared/InventoryBase';
import PaperdollIcon from './PaperdollIcon';

const ARMOR_ORNAMENT_OPACITY = 0.3;
const WEAPON_ORNAMENT_OPACITY = 0.8;

const Container = styled.div`
  position: relative;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const ArmorSlotsWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

// #region ArmorSlotsContainer constants
const ARMOR_SLOTS_CONTAINER_PADDING_HORIZONTAL = 30;
// #endregion
const ArmorSlotsContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  user-select: none;
  padding: 0 ${ARMOR_SLOTS_CONTAINER_PADDING_HORIZONTAL}px;

  @media (max-width: 2560px) {
    padding: 0 ${ARMOR_SLOTS_CONTAINER_PADDING_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: 0 ${ARMOR_SLOTS_CONTAINER_PADDING_HORIZONTAL * HD_SCALE}px;
  }
`;

// #region ArmorSlots constants
const ARMOR_SLOTS_PADDING_BOTTOM = 30;
const ARMOR_SLOTS_ORNAMENT_TOP = -140;
const ARMOR_SLOTS_ORNAMENT_BOTTOM = -116;
const ARMOR_SLOTS_ORNAMENT_HORIZONTAL_ALIGNMENT = -6;
const ARMOR_SLOTS_ORNAMENT_WIDTH = 144;
const ARMOR_SLOTS_ORNAMENT_HEIGHT = 132;
// #endregion
const LeftArmorSlots = styled.div`
  position: relative;
  height: fit-content;
  padding-bottom: ${ARMOR_SLOTS_PADDING_BOTTOM}px;

  &:before {
    content: '';
    position: absolute;
    top: ${ARMOR_SLOTS_ORNAMENT_TOP}px;
    left: ${ARMOR_SLOTS_ORNAMENT_HORIZONTAL_ALIGNMENT}px;
    width: ${ARMOR_SLOTS_ORNAMENT_WIDTH}px;
    height: ${ARMOR_SLOTS_ORNAMENT_HEIGHT}px;
    background: url(../images/paperdoll/ornament-slot-left-top.png) no-repeat;
    background-size: contain;
    opacity: ${ARMOR_ORNAMENT_OPACITY};
  }

  &:after {
    content: '';
    position: absolute;
    bottom: ${ARMOR_SLOTS_ORNAMENT_BOTTOM}px;
    left: ${ARMOR_SLOTS_ORNAMENT_HORIZONTAL_ALIGNMENT}px;
    width: ${ARMOR_SLOTS_ORNAMENT_WIDTH}px;
    height: ${ARMOR_SLOTS_ORNAMENT_HEIGHT}px;
    background: url(../images/paperdoll/ornament-slot-left-bot.png) no-repeat;
    background-size: contain;
    opacity: ${ARMOR_ORNAMENT_OPACITY};
  }

  @media (max-width: 2560px) {
    padding-bottom: ${ARMOR_SLOTS_PADDING_BOTTOM * MID_SCALE}px;

    &:before {
      top: ${ARMOR_SLOTS_ORNAMENT_TOP * MID_SCALE}px;
      left: ${ARMOR_SLOTS_ORNAMENT_HORIZONTAL_ALIGNMENT * MID_SCALE}px;
      width: ${ARMOR_SLOTS_ORNAMENT_WIDTH * MID_SCALE}px;
      height: ${ARMOR_SLOTS_ORNAMENT_HEIGHT * MID_SCALE}px;
    }

    &:after {
      bottom: ${ARMOR_SLOTS_ORNAMENT_BOTTOM * MID_SCALE}px;
      left: ${ARMOR_SLOTS_ORNAMENT_HORIZONTAL_ALIGNMENT * MID_SCALE}px;
      width: ${ARMOR_SLOTS_ORNAMENT_WIDTH * MID_SCALE}px;
      height: ${ARMOR_SLOTS_ORNAMENT_HEIGHT * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    padding-bottom: ${ARMOR_SLOTS_PADDING_BOTTOM * HD_SCALE}px;

    &:before {
      top: ${ARMOR_SLOTS_ORNAMENT_TOP * HD_SCALE}px;
      left: ${ARMOR_SLOTS_ORNAMENT_HORIZONTAL_ALIGNMENT * HD_SCALE}px;
      width: ${ARMOR_SLOTS_ORNAMENT_WIDTH * HD_SCALE}px;
      height: ${ARMOR_SLOTS_ORNAMENT_HEIGHT * HD_SCALE}px;
    }

    &:after {
      bottom: ${ARMOR_SLOTS_ORNAMENT_BOTTOM * HD_SCALE}px;
      left: ${ARMOR_SLOTS_ORNAMENT_HORIZONTAL_ALIGNMENT * HD_SCALE}px;
      width: ${ARMOR_SLOTS_ORNAMENT_WIDTH * HD_SCALE}px;
      height: ${ARMOR_SLOTS_ORNAMENT_HEIGHT * HD_SCALE}px;
    }
  }
`;

// #region Ornament constants
const ORNAMENT_HORIZONTAL_ALIGNMENT = -6;
const ORNAMENT_TOP = -10;
const ORNAMENT_WIDTH = 16;
// #endregion
const LeftSideOrnament = styled.div`
  position: absolute;
  left: ${ORNAMENT_HORIZONTAL_ALIGNMENT}px;
  top: ${ORNAMENT_TOP}px;
  width: ${ORNAMENT_WIDTH}px;
  height: 100%;
  background: url(../images/paperdoll/ornament-slot-left-mid.png) repeat;
  background-size: contain;
  opacity: ${ARMOR_ORNAMENT_OPACITY};

  @media (max-width: 2560px) {
    left: ${ORNAMENT_HORIZONTAL_ALIGNMENT * MID_SCALE}px;
    top: ${ORNAMENT_TOP * MID_SCALE}px;
    width: ${ORNAMENT_WIDTH * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    left: ${ORNAMENT_HORIZONTAL_ALIGNMENT * HD_SCALE}px;
    top: ${ORNAMENT_TOP * HD_SCALE}px;
    width: ${ORNAMENT_WIDTH * HD_SCALE}px;
  }
`;

const RightArmorSlots = styled.div`
  position: relative;
  height: fit-content;
  padding-bottom: ${ARMOR_SLOTS_PADDING_BOTTOM}px;

  &:before {
    content: '';
    position: absolute;
    top: ${ARMOR_SLOTS_ORNAMENT_TOP}px;
    right: ${ARMOR_SLOTS_ORNAMENT_HORIZONTAL_ALIGNMENT}px;
    width: ${ARMOR_SLOTS_ORNAMENT_WIDTH}px;
    height: ${ARMOR_SLOTS_ORNAMENT_HEIGHT}px;
    background: url(../images/paperdoll/ornament-slot-right-top.png) no-repeat;
    background-size: contain;
    opacity: ${ARMOR_ORNAMENT_OPACITY};
  }

  &:after {
    content: '';
    position: absolute;
    bottom: ${ARMOR_SLOTS_ORNAMENT_BOTTOM}px;
    right: ${ARMOR_SLOTS_ORNAMENT_HORIZONTAL_ALIGNMENT}px;
    width: ${ARMOR_SLOTS_ORNAMENT_WIDTH}px;
    height: ${ARMOR_SLOTS_ORNAMENT_HEIGHT}px;
    background: url(../images/paperdoll/ornament-slot-right-bot.png) no-repeat;
    background-size: contain;
    opacity: ${ARMOR_ORNAMENT_OPACITY};
  }

  @media (max-width: 2560px) {
    padding-bottom: ${ARMOR_SLOTS_PADDING_BOTTOM * MID_SCALE}px;

    &:before {
      top: ${ARMOR_SLOTS_ORNAMENT_TOP * MID_SCALE}px;
      right: ${ARMOR_SLOTS_ORNAMENT_HORIZONTAL_ALIGNMENT * MID_SCALE}px;
      width: ${ARMOR_SLOTS_ORNAMENT_WIDTH * MID_SCALE}px;
      height: ${ARMOR_SLOTS_ORNAMENT_HEIGHT * MID_SCALE}px;
    }

    &:after {
      bottom: ${ARMOR_SLOTS_ORNAMENT_BOTTOM * MID_SCALE}px;
      right: ${ARMOR_SLOTS_ORNAMENT_HORIZONTAL_ALIGNMENT * MID_SCALE}px;
      width: ${ARMOR_SLOTS_ORNAMENT_WIDTH * MID_SCALE}px;
      height: ${ARMOR_SLOTS_ORNAMENT_HEIGHT * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    padding-bottom: ${ARMOR_SLOTS_PADDING_BOTTOM * HD_SCALE}px;

    &:before {
      top: ${ARMOR_SLOTS_ORNAMENT_TOP * HD_SCALE}px;
      right: ${ARMOR_SLOTS_ORNAMENT_HORIZONTAL_ALIGNMENT * HD_SCALE}px;
      width: ${ARMOR_SLOTS_ORNAMENT_WIDTH * HD_SCALE}px;
      height: ${ARMOR_SLOTS_ORNAMENT_HEIGHT * HD_SCALE}px;
    }

    &:after {
      bottom: ${ARMOR_SLOTS_ORNAMENT_BOTTOM * HD_SCALE}px;
      right: ${ARMOR_SLOTS_ORNAMENT_HORIZONTAL_ALIGNMENT * HD_SCALE}px;
      width: ${ARMOR_SLOTS_ORNAMENT_WIDTH * HD_SCALE}px;
      height: ${ARMOR_SLOTS_ORNAMENT_HEIGHT * HD_SCALE}px;
    }
  }
`;

const RightSideOrnament = styled.div`
  position: absolute;
  right: ${ORNAMENT_HORIZONTAL_ALIGNMENT}px;
  top: ${ORNAMENT_TOP}px;
  width: ${ORNAMENT_WIDTH}px;
  height: 100%;
  background: url(../images/paperdoll/ornament-slot-right-mid.png) repeat;
  background-size: contain;
  opacity: ${ARMOR_ORNAMENT_OPACITY};

  @media (max-width: 2560px) {
    right: ${ORNAMENT_HORIZONTAL_ALIGNMENT * MID_SCALE}px;
    top: ${ORNAMENT_TOP * MID_SCALE}px;
    width: ${ORNAMENT_WIDTH * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    right: ${ORNAMENT_HORIZONTAL_ALIGNMENT * HD_SCALE}px;
    top: ${ORNAMENT_TOP * HD_SCALE}px;
    width: ${ORNAMENT_WIDTH * HD_SCALE}px;
  }
`;

// #region EquippedWeaponSlots constants
const EQUIPPED_WEAPON_SLOTS_BOTTOM = 44;
const EQUIPPED_WEAPON_SLOTS_PADDING_VERTICAL = 10;
// #endregion
const EquippedWeaponSlots = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: -webkit-fit-content;
  margin: 0 auto;
  bottom: ${EQUIPPED_WEAPON_SLOTS_BOTTOM}px;
  padding: ${EQUIPPED_WEAPON_SLOTS_PADDING_VERTICAL}px 0;
  left: 0;
  right: 0;
  width: 100%;
  pointer-events: none;

  &:before {
    content: '';
    position: absolute;
    background: url(../images/paperdoll/ornament-slot-bot-mid.png) no-repeat;
    background-size: contain;
    background-position-x: center;
    bottom: 0px;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    opacity: ${WEAPON_ORNAMENT_OPACITY};
  }

  @media (max-width: 2560px) {
    bottom: ${EQUIPPED_WEAPON_SLOTS_BOTTOM * MID_SCALE}px;
    padding: ${EQUIPPED_WEAPON_SLOTS_PADDING_VERTICAL * MID_SCALE}px 0;
  }

  @media (max-width: 1920px) {
    bottom: ${EQUIPPED_WEAPON_SLOTS_BOTTOM * HD_SCALE}px;
    padding: ${EQUIPPED_WEAPON_SLOTS_PADDING_VERTICAL * HD_SCALE}px 0;
  }
`;

// #region WeaponSlotOrnaments constants
const WEAPON_SLOT_ORNAMENTS_LEFT = -210;
const WEAPON_SLOT_ORNAMENTS_WIDTH = 194;
const WEAPON_SLOT_ORNAMENTS_RIGHT = -176;
// #endregion
const WeaponSlotOrnaments = styled.div`
  position: relative;
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: ${WEAPON_SLOT_ORNAMENTS_LEFT}px;
    width: ${WEAPON_SLOT_ORNAMENTS_WIDTH}px;
    background: url(../images/paperdoll/ornament-slot-bot-left.png) no-repeat;
    background-size: contain;
    opacity: ${WEAPON_ORNAMENT_OPACITY};
    z-index: 0;
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: ${WEAPON_SLOT_ORNAMENTS_RIGHT}px;
    width: ${WEAPON_SLOT_ORNAMENTS_WIDTH}px;
    background: url(../images/paperdoll/ornament-slot-bot-right.png) no-repeat;
    background-size: contain;
    opacity: ${WEAPON_ORNAMENT_OPACITY};
    z-index: 0;
  }
`;

// #region ItemSlotSpacing constants
const ITEM_SLOT_SPACING_MARGIN_BOTTOM = 10;
// #endregion
const ItemSlotSpacing = css`
  margin-bottom: ${ITEM_SLOT_SPACING_MARGIN_BOTTOM}px;

  @media (max-width: 2560px) {
    margin-bottom: ${ITEM_SLOT_SPACING_MARGIN_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-bottom: ${ITEM_SLOT_SPACING_MARGIN_BOTTOM * HD_SCALE}px;
  }
`;

// #region WeaponSpacing constants
const WEAPON_SPACING_MARGIN_RIGHT = 30;
// #endregion
const WeaponSpacing = css`
  margin-right: ${WEAPON_SPACING_MARGIN_RIGHT}px;
  pointer-events: all;

  @media (max-width: 2560px) {
    margin-right: ${WEAPON_SPACING_MARGIN_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-right: ${WEAPON_SPACING_MARGIN_RIGHT * HD_SCALE}px;
  }
`;

// #region SectionTitle constants
const SECTION_TITLE_FONT_SIZE = 32;
// #endregion
const SectionTitle = styled.div`
  color: gray;
  font-family: Caudex;
  text-transform: uppercase;
  text-align: center;
  font-size: ${SECTION_TITLE_FONT_SIZE}px;

  @media (max-width: 2560px) {
    font-size: ${SECTION_TITLE_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${SECTION_TITLE_FONT_SIZE * HD_SCALE}px;
  }
`;

const outerEquipmentSlotsAndInfo: EquipmentSlotsAndInfo[] = [
  { slotName: GearSlots.Head, openingSide: Alignment.ATopRight },
  { slotName: GearSlots.Torso, openingSide: Alignment.ATopRight },
  { slotName: GearSlots.Cloak, openingSide: Alignment.ATopRight },
  { slotName: GearSlots.Arms, openingSide: Alignment.ABottomRight },
  { slotName: GearSlots.Hands, openingSide: Alignment.ABottomRight },
  { slotName: GearSlots.Legs, openingSide: Alignment.ABottomRight },
  { slotName: GearSlots.Feet, openingSide: Alignment.ABottomRight },
];

const innerEquipmentSlotsAndInfo: EquipmentSlotsAndInfo[] = [
  { slotName: GearSlots.HeadUnder, openingSide: Alignment.ATopLeft },
  { slotName: GearSlots.TorsoUnder, openingSide: Alignment.ATopLeft },
  { slotName: GearSlots.ArmsUnder, openingSide: Alignment.ATopLeft },
  { slotName: GearSlots.HandsUnder, openingSide: Alignment.ABottomLeft },
  { slotName: GearSlots.LegsUnder, openingSide: Alignment.ABottomLeft },
  { slotName: GearSlots.FeetUnder, openingSide: Alignment.ABottomLeft },
];

const weaponSlots: EquipmentSlotsAndInfo[] = [
  { slotName: GearSlots.OneHandedWeaponLeft, openingSide: Alignment.WTopRight },
  { slotName: GearSlots.OneHandedWeaponRight, openingSide: Alignment.WTopLeft },
  { slotName: GearSlots.TwoHandedWeapon, openingSide: Alignment.WTopLeft },
];

export interface EquipmentSlotsInjectedProps {
  equippedItems: EquippedItem.Fragment[];
  inventoryItems: InventoryItem.Fragment[];
  myTradeState: SecureTradeState;
  visibleComponentRight: string;
  visibleComponentLeft: string;
}

export interface EquipmentSlotsProps {
  onEquippedItemsChange: (equippedItems: EquippedItem.Fragment[]) => void;
}

export type EquipmentSlotsComponentProps = EquipmentSlotsInjectedProps & EquipmentSlotsProps;

export interface EquipmentSlotsAndInfo {
  slotName: GearSlots;
  openingSide: Alignment;
}

export interface EquipmentSlotsState {
  selectedItemMenu: {
    openingSide: Alignment;
    slotName: GearSlots;
    offsets: ClientRect;
  };
}

class EquipmentSlots extends React.PureComponent<EquipmentSlotsComponentProps, EquipmentSlotsState> {
  private mouseOverItemMenu: boolean;
  private eventHandles: EventHandle[] = [];

  constructor(props: EquipmentSlotsComponentProps) {
    super(props);
    this.state = {
      selectedItemMenu: null,
    };
  }

  public render() {
    const { selectedItemMenu } = this.state;
    return (
      <Container>
        <PaperdollIcon />
        <ArmorSlotsWrapper>
          {this.renderSlots()}
        </ArmorSlotsWrapper>
        <EquippedWeaponSlots>
          <WeaponSlotOrnaments>
            {this.renderEquipmentSlotSection(weaponSlots)}
          </WeaponSlotOrnaments>
        </EquippedWeaponSlots>

        {selectedItemMenu &&
          <PopupMiniInventory
            align={selectedItemMenu.openingSide}
            slotName={selectedItemMenu.slotName}
            offsets={selectedItemMenu.offsets}
            inventoryItems={this.props.inventoryItems}
            onMouseOver={() => this.mouseOverItemMenu = true}
            onMouseLeave={() => this.mouseOverItemMenu = false}
          />
        }
      </Container>
    );
  }

  public componentDidMount() {
    this.eventHandles.push(game.on(eventNames.onEquipItem, this.onEquipItem));
    this.eventHandles.push(game.on(eventNames.onUnequipItem, this.onUnequipItem));
    window.addEventListener('resize', this.closeItemMenu);
    window.addEventListener('mousedown', this.closeItemMenu);
  }

  public componentWillUnmount() {
    this.eventHandles.forEach(eventHandle => eventHandle.clear());
    window.removeEventListener('resize', this.closeItemMenu);
    window.removeEventListener('mousedown', this.closeItemMenu);
  }

  private onUnequipItem = (payload: UnequipItemPayload) => {
    // Listens to onUnequipItem event. We need this in order to update other slots affected by the unequip.
    const { item } = payload;
    const equippedItems = this.props.equippedItems;
    const filteredItems = _.filter(equippedItems, ((equippedItem) => {
      return !_.find(equippedItem.gearSlots, (gearSlot): any => {
        return _.find(item.gearSlots, slot => gearSlot.id === slot.id);
      });
    }));
    this.props.onEquippedItemsChange(filteredItems);

    if (!payload.dontUpdateInventory) {
      const updateInventoryItemsPayload: UpdateInventoryItemsPayload = {
        type: 'Unequip',
        equippedItem: item,
      };
      game.trigger(eventNames.updateInventoryItems, updateInventoryItemsPayload);
    }
  }

  private onEquipItem = (payload: EquipItemPayload) => {
    const { newItem, prevEquippedItem, willEquipTo } = payload;
    const equippedItems = [...this.props.equippedItems];

    let filteredItems = _.filter(equippedItems, ((equippedItem) => {
      if (newItem.location === 'equipped') {
        // New Item was previously equipped somewhere else, filter replaced items and previously equipped.
        return !_.find(equippedItem.gearSlots, (gearSlot): any => {
          return _.find(newItem.gearSlots, slot => gearSlot.id === slot.id) ||
            _.find(willEquipTo, slot => gearSlot.id === slot.id);
        });
      }

      // New item coming from inventory, contianer, etc. Only filter replaced items.
      return !_.find(equippedItem.gearSlots, (gearSlot): any => {
        return _.find(willEquipTo, slot => gearSlot.id === slot.id);
      });
    }));

    makeEquipItemRequest(newItem.item, willEquipTo);

    if (newItem.location === 'equipped' && prevEquippedItem) {
      // We are swapping items that are currently equipped
      const swappedItem: InventoryItem.Fragment = {
        ...prevEquippedItem.item,
        location: {
          inventory: null,
          inContainer: null,
          inVox: null,
          equipped: {
            gearSlots: newItem.gearSlots,
          },
        },
      };
      const swappedEquippedItem = { item: swappedItem, gearSlots: newItem.gearSlots };
      makeEquipItemRequest(swappedEquippedItem.item, swappedEquippedItem.gearSlots);
      filteredItems = filteredItems.concat(swappedEquippedItem);
    }

    const nextItem: InventoryItem.Fragment = {
      ...newItem.item,
      location: {
        inventory: null,
        inContainer: null,
        inVox: null,
        equipped: {
          gearSlots: willEquipTo,
        },
      },
    };
    const newEquippedItem = { item: nextItem, gearSlots: willEquipTo };
    this.props.onEquippedItemsChange(filteredItems.concat(newEquippedItem));

    const itemToBeReplaced = _.filter(equippedItems, equippedItem =>
      _.findIndex(equippedItem.gearSlots, gearSlot =>
        _.find(willEquipTo, slot => slot.id === gearSlot.id),
      ) > -1)
      .map((equippedItem) => {
        return getEquippedDataTransfer({
          item: equippedItem.item,
          position: 0,
          location: 'equipped',
          gearSlots: equippedItem.gearSlots,
        });
      });

    if (newItem.location === 'inventory') {
      const updateInventoryItemsPayload: UpdateInventoryItemsPayload = {
        type: 'Equip',
        inventoryItem: newItem,
        willEquipTo,
        equippedItem: itemToBeReplaced.length > 0 ? itemToBeReplaced : null,
      };

      game.trigger(eventNames.updateInventoryItems, updateInventoryItemsPayload);
    }
  }

  private renderEquipmentSlotSection = (equipmentSlots: EquipmentSlotsAndInfo[]) => {
    const equippedItems = this.props.equippedItems;
    return (
      equipmentSlots.map((slot, i) => {
        const equippedItem = _.find(equippedItems, (eItem): any => {
          return _.find(eItem.gearSlots, gearSlot => gearSlot.id === slot.slotName);
        });
        const isWeapon = _.includes(slot.slotName, 'Weapon');
        const isLastItem = i === equipmentSlots.length - 1;
        return (
            <div
              key={slot.slotName}
              className={!isWeapon ? !isLastItem ? ItemSlotSpacing : '' : WeaponSpacing}
              onMouseOver={() => this.mouseOverItemMenu = true}
              onMouseLeave={() => this.mouseOverItemMenu = false}>
              <EquippedItemSlot
                slot={slot}
                selectedSlot={this.state.selectedItemMenu}
                providedEquippedItem={equippedItem}
                disableDrag={this.props.myTradeState !== 'None'}
                setSlotInfo={this.setSlotInfo}
              />
            </div>
        );
      })
    );
  }

  private renderSlots = () => {
    return (
      <ArmorSlotsContainer>
        <LeftArmorSlots>
          <SectionTitle>Outer</SectionTitle>
          <LeftSideOrnament />
          {this.renderEquipmentSlotSection(outerEquipmentSlotsAndInfo)}
        </LeftArmorSlots>
        <RightArmorSlots>
          <SectionTitle>Under</SectionTitle>
          <RightSideOrnament />
          {this.renderEquipmentSlotSection(innerEquipmentSlotsAndInfo)}
        </RightArmorSlots>
      </ArmorSlotsContainer>
    );
  }

  private setSlotInfo = (ref: HTMLDivElement, slot: { slotName: GearSlots, openingSide: Alignment }) => {
    if (!ref) return;

    const { selectedItemMenu } = this.state;
    if (selectedItemMenu && slot.slotName === selectedItemMenu.slotName) {
      // Hide
      this.setState({ selectedItemMenu: null });
    } else {
      // Show
      hideTooltip();
      const selectedItemMenu = {
        openingSide: slot.openingSide,
        slotName: slot.slotName,
        offsets: ref.getBoundingClientRect(),
      };
      this.setState({ selectedItemMenu });
    }
  }

  private closeItemMenu = () => {
    if (this.state.selectedItemMenu && !this.mouseOverItemMenu) {
      this.setState({ selectedItemMenu: null });
    }
  }
}

class EquipmentSlotsWithInjectedContext extends React.Component<EquipmentSlotsProps> {
  public render() {
    return (
      <FullScreenContext.Consumer>
        {({ equippedItems, visibleComponentLeft, visibleComponentRight, myTradeState }) => {
          return (
            <InventoryContext.Consumer>
              {({ inventoryItems }) => {
                return (
                  <EquipmentSlots
                    {...this.props}
                    equippedItems={equippedItems}
                    inventoryItems={inventoryItems}
                    myTradeState={myTradeState}
                    visibleComponentLeft={visibleComponentLeft}
                    visibleComponentRight={visibleComponentRight}
                  />
                );
              }}
            </InventoryContext.Consumer>
          );
        }}
      </FullScreenContext.Consumer>
    );
  }
}

export default EquipmentSlotsWithInjectedContext;
