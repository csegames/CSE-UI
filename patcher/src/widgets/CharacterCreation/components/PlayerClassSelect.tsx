/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Archetype, Faction, events } from 'camelot-unchained';

import { PlayerClassInfo } from '../services/session/playerClasses';
import { FactionInfo } from '../services/session/factions';
const Animate = require('react-animate.css');

const classText: any = {
  'BlackKnight': 'Legend has it that the first Black Knight was the son of Arthur, sired before he became King of his Realm. The Black Knight had a falling-out with his father, and left the Realm to wander the world. After braving The Depths, he returned to Arthur’s court a changed man. On that day, he swore to forever fight by Arthur’s side. Those who join the Black Knights swear an oath to follow Arthur into battle, no matter where it takes them. They prefer to wear black clothing, a signal to the enemy that death is coming.',
  
  'Blackguard': 'This order of archers was created by a young man named Edward. He organized a group of bowmen to defeat a “terror of Abominations” that arose from the Black Mire. They took on that tainted blight, and many horrible risks, in order to protect others. The Blackguard were among Arthur’s earliest followers, before the rebirth of magic in the world. Adopting the color black, these archers became the scourge of all enemies of the Realm.',
  
  'Physician': 'To achieve their goal of being the best healers on the field of battle, members of this class use a bit more “science” than many others. The Physicians rely on a mixture of ability-enhanced potions, elixirs, and magical abilities to accomplish their goals. They also utilize a variant of the horn of Brân Galed (one of the Thirteen Treasures of Britain) to enhance their potions.',
  
  
  'Mjolnir': 'The Mjölnir, and the first “true” hammer, were born from the collision of the two moons. New Mjölnir are entrusted with a tiny fragment from that collision, which is then used by crafters to imbue into their iconic weapon. Mjölnir are reputed to focus on causing destruction rather than on the more protective aspects of their occupation, and that’s just about right as far as they’re concerned. These men and women have a long tradition of taking their anger out on their enemies.',
  
  'WintersShadow': 'An adept archer, at home in the snow. A true Shadow can shoot while on skis or on foot, and they prefer yew-wood for their bows. They learn the importance of camouflage early in their training, and whole companies of Shadows have been known to sit silently in the snow for days at a time. A Shadow’s unique mastery of shields and other weapons makes them stand out from other archers. The bows of the Winter’s Shadows may not shoot the furthest, but their battle, survival, and skirmisher skills are impressive; especially for an archer.',
  
  'Stonehealer': 'Only in the land of the Vikings would anyone throw rocks at people in order to heal them. While it is unfair that some claim Stonehealers are men and women who have fallen on their heads too often, it is true that being a Stonehealer does come with certain unique risks to the healers themselves. They are certainly among the most stubborn, thick-skulled defenders of the Realm!',
  
  
  'Fianna': 'The Fianna were founded by one of the great leaders of the Tuatha Dé Danann: Fionn mac Cumhaill. This class has a very special ability, the Diord Fionn (Fionn’s war-cry), which they can use before and during battles. The mottos of this class are “Purity of our hearts, Strength of our limbs, and Deeds to match our words.” Between their war-cry and additional movement speed, they are glad to wear less heavy armor than many of their counterparts.',
  
  'ForestStalker': 'These archers are renowned for using very powerful weapons that have a shorter range than the weapons of many of the Forest Stalkers’ counterparts. However, within their own forests their camouflage abilities are the most powerful in all the Realms. They are adept at using poison on their arrows, as well as at calling on the forest to aid them in delaying groups of invaders. One of their abilities is the power to call on trees to create arrows for them.',
  
  'Empath': 'Empaths believe that their bodies should be used to heal those in need. They pay a great price for choosing this noble way, for they take the wounds of others onto their own bodies. The more serious the wounds they deal with, the greater the likelihood that the Empath suffers additional side effects from their healing. The reward for this sacrifice is equally impressive: Empaths have access to some of the most powerful heals of all the classes in all the Realms.',
}

export interface PlayerClassSelectProps {
  classes: Array<PlayerClassInfo>;
  selectedClass: PlayerClassInfo;
  selectClass: (playerClass: PlayerClassInfo) => void;
  selectedFaction: FactionInfo;
}

export interface PlayerClassSelectState {
}

class PlayerClassSelect extends React.Component<PlayerClassSelectProps, PlayerClassSelectState> {

  constructor(props: PlayerClassSelectProps) {
    super(props);
  }

  selectClass = (info: PlayerClassInfo) => {
    events.fire('play-sound', 'select');
    this.props.selectClass(info);
  }

  generateClassContent = (info: PlayerClassInfo) => {
    return (
      <a key={info.id}
              className={`thumb__${Archetype[info.id]} ${this.props.selectedClass !== null ? this.props.selectedClass.id == info.id ? 'active' : '' : ''}`}
              onClick={this.selectClass.bind(this, info)}></a>
    );
  }

  render() {
    if (!this.props.classes) return <div> loading classes</div>;

    let videoTitle = this.props.selectedFaction.shortName;
    let view: any = null;
    let text: any = null;
    let name: any = null;
    if (this.props.selectedClass) {
      name = <h2 className='display-name'>{this.props.selectedClass.name}</h2>
      view = <div className={`standing__${Archetype[this.props.selectedClass.id]}`}></div>
      text = <div className='selection-description'>{classText[Archetype[this.props.selectedClass.id]]}</div>
      switch(this.props.selectedClass.id)
      {
        case Archetype.WintersShadow: videoTitle = 'class_archer'; break;
        case Archetype.ForestStalker: videoTitle = 'class_archer'; break;
        case Archetype.Blackguard: videoTitle = 'class_archer'; break;
        case Archetype.BlackKnight: videoTitle = 'heavy'; break;
        case Archetype.Fianna: videoTitle = 'heavy'; break;
        case Archetype.Mjolnir: videoTitle = 'heavy'; break;
        case Archetype.Physician: videoTitle = 'healers'; break;
        case Archetype.Empath: videoTitle = 'healers'; break;
        case Archetype.Stonehealer: videoTitle = 'healers'; break;
      }
    }




    return (
      <div className='page'>
        <video src={`videos/${videoTitle}.webm`} poster={`videos/${videoTitle}.jpg`} autoPlay loop></video>
          {name}
        <div className='selection-box'>
          <h6>Choose your class</h6>
          {this.props.classes.filter((c:any) => c.faction === this.props.selectedFaction.id || c.faction == Faction.Factionless).map(this.generateClassContent)}
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

export default PlayerClassSelect;
