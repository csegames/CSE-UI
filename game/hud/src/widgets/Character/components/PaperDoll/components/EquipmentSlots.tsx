/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';

import { ContentItem, TabItem, TabPanel } from '@csegames/camelot-unchained';
import { StyleDeclaration, StyleSheet, css } from 'aphrodite';
import * as events from '@csegames/camelot-unchained/lib/events';

import EquippedItemSlot from './EquippedItemSlot';
import PopupMiniInventory, { Alignment } from './PopupMiniInventory';
import { gearSlots } from '../../../lib/constants';
import { getEquippedDataTransfer } from '../../../lib/utils';
import eventNames, {
  EquipItemCallback,
  UnequipItemCallback,
  UpdateInventoryItemsPayload,
} from '../../../lib/eventNames';
import { InventoryItemFragment, EquippedItemFragment } from '../../../../../gqlInterfaces';

export interface EquipmentSlotsStyles extends StyleDeclaration {
  equipmentSlots: React.CSSProperties;
  armorSlotsContainer: React.CSSProperties;
  loadingContainer: React.CSSProperties;
  toggleContainer: React.CSSProperties;
  toggleOn: React.CSSProperties;
  toggleText: React.CSSProperties;
  outerToggle: React.CSSProperties;
  underToggle: React.CSSProperties;
  itemSlotSpacing: React.CSSProperties;
  equippedWeaponSlots: React.CSSProperties;
  weaponSpacing: React.CSSProperties;
}

export const defaultEquipmentSlotsStyle: EquipmentSlotsStyles = {
  equipmentSlots: {
    flex: '1 1 auto',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  armorSlotsContainer: {
    flex: '1 1 auto',
    display: 'flex',
    justifyContent: 'space-between',
    userSelect: 'none',
    height: '100%',
    padding: '0 45px',
    alignItems: 'center',
  },

  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
  },

  toggleContainer: {
    justifyContent: 'center',
    fontSize: '24px',
    color: '#FDD30D',
  },

  toggleOn: {
    color: '#FDD30D',
    borderBottom: '1px solid #FDD30D',
  },

  toggleText: {
    display: 'inline',
    fontSize: '24px',
    color: '#85661B',
    webkitUserSelect: 'none',
    userSelect: 'none',
  },

  outerToggle: {
    paddingRight: '10px',
    cursor: 'pointer',
  },

  underToggle: {
    paddingLeft: '10px',
    cursor: 'pointer',
  },

  itemSlotSpacing: {
    marginBottom: '15px',
  },

  equippedWeaponSlots: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '-webkit-fit-content',
    margin: '0 auto',
    bottom: '40px',
    left: 0,
    right: 0,
  },
  weaponSpacing: {
    marginRight: '15px',
  },
};

const outerEquipmentSlotsAndInfo: EquipmentSlotsAndInfo[] = [
  { slotName: gearSlots.Skull, openingSide: Alignment.ATopRight },
  { slotName: gearSlots.Face, openingSide: Alignment.ATopRight },
  { slotName: gearSlots.Neck, openingSide: Alignment.ATopRight },
  { slotName: gearSlots.ShoulderLeft, openingSide: Alignment.ATopRight },
  { slotName: gearSlots.ShoulderRight, openingSide: Alignment.ABottomRight },
  { slotName: gearSlots.Chest, openingSide: Alignment.ABottomRight },
  { slotName: gearSlots.Back, openingSide: Alignment.ABottomRight },
  { slotName: gearSlots.Waist, openingSide: Alignment.ABottomRight },
  { slotName: gearSlots.Cloak, openingSide: Alignment.ATopLeft },
  { slotName: gearSlots.ForearmLeft, openingSide: Alignment.ATopLeft },
  { slotName: gearSlots.ForearmRight, openingSide: Alignment.ATopLeft },
  { slotName: gearSlots.HandLeft, openingSide: Alignment.ATopLeft },
  { slotName: gearSlots.HandRight, openingSide: Alignment.ABottomLeft },
  { slotName: gearSlots.Thighs, openingSide: Alignment.ABottomLeft },
  { slotName: gearSlots.Shins, openingSide: Alignment.ABottomLeft },
  { slotName: gearSlots.Feet, openingSide: Alignment.ABottomLeft },
];

