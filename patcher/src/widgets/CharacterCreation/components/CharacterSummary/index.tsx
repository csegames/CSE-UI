/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { Race, Gender, Archetype } from 'camelot-unchained';

import { AttributeInfo } from '../../services/session/attributes';
import { AttributeOffsetInfo } from '../../services/session/attributeOffsets';
import { BanesAndBoonsState } from '../../services/session/banesAndBoons';
import LeftInfoPanel from './components/LeftInfoPanel';

export interface CharacterSummaryStyle extends StyleDeclaration {
  CharacterSummary: React.CSSProperties;
  characterContainer: React.CSSProperties;
  standingCharacter: React.CSSProperties;
  characterNameInputContainer: React.CSSProperties;
  characterNameInput: React.CSSProperties;
}

export const defaultCharacterSummaryStyle: CharacterSummaryStyle = {
  CharacterSummary: {
    height: 'calc(100% - 30px)',
    display: 'flex',
    padding: '15px',
  },

  characterContainer: {
    height: '100%',
    flex: 1.5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  standingCharacter: {
    position: 'relative',
    backgroundSize: 'contain',
    maxHeight: '80%',
    height: '70vh',
    width: '30vw',
  },

  characterNameInputContainer: {
    position: 'relative',
    width: 'auto',
    bottom: '55px',
  },

  characterNameInput: {
    border: 0,
    borderBottom: '2px solid #665546',
    backgroundColor: 'rgba(0,0,0,1)',
    color: '#FCFCCF',
    '::-webkit-input-placeholder': {
      color: '#FCFCCF',
    },
  },
};


export interface CharacterSummaryProps {
  styles?: Partial<CharacterSummaryStyle>;
  attributes: AttributeInfo[];
  attributeOffsets: AttributeOffsetInfo[];
  selectedRace: Race;
  selectedGender: Gender;
  selectedClass: Archetype;
  remainingPoints: number;
  banesAndBoonsState: BanesAndBoonsState;
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
    const ss = StyleSheet.create(defaultCharacterSummaryStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    
    return (
      <div className={css(ss.CharacterSummary, custom.CharacterSummary)}>
        <LeftInfoPanel
          attributes={this.props.attributes}
          attributeOffsets={this.props.attributeOffsets}
          selectedRace={this.props.selectedRace}
          selectedGender={this.props.selectedGender}
          selectedClass={this.props.selectedClass}
          remainingPoints={this.props.remainingPoints}
          banesAndBoonsState={this.props.banesAndBoonsState}
        />
        <div className={css(ss.characterContainer, custom.characterContainer)}>
          <div className={css(ss.standingCharacter, custom.standingCharacter) +
            ` standing__${Race[this.props.selectedRace]}--${Gender[this.props.selectedGender]}`} />
          <div className={css(ss.characterNameInputContainer, custom.characterNameInputContainer) +
            ' cu-character-creation__name'}>
            <input
              id='create-character-name-input'
              type='text'
              ref={this.props.inputRef}
              placeholder='Enter A Name Here'
              className={css(ss.characterNameInput, custom.characterNameInput)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default CharacterSummary;

