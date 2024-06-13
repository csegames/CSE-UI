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
  PerkType
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Overlay, hideOverlay, showError } from '../../redux/navigationSlice';
import { RootState } from '../../redux/store';
import { Button } from '../shared/Button';
import {
  findChampionQuest,
  findChampionQuestProgress,
  getChampionPerkUnlockQuestIndex,
  isPerkUnseen,
  markEquipmentSeen
} from '../../helpers/characterHelpers';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { game } from '@csegames/library/dist/_baseGame';
import { ProfileAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { startProfileRefresh } from '../../redux/profileSlice';
import { QuestsByType } from '../../redux/questSlice';
import {
  StringIDGeneralBack,
  StringIDGeneralXPProgress,
  getStringTableValue,
  getTokenizedStringTableValue
} from '../../helpers/stringTableHelpers';
import TooltipSource from '../../../shared/components/TooltipSource';
import { ResourceBar } from '../shared/ResourceBar';
import { StarBadge } from '../../../shared/components/StarBadge';
import { webConf } from '../../dataSources/networkConfiguration';

const RuneModsBGImage = 'StartScreen-RuneModsBGImage';
const FullscreenContainer = 'ChampionProfile-SelectRuneMods-Container';
const Centerer = 'ChampionProfile-SelectRuneMods-Centerer';
const RuneCollectionContainer = 'ChampionProfile-SelectRuneMods-RuneCollectionContainer';

const ChampionName = 'ChampionProfile-SelectRuneMods-ChampionName';
const PageTitle = 'ChampionProfile-SelectRuneMods-PageTitle';
const ChampionLevelContainer = 'ChampionProfile-SelectRuneMods-ChampionLevelContainer';
const ChampionLevelBackground = 'ChampionProfile-SelectRuneMods-ChampionLevelBackground';
const ProgressionLevel = 'ChampionProfile-SelectRuneMods-ProgressionLevel';
const ProgressBarTooltip = 'ChampionProfile-SelectRuneMods-ProgressBarTooltip';
const ProgressBar = 'ChampionProfile-SelectRuneMods-ProgressBar';

const RuneModsRow = 'ChampionProfile-SelectRuneMods-Row';
const RuneModsRowButtons = 'ChampionProfile-SelectRuneMods-RowButtons';

const RuneModsButton = 'ChampionProfile-SelectRuneMods-Button';
const RuneModsButtonIcon = 'ChampionProfile-SelectRuneMods-ButtonIcon';
const LockedIcon = 'ChampionProfile-SelectRuneMods-LockedIcon';
const RuneModsButtonLockLevel = 'ChampionProfile-SelectRuneMods-RuneModsButtonLockLevel';
const Badge = 'ChampionProfile-SelectRuneMods-Badge';

const RuneModTooltipSource = 'ChampionProfile-SelectRuneMods-TooltipSource';
const ToolTipContainer = 'ChampionProfile-SelectRuneMods-ToolTipContainer';
const ToolTipName = 'ChampionProfile-SelectRuneMods-ToolTipName';
const TooltipDescription = 'ChampionProfile-SelectRuneMods-ToolTipDescription';

const SelectedRuneContainer = 'ChampionProfile-SelectRuneMods-SelectedRuneContainer';
const SelectedRuneIconContainer = 'ChampionProfile-SelectRuneMods-SelectedRuneIconContainer';
const SelectedRuneIcon = 'ChampionProfile-SelectRuneMods-SelectedRuneIcon';
const SelectedRuneRuneCountContainer = 'ChampionProfile-SelectRuneMods-SelectedRuneRuneCountContainer';
const SelectedRuneRuneCountDescriptionContainer =
  'ChampionProfile-SelectRuneMods-SelectedRuneRuneCountDescriptionContainer';
const SelectedRuneRuneCount = 'ChampionProfile-SelectRuneMods-SelectedRuneRuneCount';
const SelectedRuneRuneCountIcon = 'ChampionProfile-SelectRuneMods-SelectedRuneRuneCountIcon';
const SelectedRuneTextContainer = 'ChampionProfile-SelectRuneMods-SelectedRuneTextContainer';
const SelectedRuneName = 'ChampionProfile-SelectRuneMods-SelectedRuneName';
const SelectedRuneDescription = 'ChampionProfile-SelectRuneMods-SelectedRuneDescription';

const SelectedRunesContainer = 'ChampionProfile-SelectRuneMods-SelectedRunesContainer';

const BackButton = 'ChampionProfile-SelectRuneMods-BackButton';

// This is the aspect ratio we're going to show the bulk of this UI at (it's the size of the image that 'holds' the runes)
// The reason for this is, this image defines very specific locations and sizes for various UI elements
// We're going to show it centered in the available screen space as big as possible.
const goalAspectRatio: number = 3840 / 2160;

const StringIDChampionProfileRuneCountDescription = 'ChampionProfileRuneCountDescription';
const StringIDChampionInfoDisplayRuneModsTitle = 'ChampionInfoDisplayRuneModsTitle';
const StringIDChampionProfileRuneUnlock = 'ChampionProfileRuneUnlock';

interface ReactProps {}

interface InjectedProps {
  selectedChampion: ChampionInfo;
  ownedPerks: Dictionary<number>;
  perksByID: Dictionary<PerkDefGQL>;
  runeModLevels: number[];
  selectedRuneMods: PerkDefGQL[];
  questsById: Dictionary<QuestDefGQL>;
  questsGQL: QuestGQL[];
  quests: QuestsByType;
  stringTable: Dictionary<StringTableEntryDef>;
  newEquipment: Dictionary<boolean>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  selectedRuneMods: PerkDefGQL[];
  wideView: boolean;
}

class AFullscreenSelectRuneMods extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
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

    return (
      <div className={FullscreenContainer}>
        <div className={RuneModsBGImage} />
        <div className={Centerer}>
          <div className={RuneCollectionContainer} style={{ width: `${width}px`, height: `${height}px` }}>
            <div className={ChampionName}>{this.props.selectedChampion.name}</div>
            <div className={PageTitle}>
              {getStringTableValue(StringIDChampionInfoDisplayRuneModsTitle, this.props.stringTable)}
            </div>
            <div className={ChampionLevelContainer}>
              <img className={ChampionLevelBackground} src='../images/fullscreen/FSR_Level_Up_Frame_Background.png' />
              <span className={`${ProgressionLevel} ${maxLevel}`}>{`${this.getLevel(questGQL, atMaxLevel)}`}</span>
            </div>
            {this.getProgressBar(atMaxLevel, quest, questGQL)}
            {this.getRuneMods()}
            <div className={SelectedRunesContainer}>
              {this.getSelectedRunes()}
              <div className={SelectedRuneRuneCountDescriptionContainer}>
                <div className={`${SelectedRuneRuneCountIcon} fs-icon-misc-rune-mods`} />
                <span className={SelectedRuneRuneCount}>
                  {getStringTableValue(StringIDChampionProfileRuneCountDescription, this.props.stringTable)}
                </span>
              </div>
            </div>
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
  }

  public componentWillUnmount(): void {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }

  private onWindowResize() {
    this.setState({ wideView: this.isWideView() });
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

  private getSelectedRunes(): JSX.Element[] {
    let selectedRunes: JSX.Element[] = [];

    for (const runeID in this.props.selectedRuneMods) {
      const rune: PerkDefGQL = this.props.selectedRuneMods[runeID];
      if (rune) {
        selectedRunes.push(this.makeSelectedRune(rune));
      }
    }

    return selectedRunes;
  }

  private makeSelectedRune(rune: PerkDefGQL): JSX.Element {
    const runeCount = this.props.runeModLevels[rune.runeModLevel - 1];

    return (
      <div className={SelectedRuneContainer}>
        <div className={SelectedRuneIconContainer}>
          <img className={SelectedRuneIcon} src={rune.iconURL} />
          <div className={SelectedRuneRuneCountContainer}>
            <div className={`${SelectedRuneRuneCountIcon} fs-icon-misc-rune-mods`} />
            <div className={SelectedRuneRuneCount}>{runeCount}</div>
          </div>
        </div>
        <div className={SelectedRuneTextContainer}>
          <span className={SelectedRuneName}>{rune.name}</span>
          <span className={SelectedRuneDescription}>{rune.description}</span>
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

  private getRuneMods(): JSX.Element[] {
    let rows: JSX.Element[] = [];
    let count = 1;

    this.props.runeModLevels.map((runeModLevel) => {
      rows.push(this.makeRow(count, runeModLevel));
      count++;
    });
    if (rows.length > 0) {
      return rows;
    }
    return null;
  }

  private makeRow(runeLevel: number, runeCount: number): JSX.Element {
    let runeButtons: JSX.Element[] = [];
    let sortedRunes = [];

    for (let k in this.props.perksByID) {
      const perk = this.props.perksByID[k];
      if (
        perk.perkType == PerkType.RuneMod &&
        perk.runeModLevel == runeLevel &&
        perk.champion.id === this.props.selectedChampion.id &&
        (perk.showIfUnowned || this.props.ownedPerks[k])
      ) {
        sortedRunes.push(perk);
      }
    }

    sortedRunes = sortedRunes.sort((a, b) => this.compareRuneMods(a, b));

    runeButtons = sortedRunes.map(this.makeButton.bind(this));

    const rowStyle: string = `Row${runeLevel}`;
    return (
      <div className={`${RuneModsRow} ${rowStyle}`} key={runeLevel}>
        <div className={RuneModsRowButtons}>{runeButtons}</div>
      </div>
    );
  }

  private makeButton(runeMod: PerkDefGQL): JSX.Element {
    if (this.state.selectedRuneMods.length <= 0) {
      this.setState({ selectedRuneMods: this.props.selectedRuneMods });
    }
    let selected = '';
    if (
      this.state.selectedRuneMods.find((selectedRuneMod) => {
        return selectedRuneMod.id === runeMod.id;
      })
    ) {
      selected = 'Selected';
    }

    const isBadged = isPerkUnseen(runeMod.id, this.props.newEquipment, this.props.ownedPerks);
    const isLocked: boolean = !this.props.ownedPerks[runeMod.id];
    const locked = isLocked ? 'Locked' : '';
    const gradient = isLocked ? 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),' : '';
    const unlockLevel = this.getRuneModUnlockLevel(runeMod.id);
    return (
      <TooltipSource
        className={RuneModTooltipSource}
        key={runeMod.id}
        tooltipParams={{
          id: `${runeMod.id}`,
          content: runeMod ? this.renderRuneModTooltip.bind(this, runeMod, unlockLevel, locked) : null
        }}
        onMouseEnter={this.onMouseEnterRune.bind(this)}
      >
        <div
          className={`${RuneModsButton} ${locked}`}
          key={runeMod.id}
          onClick={locked ? null : this.onRuneModClick.bind(this, this.props.selectedChampion.id, runeMod)}
        >
          <div
            className={`${RuneModsButtonIcon} ${selected}`}
            style={{
              backgroundImage: `${gradient} url("${runeMod.iconURL ?? null}")`
            }}
          >
            {locked ? (
              <>
                <div className={`${LockedIcon}  fs-icon-misc-lock`} />{' '}
                <div className={RuneModsButtonLockLevel}>{unlockLevel}</div>
              </>
            ) : null}
            {isBadged && <StarBadge className={Badge} />}
          </div>
        </div>
      </TooltipSource>
    );
  }

  private renderRuneModTooltip(runeMod: PerkDefGQL, unlockLevel: number, locked: boolean): JSX.Element {
    return (
      <div className={ToolTipContainer}>
        <span className={ToolTipName}>{runeMod.name}</span>
        <span className={TooltipDescription}>{runeMod.description}</span>
        {locked && (
          <span className={TooltipDescription}>
            {getTokenizedStringTableValue(StringIDChampionProfileRuneUnlock, this.props.stringTable, {
              LEVEL: unlockLevel.toString()
            })}
          </span>
        )}
      </div>
    );
  }

  private onMouseEnterRune(): void {
    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_MOUSEOVER);
  }

  private compareRuneMods(a: PerkDefGQL, b: PerkDefGQL) {
    const aLevel = this.getRuneModUnlockLevel(a.id);
    const bLevel = this.getRuneModUnlockLevel(b.id);
    if (aLevel != bLevel) {
      return aLevel - bLevel;
    }
    return a.name.localeCompare(b.name);
  }

  private getRuneModUnlockLevel(runeModID: string): number {
    return getChampionPerkUnlockQuestIndex(this.props.selectedChampion, this.props.quests.Champion, runeModID) + 2;
  }

  private async onRuneModClick(champion: string, runeMod: PerkDefGQL) {
    game.playGameSound(SoundEvents.PLAY_UI_RUNEMENU_RUNESELECTION_CLICK);

    // Make a copy of the current state so that it is mutable.
    let newSelectedRuneMods: PerkDefGQL[] = [];
    for (let i = 0; i < this.state.selectedRuneMods.length; i++) {
      newSelectedRuneMods.push(this.state.selectedRuneMods[i]);
    }
    newSelectedRuneMods[runeMod.runeModLevel - 1] = runeMod;
    this.setState({
      selectedRuneMods: newSelectedRuneMods
    });

    const res = await ProfileAPI.SetChampionRuneMod(webConf, champion, runeMod.id, runeMod.runeModLevel);
    if (isPerkUnseen(runeMod.id, this.props.newEquipment, this.props.ownedPerks)) {
      markEquipmentSeen(runeMod.id, this.props.newEquipment, this.props.ownedPerks, this.props.dispatch);
    }

    if (res.ok) {
      this.props.dispatch(startProfileRefresh());
    } else {
      this.props.dispatch(showError(res));
    }
  }

  private onBackClick(): void {
    game.playGameSound(SoundEvents.PLAY_UI_RUNEMENUPAGE_BACK_CLICK);

    for (let k in this.props.perksByID) {
      const perk = this.props.perksByID[k];
      if (
        perk.perkType == PerkType.RuneMod &&
        perk.champion.id === this.props.selectedChampion.id &&
        isPerkUnseen(perk.id, this.props.newEquipment, this.props.ownedPerks)
      ) {
        markEquipmentSeen(perk.id, this.props.newEquipment, this.props.ownedPerks, this.props.dispatch);
      }
    }

    this.props.dispatch(hideOverlay(Overlay.RuneMods));
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { selectedChampion } = state.championInfo;
  const { runeModLevels } = state.runes;
  const { ownedPerks, selectedRuneMods } = state.profile;
  const selectedRuneModsFromChamp = selectedChampion ? selectedRuneMods[selectedChampion.id] : null;
  const { questsById } = state.quests;
  const { stringTable } = state.stringTable;
  const { perksByID, newEquipment } = state.store;

  return {
    ...ownProps,
    selectedChampion,
    ownedPerks,
    perksByID,
    runeModLevels,
    selectedRuneMods: selectedRuneModsFromChamp,
    questsById,
    questsGQL: state.profile.quests,
    quests: state.quests.quests,
    stringTable,
    newEquipment
  };
}

export const FullscreenSelectRuneMods = connect(mapStateToProps)(AFullscreenSelectRuneMods);
