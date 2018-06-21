/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { Race, Gender, Archetype } from '@csegames/camelot-unchained';

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
  max-height: 80%;
  height: 70vh;
  width: 100%;
`;

const CharacterNameInputContainer = styled('div')`
  position: relative;
  width: auto;
  bottom: 55px;
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
    return (
      <Container>
        <LeftInfoPanel
          attributes={this.props.attributes}
          attributeOffsets={this.props.attributeOffsets}
          selectedRace={this.props.selectedRace}
          selectedGender={this.props.selectedGender}
          selectedClass={this.props.selectedClass}
          remainingPoints={this.props.remainingPoints}
          banesAndBoonsState={this.props.banesAndBoonsState}
        />
        <CharacterContainer>
          <StandingCharacter
            className={`standing__${Race[this.props.selectedRace]}--${Gender[this.props.selectedGender]}`}
          />
          <CharacterNameInputContainer className="cu-character-creation__name">
            <input
              id='create-character-name-input'
              autoFocus
              type='text'
              ref={this.props.inputRef}
              placeholder='Enter A Name Here'
            />
          </CharacterNameInputContainer>
        </CharacterContainer>
      </Container>
    );
  }
}

export default CharacterSummary;

