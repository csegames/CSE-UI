/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { AddDispatch, RootState } from '../../redux/store';
import { connect } from 'react-redux';
import { CharacterManagementFooter } from './CharacterManagementFooter';
import { FactionButton } from '../FactionButton';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import {
  getStringTableValue,
  StringIDGeneralBack,
  StringIDGeneralConfirm,
  StringIDGeneralNext
} from '../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { CharacterCreationState, leaveCharacterCreation, startCharacterCreation } from '../../redux/charactersSlice';
import { CharacterBuilder } from './CharacterBuilder';
import { CharacterPaperDoll } from './CharacterPaperDoll';
import { CharacterDetails } from './CharacterDetails';
import { FactionSplitter } from '../FactionSplitter';
import { getFactionData } from '../../gameData/factionData';
import { hideModal, ModalModel, showModal, updateModalContent } from '../../redux/modalsSlice';
import { TextInput, TextInputType } from '../input/TextInput';
import { getSelectedBodyType, getSelectedClass, getSelectedRace } from '../../helpers/characterManagementHelpers';
import {
  CharacterCreationInput,
  CharactersAPI,
  Faction
} from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { webConf } from '../../redux/networkConfiguration';
import { addErrorNotice } from '../../redux/errorNoticesSlice';
import { RaceDef } from '../../dataSources/manifest/raceManifest';
import { ClassDef } from '../../dataSources/manifest/classManifest';
import { BodyTypeDef } from '../../dataSources/manifest/bodyTypeManifest';
import { StatDef } from '../../dataSources/manifest/statManifest';
import TooltipSource from '../TooltipSource';
import { convertRequestResult } from '../../helpers/errorConversionHelpers';

const StringIDCharacterManagementNameCharacterTitle = 'CharacterManagementNameCharacterTitle';
const StringIDCharacterManagementNameCharacterMessage = 'CharacterManagementNameCharacterMessage';
const StringIDCharacterManagementNeedsClass = 'CharacterManagementNeedsClass';
const StringIDCharacterManagementNeedsStats = 'CharacterManagementNeedsStats';

// CSS classes
const Root = 'HUD-CharacterCreation-Root';
const MainContent = 'HUD-CharacterCreation-MainContent';
const FooterButton = 'HUD-CharacterManagement-FooterButton';
const BottomBorder = 'HUD-CharacterManagement-BottomBorder';
const Splitter = 'HUD-CharacterManagement-Splitter';
const NameCharacterContainer = 'HUD-CharacterCreation-NameCharacterContainer';
const NameCharacterInput = 'HUD-CharacterCreation-NameCharacterInput';

interface ReactProps {}

interface InjectedProps {
  uiFactionID: string;
  stringTable: Record<string, StringTableEntryDef>;
  characterCreationState: CharacterCreationState;
  racesByStringID: Record<string, RaceDef>;
  classesByStringID: Record<string, ClassDef>;
  bodyTypesByStringID: Record<string, BodyTypeDef>;
  stats: Record<string, StatDef>;
  startingAttributePoints: number;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class ACharacterCreation extends React.Component<Props> {
  render(): React.ReactNode {
    if (!this.props.characterCreationState) {
      return null;
    }

    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <div className={Root}>
        <div className={MainContent}>
          <CharacterBuilder />
          <FactionSplitter className={`${Splitter} ${this.props.uiFactionID}`} />
          <CharacterPaperDoll />
          <FactionSplitter className={`${Splitter} ${this.props.uiFactionID}`} />
          <CharacterDetails />
          <div className={BottomBorder} style={{ backgroundImage: `url(${factionData.edgeDecorativeTopImage})` }} />
        </div>
        <CharacterManagementFooter leftButtons={[this.renderBackButton()]} rightButtons={[this.renderNextButton()]} />
      </div>
    );
  }

