/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { styled } from '@csegames/linaria/react';
import { css, cx } from '@csegames/linaria';
import { ContentItem, TabItem, TabPanel } from '@csegames/camelot-unchained';

import EquippedItemSlot from './EquippedItemSlot';
import PopupMiniInventory, { Alignment } from './PopupMiniInventory';
import { GearSlots } from '../../../lib/constants';
import { getEquippedDataTransfer, FullScreenContext } from '../../../lib/utils';
import eventNames, {
  EquipItemPayload,
  UnequipItemPayload,
  UpdateInventoryItemsPayload,
} from '../../../lib/eventNames';
import { InventoryItem, EquippedItem, SecureTradeState } from 'gql/interfaces';
import { InventoryContext } from '../../ItemShared/InventoryContext';
import { hideTooltip } from 'actions/tooltips';
import { makeEquipItemRequest } from '../../ItemShared/InventoryBase';
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

const ArmorSlotsContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  user-select: none;
  height: 100%;
  padding: 0 15px;
  align-items: center;
`;

const LeftArmorSlots = styled.div`
  position: relative;
  &:before {
    content: '';
    position: absolute;
    top: -70px;
    left: -3px;
    width: 72px;
    height: 67px;
    background: url(../images/paperdoll/ornament-slot-left-top.png) no-repeat;
    background-size: contain;
    opacity: ${ARMOR_ORNAMENT_OPACITY};
  }
  &:after {
    content: '';
    position: absolute;
    bottom: -58px;
    left: -3px;
    width: 72px;
    height: 67px;
    background: url(../images/paperdoll/ornament-slot-left-bot.png) no-repeat;
    background-size: contain;
    opacity: ${ARMOR_ORNAMENT_OPACITY};
  }
`;

const LeftSideOrnament = styled.div`
  position: absolute;
  left: -3px;
  top: -5px;
  height: 100%;
  background: url(../images/paperdoll/ornament-slot-left-mid.png) repeat;
  background-size: contain;
  width: 8px;
  opacity: ${ARMOR_ORNAMENT_OPACITY};
`;

const RightArmorSlots = styled.div`
  position: relative;
  &:before {
    content: '';
    position: absolute;
    top: -70px;
    right: -3px;
    width: 72px;
    height: 67px;
    background: url(../images/paperdoll/ornament-slot-right-top.png) no-repeat;
    background-size: contain;
    opacity: ${ARMOR_ORNAMENT_OPACITY};
  }
  &:after {
    content: '';
    position: absolute;
    bottom: -58px;
    right: -3px;
    width: 72px;
    height: 67px;
    background: url(../images/paperdoll/ornament-slot-right-bot.png) no-repeat;
    background-size: contain;
    opacity: ${ARMOR_ORNAMENT_OPACITY};
  }
`;

const RightSideOrnament = styled.div`
  position: absolute;
  right: -3px;
  top: -5px;
  height: 100%;
  background: url(../images/paperdoll/ornament-slot-right-mid.png) repeat;
  background-size: contain;
  width: 8px;
  opacity: ${ARMOR_ORNAMENT_OPACITY};
`;

const TabDivider = styled.div`
  background: url(../images/paperdoll/ornament-gear-select.png);
  background-size: contain;
  width: 2px;
  height: 42px;
  margin-top: -10px;
`;

const ToggleTab = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  font-family: Caudex;
  color: #9E5631;
  letter-spacing: 0.5px;
  -webkit-user-select: none;
  user-select: none;
  width: 78px;
  text-transform: uppercase;
  -webkit-text-transform: uppercase;
  z-index: 1;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
  }
  &.isInactive:hover {
    filter: brightness(130%);
    -webkit-filter: brightness(130%);
  }
  &.isActive {
    color: #F4EBAD;
    &:before {
      background: url(../images/paperdoll/outer-hover-button.png) no-repeat;
      background-size: contain;
    }
  }
  &.outer-toggle {
    justify-content: flex-end;
    padding-right: 5px;
    &.isInactive:before {
      transform: scale(-1, 1);
      -webkit-transform: scale(-1, 1);
    }
    i {
      margin-right: 5px;
    }
  }
  &.inner-toggle {
    justify-content: flex-start;
    padding-left: 5px;
    &.isActive:before {
      transform: scale(-1, 1);
      -webkit-transform: scale(-1, 1);
    }
    i {
      margin-left: 5px;
    }
  }
`;

