/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {client, events, EquippedGear, Item, gearSlot} from 'camelot-unchained';
import ClassNames from 'classnames';

export class EquippedGearWindow extends React.Component<EquippedGearWindowProps, EquippedGearWindowState> {
  private listener: any;
  private gearSlots: string[];

  constructor(props: any) {
    super(props);
    this.state = {
      equippedgear: new EquippedGear()
    };
    this.gearSlots = Object.keys(gearSlot).filter((id: any) => {
      return !isNaN(id) && id != gearSlot.NONE;
    });
  }

  componentWillMount() {
    this.listener = events.on(events.handlesEquippedGear.topic, (equippedgear: EquippedGear) => {
      this.setState({
        equippedgear: equippedgear
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
    client.HideUI('equippedgear');
  }

  unequipItem(item: Item): void {
    client.UnequipItem(item.id);
  }

  render() {
    const items: JSX.Element[] = [];

    this.gearSlots.forEach((slotId: string, index: number) => {
      const item = this.state.equippedgear.getItemInGearSlot(slotId);
      if (item != null) {
        items.push((
          <li key={'gear-slot'+index} className="equippedgear-title cu-font-cinzel">{this.getGearSlotName(slotId)}</li>
        ));
        items.push((
          <li className="equippedgear-item" key={'item'+index} onDoubleClick={this.unequipItem.bind(this, item)} onContextMenu={this.unequipItem.bind(this, item)}>
            <div className="icon"><img src="../../interface-lib/camelot-unchained/images/items/icon.png" /></div>
            <div className="name">{item.name}</div>
            <div className="tooltip">
              <h1 className="tooltip__title">{item.name}</h1>
              <p className="tooltip__detail tooltip__slot">{this.getGearSlotName(item.gearSlot)}</p>
              <p className="tooltip__detail tooltip__description">{item.description}</p>
              <p className="tooltip__meta">Resource ID: {item.id}</p>
            </div>
          </li>
        ))
      }
    });
    return (
      <div className="cu-window">
        <div className="cu-window-header">
          <div className="cu-window-title">Equipped Gear</div>
          <div className="cu-window-actions">
            <a onMouseDown={this.closeWindow.bind(this)} className="cu-window-close"></a>
          </div>
        </div>
        <div className="cu-window-content">
          <ul className="equippedgear-list equippedgear-list--vertical">
            {items}
          </ul>
        </div>
      </div>
    );
  }

  getGearSlotName(slot: any): string {
    switch (parseInt(slot, 10)) {
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

export interface EquippedGearWindowProps {
}

export interface EquippedGearWindowState {
  equippedgear: EquippedGear;
}