  componentDidUpdate(prevProps: Readonly<Props>, snapshot?: any): void {
    if (this.props.characterCreationState !== prevProps.characterCreationState) {
      const characterBodyType = this.props.bodyTypesByStringID[this.props.characterCreationState?.bodyTypeID];
      const characterClass = this.props.classesByStringID[this.props.characterCreationState?.classID];
      const characterRace = this.props.racesByStringID[this.props.characterCreationState?.raceID];

      const oldDollName = `cc-${prevProps.characterCreationState?.bodyTypeID}-${prevProps.characterCreationState?.raceID}-${prevProps.characterCreationState?.classID}`;
      const newDollName = `cc-${this.props.characterCreationState?.bodyTypeID}-${this.props.characterCreationState?.raceID}-${this.props.characterCreationState?.classID}`;

      clientAPI.deletePaperDoll(oldDollName);

      if (characterClass) {
        if (characterClass.paperDollImages !== undefined) {
          const paperDollImage = characterClass.paperDollImages.find(
            (item) =>
              item.raceID === this.props.characterCreationState?.raceID &&
              item.bodyTypeID === this.props.characterCreationState?.bodyTypeID
          );

          if (paperDollImage != undefined) {
            if (paperDollImage.defaultOutfit != undefined) {
              const animation = paperDollImage.characterSelectAnimation;

              clientAPI.renderPaperDoll(
                newDollName,
                characterClass.numericID,
                characterRace.numericID,
                characterBodyType.numericID,
                animation,
                paperDollImage.defaultOutfit
              );
              clientAPI.pauseAllPaperDollExcept(newDollName);
            } else {
              console.warn(
                `Paper doll default outfit for ${characterBodyType.name} ${characterRace.name} ${characterClass.name} is undefined`
              );
            }
          } else {
            console.warn(
              `Paper doll description for ${characterBodyType.name} ${characterRace.name} ${characterClass.name} is undefined`
            );
          }
        }
      }
    }
  }

  componentWillUnmount(): void {
    if (this.props !== undefined && this.props.characterCreationState !== null) {
      if (
        this.props.characterCreationState.bodyTypeID &&
        this.props.characterCreationState.raceID &&
        this.props.characterCreationState.classID
      ) {
        const dollName = `cc-${this.props.characterCreationState.bodyTypeID}-${this.props.characterCreationState.raceID}-${this.props.characterCreationState.classID}`;
        clientAPI.deletePaperDoll(dollName);
      }
    }
  }

  private renderBackButton(): React.ReactNode {
    return (
      <FactionButton
        className={FooterButton}
        onClick={() => {
          clientAPI.playGameSound(SoundEvents.PLAY_UI_SFX_CC_GENERIC_SELECT);
          // This clears any selections and sends us back to the FactionSelection page.
          this.props.dispatch(startCharacterCreation());
        }}
      >
        {getStringTableValue(StringIDGeneralBack, this.props.stringTable)}
      </FactionButton>
    );
  }

  private renderNextButton(): React.ReactNode {
    const needsClass = !this.props.characterCreationState.classID;
    const needsStats = this.props.characterCreationState.availableStatPoints > 0;
    const isDisabled = needsClass || needsStats;

    return (
      <TooltipSource
        tooltipID='InvalidCharacter'
        active={isDisabled}
        content={() =>
          getStringTableValue(
            needsClass ? StringIDCharacterManagementNeedsClass : StringIDCharacterManagementNeedsStats,
            this.props.stringTable
          )
        }
        positionType='mouse'
      >
        <FactionButton
          className={FooterButton}
          onClick={() => {
            clientAPI.playGameSound(SoundEvents.PLAY_UI_SFX_CC_GENERIC_SELECT);

            this.props.dispatch(
              showModal({
                id: 'NameCharacter',
                escapable: true,
                content: this.getNameCharacterModalContent('')
              })
            );
          }}
          disabled={isDisabled}
        >
          {getStringTableValue(StringIDGeneralNext, this.props.stringTable)}
        </FactionButton>
      </TooltipSource>
    );
  }

