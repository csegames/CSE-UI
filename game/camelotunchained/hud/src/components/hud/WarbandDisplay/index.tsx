/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';

import { GroupMemberState } from 'gql/interfaces';
import { WarbandDisplayView } from './WarbandDisplayView';
import { WarbandContext, WarbandContextState } from '../../context/WarbandContext';

const characterImages = {
  humanM: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_pict-m.png',
  humanF: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_pict-f.png',
  luchorpanM: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_luchorpan-m.png',
  luchorpanF: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_luchorpan-f.png',
  valkyrieM: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_valkyrie-m.png',
  valkyrieF: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_valkyrie-m.png',
  humanmalevM: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_valkyrie-m.png',
  humanmaleaM: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_humans-m-art.png',
  humanmaletM: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_humans-m-tdd.png',
  humanmalevF: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_humans-f-vik.png',
  humanmaleaF: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_humans-f-art.png',
  humanmaletF: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_humans-f-tdd.png',
};

interface InjectedProps {
  warbandContext: WarbandContextState;
}

export interface Props {
  isMini?: boolean;
}

export interface State {
  battlegroupID?: string;
}

export class WarbandDisplayComponent extends React.Component<Props & InjectedProps, State> {
  constructor(props: Props & InjectedProps) {
    super(props);
    this.state = {
      battlegroupID: '',
    };
  }

  public render() {
    return (
      <WarbandDisplayView activeMembers={Object.values(this.props.warbandContext.memberCharacterIdToMemberState)} />
    );
  }

  public static deserializeMember(memberJSON: string): GroupMemberState {
    try {
      const member = JSON.parse(memberJSON);
      member.avatar = WarbandDisplayComponent.getAvatar(member.gender, member.race);
      return member;
    } catch (e) {
      if  (process.env.IS_DEVELOPMENT) {
        console.error(`WarbandMemberJoined Failed to parse WarbandMember. | ${e}`);
      }
      return;
    }
  }

  private static getAvatar(gender: Gender, race: Race) {
    if (gender === Gender.Male) { // MALE
      switch (race) {
        case 2: return characterImages.luchorpanM; // Luchorpan
        case 4: return characterImages.valkyrieM; // Valkyrie
        case 15: return characterImages.humanmalevM; // Humanmalev
        case 16: return characterImages.humanmaleaM; // Humanmalea
        case 17: return characterImages.humanmaletM; // Humanmalet
        case 18: return characterImages.humanM; // Pict
      }
    } else {
      switch (race) {
        case 2: return characterImages.luchorpanF; // Luchorpan
        case 4: return characterImages.valkyrieF; // Valkyrie
        case 15: return characterImages.humanmalevF; // Humanmalev
        case 16: return characterImages.humanmaleaF; // Humanmalea
        case 17: return characterImages.humanmaletF; // Humanmalet
        case 18: return characterImages.humanF; // Pict
      }
    }
  }
}

export function WarbandDisplay(props: Props) {
  const warbandContext = useContext(WarbandContext);
  return (
    <WarbandDisplayComponent warbandContext={warbandContext} {...props} />
  )
}
