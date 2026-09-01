/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { AppDispatch, RootState } from '../../redux/store';
import { connect } from 'react-redux';
import { SimpleCharacter } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { FactionDivider } from '../FactionDivider';
import { ClassDef } from '../../dataSources/manifest/classManifest';
import { RaceDef } from '../../dataSources/manifest/raceManifest';
import { BodyTypeDef } from '../../dataSources/manifest/bodyTypeManifest';
import { BorderBackground, BorderType, FactionBorder } from '../FactionBorder';
import { FactionScrollArea } from '../FactionScrollArea';
import { getRaceData } from '../../gameData/raceData';
import { CharacterCreationState } from '../../redux/charactersSlice';
import {
  getStringTableValue,
  StringIDGeneralUnknownClass,
  StringIDGeneralUnknownRace
} from '../../helpers/stringTableHelpers';
import { StatLoadoutDef } from '../../dataSources/manifest/statLoadoutManifest';

// CSS classes
const Root = 'HUD-CharacterDetails-Root';
const RaceDetailsSection = 'HUD-CharacterDetails-RaceDetailsSection';
const ClassDetailsSection = 'HUD-CharacterDetails-ClassDetailsSection';
const SpecDetailsSection = 'HUD-CharacterDetails-SpecDetailsSection';
const PortraitLine = 'HUD-CharacterDetails-PortraitLine';
const PortraitContainer = 'HUD-CharacterDetails-PortraitContainer';
const PortraitImage = 'HUD-CharacterDetails-PortraitImage';
const GenderContainer = 'HUD-CharacterDetails-GenderContainer';
const GenderText = 'HUD-CharacterDetails-GenderText';
const DetailsTextContainer = 'HUD-CharacterDetails-DetailsTextContainer';
const DetailsTitle = 'HUD-CharacterDetails-DetailsTitle';
const DetailsText = 'HUD-CharacterDetails-DetailsText';

interface ReactProps {}

interface InjectedProps {
  characters: SimpleCharacter[];
  selectedCharacterID: string;
  stringTable: Record<string, StringTableEntryDef>;
  classesByStringID: Record<string, ClassDef>;
  racesByStringID: Record<string, RaceDef>;
  bodyTypesByStringID: Record<string, BodyTypeDef>;
  statLoadouts: Record<string, StatLoadoutDef>;
  characterCreationState: CharacterCreationState;
  gameDefsLoaded: boolean;
  dispatch?: AppDispatch;
}

type Props = ReactProps & InjectedProps;

class ACharacterDetails extends React.Component<Props> {
  render(): React.ReactNode {
    if (!this.props.gameDefsLoaded || Object.keys(this.props.stringTable).length <= 0) {
      return null;
    }

    const { characterCreationState } = this.props;
    const isCreatingCharacter = !!characterCreationState;
    const character = this.props.characters.find((c) => c.id === this.props.selectedCharacterID);

    // Race and body type are auto-selected when you pick a faction.
    const raceID = characterCreationState?.raceID ?? character?.raceID;
    const raceData = getRaceData(raceID);
    const race = this.props.racesByStringID[raceID];
    const bodyTypeID = characterCreationState?.bodyTypeID ?? character?.bodyTypeID;

    // Class is not auto-selected, so it may be null even during character creation, but that's okay.
    const userClass =
      this.props.classesByStringID[isCreatingCharacter ? characterCreationState.classID : character?.classID];

    // StatLoadout is selected when class is selected, and thus may also be null.
    const statLoadout = this.props.statLoadouts[characterCreationState?.statLoadoutID];

    return (
      <div className={Root}>
        {!isCreatingCharacter && !character ? null : ( // If no character selected and not in character creation, details is empty.
          <>
            <div className={RaceDetailsSection}>
              <FactionDivider className={PortraitLine} />
              <FactionBorder className={PortraitContainer} type={BorderType.Secondary}>
                <img
                  className={PortraitImage}
                  src={raceData?.portraits.find((p) => p.bodyTypeID === bodyTypeID)?.image}
                />
              </FactionBorder>
              <FactionBorder
                className={GenderContainer}
                type={BorderType.Secondary}
                background={BorderBackground.PatternSmall}
              >
                <div className={GenderText}>{bodyTypeID === 'Female' ? '2' : '1'}</div>
              </FactionBorder>
              <div className={DetailsTitle}>
                {getStringTableValue(race?.name ?? StringIDGeneralUnknownRace, this.props.stringTable)}
              </div>
              <FactionScrollArea className={DetailsTextContainer} useSmallThumb={true}>
                <div className={DetailsText}>{getStringTableValue(race?.description, this.props.stringTable)}</div>
              </FactionScrollArea>
            </div>
            {!!userClass && ( // Selecting a class auto-selects the first spec for that class.
              <>
                <div className={ClassDetailsSection}>
                  <FactionDivider className={PortraitLine} />
                  <FactionBorder className={PortraitContainer} type={BorderType.Secondary}>
                    <img className={PortraitImage} src={userClass?.unitFrameIconImage} />
                  </FactionBorder>
                  <div className={DetailsTitle}>
                    {getStringTableValue(userClass?.name ?? StringIDGeneralUnknownClass, this.props.stringTable)}
                  </div>
                  <FactionScrollArea className={DetailsTextContainer} useSmallThumb={true}>
                    <div className={DetailsText}>
                      {getStringTableValue(userClass?.description, this.props.stringTable)}
                    </div>
                  </FactionScrollArea>
                </div>
                {isCreatingCharacter && statLoadout && (
                  <div className={SpecDetailsSection}>
                    <FactionDivider />
                    <div className={DetailsTitle}>{getStringTableValue(statLoadout.name, this.props.stringTable)}</div>
                    <FactionScrollArea className={DetailsTextContainer} useSmallThumb={true}>
                      <div className={DetailsText}>
                        {getStringTableValue(statLoadout.description, this.props.stringTable)}
                      </div>
                    </FactionScrollArea>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    characters: state.characters.characters,
    selectedCharacterID: state.characters.selectedCharacterID,
    stringTable: state.stringTable.stringTable,
    classesByStringID: state.gameDefs.classesByStringID,
    racesByStringID: state.gameDefs.racesByStringID,
    bodyTypesByStringID: state.gameDefs.bodyTypesByStringID,
    statLoadouts: state.gameDefs.statLoadouts,
    characterCreationState: state.characters.characterCreationState,
    gameDefsLoaded: state.loading.gameDefsLoaded
  };
};

export const CharacterDetails = connect(mapStateToProps)(ACharacterDetails);