const Tabs = css`
  justify-content: center;
  position: absolute;
  top: 25px;
  left: 0;
  right: 0;
`;

const EquippedWeaponSlots = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: -webkit-fit-content;
  margin: 0 auto;
  bottom: 22px;
  left: 0;
  right: 0;
  width: 100%;
  padding: 5px 0;
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
`;

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
    left: -105px;
    bottom: 0;
    width: 97px;
    background: url(../images/paperdoll/ornament-slot-bot-left.png) no-repeat;
    background-size: contain;
    opacity: ${WEAPON_ORNAMENT_OPACITY};
    z-index: 0;
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: -88px;
    bottom: 0;
    width: 97px;
    background: url(../images/paperdoll/ornament-slot-bot-right.png) no-repeat;
    background-size: contain;
    opacity: ${WEAPON_ORNAMENT_OPACITY};
    z-index: 0;
  }
`;

const ItemSlotSpacing = css`
  margin-bottom: 10px;
`;

const WeaponSpacing = css`
  margin-right: 15px;
  pointer-events: all;
`;

const outerEquipmentSlotsAndInfo: EquipmentSlotsAndInfo[] = [
  { slotName: GearSlots.Skull, openingSide: Alignment.ATopRight },
  { slotName: GearSlots.Face, openingSide: Alignment.ATopRight },
  { slotName: GearSlots.Neck, openingSide: Alignment.ATopRight },
  { slotName: GearSlots.ShoulderLeft, openingSide: Alignment.ATopRight },
  { slotName: GearSlots.ShoulderRight, openingSide: Alignment.ABottomRight },
  { slotName: GearSlots.Chest, openingSide: Alignment.ABottomRight },
  { slotName: GearSlots.Back, openingSide: Alignment.ABottomRight },
  { slotName: GearSlots.Waist, openingSide: Alignment.ABottomRight },
  { slotName: GearSlots.Cloak, openingSide: Alignment.ATopLeft },
  { slotName: GearSlots.ForearmLeft, openingSide: Alignment.ATopLeft },
  { slotName: GearSlots.ForearmRight, openingSide: Alignment.ATopLeft },
  { slotName: GearSlots.HandLeft, openingSide: Alignment.ATopLeft },
  { slotName: GearSlots.HandRight, openingSide: Alignment.ABottomLeft },
  { slotName: GearSlots.Thighs, openingSide: Alignment.ABottomLeft },
  { slotName: GearSlots.Shins, openingSide: Alignment.ABottomLeft },
  { slotName: GearSlots.Feet, openingSide: Alignment.ABottomLeft },
];

