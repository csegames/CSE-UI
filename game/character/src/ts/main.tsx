/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

 // Character Wounds Frame

import * as React from 'react';
import * as ReactDom from 'react-dom';
import {events, stores, components, Player} from 'camelot-unchained';

const character : any = stores.CharacterStore.create();

class WoundsUIState {
  public character: any;
  constructor() {
    this.character = null;
  }
}
class WoundsUIProps {}

class WoundsUI extends React.Component<WoundsUIProps, WoundsUIState> {
  constructor(props: WoundsUIProps) {
    super(props);
    character.store.listen(this.oncharacter.bind(this));
  }
  componentWillMount() {
    // client.exe cuAPI BUG:-
    // We should be able to start events in componentDidMount except for
    // a client bug, that means if the event registrations are triggered
    // too long after the client starts (or not suring oninitialised callback)
    // then registering for the events does not get sent the initial data.
    // This can be seen by doing /closeui character ; /openui character
    // it will not be given the initial character data.  The problem is not
    // seen on initial load of the client because the UI is opened before
    // the character info is sent anyway.
    this.oncharacter(character.store.info);
  }
  oncharacter(character: Player) {
    this.setState({ character: character });
  }
  // Render the unit frame using character data
  render() {
    const character = this.state.character;
    return (
      <div>
        <components.WoundFrame name={character.name}
          injuries={character.injuries}
          health={character.health} healthMax={character.maxHealth}
          stamina={character.stamina} staminaMax={character.maxStamina}
          panic={15} panicMax={75}
          temp={78} tempMax={96}
          />
      </div>
    );
  }
}

events.on('init', () => {
  character.actions.start();
  ReactDom.render(<WoundsUI/>, document.getElementById("cse-ui-wounds"));
});