  private getNameCharacterModalContent(inputValue: string): ModalModel {
    return {
      title: getStringTableValue(StringIDCharacterManagementNameCharacterTitle, this.props.stringTable),
      message: getStringTableValue(StringIDCharacterManagementNameCharacterMessage, this.props.stringTable),
      body: (
        <>
          <div className={NameCharacterContainer}>
            <TextInput
              type={TextInputType.CharacterName}
              inputClassName={NameCharacterInput}
              value={inputValue}
              setValue={(value: string) => {
                this.props.dispatch(updateModalContent(['NameCharacter', this.getNameCharacterModalContent(value)]));
              }}
              showLength
              showRules
            />
          </div>
        </>
      ),
      buttons: [
        {
          text: getStringTableValue(StringIDGeneralBack, this.props.stringTable),
          onClick: () => {
            clientAPI.playGameSound(SoundEvents.PLAY_UI_SFX_CC_GENERIC_SELECT);
            this.props.dispatch(hideModal());
          }
        },
        {
          text: getStringTableValue(StringIDGeneralConfirm, this.props.stringTable),
          onClick: () => {
            const { bodyTypeID, factionID, raceID, classID, statsPoints } = this.props.characterCreationState;
            clientAPI.playGameSound(SoundEvents.PLAY_UI_SFX_CC_CONFIRM);
            const selectedRace = getSelectedRace(factionID, raceID, this.props.racesByStringID);
            const selectedClass = getSelectedClass(factionID, classID, this.props.classesByStringID);
            const selectedBodyType = getSelectedBodyType(bodyTypeID, this.props.bodyTypesByStringID);
            if (selectedRace && selectedClass && selectedBodyType) {
              // Server wants stats without racial bonuses, since they apply them differently.
              let nakedStats: Record<string, number> = {};
              Object.entries(statsPoints).forEach(([statID, value]) => {
                const bonus = selectedRace.baseStatOffsets[statID] ?? 0;
                nakedStats[statID] = value - bonus;
              });

              const model: CharacterCreationInput = {
                classID: selectedClass.id,
                stats: nakedStats,
                factionID: Faction[factionID],
                bodyTypeID: selectedBodyType.id,
                name: inputValue,
                raceID: selectedRace.id
              };
              CharactersAPI.CreateCharacterV3(webConf, model).then((res) => {
                if (res.ok) {
                  this.props.dispatch(leaveCharacterCreation());
                } else {
                  const error = convertRequestResult(res, (slug, fields) => {
                    // TODO : move text to string table
                    switch (slug) {
                      case 'VersionedData-RecordLimitReached':
                        return 'Character limit reached';
                      case 'VersionedData-RequestValueCollision':
                        if (fields && fields['name']) {
                          switch (fields['name']) {
                            case 'faction':
                              return 'Your faction has been locked';
                            case 'name':
                              return 'That name is taken';
                          }
                        }
                        return undefined;
                      case 'VersionedData-RequestValueInvalid':
                        if (fields && fields['name']) {
                          switch (fields['name']) {
                            case 'name':
                              return 'Invalid name'; // TODO : specify why
                            case 'raceID':
                              return 'Invalid race';
                            case 'classID':
                              return 'Invalid class';
                            case 'bodyTypeID':
                              return 'Invalid body type';
                            case 'stats':
                              return 'Invalid stat total';
                            // TODO : handle individual stats, each has the form "stats:{key}"
                          }
                        }
                      default:
                        return undefined;
                    }
                  });
                  console.error(error);
                  this.props.dispatch(addErrorNotice(error.message));
                }
                this.props.dispatch(hideModal());
              });
            }
          },
          isDisabled: inputValue.length === 0
        }
      ]
    };
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  return {
    ...ownProps,
    uiFactionID: state.hud.uiFactionID,
    stringTable: state.stringTable.stringTable,
    characterCreationState: state.characters.characterCreationState,
    racesByStringID: state.gameDefs.racesByStringID,
    classesByStringID: state.gameDefs.classesByStringID,
    bodyTypesByStringID: state.gameDefs.bodyTypesByStringID,
    stats: state.gameDefs.stats,
    startingAttributePoints: state.gameDefs.settings?.startingAttributePoints
  };
};

export const CharacterCreation = connect(mapStateToProps)(ACharacterCreation);
