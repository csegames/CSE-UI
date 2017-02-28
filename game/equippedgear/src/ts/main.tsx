/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { client, Item } from 'camelot-unchained';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface EquippedGearWindowProps {
}

export interface EquippedGearWindowState {
  items: {
    [id: string]: Item
  }
}

export class EquippedGearWindow extends React.Component<EquippedGearWindowProps, EquippedGearWindowState> {
  constructor(props: any) {
    super(props);
    this.state = {
      items: {}
    };
  }

  componentWillMount() {
    if (client.initialized) {
      this.addCallbacks();
    } else {
      client.OnInitialized(() => {
        this.addCallbacks();      
      });
    }
  }

  addCallbacks = () => {
    client.SubscribeGear(true);
    client.OnGearAdded(this.onGearAdded);
    client.OnGearRemoved(this.onGearRemoved);
  }

  onGearAdded = (item: Item) => {
    var items = Object.assign({}, this.state.items);
    items[item.id] = item;
    this.setState({
      items 
    });
  }

  onGearRemoved = (itemID: string) => {
    var items = Object.assign({}, this.state.items);
    delete items[itemID];
    this.setState({
      items
    });
  }

  closeWindow(): void {
    client.HideUI('equippedgear');
  }

  unequipItem(item: Item): void {
    client.UnequipItem(item.id);
  }

  render() {
    const items: JSX.Element[] = [];

    for (const key in this.state.items) {
      const item = this.state.items[key];
      if (item == null) continue;
      items.push((
          <li key={item.gearSlot} className="equippedgear-title cu-font-cinzel">{item.gearSlot}</li>
        ));
        items.push((
          <li className="equippedgear-item" key={item.id} onDoubleClick={this.unequipItem.bind(this, item)} onContextMenu={this.unequipItem.bind(this, item)}>
            <div className="icon"><img src="../../interface-lib/camelot-unchained/images/items/icon.png" /></div>
            <div className="name">{item.name}</div>
            <div className="tooltip">
              <h1 className="tooltip__title">{item.name}</h1>
              <p className="tooltip__detail tooltip__slot">{item.gearSlot}</p>
              <p className="tooltip__detail tooltip__description">{item.description}</p>
              <p className="tooltip__meta">Resource ID: {item.id}</p>
            </div>
          </li>
        ))
    }
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
}

ReactDOM.render(<EquippedGearWindow />, document.getElementById('equippedgear'));
