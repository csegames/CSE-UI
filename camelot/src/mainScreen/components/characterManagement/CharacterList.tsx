/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { AddDispatch, RootState } from '../../redux/store';
import { connect } from 'react-redux';
import { SimpleCharacter } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralDelete,
  StringIDGeneralHyphen,
  StringIDGeneralReturn,
  StringIDGeneralUnknownClass,
  StringIDGeneralUnknownRace
} from '../../helpers/stringTableHelpers';
import { hideModal, ModalModel, showModal, updateModalContent } from '../../redux/modalsSlice';
import { FormattedTextDiv } from '../../../shared/components/FormattedTextDiv';
import { FactionScrollArea } from '../FactionScrollArea';
import { FactionDivider } from '../FactionDivider';
import { BorderBackground } from '../FactionBorder';
import { ClassDef } from '../../dataSources/manifest/classManifest';
import { RaceDef } from '../../dataSources/manifest/raceManifest';
import { CornerButtonType, FactionCornerButton } from '../FactionCornerButton';
import { setUIFactionID } from '../../redux/hudSlice';
import { TextInput, TextInputType } from '../input/TextInput';
import { CharactersAPI, Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { webConf } from '../../redux/networkConfiguration';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { selectCharacter } from '../../redux/charactersSlice';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { BodyTypeDef } from '../../dataSources/manifest/bodyTypeManifest';
import { FactionBorderSelectable } from '../FactionBorderSelectable';

const ModalID = 'DeleteCharacter';

// String IDs
const StringIDCharacterManagementCharactersCount = 'CharacterManagementCharactersCount';
const StringIDCharacterManagementDeleteCharacterTitle = 'CharacterManagementDeleteCharacterTitle';
const StringIDCharacterManagementDeleteCharacterMessage = 'CharacterManagementDeleteCharacterMessage';

// CSS classes
const Root = 'HUD-CharacterList-Root';
const CharacterCountNumber = 'HUD-CharacterList-CharacterCountNumber';
const CharacterCountLabel = 'HUD-CharacterList-CharacterCountLabel';
const ListContainer = 'HUD-CharacterList-CharacterListContainer';
const ListContent = 'HUD-CharacterList-CharacterListContent';
const Cell = 'HUD-CharacterList-Cell';
const CharacterNameLabel = 'HUD-CharacterList-CharacterNameLabel';
const CharacterDetailsLabel = 'HUD-CharacterList-DetailsLabel';
const CharacterDeleteContainer = 'HUD-CharacterList-CharacterDeleteContainer';
const CharacterDeleteInput = 'HUD-CharacterList-CharacterDeleteInput';

interface ReactProps {}

interface InjectedProps {
  characters: SimpleCharacter[];
  selectedCharacterID: string | null;
  stringTable: Record<string, StringTableEntryDef>;
  classesByStringID: Record<string, ClassDef>;
  racesByStringID: Record<string, RaceDef>;
  bodyTypesByStringID: Record<string, BodyTypeDef>;
  gameDefsLoaded: boolean;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class ACharacterList extends React.Component<Props> {
  render(): React.ReactNode {
    if (!this.props.gameDefsLoaded || Object.keys(this.props.stringTable).length <= 0) {
      return null;
    }

    return (
      <div className={Root}>
        <FormattedTextDiv
          textAlign={'center'}
          text={getTokenizedStringTableValue(StringIDCharacterManagementCharactersCount, this.props.stringTable, {
            COUNT: String(this.props.characters.length)
          })}
          className={CharacterCountLabel}
          textClasses={[CharacterCountNumber]}
          nodes={[]}
        />
        <FactionDivider />
        <FactionScrollArea className={ListContainer} contentClassName={ListContent}>
          {this.props.characters.map(this.renderCharacterCell.bind(this))}
        </FactionScrollArea>
        <FactionDivider />
      </div>
    );
  }

  private renderCharacterCell(character: SimpleCharacter, index: number): React.ReactNode {
    const isSelected = character.id === this.props.selectedCharacterID;
    const characterClass = this.props.classesByStringID[character.classID!];
    const characterRace = this.props.racesByStringID[character.raceID!];
    const characterBodyType = this.props.bodyTypesByStringID[character.bodyTypeID!];

    return (
      <FactionBorderSelectable
        factionIDOverride={character.factionID!}
        key={`Character${character.id}`}
        className={Cell}
        isSelected={isSelected}
        background={BorderBackground.PatternLarge}
        cornerButtons={[
          <FactionCornerButton
            small
            factionIDOverride={character.factionID!}
            type={CornerButtonType.Close}
            onClick={this.onDeleteCharacterClicked.bind(this, character)}
          />
        ]}
        onSelected={() => {
          clientAPI.playGameSound(SoundEvents.PLAY_UI_MENU_CHARACTERSELECT_CHANGE);
          if (!isSelected) {
            clientAPI.pauseAllPaperDollExcept(character.name!);
            clientAPI.setUIClassState(characterClass.numericID);
            clientAPI.setUIFactionState(Faction[character.factionID!]);
            clientAPI.setUIGenderState(characterBodyType.numericID);
            clientAPI.setUIRaceState(characterRace.numericID);
            this.props.dispatch(selectCharacter(character.id));
            this.props.dispatch(setUIFactionID(character.factionID!));
          }
        }}
      >
        <div className={CharacterNameLabel}>{character.name}</div>
        <div className={CharacterDetailsLabel}>{`${getStringTableValue(
          characterClass?.name ?? StringIDGeneralUnknownClass,
          this.props.stringTable
        )} ${getStringTableValue(StringIDGeneralHyphen, this.props.stringTable)} ${getStringTableValue(
          characterRace?.name ?? StringIDGeneralUnknownRace,
          this.props.stringTable
        )}`}</div>
      </FactionBorderSelectable>
    );
  }

  private onDeleteCharacterClicked(character: SimpleCharacter): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_SFX_CC_SELECT_X_DELETE);
    this.props.dispatch(setUIFactionID(character.factionID!));
    this.props.dispatch(
      showModal({
        id: ModalID,
        escapable: true,
        content: this.getDeleteCharacterModalContent(character, ''),
        maxWidth: '38vmin'
      })
    );
  }

  private getDeleteCharacterModalContent(character: SimpleCharacter, inputValue: string): ModalModel {
    return {
      title: getStringTableValue(StringIDCharacterManagementDeleteCharacterTitle, this.props.stringTable),
      message: getStringTableValue(StringIDCharacterManagementDeleteCharacterMessage, this.props.stringTable),
      body: (
        <div className={CharacterDeleteContainer}>
          <TextInput
            type={TextInputType.CharacterName}
            inputClassName={CharacterDeleteInput}
            value={inputValue}
            setValue={(value) => {
              this.props.dispatch(updateModalContent([ModalID, this.getDeleteCharacterModalContent(character, value)]));
            }}
            showLength
          />
        </div>
      ),
      buttons: [
        {
          text: getStringTableValue(StringIDGeneralReturn, this.props.stringTable),
          onClick: () => {
            clientAPI.playGameSound(SoundEvents.PLAY_UI_SFX_CC_CANCEL_RETURN);
            this.props.dispatch(hideModal());
          }
        },
        {
          text: getStringTableValue(StringIDGeneralDelete, this.props.stringTable),
          onClick: () => {
            clientAPI.playGameSound(SoundEvents.PLAY_UI_SFX_CC_CONFIRM_DELETE);
            CharactersAPI.DeleteCharacterV2(webConf, character.id!).then((res) => {
              if (!res.ok) {
                console.error('DeleteCharacterV2 error', JSON.parse(res.data));
              }
              this.props.dispatch(hideModal());
            });
          },
          isDisabled: inputValue !== character.name
        }
      ]
    };
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  state.characters.characters;
  return {
    ...ownProps,
    characters: state.characters.characters,
    selectedCharacterID: state.characters.selectedCharacterID,
    stringTable: state.stringTable.stringTable,
    classesByStringID: state.gameDefs.classesByStringID,
    racesByStringID: state.gameDefs.racesByStringID,
    bodyTypesByStringID: state.gameDefs.bodyTypesByStringID,
    gameDefsLoaded: state.loading.gameDefsLoaded
  };
};

export const CharacterList = connect(mapStateToProps)(ACharacterList);
