/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {events, client, Item} from 'camelot-unchained';
import * as React from 'react';
import * as ReactDOM from 'react-dom';


export interface InventoryWindowProps {

}

export interface InventoryWindowState {
  items: Items;
  stacks: Stack;
}

export interface Items {
  [id: string]: Item;
}

export interface Stack {
  [id: string]: string[];
}

class InventoryWindow extends React.Component<InventoryWindowProps, InventoryWindowState> {
  constructor(props: InventoryWindowProps) {
    super(props);
    this.state = {
      items: {},
      stacks: {},
    }
  }

  componentWillMount() {
    client.OnInventoryAdded(this.addItem);
    client.OnInventoryRemoved(this.removeItem);
  }

  addItem = (item: Item) => {
    const items = {...this.state.items, [item.id]: item};

    // should this stack??
    // stacking is determined by name and gear slot
    const stackId = item.name + item.gearSlot;
    const stack = this.state.stacks[stackId] ? this.state.stacks[stackId].concat(item.id) : [item.id];
    const stacks = {...this.state.stacks, [stackId]: stack};

    this.setState({
      items,
      stacks
    });
  }

  removeItem = (id: string) => {
    const items = {...this.state.items};
    const stacks = {...this.state.stacks};
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

    this.setState({
      items,
      stacks,
    });
  }

  hideWindow = () => {
    client.HideUI('inventory');
  }

  useItem = (stackId: string) => {
    const itemId = this.state.stacks[stackId][0];
    const item = this.state.items[itemId];
    if (item && item.gearSlot != 'NONE') {
      client.EquipItem(itemId);
    }
  }

  dropItem = (stackId: string) => {
    const itemId = this.state.stacks[stackId][0];
    const item = this.state.items[itemId];
    if (item && item.gearSlot != 'NONE') {
      client.DropItem(itemId);
    }
  }

  lastClicked: number = 0;
  simDblClick(onDblClick: any, ...args : any[]) {
    let now:number = Date.now();
    if (now - this.lastClicked < 500) {
      onDblClick(...args);
      this.lastClicked = 0;
    } else {
      this.lastClicked = now;
    }
  }

  renderItems = () => {
    const toRender: JSX.Element[] = [];
    const sortByGroup: {[id: string]: { name: string, elements:  JSX.Element[]}} = {};


    for (const key in this.state.stacks) {
      const stack = this.state.stacks[key];
      const firstItem = this.state.items[stack[0]];

      toRender.push(
        (
          <li className="inventory-item" 
              key={key}
              onClick={() => this.simDblClick(this.useItem, key)}
              onContextMenu={() => this.dropItem(key)}>
            <div className="quantity">{stack.length}</div>
            <div className="icon"><img src="../../interface-lib/camelot-unchained/images/items/icon.png" /></div>
            <div className="name">{firstItem.name}</div>
            <div className="tooltip">
              <h1 className="tooltip__title">{firstItem.name}</h1>
              <p className="tooltip__detail tooltip__slot">{firstItem.gearSlot}</p>
              <p className="tooltip__detail tooltip__description">{firstItem.description}</p>
              <p className="tooltip__meta">Resource ID: {firstItem.id}</p>
            </div>
          </li>
        )
      );
    }

    return (
      <div>
        <ul>{toRender}</ul>
      </div>
    );
  }

  render() {
    return (
      <div className="cu-window">
        <div className="cu-window-header cu-window-bg-brown">
          <div className="cu-window-title">Inventory</div>
          <div className="cu-window-actions">
            <a onClick={this.hideWindow} className="cu-window-close"></a>
          </div>
        </div>
        <div className="cu-window-content">
          <ul className="inventory-list inventory-list--vertical">
            {this.renderItems()}
          </ul>
        </div>
      </div>
    )
  }
}


events.on('init', () => {
  ReactDOM.render(<InventoryWindow />, document.getElementById('inventory'));
  client.SubscribeInventory(true);
});
