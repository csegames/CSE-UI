/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { events, client, Item } from '@csegames/camelot-unchained';
import * as React from 'react';


export interface InventoryWindowProps {

}

export interface InventoryWindowState {
  items: Items;
  stacks: Stack;
  visible: boolean;
}

export interface Items {
  [id: string]: Item;
}

export interface Stack {
  [id: string]: string[];
}

class InventoryWindow extends React.Component<InventoryWindowProps, InventoryWindowState> {

  private lastClicked: number = 0;

  constructor(props: InventoryWindowProps) {
    super(props);
    this.state = {
      items: {},
      stacks: {},
      visible: false,
    };
  }

  public render() {
    if (this.state.visible) {
      return (
        <div className='inventory-container cu-window'>
          <div className='cu-window-header cu-window-bg-brown'>
            <div className='cu-window-title'>Inventory</div>
            <div className='cu-window-actions'>
              <a onClick={this.hideWindow} className='cu-window-close'></a>
            </div>
          </div>
          <div className='cu-window-content'>
            <ul className='inventory-list inventory-list--vertical'>
              {this.renderItems()}
            </ul>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  public componentWillMount() {
    client.SubscribeInventory(true);
    client.OnInventoryAdded(this.addItem);
    client.OnInventoryRemoved(this.removeItem);
  }

  public componentDidMount() {
    events.on('hudnav--navigate', (name: string) => {
      if (name === 'inventory') {
        if (this.state.visible) {
          this.setState((state, props) => ({ visible: false }));
        } else {
          this.setState((state, props) => ({ visible: true }));
        }
      }
    });
  }

  public componentWillUnmount() {
    events.off('hudnav--navigate');
    client.ReleaseInputOwnership();
  }

  private addItem = (item: Item) => {
    this.setState((state, props) => {
      const items = { ...state.items, [item.id]: item };
      // should this stack??
      // stacking is determined by name and gear slot
      const stackId = item.name + item.gearSlot;
      const stack = state.stacks[stackId] ? state.stacks[stackId].concat(item.id) : [item.id];
      const stacks = { ...state.stacks, [stackId]: stack };
      return {
        items,
        stacks,
      };
    });
  }

  private removeItem = (id: string) => {
    this.setState((state, props) => {
      const items = { ...this.state.items };
      const stacks = { ...this.state.stacks };
      if (!items[id]) return;

      const stackId = items[id].name + items[id].gearSlot;
      delete items[id];
      if (stacks[stackId].length > 1) {
        // stack remains
        const index = stacks[stackId].findIndex(s => s === id);
        stacks[stackId].splice(index, 1);
      } else {
        // stack is removed
        delete stacks[stackId];
      }
      return {
        items,
        stacks,
      };
    });
  }

  private hideWindow = () => {
    this.setState((state, props) => ({
      visible: false,
    }));
  }

  private useItem = (stackId: string) => {
    const itemId = this.state.stacks[stackId][0];
    const item = this.state.items[itemId];
    if (item && item.gearSlot !== 'NONE') {
      client.EquipItem(itemId);
    }
  }

  private dropItem = (stackId: string) => {
    const itemId = this.state.stacks[stackId][0];
    const item = this.state.items[itemId];
    if (item && item.gearSlot !== 'NONE') {
      client.DropItem(itemId);
    }
  }

  private simDblClick(onDblClick: any, ...args: any[]) {
    const now: number = Date.now();
    if (now - this.lastClicked < 500) {
      onDblClick(...args);
      this.lastClicked = 0;
    } else {
      this.lastClicked = now;
    }
  }

  private renderItems = () => {
    const toRender: JSX.Element[] = [];

    Object.keys(this.state.stacks).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).forEach((key: string) => {
      const stack = this.state.stacks[key];
      const firstItem = this.state.items[stack[0]];

      toRender.push(
        (
          <li className='inventory-item'
              key={key}
              onClick={() => this.simDblClick(this.useItem, key)}
              onContextMenu={() => this.dropItem(key)}>
            <div className='quantity'>{stack.length}</div>
            <div className='icon'><img src='../../interface-lib/@csegames/camelot-unchained/images/items/icon.png' /></div>
            <div className='name'>{firstItem.name}</div>
            <div className='tooltip'>
              <h1 className='tooltip__title'>{firstItem.name}</h1>
              <p className='tooltip__detail tooltip__slot'>{firstItem.gearSlot}</p>
              <p className='tooltip__detail tooltip__description'>{firstItem.description}</p>
              <p className='tooltip__meta'>Resource ID: {firstItem.id}</p>
            </div>
          </li>
        ),
      );
    });

    return (
      <div>
        <ul>{toRender}</ul>
      </div>
    );
  }
}

export default InventoryWindow;
