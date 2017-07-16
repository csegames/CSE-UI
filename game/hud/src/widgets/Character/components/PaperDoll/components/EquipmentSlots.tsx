/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-06-23 00:19:34
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-12 10:29:33
 */

import * as React from 'react';
import * as _ from 'lodash';

import { ContentItem, TabItem, TabPanel, ql } from 'camelot-unchained';
import { StyleDeclaration, StyleSheet, css } from 'aphrodite';

import EquippedItemSlot from './EquippedItemSlot';
import { gearSlots } from '../../../lib/constants';

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

const openingSides = {
  armorRT: 'armor-rt',
  armorRB: 'armor-rb',
  armorLT: 'armor-lt',
  armorLB: 'armor-lb',
  weaponTR: 'weapon-tr',
  weaponTL: 'weapon-tl',
};

const outerEquipmentSlotsAndInfo: EquipmentSlotsAndInfo[] = [
  { slotName: gearSlots.Skull, openingSide: openingSides.armorRT },
  { slotName: gearSlots.Face, openingSide: openingSides.armorRT },
  { slotName: gearSlots.Neck, openingSide: openingSides.armorRT },
  { slotName: gearSlots.ShoulderLeft, openingSide: openingSides.armorRT },
  { slotName: gearSlots.ShoulderRight, openingSide: openingSides.armorRB },
  { slotName: gearSlots.Chest, openingSide: openingSides.armorRB },
  { slotName: gearSlots.Back, openingSide: openingSides.armorRB },
  { slotName: gearSlots.Waist, openingSide: openingSides.armorRB },
  { slotName: gearSlots.Cloak, openingSide: openingSides.armorLT },
  { slotName: gearSlots.ForearmLeft, openingSide: openingSides.armorLT },
  { slotName: gearSlots.ForearmRight, openingSide: openingSides.armorLT },
  { slotName: gearSlots.HandLeft, openingSide: openingSides.armorLT },
  { slotName: gearSlots.HandRight, openingSide: openingSides.armorLB },
  { slotName: gearSlots.Thighs, openingSide: openingSides.armorLB },
  { slotName: gearSlots.Shins, openingSide: openingSides.armorLB },
  { slotName: gearSlots.Feet, openingSide: openingSides.armorLB },
];

const innerEquipmentSlotsAndInfo: EquipmentSlotsAndInfo[] = [
  { slotName: gearSlots.SkullUnder, openingSide: openingSides.armorRT },
  { slotName: gearSlots.FaceUnder, openingSide: openingSides.armorRT },
  { slotName: gearSlots.NeckUnder, openingSide: openingSides.armorRT },
  { slotName: gearSlots.ShoulderLeftUnder, openingSide: openingSides.armorRT },
  { slotName: gearSlots.ShoulderRightUnder, openingSide: openingSides.armorRB },
  { slotName: gearSlots.ChestUnder, openingSide: openingSides.armorRB },
  { slotName: gearSlots.BackUnder, openingSide: openingSides.armorRB },
  { slotName: gearSlots.WaistUnder, openingSide: openingSides.armorRB },
  { slotName: gearSlots.CloakUnder, openingSide: openingSides.armorLT },
  { slotName: gearSlots.ForearmLeftUnder, openingSide: openingSides.armorLT },
  { slotName: gearSlots.ForearmRightUnder, openingSide: openingSides.armorLT },
  { slotName: gearSlots.HandLeftUnder, openingSide: openingSides.armorLT },
  { slotName: gearSlots.HandRightUnder, openingSide: openingSides.armorLB },
  { slotName: gearSlots.ThighsUnder, openingSide: openingSides.armorLB },
  { slotName: gearSlots.ShinsUnder, openingSide: openingSides.armorLB },
  { slotName: gearSlots.FeetUnder, openingSide: openingSides.armorLB },
];

