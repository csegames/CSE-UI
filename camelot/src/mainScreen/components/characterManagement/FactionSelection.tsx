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
  StringIDGeneralCancel,
  StringIDGeneralConfirm,
  StringIDGeneralNext,
  StringIDGeneralUnknownFaction
} from '../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import {
  CharacterCreationState,
  leaveCharacterCreation,
  selectBodyType,
  selectFaction,
  selectRace
} from '../../redux/charactersSlice';
import { hideModal, showModal } from '../../redux/modalsSlice';
import { Faction, SimpleCharacter } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { getFactionData } from '../../gameData/factionData';
import { VideoPlayer } from '../../../shared/components/VideoPlayer';
import { FactionDef } from '../../dataSources/manifest/factionManifest';
import { FactionTitle } from '../FactionTitle';
import { BorderBackground, BorderType, FactionBorder } from '../FactionBorder';
import { setUIFactionID } from '../../redux/hudSlice';
import { cacheImagesForFaction } from '../../helpers/imageCacheHelpers';
import { getSelectableBodyTypes, getSelectableRaces } from '../../helpers/characterManagementHelpers';
import { RaceDef } from '../../dataSources/manifest/raceManifest';
import { BodyTypeDef } from '../../dataSources/manifest/bodyTypeManifest';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import HeaderDecorationURL from '../../../images/menu/menu-topnav-arrow-up.png';
import { requestAddImagesToCache, requestRemoveImagesFromCache } from '../../dataSources/imageCacheService';
import { FactionSplitter } from '../FactionSplitter';

// String IDs
const StringIDCharacterManagementLeaveTitle = 'CharacterManagementLeaveTitle';
const StringIDCharacterManagementLeaveMessage = 'CharacterManagementLeaveMessage';
const StringIDCharacterManagementHeaderRealm = 'CharacterManagementHeaderRealm';

// CSS classes
const Root = 'HUD-FactionSelection-Root';
const HeaderSection = 'HUD-FactionSelection-HeaderSection';
const HeaderDecoration = 'HUD-FactionSelection-HeaderDecoration';
const HeaderText = 'HUD-FactionSelection-HeaderText';
const MainContent = 'HUD-FactionSelection-MainContent';
const FooterButton = 'HUD-CharacterManagement-FooterButton';
const FactionSection = 'HUD-FactionSelection-FactionSection';
const FactionShadow = 'HUD-FactionSelection-FactionShadow';
const FactionMovie = 'HUD-FactionSelection-FactionMovie';
const FactionContent = 'HUD-FactionSelection-FactionContent';
const FactionShield = 'HUD-FactionSelection-FactionShield';
const FactionName = 'HUD-FactionSelection-FactionName';
const FactionDescriptionCollapser = 'HUD-FactionSelection-FactionDescriptionCollapser';
const FactionDescriptionContainer = 'HUD-FactionSelection-FactionDescriptionContainer';
const FactionDescriptionLabel = 'HUD-FactionSelection-FactionDescriptionLabel';
const Splitter = 'HUD-FactionSelection-Splitter';
const BottomBorder = 'HUD-FactionSelection-BottomBorder';
const TopBorder = 'HUD-FactionSelection-TopBorder';

interface State {
  selectedFactionID: Faction | null;
}

interface ReactProps {}

