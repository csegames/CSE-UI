/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Faction, events } from 'camelot-unchained';

import { FactionInfo } from '../services/session/factions';

export interface FactionSelectProps {
  factions: Array<FactionInfo>;
  selectedFaction: FactionInfo;
  selectFaction: (Faction: FactionInfo) => void;
}

export interface FactionSelectState {
}

const realmText: any = {
  'Arthurian': 'The Realm of King Arthur strives to be the embodiment of nobility, honesty, and righteous strength. They believe they are destined to save the world, not purely through conquest but through virtue and greatness of spirit. The Realm of Arthur accepts all who would better the world through integrity, and strong characters are always welcome to find a home here. The Arthurian Edicts ensure that no one is excluded from the march to a bright future for the Realm, so long as they follow a pure nobility of purpose. Some may say the Arthurians are self-righteous and obsessive, but in the Realm of Arthur they know the truth: Honor and devotion will unite us under an Arthurian Camelot once again.',

  'Viking': 'The Realm of the Vikings follows the path of blood and steel to greatness. In the tall peaks of windswept ice they make their homes, waiting for the moment to conquer the lands below. Sigurd the Dragonslayer leads a Realm whose warriors claim to be the most fearless in the world. Across the war-torn fields the Vikings shout their famous battlecry: “How long can a Viking fight? All the day and through the night!” Fierce and determined to survive against all odds, the Viking Realm wields the storm within as a weapon to fight the storms without. Some may hold the Vikings as coarse barbarians, but in the Realm of the Mountains, they know these naysayers lack courage and conviction: Only through the forge of bloody conquest can the Realms be united to stand against the coming storms.',

  'TDD': 'The Realm of the Tuatha Dé Danann strives to become one with nature. They revere the forest for its fierce beauty and its unyielding grip on life. The forest is more than the home of the Tuatha Dé Danann; it is their deep-rooted mother, their broad-boughed father, and their protector. Beneath the green-on-green canopy of the ever-living forest, dark secrets and powerful mysteries are hidden, which every member of the Realm will fight to defend. The wise and enigmatic Lugh leads the Tuatha Dé Danann to blossoming power, expanding the reach of limitless life. Some may jest that the Tuatha Dé Danann are foolish tree-lovers and frivolous fairies, but in the Realm of the Forest they know the truth: The world will be fierce and beautiful when the Realms are united under forest halls.'
}

class FactionSelect extends React.Component<FactionSelectProps, FactionSelectState> {

  constructor(props: FactionSelectProps) {
    super(props);
  }

  selectFaction = (faction: FactionInfo) => {
    this.props.selectFaction(faction);
  }

  generateFactionContent = (info: FactionInfo) => {
    if (info.id == Faction.Factionless) return null;  // players can not be factionless!
    return (
      <div key={info.id}
           className={`cu-character-creation__faction-select__${info.shortName} ${ this.props.selectedFaction !== null ? this.props.selectedFaction.id == info.id ? 'active' : '' : ''}`}
           onClick={this.selectFaction.bind(this, info)}>
        <div className={`cu-character-creation__faction-select__${info.shortName}__shield`}
             onClick={this.selectFaction.bind(this, info)}></div>
             <h4>{info.description}</h4>
        <div className={`cu-character-creation__faction-select__${info.shortName}__description`}
             onClick={this.selectFaction.bind(this, info)}>
             {realmText[info.shortName]}
        </div>
      </div>
    )
  }

  render() {
    if (!this.props.factions) {
      return <div> loading factions </div>
    }
    return (
      <div className='cu-character-creation__faction-select'>

        {this.props.factions.map(this.generateFactionContent)}
      </div>
    )
  }
}

export default FactionSelect;

// remove video for now for better performance.
//        <video src={`videos/${info.shortName}.webm`} poster={`videos/${info.shortName}-bg.jpg`} autoPlay loop></video>
