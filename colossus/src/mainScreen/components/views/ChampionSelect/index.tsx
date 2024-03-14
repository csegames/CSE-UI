/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';

import { ChampionPanel } from './ChampionPanel';
import { PlayerList } from './PlayerList';
import { LockButton } from './LockButton';

import { TransitionAnimation } from '../../shared/TransitionAnimation';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { RootState } from '../../../redux/store';
import { connect } from 'react-redux';
import {
  ChampionCostumeInfo,
  ChampionInfo,
  ChampionSelection,
  PerkDefGQL,
  ScenarioDefGQL,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Header } from '../../shared/Header';
import { MatchRequestState, selectChampion, SelectionRequest } from '../../../redux/matchSlice';
import { Dispatch } from 'redux';
import { ProfileModel } from '../../../redux/profileSlice';
import { getStringTableValue } from '../../../helpers/stringTableHelpers';

const Container = 'ChampionSelect-PlayerSelect-Container';
const HeaderContainer = 'ChampionSelect-PlayerSelect-HeaderContainer';
const HeaderItemContainer = 'ChampionSelect-PlayerSelect-HeaderItemContainer';
const GameModeContainer = 'ChampionSelect-PlayerSelect-GameModeContainer';
const GameModeText = 'ChampionSelect-PlayerSelect-GameModeText';
const GameModeDifficulty = 'ChampionSelect-PlayerSelect-GameModeDifficulty';
const PlayerSelectionContainerDiv = 'ChampionSelect-PlayerSelect-PlayerSelectionContainerDiv';
const ChampionPickContainer = 'ChampionSelect-PlayerSelect-ChampionPickContainer';
const CharacterArtBackgroundFar = 'ChampionSelect-PlayerSelect-CharacterArtBackgroundFar';
const CharacterArtBackgroundHighlight = 'ChampionSelect-PlayerSelect-CharacterArtBackgroundHighlight';

// @TODO: [FSR-1906] Determine if this really needs to be a -webkit-mask-image and refactor if not.
const SelectedChampionContainer = 'ChampionSelect-PlayerSelect-SelectedChampionContainer';
const SelectedChampionTransitionAnimation = 'ChampionSelect-PlayerSelect-SelectedChampionTransitionAnimation';
const SelectedChampionImage = 'ChampionSelect-PlayerSelect-SelectedChampionImage';
const ChampionInfoContainer = 'ChampionSelect-PlayerSelect-ChampionInfoContainer';
const LockedListContainer = 'ChampionSelect-PlayerSelect-LockedListContainer';
const LockInPosition = 'ChampionSelect-PlayerSelect-LockInPosition';
const ConsoleNavIcon = 'ChampionSelect-PlayerSelect-ConsoleNavIcon';

const ChoiceContainer = 'ChampionSelect-ChampionPick-Container';
const ChoiceImage = 'ChampionSelect-ChampionPick-Image';

const BackgroundAnimationClass = 'ChampionSelect-PlayerSelect-BackgroundAnimation';

const StringIDChampionSelectTitle = 'ChampionSelectTitle';

export interface ReactProps {}

