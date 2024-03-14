/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { includes } from 'lodash';
import { styled } from '@csegames/linaria/react';

import { BanesAndBoonsState } from '../../services/session/banesAndBoons';
import { CharacterState } from '../../services/session/character';
import { getClassMedia } from '../../../../lib/characterImages';
import LeftInfoPanel from './components/LeftInfoPanel';
import { Gender, Race } from '../../../../api/helpers';
import { ArchetypeInfo } from '../../../../api/webapi';

const Container = styled.div`
  height: calc(100% - 30px);
  display: flex;
  padding: 15px;
`;

const CharacterContainer = styled.div`
  position: relative;
  height: 100%;
  flex: 1.5;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StandingCharacter = styled.div`
  position: relative !important;
  background-size: contain !important;
  pointer-events: none;
  height: 120%;
  width: 120%;
  margin-top: -15%;
  margin-left: -15%;
`;

const CharacterNameInputContainer = styled.div`
  position: relative;
  width: auto;
  bottom: 55px;
  opacity: 0;
  animation: slideRightToLeft 1.5s forwards;
  @keyframes slideRightToLeft {
    from {
      opacity: 0;
      transform: translateX(20%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const VideoBG = styled.video`
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
  // attributes: AttributeInfo[];
  // attributeOffsets: AttributeOffsetInfo[];
  selectedRace: Race;
  selectedGender: Gender;
  selectedClass: ArchetypeInfo;
  // remainingPoints: number;
  banesAndBoonsState: BanesAndBoonsState;
  characterState: CharacterState;
  showInfo: boolean;
  showImage: boolean;
  inputRef: (ref: Element) => void;
}

export interface CharacterSummaryState {}

export class CharacterSummary extends React.Component<CharacterSummaryProps, CharacterSummaryState> {
  constructor(props: CharacterSummaryProps) {
    super(props);
    this.state = {};
  }

  public render() {
    const { selectedRace, selectedClass, selectedGender, banesAndBoonsState, inputRef } = this.props;
    const race = includes(Race[selectedRace].toLowerCase(), 'human') ? 'Human' : Race[selectedRace];
    const [src, poster] = getClassMedia(selectedClass);
    return (
      <Container>
        <VideoBG src={src} poster={poster} autoPlay loop></VideoBG>
        {this.props.showInfo ? (
          <LeftInfoPanel
            selectedRace={selectedRace}
            selectedGender={selectedGender}
            selectedClass={selectedClass}
            banesAndBoonsState={banesAndBoonsState}
          />
        ) : null}
        <CharacterContainer>
          {this.props.showImage ? (
            <StandingCharacter
              className={`char standing__${race}_${Gender[selectedGender]}_${selectedClass.stringID}`}
            />
          ) : null}
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
}

export default CharacterSummary;