const innerEquipmentSlotsAndInfo: EquipmentSlotsAndInfo[] = [
  { slotName: GearSlots.SkullUnder, openingSide: Alignment.ATopRight },
  { slotName: GearSlots.FaceUnder, openingSide: Alignment.ATopRight },
  { slotName: GearSlots.NeckUnder, openingSide: Alignment.ATopRight },
  { slotName: GearSlots.ShoulderLeftUnder, openingSide: Alignment.ATopRight },
  { slotName: GearSlots.ShoulderRightUnder, openingSide: Alignment.ABottomRight },
  { slotName: GearSlots.ChestUnder, openingSide: Alignment.ABottomRight },
  { slotName: GearSlots.BackUnder, openingSide: Alignment.ABottomRight },
  { slotName: GearSlots.WaistUnder, openingSide: Alignment.ABottomRight },
  { slotName: GearSlots.CloakUnder, openingSide: Alignment.ATopLeft },
  { slotName: GearSlots.ForearmLeftUnder, openingSide: Alignment.ATopLeft },
  { slotName: GearSlots.ForearmRightUnder, openingSide: Alignment.ATopLeft },
  { slotName: GearSlots.HandLeftUnder, openingSide: Alignment.ATopLeft },
  { slotName: GearSlots.HandRightUnder, openingSide: Alignment.ABottomLeft },
  { slotName: GearSlots.ThighsUnder, openingSide: Alignment.ABottomLeft },
  { slotName: GearSlots.ShinsUnder, openingSide: Alignment.ABottomLeft },
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

interface EquipmentSlotsTabData {
  title: string;
  onClick: () => void;
  className: string;
}

class EquipmentSlots extends React.Component<EquipmentSlotsComponentProps, EquipmentSlotsState> {
  private eventHandles: EventHandle[] = [];

  constructor(props: EquipmentSlotsComponentProps) {
    super(props);
    this.state = {
      selectedItemMenu: null,
    };
  }

  public render() {
    const { selectedItemMenu } = this.state;
    const tabs: TabItem<EquipmentSlotsTabData>[] = [
      {
        name: 'OUTER',
        tab: { title: 'Outer', onClick: () => {}, className: 'outer-toggle' },
        rendersContent: 'outer',
      },
      {
        name: 'INNER',
        tab: { title: 'Inner', onClick: () => {}, className: 'inner-toggle' },
        rendersContent: 'inner',
      },
    ];

    const content: ContentItem[] = [
      { name: 'outer', content: { render: this.renderOuterSlots } },
      { name: 'inner', content: { render: this.renderInnerSlots } },
    ];
    return (
      <Container>
        <PaperdollIcon />
        <TabPanel
          defaultTabIndex={0}
          tabs={tabs}
          renderTabDivider={() => <TabDivider />}
          renderTab={(tab: EquipmentSlotsTabData, active: boolean) =>
            <ToggleTab onClick={tab.onClick} className={`${active ? 'isActive' : 'isInactive'} ${tab.className}`}>
              {tab.title === 'Outer' && <i className='icon-filter-armor'></i>}
              {tab.title}
              {tab.title === 'Inner' && <i className='icon-filter-underlayer'></i>}
            </ToggleTab>
          }
          content={content}
          styles={{ tabs: Tabs }}
          alwaysRenderContent={true}
        />
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
      equipmentSlots.map((slot) => {
        const equippedItem = _.find(equippedItems, (eItem): any => {
          return _.find(eItem.gearSlots, gearSlot => gearSlot.id === slot.slotName);
        });
        const isWeapon = _.includes(slot.slotName, 'Weapon');
        return (
            <div
              key={slot.slotName}
              className={cx(
                !isWeapon ? ItemSlotSpacing : '',
                isWeapon ? WeaponSpacing : '',
              )}
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

  private renderInnerSlots = () => {
    return (
      <ArmorSlotsContainer>
        <LeftArmorSlots>
          <LeftSideOrnament />
          {this.renderEquipmentSlotSection(innerEquipmentSlotsAndInfo.slice(0, 8))}
        </LeftArmorSlots>
        <RightArmorSlots>
          <RightSideOrnament />
          {this.renderEquipmentSlotSection(innerEquipmentSlotsAndInfo.slice(8, innerEquipmentSlotsAndInfo.length))}
        </RightArmorSlots>
      </ArmorSlotsContainer>
    );
  }

  private renderOuterSlots = () => {
    return (
      <ArmorSlotsContainer>
        <LeftArmorSlots>
          <LeftSideOrnament />
          {this.renderEquipmentSlotSection(outerEquipmentSlotsAndInfo.slice(0, 8))}
        </LeftArmorSlots>
        <RightArmorSlots>
          <RightSideOrnament />
          {this.renderEquipmentSlotSection(outerEquipmentSlotsAndInfo.slice(8, outerEquipmentSlotsAndInfo.length))}
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
