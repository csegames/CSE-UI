/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { Dispatch } from 'redux';
import { QuestGQL, PerkDefGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { QuestsByType } from '../../../../redux/questSlice';
import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { LobbyView, navigateTo } from '../../../../redux/navigationSlice';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import TooltipSource from '../../../../../shared/components/TooltipSource';
import {
  findChampionQuest,
  findChampionQuestProgress,
  getUnlockedRuneModTierForChampion
} from '../../../../helpers/characterHelpers';
import { ChampionInfo } from '@csegames/library/dist/hordetest/graphql/schema';
import { getStringTableValue, getTokenizedStringTableValue } from '../../../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { ChampionXPData, updateLastDisplayedChampionXP } from '../../../../redux/championInfoSlice';
import { ExperienceBar } from '../../../shared/ExperienceBar';

const Root = 'LobbyChampionStatus-Root';
const Loading = 'LobbyChampionStatus-Loading';
const LoadingIcon = 'LobbyChampionStatus-LoadingIcon';
const Row = 'Row';
const ProgressionLevel = 'LobbyChampionStatus-ProgressionLevel';
const ProgressionProgressContainer = 'LobbyChampionStatus-ProgressionProgressContainer';
const ProgressionLevelContainer = 'LobbyChampionStatus-ProgressionLevelContainer';
const ProgressionXPLabel = 'LobbyChampionStatus-ProgressionXPLabel';
const RuneSection = 'LobbyChampionStatus-RuneSection';
const RunesContainer = 'LobbyChampionStatus-RunesContainer';
const RuneArt = 'LobbyChampionStatus-RuneArt';
const RuneModButton = 'LobbyChampionStatus-RuneModButton';
const RuneModIcon = 'LobbyChampionStatus-RuneModIcon';
const RuneModLockIcon = 'LobbyChampionStatus-RuneModLockIcon';
const RuneTooltipContainer = 'LobbyChampionStatus-RuneTooltipContainer';
const RuneTooltipTitle = 'LobbyChampionStatus-RuneTooltipTitle';
const RuneTooltipDescription = 'LobbyChampionStatus-RuneTooltipDescription';
const XPBar = 'LobbyChampionStatus-XPBar';

const StringIDChampionMaxLevel = 'ChampionProgressionMaxLevel';
const StringIDXPToNextLevel = 'ChampionProgressionXPToNextLevel';
const StringIDXPToMaxLevel = 'ChampionProgressionXPToMaxLevel';

interface State {
  displayedLevel: number;
  displayedMaxLevel: number;
  displayedXP: number;
  displayedMaxXP: number;
}

interface ReactProps {}

interface InjectedProps {
  questsGQL: QuestGQL[];
  quests: QuestsByType;
  runeMods: PerkDefGQL[];
  champion: ChampionInfo;
  championIDToLastDisplayedXP: Dictionary<ChampionXPData>;
  stringTable: Dictionary<StringTableEntryDef>;
  ownedPerks: Dictionary<number>;
  perksByID: Dictionary<PerkDefGQL>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ALobbyChampionStatus extends React.Component<Props, State> {
  private animTimeout: number = null;
  private isAnimating: boolean = false;

  constructor(props: Props) {
    super(props);

    this.state = this.getNewState(true);
  }

  public render(): React.ReactNode {
    if (!this.props.champion) {
      return this.renderLoadingPlaceholder();
    }
    const questGQL = findChampionQuestProgress(this.props.champion, this.props.questsGQL);
    const quest = findChampionQuest(this.props.champion, this.props.quests.Champion);

    if (!quest || !questGQL) {
      return this.renderLoadingPlaceholder();
    }

    const notMaxLevel = this.state.displayedLevel < this.state.displayedMaxLevel;
    const maxLevel = notMaxLevel ? '' : 'MaxLevel';

    const unlockedTier = getUnlockedRuneModTierForChampion(
      this.props.champion,
      this.props.perksByID,
      this.props.ownedPerks
    );

    return (
      <div className={Root}>
        <div className={Row}>
          <span className={`${ProgressionLevel} ${maxLevel}`}>{`${this.state.displayedLevel}`}</span>
          <div className={ProgressionProgressContainer}>
            <div className={ProgressionLevelContainer}>
              <div className={ProgressionXPLabel}>{this.getProgressText()}</div>
            </div>
            <ExperienceBar
              className={XPBar}
              current={this.state.displayedXP}
              level={this.state.displayedLevel}
              xpForLevels={quest.links.map((link) => {
                return link.progress;
              })}
              hideText={true}
              onAnimationComplete={this.onXPAnimationComplete.bind(this)}
            />
          </div>
        </div>
        <div className={RuneSection}>
          <div className={RuneArt} />
          <div className={RunesContainer}>
            {this.props.runeMods?.map((rm, index) => {
              // Is this tier unlocked yet?
              const lockIcon = unlockedTier <= index ? 'fs-icon-misc-lock' : 'fs-icon-misc-unlock';
              const lockedStyle = unlockedTier <= index ? 'locked' : '';
              return (
                <TooltipSource
                  key={index}
                  tooltipParams={{ id: `${index}`, content: rm ? this.renderRuneModTooltip.bind(this, rm) : null }}
                >
                  <div className={`${RuneModButton} ${lockedStyle}`} onClick={this.onChampionInfoClick.bind(this)}>
                    {rm ? (
                      <img className={RuneModIcon} src={rm?.iconURL} />
                    ) : (
                      <div className={`${RuneModLockIcon} ${lockedStyle} ${lockIcon}`} />
                    )}
                  </div>
                </TooltipSource>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  private getNewState(isInit?: boolean): State {
    const dummyData: State = {
      displayedLevel: 1,
      displayedMaxLevel: 30,
      displayedXP: 0,
      displayedMaxXP: 100
    };
    if (this.props.champion) {
      // Prepare xp data.
      const questGQL = findChampionQuestProgress(this.props.champion, this.props.questsGQL);
      const quest = findChampionQuest(this.props.champion, this.props.quests.Champion);

      if (!quest || !questGQL) {
        return dummyData;
      }

      const notMaxLevel = quest.links.length > questGQL.currentQuestIndex;
      const questLink = quest.links[questGQL.currentQuestIndex];

      const level = Math.min(quest.links.length, questGQL.currentQuestIndex + 1);
      const xp = notMaxLevel ? questGQL.currentQuestProgress : 100;
      const maxXP = notMaxLevel ? questLink.progress : 100;

      if (isInit && this.props.championIDToLastDisplayedXP[this.props.champion.id]) {
        // If we are initializing this with data from an earlier lobby visit, use that previous data
        // as the starting state so we can animate away from it.
        const prev = this.props.championIDToLastDisplayedXP[this.props.champion.id];
        return {
          displayedLevel: prev.level,
          displayedMaxLevel: quest.links.length,
          displayedXP: prev.xp,
          displayedMaxXP: maxXP
        };
      } else {
        // Non-init, just use current state.
        return {
          displayedLevel: level,
          displayedMaxLevel: quest.links.length,
          displayedXP: xp,
          displayedMaxXP: maxXP
        };
      }
    } else {
      return dummyData;
    }
  }

  private renderLoadingPlaceholder(): React.ReactNode {
    return (
      <div className={Loading}>
        <div className={LoadingIcon} />
      </div>
    );
  }

  private renderRuneModTooltip(runeMod: PerkDefGQL): React.ReactNode {
    return (
      <div className={RuneTooltipContainer}>
        <div className={RuneTooltipTitle}>{runeMod.name}</div>
        <div className={RuneTooltipDescription}>{runeMod.description}</div>
      </div>
    );
  }

  private onChampionInfoClick(): void {
    // Go to Champions tab.
    this.props.dispatch(navigateTo(LobbyView.Champions));
    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_TAB_CHAMPION_OPEN);
  }

  private getProgressText(): string {
    if (this.state.displayedLevel < this.state.displayedMaxLevel) {
      const tokens: Dictionary<string> = {
        CURRENT_XP: `${addCommasToNumber(this.state.displayedXP)}`,
        MAX_XP: `${addCommasToNumber(this.state.displayedMaxXP)}`,
        NEXT_CHAMPION_LEVEL: `${this.state.displayedLevel + 1}`
      };
      if (this.state.displayedLevel + 1 < this.state.displayedMaxLevel) {
        // Next level is not max.
        return getTokenizedStringTableValue(StringIDXPToNextLevel, this.props.stringTable, tokens);
      } else {
        // Next level is max.
        return getTokenizedStringTableValue(StringIDXPToMaxLevel, this.props.stringTable, tokens);
      }
    } else {
      // Current level is max.
      return getStringTableValue(StringIDChampionMaxLevel, this.props.stringTable);
    }
  }

  componentDidMount(): void {
    this.checkLastDisplayedXP();
  }

  componentWillUnmount(): void {
    if (this.animTimeout) {
      clearTimeout(this.animTimeout);
      this.animTimeout = null;
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    this.checkLastDisplayedXP();
  }

  private checkLastDisplayedXP(): void {
    // If we're already animating an update, wait until it finishes.
    if (this.isAnimating) {
      return;
    }

    // Make sure we actually have a champion before we try to check their XP.
    if (this.props.champion) {
      // Prepare xp data.
      const questGQL = findChampionQuestProgress(this.props.champion, this.props.questsGQL);
      const quest = findChampionQuest(this.props.champion, this.props.quests.Champion);

      if (!quest || !questGQL) {
        return;
      }

      const newState = this.getNewState();

      // This detects the first launch-to-lobby, plus capturing changes to default champion.
      const prevXPData = this.props.championIDToLastDisplayedXP[this.props.champion.id];
      if (!prevXPData) {
        // On first display for a champion, store away XP data so we can detect changes on subsequent lobby visits.
        this.setState(newState);
        this.props.dispatch?.(
          updateLastDisplayedChampionXP({
            championID: this.props.champion.id,
            level: newState.displayedLevel,
            xp: newState.displayedXP
          })
        );
      } else {
        // This is a subsequent visit to the lobby, either by switching tabs or by playing and leaving a match.
        // Check if the displayed champion's XP data has changed.  If so, queue up an XP animation.
        if (prevXPData.level !== newState.displayedLevel || prevXPData.xp !== newState.displayedXP) {
          if (this.animTimeout) {
            clearTimeout(this.animTimeout);
          }
          this.isAnimating = true;
          this.animTimeout = window.setTimeout(() => {
            this.setState(newState);
            this.animTimeout = null;
          }, 1000);
        }
      }
    }
  }

  private onXPAnimationComplete(): void {
    this.isAnimating = false;
    // Should be guaranteed, but check just in case.
    if (this.props.champion) {
      this.props.dispatch?.(
        updateLastDisplayedChampionXP({
          championID: this.props.champion.id,
          xp: this.state.displayedXP,
          level: this.state.displayedLevel
        })
      );
    }
    // See if the XP data changed while we were animating, but on the next frame so the dispatch
    // just above this will have already been processed.
    requestAnimationFrame(() => {
      this.checkLastDisplayedXP();
    });
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps) {
  const { quests: questsGQL, ownedPerks } = state.profile;
  const { quests } = state.quests;
  const runeMods = state.profile.selectedRuneMods[state.profile.defaultChampionID];
  const champion = state.championInfo.championIDToChampion[state.profile.defaultChampionID];
  const { championIDToLastDisplayedXP } = state.championInfo;
  const { stringTable } = state.stringTable;
  const { perksByID } = state.store;

  return {
    ...ownProps,
    questsGQL,
    quests,
    runeMods,
    champion,
    stringTable,
    championIDToLastDisplayedXP,
    ownedPerks,
    perksByID
  };
}

export const LobbyChampionStatus = connect(mapStateToProps)(ALobbyChampionStatus);
