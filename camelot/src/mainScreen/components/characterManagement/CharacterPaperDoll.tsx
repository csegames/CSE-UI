/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { BodyTypeDef } from '../../dataSources/manifest/bodyTypeManifest';
import { ClassDef } from '../../dataSources/manifest/classManifest';
import { RaceDef } from '../../dataSources/manifest/raceManifest';
import { AppDispatch, RootState } from '../../redux/store';
import { getFactionData } from '../../gameData/factionData';
import { FactionTitle } from '../FactionTitle';
import { CharacterCreationState } from '../../redux/charactersSlice';
import { FactionDef } from '../../dataSources/manifest/factionManifest';
import { getStringTableValue, StringIDGeneralUnknownFaction } from '../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { SimpleCharacter } from '@csegames/library/dist/camelotunchained/graphql/schema';

// CSS classes
const Root = 'HUD-CharacterPaperDoll-Root';
const Darkener = 'HUD-CharacterPaperDoll-Darkener';
const Title = 'HUD-CharacterPaperDoll-Title';
const Doll = 'HUD-CharacterPaperDoll-Doll';

interface ReactProps {}

interface InjectedProps {
  uiFactionID: string;
  factions: Record<string, FactionDef>;
  bodyTypesByStringID: Record<string, BodyTypeDef>;
  classesByStringID: Record<string, ClassDef>;
  racesByStringID: Record<string, RaceDef>;
  stringTable: Record<string, StringTableEntryDef>;
  characterCreationState: CharacterCreationState;
  characters: SimpleCharacter[];
  selectedCharacterID: string;
  dispatch?: AppDispatch;
}

type Props = ReactProps & InjectedProps;

interface State {}

class ACharacterPaperDoll extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render(): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);
    const factionDef = this.getFactionDef();
    const character = this.props.characters.find((c) => c.id === this.props.selectedCharacterID);

    return (
      <div className={Root} style={{ backgroundImage: `url(${factionData.backgroundCharacterImage})` }}>
        <div className={Darkener} />
        <FactionTitle className={Title} heightOverrideVmin={25}>
          {this.props.characterCreationState
            ? getStringTableValue(factionDef?.name ?? StringIDGeneralUnknownFaction, this.props.stringTable)
            : character?.name ?? ''}
        </FactionTitle>
        <img className={Doll} src={this.getDollURL()} />
      </div>
    );
  }

  private getDollURL(): string {
    if (this.props.characterCreationState) {
      return this.getDollURLForCharacterCreation();
    } else {
      return this.getDollURLForCharacter();
    }
  }

  private getDollURLForCharacter(): string {
    const character = this.props.characters.find((c) => c.id === this.props.selectedCharacterID);

    if (character) {
      if (character.name) {
        return `coui://runtime/${character.name}-paperdoll`;
      } else {
        const userClass = this.props.classesByStringID[character.classID];
        return (
          userClass?.paperDollImages.find(
            (paperDollImage) =>
              paperDollImage.raceID === character.raceID && paperDollImage.bodyTypeID === character.bodyTypeID
          )?.image ?? '/images/MissingAsset.png'
        );
      }
    } else {
      return '';
    }
  }

  private getDollURLForCharacterCreation(): string {
    const { factionID, classID, raceID, bodyTypeID } = this.props.characterCreationState;

    if (factionID) {
      return `coui://runtime/cc-${bodyTypeID}-${raceID}-${classID}-paperdoll`;
    } else {
      // Haven't even picked a faction, so don't show anything!
      return '';
    }
  }

  private getFactionDef(): FactionDef {
    if (this.props.characterCreationState) {
      return this.props.factions[this.props.characterCreationState.factionID];
    } else {
      return this.props.factions[this.props.uiFactionID];
    }
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    uiFactionID: state.hud.uiFactionID,
    characterCreationState: state.characters.characterCreationState,
    factions: state.gameDefs.factions,
    bodyTypesByStringID: state.gameDefs.bodyTypesByStringID,
    classesByStringID: state.gameDefs.classesByStringID,
    racesByStringID: state.gameDefs.racesByStringID,
    stringTable: state.stringTable.stringTable,
    characters: state.characters.characters,
    selectedCharacterID: state.characters.selectedCharacterID
  };
};

export const CharacterPaperDoll = connect(mapStateToProps)(ACharacterPaperDoll);
