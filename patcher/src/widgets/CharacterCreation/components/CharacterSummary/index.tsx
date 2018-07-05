/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { includes } from 'lodash';
import styled from 'react-emotion';
import { webAPI, Race, Gender, Archetype } from '@csegames/camelot-unchained';

import { AttributeInfo } from '../../services/session/attributes';
import { AttributeOffsetInfo } from '../../services/session/attributeOffsets';
import { BanesAndBoonsState } from '../../services/session/banesAndBoons';
import { CharacterState } from '../../services/session/character';
import LeftInfoPanel from './components/LeftInfoPanel';

const Container = styled('div')`
  height: calc(100% - 30px);
  display: flex;
  padding: 15px;
`;

const CharacterContainer = styled('div')`
  position: relative;
  height: 100%;
  flex: 1.5;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StandingCharacter = styled('div')`
  position: relative !important;
  background-size: contain !important;
  height: 120%;
  width: 120%;
  margin-top: -15%;
  margin-left: -15%;
`;

const CharacterNameInputContainer = styled('div')`
  position: relative;
  width: auto;
  bottom: 55px;
`;

const VideoBG = styled('video')`
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translateX(-50%) translateY(-50%);
  background-size: cover;
  z-index: -1;
`;

export interface CharacterSummaryProps {
  attributes: AttributeInfo[];
  attributeOffsets: AttributeOffsetInfo[];
  selectedRace: Race;
  selectedGender: Gender;
  selectedClass: Archetype;
  remainingPoints: number;
  banesAndBoonsState: BanesAndBoonsState;
  characterState: CharacterState;
  inputRef: (ref: Element) => void;
}

export interface CharacterSummaryState {
}

export class CharacterSummary extends React.Component<CharacterSummaryProps, CharacterSummaryState> {
  constructor(props: CharacterSummaryProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    const { selectedRace, selectedClass, selectedGender, attributes,
      attributeOffsets, remainingPoints, banesAndBoonsState, inputRef } = this.props;
    const race = includes(Race[selectedRace].toLowerCase(), 'human') ? webAPI.raceString(selectedRace) : Race[selectedRace];
    const videoTitle = this.getVideoTitle();
    return (
      <Container>
        <VideoBG src={`videos/${videoTitle}.webm`} poster={`videos/${videoTitle}.jpg`} autoPlay loop></VideoBG>
        <LeftInfoPanel
          attributes={attributes}
          attributeOffsets={attributeOffsets}
          selectedRace={selectedRace}
          selectedGender={selectedGender}
          selectedClass={selectedClass}
          remainingPoints={remainingPoints}
          banesAndBoonsState={banesAndBoonsState}
        />
        <CharacterContainer>
          <StandingCharacter className={`char standing__${race}_${Gender[selectedGender]}_${Archetype[selectedClass]}`} />
          <CharacterNameInputContainer className='cu-character-creation__name'>
            <input
              id='create-character-name-input'
              autoFocus
              type='text'
              ref={inputRef}
              placeholder='Enter A Name Here'
            />
          </CharacterNameInputContainer>
        </CharacterContainer>
      </Container>
    );
  }

  private getVideoTitle = () => {
    switch (this.props.selectedClass) {
      case Archetype.WintersShadow: return 'class_archer';
      case Archetype.ForestStalker: return 'class_archer';
      case Archetype.Blackguard: return 'class_archer';
      case Archetype.BlackKnight: return 'heavy';
      case Archetype.Fianna: return 'heavy';
      case Archetype.Mjolnir: return 'heavy';
      case Archetype.Physician: return 'healers';
      case Archetype.Empath: return 'healers';
      case Archetype.Stonehealer: return 'healers';
    }
  }
}

export default CharacterSummary;

