/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {race, faction, gender} from 'camelot-unchained';
import * as events from '../../../lib/events';

import {RaceInfo} from '../services/session/races';
import {FactionInfo} from '../services/session/factions';

import Animate from '../../../components/Animate';

const raceText: any = {
  'HUMANMALEA': 'Through luck, or perhaps something more, a few Humans managed to escape Veilstorm influence entirely. They did not change into something else, and were untouched by the Veil’s wrath, as though chosen for a special purpose. They may lack the strange powers that some other races possess, but they are also spared the curses that sometimes accompany these powers. Through sheer determination, Humans survive. They refuse to disappear, and prosper even in the most difficult of times, following the noble path of righteous strength that King Arthur lays before them.',

  'PICT': 'A description for Picts that explains lots of cool things about them which Max still has to write for me.',

  'HUMANMALEV': 'Explorers and mighty warriors of legend, the Vikings are hungry. Hungry for battle, hungry for plunder, and starving to rule by right of conquest. They are a hard people, who wear their scars as badges of honor, and choose to live in some of the harshest lands imaginable. They will brazenly homestead in foreign territory and claim it as their own, upholding a culture that is welcoming to friends but ruthless to foes. A people of blood and steel, they will devour the Realms as masters of the sea-lanes, raiding and pillaging what they need, as they swim swiftly and their watercraft move too fast to catch. There is no place on earth the Vikings fear to tread; let the other Realms tremble at their approach.',

  'VALKYRIE': 'Though their race was born of great suffering and tragedy, the Valkyrie have risen high above their past on hidden wings of magic. Some of the Valkyrie can truly fly with their delicate wings; others glide overhead. Harsh dispensers of justice, the Valkyrie seek eternal revenge, and never forget a wrong. However, a merciful streak runs deeply through their culture, for the Valkyrie know pain and suffering well. They are serious as a rule, and none are much good at festivals, though the men of the race tend to be less quick to anger. The Valkyrie are the authors and the keepers of the Valkyric Code, the basis of law in the Viking Realm, and one of the most important documents ever written. Chanting its passages, the Valkyrie fly to ferocious battle, ever fighting to protect the Realm.',

  'HUMANMALET': 'Humans have always had a place in the courts of the Tuatha Dé Danann, whether through fairy tales of captured children, lost souls looking for the Otherworld, or simply by seeking a place of refuge in their magnificent forests. While some in other Realms, particularly their hated enemies the Cait Sith, call the Human races of the Tuatha Dé Danann “pets” of their more powerful “masters”, nothing could be further from the truth. The Human races of this Realm share the same social, political, and military status of their compatriots. Just as importantly, these humans do not share the Banes of some of their fellow races among the Tuatha Dé Danann. Then again, tales are told in quiet corners of Humans in this Realm who are not quite what they seem to be…',

  'LUCHORPAN': 'Small and often underestimated, the Luchorpán are natural-born tricksters, masters of misdirection and illusion. They believe that lies can reveal the truth, that a person’s hidden nature is revealed when they are the victim of a prank. The clever fingers of the Luchorpán are naturally skilled at powerful crafting, and their quick reflexes, excellent hiding skills, or talent for climbing often get them out of whatever trouble their mischief gets them into. If all else fails, rumor holds that Luchorpán can simply vanish and reappear elsewhere. Bonds of love are considered unbreakable among the Luchorpán, and any of them would give up life itself to defend their family or their Realm.',
}

export interface RaceSelectProps {
  selectedFaction: FactionInfo;
  races: Array<RaceInfo>;
  selectedRace: RaceInfo;
  selectRace: (race: RaceInfo) => void;
  selectedGender: gender;
  selectGender: (selected: gender) => void;
}

export interface RaceSelectState {
}

class RaceSelect extends React.Component<RaceSelectProps, RaceSelectState> {

  constructor(props: RaceSelectProps) {
    super(props);
  }

  selectRace = (race: RaceInfo) => {
    this.props.selectRace(race);
  }

  generateRaceContent = (info: RaceInfo) => {
    return (
      <a key={info.id}
         className={`thumb__${race[info.id]}--${gender[this.props.selectedGender]} ${this.props.selectedRace !== null ? this.props.selectedRace.id == info.id ? 'active' : '' : ''}`}
         onClick={this.selectRace.bind(this, info)}></a>
    );
  }

  selectGender = (gender: gender) => {
    this.props.selectGender(gender);
    events.fire('play-sound', 'select');
  }

  render() {
    if (!this.props.races) return <div>loading races</div>;

    let view: any = null;
    let text: any = null;
    let name: any = null;
    if (this.props.selectedRace) {
      name = <h2 className='display-name'>{this.props.selectedRace.name}</h2>
      view = <div key={`${race[this.props.selectedRace.id]}--${gender[this.props.selectedGender]}`} className={`standing__${race[this.props.selectedRace.id]}--${gender[this.props.selectedGender]}`}></div>
      text = <div className='selection-description'>{raceText[race[this.props.selectedRace.id]]}</div>
    }

    return (
      <div className='page'>
        <video src={`videos/${this.props.selectedFaction.shortName}.webm`} poster={`videos/${this.props.selectedFaction.shortName}-bg.jpg`} autoPlay loop></video>
        {name}
        <div className='selection-box'>
          <h6>Choose your race</h6>
          {this.props.races.filter((r: any) => r.faction === this.props.selectedFaction.id).map(this.generateRaceContent)}
          <h6>Choose your gender</h6>
          <a className={`gender-btn ${this.props.selectedGender == gender.MALE ? 'selected' : ''}`}
             onClick={() => this.selectGender(gender.MALE)}>Male</a>
          <a className={`gender-btn ${this.props.selectedGender == gender.FEMALE ? 'selected' : ''}`}
             onClick={() => this.selectGender(gender.FEMALE)}>Female</a>
          {text}
        </div>
        <div className='view-content'>
          <Animate className='animate' animationEnter='fadeIn' animationLeave='fadeOut'
          durationEnter={400} durationLeave={500}>
          {view}
        </Animate>
        </div>
      </div>
    )
  }
}

export default RaceSelect;
