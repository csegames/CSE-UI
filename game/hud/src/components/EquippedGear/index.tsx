/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-03-27 16:37:20
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-03-30 16:30:36
 */

import { client, Item, events, jsKeyCodes, hasClientAPI } from 'camelot-unchained';
import * as React from 'react';

export interface EquippedGearWindowProps {
}

export interface EquippedGearWindowState {
  items: {
    [id: string]: Item,
  };
  visible: boolean;
}

export class EquippedGearWindow extends React.Component<EquippedGearWindowProps, EquippedGearWindowState> {

  private mainRef: any = null;

  constructor(props: any) {
    super(props);
    this.state = {
      items: {},
      visible: false,
    };
  }

  public render() {
    const items: JSX.Element[] = [];

    for (const key in this.state.items) {
      const item = this.state.items[key];
      if (item == null) continue;
      items.push((
          <li key={item.gearSlot} className='equippedgear-title cu-font-cinzel'>{item.gearSlot}</li>
        ));
        items.push((
          <li
            className='equippedgear-item'
            key={item.id}
            onDoubleClick={this.unequipItem.bind(this, item)}
            onContextMenu={this.unequipItem.bind(this, item)}>
            <div className='equippedgear-icon'>
              <img src='../../interface-lib/camelot-unchained/images/items/icon.png' />
            </div>
            <div className='equippedgear-name'>{item.name}</div>
            <div className='equippedgear-tooltip'>
              <p className='equippedgear-tooltip__title'>{item.name}</p>
              <p className='equippedgear-tooltip__detail tooltip__slot'>{item.gearSlot}</p>
              <p className='equippedgear-tooltip__detail tooltip__description'>{item.description}</p>
              <p className='equippedgear-tooltip__meta'>Resource ID: {item.id}</p>
            </div>
          </li>
        ));
    }
    if (this.state.visible) {
      return (
        <div className='equippedgear-container cu-window' ref={r => this.mainRef = r}>
          <div className='cu-window-header'>
            <div className='cu-window-title'>Equipped Gear</div>
            <div className='cu-window-actions' onMouseDown={this.hide}>
              <a className='cu-window-close'></a>
            </div>
          </div>
          <div className='cu-window-content'>
            <ul className='equippedgear-list equippedgear-list--vertical'>
              {items}
            </ul>
          </div>
        </div>
      );
    } else { return null; }
  }

  public componentWillMount() {
    this.addCallbacks();
  }

  public componentDidMount() {
    events.on('hudnav--navigate', (name: string) => {
      if (name === 'equippedgear') {
        if (!this.state.visible) {
          this.show();
        } else {
          this.hide();
        }
      }
    });
    window.addEventListener('keydown', e => this.onKeyDown(e));
  }

  public componentWillUnmount() {
    events.off('hudnav--navigate');
    window.removeEventListener('keydown', this.onKeyDown);
  }
  
  private onKeyDown = (e : KeyboardEvent) => {
    if (e.which === jsKeyCodes.ESC && this.state.visible) {
      this.hide();
    }
  }

  private hide = () => {
    this.setState((state, props) => {
      return {
        visible: false,
      };
    });
  }

  private show = () => {
    this.setState((state, props) => {
      return {
        visible: true,
      };
    });
  }

  private addCallbacks = () => {
    if (hasClientAPI()) {
      client.SubscribeGear(true);
      client.OnGearAdded(item => this.onGearAdded(item));
      client.OnGearRemoved(item => this.onGearRemoved(item));
    }
  }

  private onGearAdded = (item: Item) => {
    this.setState((state, props) => {
      const items = {...state.items};
      items[item.id] = item;
      return {
        items,
      };
    });
  }

  private onGearRemoved = (itemID: string) => {
    this.setState((state, props) => {
      const items = {...state.items};
      delete items[itemID];
      return {
        items,
      };
    });
  }

  private unequipItem(item: Item): void {
    client.UnequipItem(item.id);
  }
}

export default EquippedGearWindow;