interface InjectedProps {
  stringTable: Record<string, StringTableEntryDef>;
  characterCreationState: CharacterCreationState | null;
  factionsByStringID: Record<string, FactionDef>;
  racesByStringID: Record<string, RaceDef>;
  bodyTypesByStringID: Record<string, BodyTypeDef>;
  characters: SimpleCharacter[];
  selectedCharacterID: string | null;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class AFactionSelection extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedFactionID: null
    };
  }

  render(): React.ReactNode {
    const borderFactionData = getFactionData(Faction.Factionless);

    return (
      <div className={Root}>
        <div className={HeaderSection}>
          <img className={HeaderDecoration} src={HeaderDecorationURL} />
          <div className={HeaderText}>
            {getStringTableValue(StringIDCharacterManagementHeaderRealm, this.props.stringTable)}
          </div>
          <img className={`${HeaderDecoration} bottom`} src={HeaderDecorationURL} />
        </div>
        <div className={MainContent}>
          <div className={TopBorder} style={{ backgroundImage: `url(${borderFactionData.edgeDecorativeTopImage})` }} />

          {this.renderFactionSection(Faction.Arthurian)}

          <FactionSplitter className={`${Splitter} ${Faction.Factionless}`} factionIDOverride={Faction.Factionless} />

          {this.renderFactionSection(Faction.TDD)}

          <FactionSplitter className={`${Splitter} ${Faction.Factionless}`} factionIDOverride={Faction.Factionless} />

          {this.renderFactionSection(Faction.Viking)}

          <div
            className={BottomBorder}
            style={{ backgroundImage: `url(${borderFactionData.edgeDecorativeTopImage})` }}
          />
        </div>
        <CharacterManagementFooter leftButtons={[this.renderLeaveButton()]} rightButtons={[this.renderNextButton()]} />
      </div>
    );
  }

  private getImagesToCache(factionID: string): string[] {
    const factionData = getFactionData(factionID);
    return [
      // The main background for CharacterManagement.
      factionData.backgroundFullscreenImage,
      // All of the button images.
      factionData.buttonBackgroundImage,
      factionData.cornerDecorativeTopLeftImage,
      factionData.cornerDecorativeTopRightImage,
      factionData.cornerDecorativeBottomLeftImage,
      factionData.cornerDecorativeBottomRightImage,
      factionData.endcapImage,
      factionData.edgeDecorativeTopImage
    ];
  }

  componentDidMount(): void {
    // Directly cache the needed images for ALL factions so that this UI will always look good.
    Object.values(Faction).forEach((factionID) => {
      requestAddImagesToCache(Root, this.getImagesToCache(factionID));
    });

    requestAddImagesToCache(Root, this.getImagesToCache(Faction.Factionless));
  }

  componentWillUnmount(): void {
    Object.values(Faction).forEach((factionID) => {
      requestRemoveImagesFromCache(Root, this.getImagesToCache(factionID));
    });

    requestRemoveImagesFromCache(Root, this.getImagesToCache(Faction.Factionless));
  }

  private renderFactionSection(factionID: Faction): React.ReactNode {
    const factionData = getFactionData(factionID);
    const isSelected = factionID === this.state.selectedFactionID;
    const faction = this.props.factionsByStringID[factionID];

    return (
      <div
        className={`${FactionSection}${isSelected ? ' selected' : ''}`}
        onClick={() => {
          if (this.state.selectedFactionID !== factionID) {
            this.setState({ selectedFactionID: factionID });
            this.props.dispatch(setUIFactionID(factionID));
            cacheImagesForFaction(factionID);
          }

          switch (factionID) {
            case Faction.Arthurian: {
              clientAPI.playGameSound(SoundEvents.PLAY_UI_MUSIC_CC_REALM_ART_SELECT);
              break;
            }
            case Faction.TDD: {
              clientAPI.playGameSound(SoundEvents.PLAY_UI_MUSIC_CC_REALM_TDD_SELECT);
              break;
            }
            case Faction.Viking: {
              clientAPI.playGameSound(SoundEvents.PLAY_UI_MUSIC_CC_REALM_VIK_SELECT);
              break;
            }
          }
        }}
      >
        <VideoPlayer className={FactionMovie} src={factionData.backgroundRealmVideo} play={isSelected} />
        <div className={FactionContent}>
          <div className={`${FactionDescriptionCollapser}${isSelected ? ' open' : ''}`}>
            <FactionBorder
              factionIDOverride={factionID}
              className={FactionDescriptionContainer}
              type={BorderType.Primary}
              background={BorderBackground.PatternLarge}
            >
              <div className={FactionDescriptionLabel}>
                {getStringTableValue(faction?.description ?? StringIDGeneralUnknownFaction, this.props.stringTable)}
              </div>
            </FactionBorder>
          </div>
          <img className={FactionShield} src={factionData.factionShieldImage} />
          <FactionTitle className={FactionName} heightOverrideVmin={20} factionIDOverride={factionID}>
            {getStringTableValue(faction?.name ?? StringIDGeneralUnknownFaction, this.props.stringTable)}
          </FactionTitle>
        </div>
        <div className={FactionShadow} />
      </div>
    );
  }

  private renderLeaveButton(): React.ReactNode {
    return (
      <FactionButton
        className={FooterButton}
        onClick={() => {
          clientAPI.playGameSound(SoundEvents.PLAY_UI_SFX_CC_GENERIC_SELECT);
          this.props.dispatch(
            showModal({
              content: {
                title: getStringTableValue(StringIDCharacterManagementLeaveTitle, this.props.stringTable),
                message: getStringTableValue(StringIDCharacterManagementLeaveMessage, this.props.stringTable),
                buttons: [
                  {
                    text: getStringTableValue(StringIDGeneralCancel, this.props.stringTable),
                    onClick: () => {
                      clientAPI.playGameSound(SoundEvents.PLAY_UI_MUSIC_CC_LEAVE_CANCEL);
                      this.props.dispatch(hideModal());
                    }
                  },
                  {
                    text: getStringTableValue(StringIDGeneralConfirm, this.props.stringTable),
                    onClick: () => {
                      clientAPI.playGameSound(SoundEvents.PLAY_UI_MUSIC_CC_LEAVE_CONFIRM);

                      this.props.dispatch(leaveCharacterCreation());
                      const selectedCharacter = this.props.characters.find(
                        (c) => c.id === this.props.selectedCharacterID
                      );
                      // When we back out, return the UI faction to whatever it used to be before.
                      if (selectedCharacter) {
                        this.props.dispatch(setUIFactionID(selectedCharacter.factionID!));
                        cacheImagesForFaction(selectedCharacter.factionID!);
                      }
                      this.props.dispatch(hideModal());
                    }
                  }
                ]
              },
              id: 'LeaveCharacterCreation'
            })
          );
        }}
      >
        {getStringTableValue(StringIDGeneralBack, this.props.stringTable)}
      </FactionButton>
    );
  }

  private renderNextButton(): React.ReactNode {
    return (
      <FactionButton
        className={FooterButton}
        disabled={!this.state.selectedFactionID}
        onClick={() => {
          clientAPI.playGameSound(SoundEvents.PLAY_UI_SFX_CC_GENERIC_SELECT);
          // Selecting the faction will progress us to the CharacterCreation page.
          this.props.dispatch(selectFaction(this.state.selectedFactionID!));

          // Auto-select the first supported race and bodytype for this faction.
          const selectableRaces = getSelectableRaces(this.state.selectedFactionID!, this.props.racesByStringID);
          this.props.dispatch(selectRace(selectableRaces[0]?.id));

          const selectableBodyTypes = getSelectableBodyTypes(this.props.bodyTypesByStringID);
          this.props.dispatch(selectBodyType(selectableBodyTypes[0]?.id));

          // Once a faction has been selected, we can preload its UI images.
          // If the faction is already cached, this is a no-op.
          this.props.dispatch(setUIFactionID(this.state.selectedFactionID!));
          cacheImagesForFaction(this.state.selectedFactionID!);
        }}
      >
        {getStringTableValue(StringIDGeneralNext, this.props.stringTable)}
      </FactionButton>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable,
    characterCreationState: state.characters.characterCreationState,
    factionsByStringID: state.gameDefs.factions,
    racesByStringID: state.gameDefs.racesByStringID,
    bodyTypesByStringID: state.gameDefs.bodyTypesByStringID,
    characters: state.characters.characters,
    selectedCharacterID: state.characters.selectedCharacterID
  };
};

export const FactionSelection = connect(mapStateToProps)(AFactionSelection);
