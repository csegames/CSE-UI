/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { AddDispatch, RootState } from '../../redux/store';
import { connect } from 'react-redux';
import { SimpleCharacter } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { CharacterManagementFooter } from './CharacterManagementFooter';
import { FactionButton } from '../FactionButton';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { getStringTableValue, StringIDGeneralCancel, StringIDGeneralConfirm } from '../../helpers/stringTableHelpers';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { startCharacterCreation } from '../../redux/charactersSlice';
import { hideModal, showModal } from '../../redux/modalsSlice';
import { CharacterList } from './CharacterList';
import { FactionSplitter } from '../FactionSplitter';
import { getFactionData } from '../../gameData/factionData';
import { CharacterDetails } from './CharacterDetails';
import { CharacterPaperDoll } from './CharacterPaperDoll';
import { clearAbilities } from '../../redux/abilitiesSlice';
import {
  cacheCharacterListImages,
  cacheCharacterRaceImages,
  cacheImagesForFaction,
  uncacheCharacterListImages
} from '../../helpers/imageCacheHelpers';
import { setUIFactionID } from '../../redux/hudSlice';
import { ClassDef } from '../../dataSources/manifest/classManifest';
import { RaceDef } from '../../dataSources/manifest/raceManifest';
import { BodyTypeDef } from '../../dataSources/manifest/bodyTypeManifest';
import { WithWebInterface } from '../../redux/withWebInterface';
import { LoadingTopic } from '../../redux/loadingSlice';

// String IDs
const StringIDCharacterManagementCreateCharacter = 'CharacterManagementCreateCharacter';
const StringIDCharacterManagementExitGame = 'CharacterManagementExitGame';
const StringIDCharacterManagementExitTitle = 'CharacterManagementExitTitle';
const StringIDCharacterManagementExitMessage = 'CharacterManagementExitMessage';
const StringIDCharacterManagementPlay = 'CharacterManagementPlay';
const StringIDCharacterCreationWelcomeHeader = 'CharacterCreationWelcomeHeader';
const StringIDCharacterCreationWelcomeBody = 'CharacterCreationWelcomeBody';
const StringIDLoadingPhaseFindingServer = 'LoadingPhaseFindingServer';

// CSS classes
const Root = 'HUD-CharacterSelection-Root';
const MainContent = 'HUD-CharacterSelection-MainContent';
const FooterButton = 'HUD-CharacterManagement-FooterButton';
const BottomBorder = 'HUD-CharacterManagement-BottomBorder';
const Splitter = 'HUD-CharacterManagement-Splitter';
const WelcomeHeader = 'HUD-CharacterSelection-WelcomeHeader';
const WelcomeBody = 'HUD-CharacterSelection-WelcomeBody';

interface State {
  playButtonPressed: boolean;
}

interface ReactProps {}