const weaponSlots: EquipmentSlotsAndInfo[] = [
  { slotName: gearSlots.PrimaryHandWeapon, openingSide: openingSides.weaponTR },
  { slotName: gearSlots.SecondaryHandWeapon, openingSide: openingSides.weaponTL },
];

export interface EquipmentSlotsProps {
  styles?: Partial<EquipmentSlotsStyles>;
  equippedItems: ql.schema.EquippedItem[];
}

export interface EquipmentSlotsAndInfo {
  slotName: string;
  openingSide: string;
}

export interface EquipmentSlotsState {
  showUnder: boolean;
}

class EquipmentSlots extends React.Component<EquipmentSlotsProps, EquipmentSlotsState> {
  private style: EquipmentSlotsStyles;
  private customStyle: Partial<EquipmentSlotsStyles>;

  constructor(props: EquipmentSlotsProps) {
    super(props);
    this.state = {
      showUnder: false,
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
          tabs={tabs}
          content={content}
          styles={{
            tabs: defaultEquipmentSlotsStyle.toggleContainer,
          }}
        />
        {this.renderWeaponSlots(weaponSlots)}
      </div>
    );
  }

  private renderEquipmentSlotsection = (equipmentSlots: EquipmentSlotsAndInfo[]) => {
    const { equippedItems } = this.props;
    const style = this.style;
    const customStyle = this.customStyle;
    return (
      <div>
        {equipmentSlots.map((slot) => {
          const equippedItem = _.find(equippedItems, (eItem) => {
            return _.find(eItem.gearSlots, gearSlot => gearSlot.id === slot.slotName);
          });
          return (
            <div key={slot.slotName} className={css(style.itemSlotSpacing, customStyle.itemSlotSpacing)}>
              <EquippedItemSlot
                providedEquippedItem={equippedItem}
                slotName={slot.slotName}
                openingSide={slot.openingSide}
              />
            </div>
          );
        })}
      </div>
    );
  }

  private renderWeaponSlots = (weaponSlots: EquipmentSlotsAndInfo[]) => {
    const style = this.style;
    const customStyle = this.customStyle;

    return (
      <div className={css(style.equippedWeaponSlots, customStyle.equippedWeaponSlots)}>
        {weaponSlots.map((slot) => {
          const equippedWeapon = _.find(this.props.equippedItems, (eItem) => {
            return _.find(eItem.gearSlots, gearSlot => gearSlot.id === slot.slotName);
          });
          return (
            <div key={slot.slotName} className={css(style.weaponSpacing, customStyle.weaponSpacing)}>
              <EquippedItemSlot
                providedEquippedItem={equippedWeapon}
                slotName={slot.slotName}
                openingSide={slot.openingSide}
              />
            </div>
          );
        })}
      </div>
    );
  };

  private renderInnerSlots = () => {
    const ss = this.style;
    const customStyle = this.customStyle;
    return (
    <div className={css(ss.armorSlotsContainer, customStyle.armorSlotsContainer)}>
      {this.renderEquipmentSlotsection(innerEquipmentSlotsAndInfo.slice(0, 8))}
      {this.renderEquipmentSlotsection(innerEquipmentSlotsAndInfo.slice(8, innerEquipmentSlotsAndInfo.length))}
    </div>
    );
  }

  private renderOuterSlots = () => {
    const ss = this.style;
    const customStyle = this.customStyle;
    return (
      <div className={css(ss.armorSlotsContainer, customStyle.armorSlotsContainer)}>
        {this.renderEquipmentSlotsection(outerEquipmentSlotsAndInfo.slice(0, 8))}
        {this.renderEquipmentSlotsection(outerEquipmentSlotsAndInfo.slice(8, outerEquipmentSlotsAndInfo.length))}
      </div>
    );
  }

  private toggleOuter = () => {
    this.setState({ showUnder: false });
  }

  private toggleUnder = () => {
    this.setState({ showUnder: true });
  }
}

export default EquipmentSlots;
