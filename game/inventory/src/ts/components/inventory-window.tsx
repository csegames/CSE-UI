/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {client, events, Inventory, Item, gearSlot} from 'camelot-unchained';
import ClassNames from 'classnames';
import {ItemGroup} from './item-group';

export class InventoryWindow extends React.Component<InventoryWindowProps, InventoryWindowState> {
  private listener: any;
  private lastClicked:number;

  constructor(props: any) {
    super(props);
    this.state = {
      inventory: new Inventory(),
      itemGroups: []
    };
  }

  componentWillMount() {
    this.listener = events.on(events.clientEventTopics.handlesInventory, (inventory: Inventory) => {
      this.setState({
        inventory: inventory,
        itemGroups: ItemGroup.buildItemGroups(inventory)
      });
    });
  }

  componentWillUnmount() {
    if (this.listener) {
      events.off(this.listener);
      this.listener = null;
    }
  }

  closeWindow(): void {
    client.HideUI('inventory');
  }

  useItem(group: ItemGroup): void {
    if (group.item.gearSlot != 0) {
      client.EquipItem(group.getFirstItemID());
    }
  }
  
  simDblClick(onDblClick: any, ...args : any[]) {
    let now:number = Date.now();
    if (now - this.lastClicked < 500) {
      onDblClick(...args);
      this.lastClicked = 0;
    } else {
      this.lastClicked = now;
    }
  }

  dropItem(group: ItemGroup): void {
    client.DropItem(group.getFirstItemID());
  }

  render() {
    const itemGroups: JSX.Element[] = [];
    const itemGroupsBySlot:any = {};
    this.state.itemGroups.forEach((group: ItemGroup, index: number) => {

      const gearSlotName = this.getGearSlotName(group.item.gearSlot);
      if(!itemGroupsBySlot.hasOwnProperty(gearSlotName)) {
        itemGroupsBySlot[gearSlotName] = [];
      }
      
      itemGroupsBySlot[gearSlotName].push((
          <li className="inventory-item" key={'item-group' + index} onClick={() => this.simDblClick(this.useItem, group)} onContextMenu={this.dropItem.bind(this, group )}>
            <div className="quantity">{group.quantity}</div>
            <div className="icon"><img src="../../interface-lib/camelot-unchained/images/items/icon.png" /></div>
            <div className="name">{group.item.name}</div>
            <div className="tooltip">
              <h1 className="tooltip__title">{group.item.name}</h1>
              <p className="tooltip__detail tooltip__slot">{this.getGearSlotName(group.item.gearSlot)}</p>
              <p className="tooltip__detail tooltip__description">{group.item.description}</p>
              <p className="tooltip__meta">Resource ID: {group.item.id}</p>
            </div>
          </li>
      ));
    });

    Object.keys(itemGroupsBySlot).forEach(key => {
      itemGroups.push((
        <div>
          <div className="cu-font-cinzel">{key}</div>
          <ul>{itemGroupsBySlot[key]}</ul>
        </div>
      ));
    });

    return (
      <div className="cu-window">
        <div className="cu-window-header cu-window-bg-brown">
          <div className="cu-window-title">Inventory</div>
          <div className="cu-window-actions">
            <a onMouseDown={this.closeWindow.bind(this)} className="cu-window-close"></a>
          </div>
        </div>
        <div className="cu-window-content">
          <ul className="inventory-list inventory-list--vertical">
            {itemGroups}
          </ul>
        </div>
      </div>
    );
  }

  getGearSlotName(slot: gearSlot): string {
    switch (slot) {
      case gearSlot.NONE:
        return 'None';
      case gearSlot.CHEST:
        return 'Chest';
      case gearSlot.LEFT_HAND:
        return 'Left Hand';
      case gearSlot.RIGHT_HAND:
        return 'Right Hand';
      case gearSlot.TWO_HANDED:
        return 'Two-Handed';
      case gearSlot.PANTS:
        return 'Pants';
      case gearSlot.BOOTS:
        return 'Boots';
      case gearSlot.LEFT_GLOVE:
        return 'Left Glove';
      case gearSlot.RIGHT_GLOVE:
        return 'Right Glove';
      case gearSlot.HELMET:
        return 'Helmet';
      case gearSlot.BELT:
        return 'Belt';
      case gearSlot.SKIRT:
        return 'Skirt';
      case gearSlot.TABARD:
        return 'Tabard';
      case gearSlot.CAPE:
        return 'Cape';
      default:
        return 'None';
    }
  }
}

export interface InventoryWindowProps {
}

export interface InventoryWindowState {
  inventory: Inventory;
  itemGroups: ItemGroup[];
}