const innerEquipmentSlotsAndInfo: EquipmentSlotsAndInfo[] = [
  { slotName: gearSlots.SkullUnder, openingSide: Alignment.ATopRight },
  { slotName: gearSlots.FaceUnder, openingSide: Alignment.ATopRight },
  { slotName: gearSlots.NeckUnder, openingSide: Alignment.ATopRight },
  { slotName: gearSlots.ShoulderLeftUnder, openingSide: Alignment.ATopRight },
  { slotName: gearSlots.ShoulderRightUnder, openingSide: Alignment.ABottomRight },
  { slotName: gearSlots.ChestUnder, openingSide: Alignment.ABottomRight },
  { slotName: gearSlots.BackUnder, openingSide: Alignment.ABottomRight },
  { slotName: gearSlots.WaistUnder, openingSide: Alignment.ABottomRight },
  { slotName: gearSlots.CloakUnder, openingSide: Alignment.ATopLeft },
  { slotName: gearSlots.ForearmLeftUnder, openingSide: Alignment.ATopLeft },
  { slotName: gearSlots.ForearmRightUnder, openingSide: Alignment.ATopLeft },
  { slotName: gearSlots.HandLeftUnder, openingSide: Alignment.ATopLeft },
  { slotName: gearSlots.HandRightUnder, openingSide: Alignment.ABottomLeft },
  { slotName: gearSlots.ThighsUnder, openingSide: Alignment.ABottomLeft },
  { slotName: gearSlots.ShinsUnder, openingSide: Alignment.ABottomLeft },
  { slotName: gearSlots.FeetUnder, openingSide: Alignment.ABottomLeft },
];

const weaponSlots: EquipmentSlotsAndInfo[] = [
  { slotName: gearSlots.PrimaryHandWeapon, openingSide: Alignment.WTopRight },
  { slotName: gearSlots.SecondaryHandWeapon, openingSide: Alignment.WTopLeft },
];

export interface EquipmentSlotsProps {
  styles?: Partial<EquipmentSlotsStyles>;
  equippedItems: EquippedItemFragment[];
  onEquippedItemsChange: (equippedItems: EquippedItemFragment[]) => void;
  inventoryItems: InventoryItemFragment[];
}

export interface EquipmentSlotsAndInfo {
  slotName: string;
  openingSide: Alignment;
}

export interface EquipmentSlotsState {
  showUnder: boolean;
  slotNameItemMenuVisible: string;
}

class EquipmentSlots extends React.Component<EquipmentSlotsProps, EquipmentSlotsState> {
  private style: EquipmentSlotsStyles;
  private customStyle: Partial<EquipmentSlotsStyles>;
  private equipItemListener: number;
  private onUnequipItemListener: number;

  constructor(props: EquipmentSlotsProps) {
    super(props);
    this.state = {
      showUnder: false,
      slotNameItemMenuVisible: '',
    };
  }

  public render() {
    const style = this.style = StyleSheet.create(defaultEquipmentSlotsStyle);
    const customStyle = this.customStyle = StyleSheet.create(this.props.styles || {});
    const { showUnder } = this.state;

    const outerToggleClass = css(
      style.toggleText, customStyle.toggleText,
      style.outerToggle, customStyle.outerToggle,
      !showUnder && style.toggleOn, !showUnder && customStyle.toggleOn,
    );
    const innerToggleClass = css(
      style.toggleText, customStyle.toggleText,
      style.underToggle, customStyle.underToggle,
      showUnder && style.toggleOn, showUnder && customStyle.toggleOn,
    );

    const tabs: TabItem[] = [
      {
        name: 'OUTER',
        tab: {
          render: () => <p onClick={this.toggleOuter} className={outerToggleClass}>Outer</p>,
        },
        rendersContent: 'outer',
      },
      {
        name: 'INNER',
        tab: {
          render: () => <p onClick={this.toggleUnder} className={innerToggleClass}>Under</p>,
        },
        rendersContent: 'inner',
      },
    ];

    const content: ContentItem[] = [
      {
        name: 'outer',
        content: {
          render: this.renderOuterSlots,
        },
      },
      {
        name: 'inner',
        content: {
          render: this.renderInnerSlots,
        },
      },
    ];
    return (
      <div className={css(style.equipmentSlots, customStyle.equipmentSlots)}>
        <TabPanel
          defaultTabIndex={0}
          tabs={tabs}
          content={content}
          styles={{
            tabs: defaultEquipmentSlotsStyle.toggleContainer,
          }}
          alwaysRenderContent={true}
        />
        <div className={css(style.equippedWeaponSlots, customStyle.equippedweaponSlots)}>
          {this.renderEquipmentSlotSection(weaponSlots)}
        </div>
      </div>
    );
  }

  public componentDidMount() {
    this.equipItemListener = events.on(eventNames.onEquipItem, this.onEquipItem);
    this.onUnequipItemListener = events.on(eventNames.onUnequipItem, this.onUnequipItem);
  }

