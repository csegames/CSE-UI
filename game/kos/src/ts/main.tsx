/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Player, events} from 'camelot-unchained';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

class KOSList extends React.Component<any, any> {
  render() {
    var createItem = function(itemText: string, index: number) {
      return <li key={index + itemText}>{itemText}</li>;
    };
    return <ul>{this.props.items.map(createItem)}</ul>;
  }
}

class KOSAppState {
  public items: Array<string>;
  public text: string;

  constructor() {
    this.items = new Array<string>();
    this.text = '';
  }
}

class KOSApp extends React.Component<any, KOSAppState> {

  public myCharacterName: string;

  constructor(props: any) {
    super(props);

    this.myCharacterName = '';

    var myState:KOSAppState = new KOSAppState();
    if (localStorage['KOSApp_KOSLIST']) {
      myState.items = JSON.parse(localStorage['KOSApp_KOSLIST']);
    }
    this.state = myState;
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.init = this.init.bind(this);
    this.parseChatMessage = this.parseChatMessage.bind(this);
    events.on('init', this.init);
  }

  init() {
    events.on(events.handlesChat.topic, this.parseChatMessage);

    events.on(events.handlesCharacter.topic, (player: Player) => {
      this.myCharacterName = player.name;
    });
  }

  parseChatMessage(chatObject: any) {
    console.log(JSON.stringify(chatObject));

    if ((chatObject.from as string).indexOf('_combat') === -1) return;

    var users = chatObject.body.split('killed');
    if ((users[0].trim() as string) !== this.myCharacterName) return;
    var killed = users[1].trim();
    killed = killed.substring(0, killed.length - 1);
    var index = this.state.items.indexOf(killed);
    if (index !== -1) {
      console.log('Yay! You killed a KOS ' + killed);
      var nextItems = this.state.items;
      nextItems.splice(index, 1);
      this.setState({
        items: nextItems,
        text: this.state.text
      });
      localStorage.setItem('KOSApp_KOSLIST', JSON.stringify(nextItems));
    }
  }

  onChange(e:any) {
    this.setState({
      items: this.state.items,
      text: e.target.value
    });
  }

  handleSubmit(e: any) {
    e.preventDefault();
    var nextItems = this.state.items.concat([this.state.text]);
    var nextText = '';
    this.setState({items: nextItems, text: nextText});
    localStorage.setItem('KOSApp_KOSLIST', JSON.stringify(nextItems));
  }



  render() {
    return (
      <div>
        <h3>KOS List</h3>
        <KOSList items={this.state.items} />
        <form onSubmit={this.handleSubmit}>
          <input onChange={this.onChange} value={this.state.text} />
          <button>{'Add #' + (this.state.items.length + 1)}</button>
        </form>
      </div>
    );
  }
}

ReactDOM.render(<KOSApp />, document.getElementById('app'));