interface InjectedProps {
  uiFactionID: string;
  characters: SimpleCharacter[];
  selectedCharacterID: string | null;
  stringTable: Record<string, StringTableEntryDef>;
  classesByStringID: Record<string, ClassDef>;
  racesByStringID: Record<string, RaceDef>;
  bodyTypesByStringID: Record<string, BodyTypeDef>;
  gameDefsLoaded: boolean;
  isShardOffline: boolean;
  subscribedToQueues: boolean;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class ACharacterSelection extends WithWebInterface(React.Component<Props, State>) {
  constructor(props: Props) {
    super(props);

    this.state = {
      playButtonPressed: false,
    };
  }

  render(): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <div className={Root}>
        <div className={MainContent}>
          <CharacterList />
          <FactionSplitter className={`${Splitter} ${this.props.uiFactionID}`} />
          <CharacterPaperDoll />
          <FactionSplitter className={`${Splitter} ${this.props.uiFactionID}`} />
          <CharacterDetails />
          <div className={BottomBorder} style={{ backgroundImage: `url(${factionData.edgeDecorativeTopImage})` }} />
        </div>
        <CharacterManagementFooter
          leftButtons={[this.renderQuitButton(), this.renderCreateCharacterButton()]}
          rightButtons={[this.renderPlayButton()]}
          centerContent={this.renderWelcomeMessage()}
        />
      </div>
    );
  }

  componentDidMount(): void {
    this.requestCacheCharacterListImages();
    this.props.characters.forEach((character) => this.clientRenderPaperDoll(character));
    const selectedCharacter = this.props.characters.find((c) => c.id === this.props.selectedCharacterID);
    if (selectedCharacter) {
      clientAPI.pauseAllPaperDollExcept(selectedCharacter.name);
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (this.props.characters !== prevProps.characters || this.props.gameDefsLoaded !== prevProps.gameDefsLoaded) {
      this.requestCacheCharacterListImages();
      this.props.characters.forEach((character) => this.clientRenderPaperDoll(character));

      let newSet = new Set(this.props.characters);
      const removedCharacters = prevProps.characters.filter((x) => !newSet.has(x));
      removedCharacters.forEach((character) => clientAPI.deletePaperDoll(character.name));
    }

    if (this.props.subscribedToQueues && !prevProps.subscribedToQueues) {
      const selectedCharacter = this.props.characters.find((c) => c.id === this.props.selectedCharacterID);
      if (selectedCharacter && this.state.playButtonPressed) {
        this.play(selectedCharacter);
      }
    }
  }

  componentWillUnmount(): void {
    this.props.characters.forEach((character) => clientAPI.deletePaperDoll(character.name));
  }

  private clientRenderPaperDoll(character: SimpleCharacter): void {
    const characterBodyType = this.props.bodyTypesByStringID[character.bodyTypeID];
    const characterClass = this.props.classesByStringID[character.classID];
    const characterRace = this.props.racesByStringID[character.raceID];

    if (characterClass) {
      if (characterClass.paperDollImages !== undefined) {
        const paperDollImage = characterClass.paperDollImages.find(
          (item) => item.raceID === character.raceID && item.bodyTypeID === character.bodyTypeID
        );

        if (paperDollImage != undefined) {
          if (paperDollImage.defaultOutfit != undefined) {
            const animation = paperDollImage.characterSelectAnimation;

            clientAPI.renderPaperDoll(
              character.name,
              characterClass.numericID,
              characterRace.numericID,
              characterBodyType.numericID,
              animation,
              paperDollImage.defaultOutfit
            );
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

  private requestCacheCharacterListImages(): void {
    if (this.props.gameDefsLoaded) {
      cacheCharacterListImages(this.props.characters, this.props.classesByStringID);
    }
  }

  private renderWelcomeMessage(): React.ReactNode {
    return (
      <>
        <div className={WelcomeHeader}>
          {getStringTableValue(StringIDCharacterCreationWelcomeHeader, this.props.stringTable)}
        </div>
        <div className={WelcomeBody}>
          {getStringTableValue(StringIDCharacterCreationWelcomeBody, this.props.stringTable)}
        </div>
      </>
    );
  }

  private renderQuitButton(): JSX.Element | null {
    return (
      <FactionButton
        className={FooterButton}
        onClick={() => {
          clientAPI.playGameSound(SoundEvents.PLAY_UI_SFX_CC_GENERIC_SELECT);
          this.props.dispatch(
            showModal({
              content: {
                title: getStringTableValue(StringIDCharacterManagementExitTitle, this.props.stringTable),
                message: getStringTableValue(StringIDCharacterManagementExitMessage, this.props.stringTable),
                buttons: [
                  {
                    text: getStringTableValue(StringIDGeneralCancel, this.props.stringTable),
                    onClick: () => {
                      clientAPI.playGameSound(SoundEvents.PLAY_UI_SFX_CC_GENERIC_SELECT);
                      this.props.dispatch(hideModal());
                    }
                  },
                  {
                    text: getStringTableValue(StringIDGeneralConfirm, this.props.stringTable),
                    onClick: () => {
                      clientAPI.playGameSound(SoundEvents.PLAY_UI_SFX_CC_CONFIRM);
                      clientAPI.quit();
                    }
                  }
                ]
              },
              id: 'ExitGame'
            })
          );
        }}
      >
        {getStringTableValue(StringIDCharacterManagementExitGame, this.props.stringTable)}
      </FactionButton>
    );
  }

  private renderCreateCharacterButton(): React.ReactNode {
    return (
      <FactionButton
        disabled={!this.props.gameDefsLoaded || this.props.isShardOffline}
        onClick={() => {
          clientAPI.playGameSound(SoundEvents.PLAY_UI_SFX_CC_GENERIC_SELECT);
          this.props.dispatch(startCharacterCreation());
        }}
      >
        {getStringTableValue(StringIDCharacterManagementCreateCharacter, this.props.stringTable)}
      </FactionButton>
    );
  }

  private renderPlayButton(): React.ReactNode {
    const selectedCharacter = this.props.characters.find((c) => c.id === this.props.selectedCharacterID);
    if (selectedCharacter) {
      return (
        <FactionButton
          disabled={!selectedCharacter || this.state.playButtonPressed}
          disabledTooltip={this.getDisabledPlayTooltipText()}
          onClick={() => {
            clientAPI.playGameSound(SoundEvents.PLAY_UI_SFX_CC_PLAY_SELECT);
            clientAPI.setCharacter(this.props.selectedCharacterID!).then((wasSuccessful) => {
              if (wasSuccessful) {
                this.setState({ playButtonPressed: true });
                this.props.dispatch(clearAbilities());
                this.resetGraphQL();
              }
            });
          }}
        >
          {getStringTableValue(StringIDCharacterManagementPlay, this.props.stringTable)}
        </FactionButton>
      );
    } else {
      return null;
    }
  }

  private getDisabledPlayTooltipText(): string {
    if (!this.props.subscribedToQueues) {
      return getStringTableValue(StringIDLoadingPhaseFindingServer, this.props.stringTable);
    }
    return '';
  }

  private play(selectedCharacter: SimpleCharacter): void {
    this.setState({ playButtonPressed: false });
    clientAPI.connect();
    // While the loading screen is up, we can start preloading some relevant images.
    // These give a better experience for all faction-themed UI (which is most of it).
    // If we already requested caching for this faction, this will be a no-op.
    cacheImagesForFaction(selectedCharacter.factionID);
    this.props.dispatch(setUIFactionID(selectedCharacter.factionID));
    // Race/bodyType images are for equipment UI.
    cacheCharacterRaceImages(selectedCharacter.raceID, selectedCharacter.bodyTypeID);
    // These won't be necessary again this session unless the user logs out.
    uncacheCharacterListImages();
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  state.characters.characters;
  return {
    ...ownProps,
    uiFactionID: state.hud.uiFactionID,
    characters: state.characters.characters,
    selectedCharacterID: state.characters.selectedCharacterID,
    stringTable: state.stringTable.stringTable,
    classesByStringID: state.gameDefs.classesByStringID,
    racesByStringID: state.gameDefs.racesByStringID,
    bodyTypesByStringID: state.gameDefs.bodyTypesByStringID,
    gameDefsLoaded: state.loading.gameDefsLoaded,
    // Confirmed shard query failure (tri-state: null = loading, true = ok, false = failed).
    isShardOffline: state.loading.componentStatus[LoadingTopic.ShardCharacters] === false,
    subscribedToQueues: state.loading.subscribedToQueues
  };
};

export const CharacterSelection = connect(mapStateToProps)(ACharacterSelection);
