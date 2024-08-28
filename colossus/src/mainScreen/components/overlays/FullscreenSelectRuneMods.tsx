/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {
  ChampionInfo,
  PerkDefGQL,
  QuestGQL,
  QuestDefGQL,
  StringTableEntryDef,
  PerkType,
  PurchaseDefGQL
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Overlay, hideOverlay, showError, showOverlay } from '../../redux/navigationSlice';
import { RootState } from '../../redux/store';
import { Button } from '../shared/Button';
import {
  findChampionQuest,
  findChampionQuestProgress,
  getChampionPerkUnlockQuestIndex,
  getUnlockedRuneModTierForChampion,
  isPerkUnseen,
  markEquipmentSeen
} from '../../helpers/characterHelpers';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { game } from '@csegames/library/dist/_baseGame';
import { ProfileAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { QuestsByType } from '../../redux/questSlice';
import {
  StringIDGeneralBack,
  StringIDGeneralError,
  StringIDGeneralUnlock,
  StringIDGeneralXPProgress,
  getStringTableValue,
  getTokenizedStringTableValue
} from '../../helpers/stringTableHelpers';
import TooltipSource from '../../../shared/components/TooltipSource';
import { ResourceBar } from '../shared/ResourceBar';
import { webConf } from '../../dataSources/networkConfiguration';
import { refreshProfile } from '../../dataSources/profileNetworking';
import { TooltipPosition } from '../../redux/tooltipSlice';
import { GenericToaster } from '../GenericToaster';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';

const FullscreenContainer = 'ChampionProfile-SelectRuneMods-Container';
const RuneModsBGImage = 'ChampionProfile-SelectRuneMods-BGImage';
const Centerer = 'ChampionProfile-SelectRuneMods-Centerer';
const RuneCollectionContainer = 'ChampionProfile-SelectRuneMods-RuneCollectionContainer';

const ChampionName = 'ChampionProfile-SelectRuneMods-ChampionName';
const PageTitle = 'ChampionProfile-SelectRuneMods-PageTitle';
const AvailableRuneKeys = 'ChampionProfile-SelectRuneMods-AvailableRuneKeys';
const ChampionLevelContainer = 'ChampionProfile-SelectRuneMods-ChampionLevelContainer';
const ChampionLevelBackground = 'ChampionProfile-SelectRuneMods-ChampionLevelBackground';
const ProgressionLevel = 'ChampionProfile-SelectRuneMods-ProgressionLevel';
const ProgressBarTooltip = 'ChampionProfile-SelectRuneMods-ProgressBarTooltip';
const ProgressBar = 'ChampionProfile-SelectRuneMods-ProgressBar';

const RuneModsRow = 'ChampionProfile-SelectRuneMods-Row';
const TierHeader = 'ChampionProfile-SelectRuneMods-TierHeader';
const RuneModContainer = 'ChampionProfile-SelectRuneMods-RuneModContainer';
const RuneModsButton = 'ChampionProfile-SelectRuneMods-Button';
const RuneModsButtonIcon = 'ChampionProfile-SelectRuneMods-ButtonIcon';
const LockedIcon = 'ChampionProfile-SelectRuneMods-LockedIcon';
const UnlockButton = 'ChampionProfile-SelectRuneMods-UnlockButton';
const UnlockAnimation = 'ChampionProfile-SelectRuneMods-UnlockAnimation';

const ToolTipContainer = 'ChampionProfile-SelectRuneMods-ToolTipContainer';
const ToolTipName = 'ChampionProfile-SelectRuneMods-ToolTipName';
const TooltipDescription = 'ChampionProfile-SelectRuneMods-ToolTipDescription';
const TooltipUnlockRequirements = 'ChampionProfile-SelectRuneMods-ToolTipUnlockRequirements';

const SelectedRuneContainer = 'ChampionProfile-SelectRuneMods-SelectedRuneContainer';
const SelectedRuneIconContainer = 'ChampionProfile-SelectRuneMods-SelectedRuneIconContainer';
const SelectedRuneIcon = 'ChampionProfile-SelectRuneMods-SelectedRuneIcon';
const SelectedRuneLockIcon = 'ChampionProfile-SelectRuneMods-SelectedRuneLockIcon';
const SelectedRuneTextContainer = 'ChampionProfile-SelectRuneMods-SelectedRuneTextContainer';
const SelectedRuneName = 'ChampionProfile-SelectRuneMods-SelectedRuneName';
const SelectedRuneDescription = 'ChampionProfile-SelectRuneMods-SelectedRuneDescription';

const SelectedRunesContainer = 'ChampionProfile-SelectRuneMods-SelectedRunesContainer';

const BackButton = 'ChampionProfile-SelectRuneMods-BackButton';

// This is the aspect ratio we're going to show the bulk of this UI at (it's the size of the image that 'holds' the runes)
// The reason for this is, this image defines very specific locations and sizes for various UI elements
// We're going to show it centered in the available screen space as big as possible.
const goalAspectRatio: number = 3840 / 2160;

const StringIDChampionInfoDisplayRuneModsTitle = 'ChampionInfoDisplayRuneModsTitle';
const StringIDRuneModsFullscreenAvailableRuneKeys = 'RuneModsFullscreenAvailableRuneKeys';
const StringIDRuneModsFullScreenTier = [
  '',
  'RuneModsFullscreenTierOne',
  'RuneModsFullscreenTierTwo',
  'RuneModsFullscreenTierThree',
  'RuneModsFullscreenTierFour',
  'RuneModsFullscreenTierFive'
];
const StringIDRuneModsFullscreenUnlockRuneLevel = [
  '',
  '',
  'RuneModsFullscreenUnlockRuneLevelTwo',
  'RuneModsFullscreenUnlockRuneLevelThree',
  'RuneModsFullscreenUnlockRuneLevelFour',
  'RuneModsFullscreenUnlockRuneLevelFive'
];
const StringIDRuneModsFullScreenUnlockAtLevel = 'RuneModsFullscreenUnlockAtLevel';
const StringIDRuneModsFullScreenUnlockRequirements = 'RuneModsFullscreenUnlockRequirements';
const StringIDRuneModsFullscreenErrorNoRuneKeys = 'RuneModsFullscreenErrorNoRuneKeys';
const StringIDRuneModsFullscreenErrorNoPurchaseDef = 'RuneModsFullscreenErrorNoPurchaseDef';

interface ReactProps {}

interface InjectedProps {
  selectedChampion: ChampionInfo;
  ownedPerks: Dictionary<number>;
  perksByID: Dictionary<PerkDefGQL>;
  runeModTiers: number;
  selectedRuneMods: PerkDefGQL[];
  questsById: Dictionary<QuestDefGQL>;
  questsGQL: QuestGQL[];
  quests: QuestsByType;
  stringTable: Dictionary<StringTableEntryDef>;
  newEquipment: Dictionary<boolean>;
  purchases: PurchaseDefGQL[];
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  isUnlocking: boolean;
  // This is separate from `isUnlocking` because we don't animate unless the unlock succeeds, so the animation is an optional
  // sub-section of the unlock process.
  shouldAnimateUnlock: boolean;
  runeIdToUnlock: string;
  selectedRuneMods: PerkDefGQL[];
  wideView: boolean;
}

class AFullscreenSelectRuneMods extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isUnlocking: false,
      shouldAnimateUnlock: false,
      runeIdToUnlock: '',
      selectedRuneMods: [],
      wideView: this.isWideView()
    };
  }

  render(): JSX.Element {
    const questGQL = findChampionQuestProgress(this.props.selectedChampion, this.props.questsGQL);
    const quest = findChampionQuest(this.props.selectedChampion, this.props.quests.Champion);

    const atMaxLevel: boolean = this.atMaxLevel(quest, questGQL);
    const maxLevel: string = atMaxLevel ? 'MaxLevel' : '';

    // we're manually setting the width/height of the RuneCollectionContainer div to make it as big as possible
    // while retaining the right aspect ratio.
    const width: number = this.state.wideView ? window.innerWidth : this.getHeight() * goalAspectRatio;
    const height: number = this.state.wideView ? window.innerWidth / goalAspectRatio : this.getHeight();

    const tier = getUnlockedRuneModTierForChampion(
      this.props.selectedChampion,
      this.props.perksByID,
      this.props.ownedPerks
    );

    return (
      <div className={FullscreenContainer}>
        <div className={RuneModsBGImage} />
        <div className={Centerer}>
          <div
            className={`${RuneCollectionContainer} Tier${tier}`}
            style={{ width: `${width}px`, height: `${height}px` }}
          >
            <div className={ChampionName}>{this.props.selectedChampion.name}</div>
            <div className={PageTitle}>
              {getStringTableValue(StringIDChampionInfoDisplayRuneModsTitle, this.props.stringTable)}
              <div className={AvailableRuneKeys}>
                {getStringTableValue(StringIDRuneModsFullscreenAvailableRuneKeys, this.props.stringTable)}
                <span style={{ color: 'white' }}>{`\xa0${
                  this.props.ownedPerks[this.props.selectedChampion.runeModUnlockCurrencyID] ?? 0
                }`}</span>
              </div>
            </div>
            <div className={ChampionLevelContainer}>
              <img className={ChampionLevelBackground} src='../images/fullscreen/FSR_Level_Up_Frame_Background.png' />
              <span className={`${ProgressionLevel} ${maxLevel}`}>{`${this.getLevel(questGQL, atMaxLevel)}`}</span>
            </div>
            {this.getProgressBar(atMaxLevel, quest, questGQL)}
            {this.getRuneMods(height)}
            <div className={SelectedRunesContainer}>{this.getSelectedRunes(tier, height)}</div>
            <Button
              type={'blue'}
              text={getStringTableValue(StringIDGeneralBack, this.props.stringTable).toUpperCase()}
              styles={BackButton}
              onClick={this.onBackClick.bind(this)}
              disabled={false}
            />
          </div>
        </div>
      </div>
    );
  }

  public componentDidMount(): void {
    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.checkForPrestitial();
  }

  public componentWillUnmount(): void {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }

  private onWindowResize() {
    this.setState({ wideView: this.isWideView() });
  }

  private checkForPrestitial(): void {
    // If the user hasn't seen the RuneMods tutorial yet, show it!
    if (!clientAPI.getHasSeenRuneModsTutorial()) {
      this.props.dispatch?.(showOverlay(Overlay.RuneModsTutorial));
    }
  }

  private isWideView(): boolean {
    const width: number = window.innerWidth;
    const height: number = this.getHeight();
    const aspect: number = width / height;
    return aspect < goalAspectRatio;
  }

  private getHeight(): number {
    const vmin: number = Math.min(window.innerWidth, window.innerHeight);
    return window.innerHeight - vmin * 0.06;
  }

  private atMaxLevel(questDef: QuestDefGQL, questProgress: QuestGQL): boolean {
    if (!questDef || !questProgress) {
      return false;
    }

    return questDef.links.length <= questProgress.currentQuestIndex;
  }

  private getLevel(questProgress: QuestGQL, maxLevel: boolean): string {
    if (!questProgress) {
      return '1';
    }

    if (maxLevel) {
      return questProgress.currentQuestIndex.toString();
    }

    return (questProgress.currentQuestIndex + 1).toString();
  }

  private getSelectedRunes(unlockedTier: number, height: number): React.ReactNode[] {
    let selectedRunes: React.ReactNode[] = [];

    // Sizes have to be manually calculated to maintain aspect ratio.
    const imageSize = `${height * 0.1052}px`;

    for (let i = 0; i < this.props.runeModTiers; ++i) {
      const rune: PerkDefGQL = this.props.selectedRuneMods[i];
      if (rune) {
        // Rune tier unlocked, rune selected.
        selectedRunes.push(this.renderSelectedRune(rune, i, imageSize));
      } else if (i < unlockedTier) {
        // Rune tier unlocked, no rune selected.
        selectedRunes.push(this.renderNoSelectedRune(i, imageSize));
      } else {
        // Rune tier locked.
        selectedRunes.push(this.renderRuneTierLocked(i, imageSize));
      }
    }

    return selectedRunes;
  }

  private renderSelectedRune(rune: PerkDefGQL, index: number, imageSize: string): JSX.Element {
    return (
      <div className={SelectedRuneContainer} key={`SelectedRune${index}`}>
        <div className={SelectedRuneIconContainer} style={{ width: imageSize, height: imageSize }}>
          <img className={SelectedRuneIcon} src={rune.iconURL} />
        </div>
        <div className={SelectedRuneTextContainer}>
          <span className={SelectedRuneName}>{rune.name}</span>
          <span className={SelectedRuneDescription}>{rune.description}</span>
        </div>
      </div>
    );
  }

  private renderNoSelectedRune(index: number, imageSize: string): React.ReactNode {
    return (
      <div className={SelectedRuneContainer} key={`NoSelectedRune${index}`}>
        <div className={SelectedRuneIconContainer} style={{ width: imageSize, height: imageSize }}>
          <div className={`${SelectedRuneLockIcon} fs-icon-misc-unlock`} />
        </div>
        <div className={SelectedRuneTextContainer}>
          <span className={SelectedRuneName}>
            {getStringTableValue(StringIDRuneModsFullScreenTier[index + 1], this.props.stringTable)}
          </span>
          <span className={SelectedRuneDescription}>
            {getStringTableValue(StringIDRuneModsFullscreenUnlockRuneLevel[index + 1], this.props.stringTable)}
          </span>
        </div>
      </div>
    );
  }

  private renderRuneTierLocked(index: number, imageSize: string): React.ReactNode {
    const tierKeyPerk = Object.values(this.props.perksByID).find((perk) => {
      return (
        perk.perkType === PerkType.RuneModTierKey &&
        perk.runeModTier === index + 1 &&
        perk.champion.id === this.props.selectedChampion.id
      );
    });
    const unlockLevel =
      getChampionPerkUnlockQuestIndex(this.props.selectedChampion, this.props.quests.Champion, tierKeyPerk.id) + 2;
    return (
      <div className={`${SelectedRuneContainer} Locked`} key={`TierLocked${index + 1}`}>
        <div className={`${SelectedRuneIconContainer} Locked`} style={{ width: imageSize, height: imageSize }}>
          <div className={`${SelectedRuneLockIcon} Locked fs-icon-misc-lock`} />
        </div>
        <div className={SelectedRuneTextContainer}>
          <span className={SelectedRuneName}>
            {getStringTableValue(StringIDRuneModsFullScreenTier[index + 1], this.props.stringTable)}
          </span>
          <span className={`${SelectedRuneDescription} Locked`}>
            {getTokenizedStringTableValue(StringIDRuneModsFullScreenUnlockAtLevel, this.props.stringTable, {
              LEVEL: unlockLevel.toString()
            })}
          </span>
        </div>
      </div>
    );
  }

  private getProgressBar(atMaxLevel: boolean, questDef: QuestDefGQL, questProgress: QuestGQL): JSX.Element {
    if (atMaxLevel || !questDef || !questProgress) {
      return null;
    }

    return (
      <TooltipSource
        className={ProgressBarTooltip}
        tooltipParams={{
          id: 'FullscreenSelectRuneModsResourceBar',
          content: getTokenizedStringTableValue(StringIDGeneralXPProgress, this.props.stringTable, {
            CURRENT_XP: String(questProgress.currentQuestProgress),
            MAX_XP: String(questDef.links[questProgress.currentQuestIndex].progress)
          })
        }}
      >
        <ResourceBar
          type={'blue'}
          current={questProgress.currentQuestProgress}
          max={questDef.links[questProgress.currentQuestIndex].progress}
          containerClasses={ProgressBar}
          hideText={true}
        />
      </TooltipSource>
    );
  }

  private getRuneMods(height: number): JSX.Element[] {
    let rows: JSX.Element[] = [];

    for (var i = 0; i < this.props.runeModTiers; ++i) {
      rows.push(this.makeRow(i + 1, height));
    }

    if (rows.length > 0) {
      return rows;
    }
    return null;
  }

  private makeRow(runeTier: number, height: number): JSX.Element {
    let runeButtons: JSX.Element[] = [];
    let sortedRunes = [];

    for (let k in this.props.perksByID) {
      const perk = this.props.perksByID[k];
      if (
        perk.perkType == PerkType.RuneMod &&
        perk.runeModTier == runeTier &&
        perk.champion.id === this.props.selectedChampion.id &&
        (perk.showIfUnowned || this.props.ownedPerks[k])
      ) {
        sortedRunes.push(perk);
      }
    }

    sortedRunes = sortedRunes.sort((a, b) => this.compareRuneMods(a, b));

    const unlockedTier = getUnlockedRuneModTierForChampion(
      this.props.selectedChampion,
      this.props.perksByID,
      this.props.ownedPerks
    );
    const isUnlocked = unlockedTier >= runeTier;
    const rowStyle: string = `Row${runeTier}`;

    runeButtons = sortedRunes.map(this.makeButton.bind(this, height, isUnlocked));

    return (
      <div className={`${RuneModsRow} ${rowStyle}`} key={runeTier}>
        <div className={`${TierHeader} ${isUnlocked ? '' : 'locked'}`}>
          {getStringTableValue(StringIDRuneModsFullScreenTier[runeTier], this.props.stringTable)}
        </div>
        {runeButtons}
      </div>
    );
  }

  private makeButton(height: number, isTierUnlocked: boolean, runeMod: PerkDefGQL): JSX.Element {
    if (this.state.selectedRuneMods.length <= 0) {
      this.setState({ selectedRuneMods: this.props.selectedRuneMods });
    }
    const isSelected =
      this.state.selectedRuneMods.find((selectedRuneMod) => {
        return selectedRuneMod?.id === runeMod.id;
      }) || runeMod.id === this.state.runeIdToUnlock;
    let selected = isSelected ? 'Selected' : '';

    const isLocked: boolean = !this.props.ownedPerks[runeMod.id];
    const locked = isLocked ? 'Locked' : '';
    const tierLocked = isTierUnlocked ? '' : 'TierLocked';
    const gradient = isLocked ? 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),' : '';
    // Sizes have to be manually calculated to maintain aspect ratio.
    const buttonSize = `${height * 0.097}px`;
    const borderWidth = `${height * 0.005}px`;
    return (
      <div
        className={`${RuneModContainer} ${selected} ${locked}`}
        style={{ width: buttonSize, height: buttonSize }}
        onClick={this.onRuneModClick.bind(this, this.props.selectedChampion.id, runeMod, isLocked, !isTierUnlocked)}
      >
        <TooltipSource
          key={runeMod.id}
          className={`${RuneModsButton} ${locked} ${tierLocked} ${selected}`}
          style={{ borderWidth }}
          tooltipParams={{
            id: `${runeMod.id}`,
            content: runeMod ? this.renderRuneModTooltip.bind(this, runeMod, locked) : null,
            position: TooltipPosition.OutsideSource
          }}
          onMouseEnter={this.onMouseEnterRune.bind(this)}
        >
          <div
            className={`${RuneModsButtonIcon} ${selected}`}
            style={{
              backgroundImage: `${gradient} url("${runeMod.iconURL ?? null}")`
            }}
          >
            {locked && <div className={`${LockedIcon}  ${isSelected ? 'fs-icon-misc-unlock' : 'fs-icon-misc-lock'}`} />}
          </div>
          {this.state.shouldAnimateUnlock && this.state.runeIdToUnlock === runeMod.id && (
            <div className={UnlockAnimation} />
          )}
        </TooltipSource>
        <Button
          type={'blue'}
          text={getStringTableValue(StringIDGeneralUnlock, this.props.stringTable).toUpperCase()}
          styles={`${UnlockButton} ${this.state.runeIdToUnlock === runeMod.id ? 'Selected' : ''}`}
          onClick={this.state.runeIdToUnlock === runeMod.id ? this.onUnlockClick.bind(this, runeMod) : null}
          disabled={false}
        />
      </div>
    );
  }

  private async onUnlockClick(runeMod: PerkDefGQL): Promise<void> {
    // If we're already unlocking, don't try again until we finish.
    if (this.state.isUnlocking) {
      return;
    }

    const availableKeys = this.props.ownedPerks[this.props.selectedChampion.runeModUnlockCurrencyID] ?? 0;

    if (availableKeys === 0) {
      // If no rune key available, pop an error dialog.
      game.trigger(
        'show-bottom-toaster',
        <GenericToaster
          title={getStringTableValue(StringIDGeneralError, this.props.stringTable)}
          description={getStringTableValue(StringIDRuneModsFullscreenErrorNoRuneKeys, this.props.stringTable)}
        />
      );
    } else {
      // If rune key available, try to unlock/purchase it.
      const purchaseDef = this.props.purchases.find((p) => {
        return p.perks[0].perkID === runeMod.id;
      });
      if (purchaseDef) {
        this.setState({ isUnlocking: true });
        // Attempt to perform the transaction.
        const res = await ProfileAPI.Purchase(webConf, purchaseDef.id, 1);
        if (res.ok) {
          // Trigger unlock animation.
          this.setState({ shouldAnimateUnlock: true });
          // Refetch owned items.
          refreshProfile(() => {
            this.setState({ isUnlocking: false, shouldAnimateUnlock: false, runeIdToUnlock: '' });
          }, this.props.dispatch);
        } else {
          // Purchased failed.
          this.props.dispatch(showError(res));
          this.setState({ isUnlocking: false });
        }
      } else {
        // Failed to find the matching purchaseDef.
        game.trigger(
          'show-bottom-toaster',
          <GenericToaster
            title={getStringTableValue(StringIDGeneralError, this.props.stringTable)}
            description={getStringTableValue(StringIDRuneModsFullscreenErrorNoPurchaseDef, this.props.stringTable)}
          />
        );
      }
    }
  }

  private renderRuneModTooltip(runeMod: PerkDefGQL, locked: boolean): JSX.Element {
    return (
      <div className={ToolTipContainer}>
        <span className={ToolTipName}>{runeMod.name}</span>
        <span className={TooltipDescription}>{runeMod.description}</span>
        {locked && (
          <span className={TooltipUnlockRequirements}>
            {getStringTableValue(StringIDRuneModsFullScreenUnlockRequirements, this.props.stringTable)}
          </span>
        )}
      </div>
    );
  }

  private onMouseEnterRune(): void {
    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_MOUSEOVER);
  }

  private compareRuneMods(a: PerkDefGQL, b: PerkDefGQL) {
    // If an explicit sortOrder is set, use that.
    const aSortOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
    const bSortOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
    if (aSortOrder !== bSortOrder) {
      return aSortOrder - bSortOrder;
    }

    // Otherwise just sort alphabetically.
    return a.name.localeCompare(b.name);
  }

  private async onRuneModClick(champion: string, runeMod: PerkDefGQL, isRuneLocked: boolean, isTierLocked: boolean) {
    game.playGameSound(SoundEvents.PLAY_UI_RUNEMENU_RUNESELECTION_CLICK);

    // If the tier is locked, you cannot interact with any of its buttons.  You will still see the tooltip, though.
    if (isTierLocked) {
      return;
    }

    if (isRuneLocked) {
      // The rune is locked but unlockable.  Mark it so that the Unlock button can appear.
      this.setState({ runeIdToUnlock: runeMod.id });
    } else {
      // The rune is unlocked, so clicking it will activate it.

      // Make a copy of the current state so that it is mutable.
      let newSelectedRuneMods: PerkDefGQL[] = [];
      for (let i = 0; i < this.state.selectedRuneMods.length; i++) {
        newSelectedRuneMods.push(this.state.selectedRuneMods[i]);
      }
      newSelectedRuneMods[runeMod.runeModTier - 1] = runeMod;
      this.setState({
        selectedRuneMods: newSelectedRuneMods
      });

      const res = await ProfileAPI.SetChampionRuneMod(webConf, champion, runeMod.id, runeMod.runeModTier);
      if (isPerkUnseen(runeMod.id, this.props.newEquipment, this.props.ownedPerks)) {
        markEquipmentSeen(runeMod.id, this.props.newEquipment, this.props.ownedPerks, this.props.dispatch);
      }

      if (res.ok) {
        refreshProfile();
      } else {
        this.props.dispatch(showError(res));
      }
    }
  }

  private onBackClick(): void {
    game.playGameSound(SoundEvents.PLAY_UI_RUNEMENUPAGE_BACK_CLICK);

    // When the player visits the RuneMods page, we need to mark all "unseen" Rune-related items for the champion as seen.
    Object.keys(this.props.newEquipment).forEach((perkID) => {
      const perk = this.props.perksByID[perkID];
      if (perk.champion.id === this.props.selectedChampion.id) {
        if (
          perk.perkType === PerkType.RuneModTierKey ||
          perk.perkType === PerkType.RuneMod ||
          perk.id === this.props.selectedChampion.runeModUnlockCurrencyID
        ) {
          markEquipmentSeen(perk.id, this.props.newEquipment, this.props.ownedPerks, this.props.dispatch);
        }
      }
    });

    this.props.dispatch(hideOverlay(Overlay.RuneMods));
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { selectedChampion } = state.championInfo;
  const { runeModTiers } = state.gameSettings;
  const { ownedPerks, selectedRuneMods } = state.profile;
  const selectedRuneModsFromChamp = selectedChampion ? selectedRuneMods[selectedChampion.id] : null;
  const { questsById } = state.quests;
  const { stringTable } = state.stringTable;
  const { perksByID, newEquipment, purchases } = state.store;

  return {
    ...ownProps,
    selectedChampion,
    ownedPerks,
    perksByID,
    runeModTiers,
    selectedRuneMods: selectedRuneModsFromChamp,
    questsById,
    questsGQL: state.profile.quests,
    quests: state.quests.quests,
    stringTable,
    newEquipment,
    purchases
  };
}

export const FullscreenSelectRuneMods = connect(mapStateToProps)(AFullscreenSelectRuneMods);