interface InjectedProps {
  accountID: string;
  costumes: ChampionCostumeInfo[];
  champions: ChampionInfo[];
  currentSelection: ChampionSelection;
  dispatch?: Dispatch;
  perksByID: Dictionary<PerkDefGQL>;
  profile: ProfileModel;
  requests: MatchRequestState;
  usingGamepadInMainMenu: boolean;
  scenarioDefs: Dictionary<ScenarioDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class AChampionSelect extends React.Component<Props> {
  public render() {
    if (!this.props.currentSelection?.players) {
      return null;
    }
    const requested = this.getCurrentRequest();
    const champion = this.props.champions.find((c) => c.id === requested?.championID);
    const costume = this.getChampionCostumeInfo(requested?.championID);
    if (!costume) return;

    const scenarioName = this.props.scenarioDefs[this.props.currentSelection.scenarioID]?.name ?? '';

    return (
      <div className={Container}>
        {!requested.locked && (
          <TransitionAnimation changeVariable={costume.backgroundImageURL} animationClass={BackgroundAnimationClass}>
            <img className={CharacterArtBackgroundFar} src={costume.backgroundImageURL} />
          </TransitionAnimation>
        )}

        <img
          src={costume.championSelectedFlareImageURL}
          className={`${CharacterArtBackgroundHighlight} ${requested.locked ? 'locked' : ''}`}
        />

        <div className={`${HeaderContainer} ${requested.locked ? 'locked' : ''}`}>
          <div className={HeaderItemContainer}>
            <div className={GameModeContainer}>
              <div className={GameModeText}>{scenarioName}</div>
              <div className={GameModeDifficulty}>{'Standard'}</div>
            </div>
          </div>
          <div className={`${HeaderItemContainer} align-center`}>
            <Header isSelected>{getStringTableValue(StringIDChampionSelectTitle, this.props.stringTable)}</Header>
          </div>
          <div className={HeaderItemContainer} />
        </div>

        <div className={`${PlayerSelectionContainerDiv} ${requested.locked ? ' locked' : ''}`}>
          <TransitionAnimation
            changeVariable={costume.standingImageURL}
            animationClass={SelectedChampionTransitionAnimation}
            containerStyles={SelectedChampionContainer}
          >
            <img className={SelectedChampionImage} src={costume.standingImageURL} />
          </TransitionAnimation>

          <div className={ChampionInfoContainer}>
            <div className={ChampionPickContainer}>
              {this.props.usingGamepadInMainMenu && <div className={`${ConsoleNavIcon} icon-xb-lb`} />}
              {this.props.champions.map((champion) =>
                this.renderPick(champion.id, requested.locked, champion.id === requested.championID)
              )}
              {this.props.usingGamepadInMainMenu && <div className={`${ConsoleNavIcon} icon-xb-rb`} />}
            </div>

            {champion && <ChampionPanel selected={champion} />}
            <div className={LockInPosition}>
              <LockButton enabled={!requested.locked} onClick={this.onLockIn.bind(this, requested.championID)} />
            </div>
          </div>
        </div>

        <div className={LockedListContainer}>
          <PlayerList />
        </div>
      </div>
    );
  }

  private renderPick(championID: string, locked: boolean, selected: boolean): React.ReactNode {
    const championThumbnailURL = this.getChampionThumbnail(championID);
    const selectedClass = selected ? 'selected' : '';
    const onClick = !locked && !selected ? this.onChampionPick.bind(this, championID) : undefined;
    return (
      <div className={`${ChoiceContainer} ${selectedClass}`} onClick={onClick}>
        <img className={ChoiceImage} src={championThumbnailURL} />
      </div>
    );
  }

  private getCurrentRequest(): SelectionRequest {
    const roundID = this.props.currentSelection.roundID;
    const queued = this.props.requests.queued?.select;
    if (queued?.roundID === roundID) return queued;
    const active = this.props.requests.active?.select;
    if (active?.roundID === roundID) return active;
    const player = this.props.currentSelection.players.find((p) => p.id == this.props.accountID);
    const locked = player?.locked ?? false;
    const championID =
      player?.selectedChampion?.championID ?? player?.defaultChampion?.championID ?? this.props.champions[0].id;
    return { roundID, championID, locked };
  }

  private getChampionThumbnail(championID: string): string {
    const champ = this.props.profile.champions.find((champ) => champ.championID === championID);
    if (champ) {
      const portraitPerk = this.props.perksByID[champ.portraitPerkID];
      if (portraitPerk) {
        return portraitPerk.portraitThumbnailURL;
      }
    }

    return this.getChampionCostumeInfo(championID).thumbnailURL;
  }

  private getChampionCostumeInfo(championID: string): ChampionCostumeInfo {
    const champ = this.props.profile.champions.find((champ) => champ.championID === championID);
    const costumePerk = this.props.perksByID[champ?.costumePerkID ?? ''];
    const costume = this.props.costumes.find((c) => c.id === costumePerk?.costume.id);
    return costume ?? this.props.costumes[0];
  }

  private onChampionPick(championID: string) {
    const roundID = this.props.currentSelection.roundID;
    this.props.dispatch(selectChampion({ roundID, championID, locked: false }));
    const champ = this.props.champions.find((c) => c.id == championID);
    if (champ?.championSelectSound) {
      game.playGameSound(champ.championSelectSound);
    }
  }

  private async onLockIn(championID: string) {
    const roundID = this.props.currentSelection.roundID;
    this.props.dispatch(selectChampion({ roundID, championID, locked: true }));
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CHARACTER_SELECT_LOCK_IN);
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { id } = state.user;
  const { requests, currentSelection } = state.match;
  const { usingGamepadInMainMenu } = state.baseGame;
  const { championCostumes, champions } = state.championInfo;
  const { perksByID } = state.store;
  const { profile } = state;
  const { scenarioDefs } = state.scenarios;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    accountID: id,
    costumes: championCostumes,
    champions,
    currentSelection,
    perksByID,
    profile,
    requests,
    usingGamepadInMainMenu,
    scenarioDefs,
    stringTable
  };
}

export const ChampionSelect = connect(mapStateToProps)(AChampionSelect);