  public componentWillUnmount() {
    events.off(this.equipItemListener);
    events.off(this.onUnequipItemListener);
  }

  private onUnequipItem = (payload: UnequipItemCallback) => {
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
      events.fire(eventNames.updateInventoryItems, updateInventoryItemsPayload);
    }
  }

  private onEquipItem = (payload: EquipItemCallback) => {
    const { inventoryItem, willEquipTo } = payload;
    const equippedItems = this.props.equippedItems;
    const filteredItems = _.filter(equippedItems, ((equippedItem) => {
      return !_.find(equippedItem.gearSlots, (gearSlot): any => {
        return _.find(willEquipTo, slot => gearSlot.id === slot.id);
      });
    }));
    const newItem: InventoryItemFragment = {
      ...inventoryItem.item,
      location: {
        inventory: null,
        inContainer: null,
        equipped: {
          gearSlots: willEquipTo,
        },
      },
    };
    const newEquippedItem = { item: newItem, gearSlots: willEquipTo };
    this.props.onEquippedItemsChange(filteredItems.concat(newEquippedItem));

    const prevEquippedItem = _.filter(equippedItems, equippedItem =>
      _.findIndex(equippedItem.gearSlots, gearSlot =>
        _.find(willEquipTo, slot => slot.id === gearSlot.id),
      ) > -1)
      .map((equippedItem) => {
        return getEquippedDataTransfer({
          item: equippedItem.item,
          position: 0,
          location: 'Equipped',
          gearSlots: equippedItem.gearSlots,
        });
      });

    const updateInventoryItemsPayload: UpdateInventoryItemsPayload = {
      type: 'Equip',
      inventoryItem,
      willEquipTo,
      equippedItem: prevEquippedItem.length > 0 ? prevEquippedItem : null,
    };

    events.fire(eventNames.updateInventoryItems, updateInventoryItemsPayload);
  }

  private renderEquipmentSlotSection = (equipmentSlots: EquipmentSlotsAndInfo[]) => {
    const equippedItems = this.props.equippedItems;
    const style = this.style;
    const customStyle = this.customStyle;
    return (
      equipmentSlots.map((slot) => {
        const equippedItem = _.find(equippedItems, (eItem): any => {
          return _.find(eItem.gearSlots, gearSlot => gearSlot.id === slot.slotName);
        });
        const isWeapon = _.includes(slot.slotName, 'Weapon');
        return (
          <PopupMiniInventory
            key={slot.slotName}
            align={slot.openingSide}
            inventoryItems={this.props.inventoryItems}
            slotName={slot.slotName}
            visible={slot.slotName === this.state.slotNameItemMenuVisible}
            onVisibilityChange={this.onToggleItemMenuVisibility}>
          <div
            key={slot.slotName}
            className={css(
              !isWeapon && style.itemSlotSpacing,
              !isWeapon && customStyle.itemSlotSpacing,
              isWeapon && style.weaponSpacing,
              isWeapon && customStyle.weaponSpacing,
            )}>
            <EquippedItemSlot slot={slot} providedEquippedItem={equippedItem} />
          </div>
          </PopupMiniInventory>
        );
      })
    );
  }

  private renderInnerSlots = () => {
    const ss = this.style;
    const customStyle = this.customStyle;
    return (
      <div className={css(ss.armorSlotsContainer, customStyle.armorSlotsContainer)}>
        <div>{this.renderEquipmentSlotSection(innerEquipmentSlotsAndInfo.slice(0, 8))}</div>
        <div>{this.renderEquipmentSlotSection(innerEquipmentSlotsAndInfo.slice(8, innerEquipmentSlotsAndInfo.length))}</div>
      </div>
    );
  }

  private renderOuterSlots = () => {
    const ss = this.style;
    const customStyle = this.customStyle;
    return (
      <div className={css(ss.armorSlotsContainer, customStyle.armorSlotsContainer)}>
        <div>{this.renderEquipmentSlotSection(outerEquipmentSlotsAndInfo.slice(0, 8))}</div>
        <div>{this.renderEquipmentSlotSection(outerEquipmentSlotsAndInfo.slice(8, outerEquipmentSlotsAndInfo.length))}</div>
      </div>
    );
  }

  private onToggleItemMenuVisibility = (slotName: string) => {
    if (slotName === this.state.slotNameItemMenuVisible) {
      this.setState({ slotNameItemMenuVisible: '' });
    } else {
      this.setState({ slotNameItemMenuVisible: slotName });
    }
  }

  private toggleOuter = () => {
    this.setState({ showUnder: false });
  }

  private toggleUnder = () => {
    this.setState({ showUnder: true });
  }
}

export default EquipmentSlots;
