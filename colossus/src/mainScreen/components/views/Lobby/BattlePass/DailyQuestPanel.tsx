/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Button } from '../../../shared/Button';
import { hideRightPanel, showError } from '../../../../redux/navigationSlice';
import { RootState } from '../../../../redux/store';
import { QuestsByType } from '../../../../redux/questSlice';
import {
  PerkGQL,
  PerkType,
  QuestGQL,
  StringTableEntryDef,
  QuestDefGQL,
  PerkDefGQL
} from '@csegames/library/dist/hordetest/graphql/schema';
import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { ProfileAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { webConf } from '../../../../dataSources/networkConfiguration';
import { startProfileRefresh } from '../../../../redux/profileSlice';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import TooltipSource from '../../../../../shared/components/TooltipSource';
import { getAllPendingRewardsForQuest } from './BattlePassUtils';
import { ItemGainedToaster } from '../Store/ItemGainedToaster';
import {
  StringIDGeneralBack,
  getStringTableValue,
  getTokenizedStringTableValue
} from '../../../../helpers/stringTableHelpers';
import { createAlertsForCollectedQuestProgress } from '../../../../helpers/perkUtils';

const Container = 'BattlePass-DailyQuestPanel-Container';
const ContentCenterer = 'BattlePass-DailyQuestPanel-ContentCenterer';
const Row = 'Row';
const TitleIcon = 'BattlePass-DailyQuestPanel-TitleIcon';
const Title = 'BattlePass-DailyQuestPanel-Title';
const DescriptionContainer = 'BattlePass-DailyQuestPanel-DescriptionContainer';
const DescriptionLabel = 'BattlePass-DailyQuestPanel-DescriptionLabel';
const QuestsContainer = 'BattlePass-DailyQuestPanel-QuestsContainer';
const ButtonsContainer = 'BattlePass-DailyQuestPanel-ButtonsContainer';
const ButtonStyleLeft = 'BattlePass-DailyQuestPanel-ButtonLeft';
const ButtonStyleRight = 'BattlePass-DailyQuestPanel-ButtonRight';
const ConsoleIcon = 'BattlePass-DailyQuestPanel-ConsoleIcon';
const Divider = 'BattlePass-DailyQuestPanel-Divider';
const QuestContainer = 'BattlePass-DailyQuestPanel-QuestContainer';
const QuestSelectedOverlay = 'BattlePass-DailyQuestPanel-QuestSelectedOverlay';
const QuestHeader = 'BattlePass-DailyQuestPanel-QuestHeader';
const QuestTitle = 'BattlePass-DailyQuestPanel-QuestTitle';
const QuestReward = 'BattlePass-DailyQuestPanel-QuestReward';
const QuestXPIcon = 'BattlePass-DailyQuestPanel-QuestXPIcon';
const QuestXPText = 'BattlePass-DailyQuestPanel-QuestXPText';
const QuestCompletedText = 'BattlePass-DailyQuestPanel-QuestCompletedText';
const QuestDescription = 'BattlePass-DailyQuestPanel-QuestDescription';
const QuestObjectivesContainer = 'BattlePass-DailyQuestPanel-QuestObjectivesContainer';
const QuestObjectiveContainer = 'BattlePass-DailyQuestPanel-QuestObjectiveContainer';
const QuestObjectiveHeader = 'BattlePass-DailyQuestPanel-QuestObjectiveHeader';
const QuestObjectiveTitle = 'BattlePass-DailyQuestPanel-QuestObjectiveTitle';
const QuestCompletedDescription = 'BattlePass-DailyQuestPanel-QuestCompletedDescription';
const QuestObjectiveProgress = 'BattlePass-DailyQuestPanel-QuestObjectiveProgress';
const QuestObjectiveBarContainer = 'BattlePass-DailyQuestPanel-QuestObjectiveBarContainer';
const QuestObjectiveBar = 'BattlePass-DailyQuestPanel-QuestObjectiveBar';
const QuestObjectiveInfoIcon = 'BattlePass-DailyQuestPanel-QuestObjectiveInfoIcon';
const QuestTooltipWrapper = 'BattlePass-DailyQuestPanel-QuestTooltipWrapper';
const QuestTooltipComplete = 'BattlePass-DailyQuestPanel-QuestTooltipComplete';
const QuestTooltipIncomplete = 'BattlePass-DailyQuestPanel-QuestTooltipIncomplete';

const StringIDDailyQuestsTitle = 'DailyQuestsTitle';
const StringIDDailyQuestsDescription = 'DailyQuestsDescription';
const StringIDDailyQuestsRefreshDescription = 'DailyQuestsRefreshDescription';
const StringIDDailyQuestsRefreshesRemaining = 'DailyQuestsRefreshesRemaining';
const StringIDDailyQuestsCompleted = 'DailyQuestsCompleted';
const StringIDDailyQuestsCompletedDescription = 'DailyQuestsCompletedDescription';
const StringIDDailyQuestsClaim = 'DailyQuestsClaim';
const StringIDDailyQuestsRefresh = 'DailyQuestsRefresh';

interface State {
  isWaiting: boolean;
  waitingForProfileVersion: number;
  selectedQuest: QuestDefGQL;
}

interface ReactProps {}

interface InjectedProps {
  usingGamepad: boolean;
  usingGamepadInMainMenu: boolean;
  quests: QuestsByType;
  questsById: Dictionary<QuestDefGQL>;
  questsProgress: QuestGQL[];
  perks: PerkGQL[];
  dailyQuestResetsAllowed: number;
  dailyQuestResets: number;
  localProfileVersion: number;
  stringTable: Dictionary<StringTableEntryDef>;
  perksByID: Dictionary<PerkDefGQL>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ADailyQuestPanel extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isWaiting: false, selectedQuest: null, waitingForProfileVersion: Number.MAX_VALUE };
  }

  render() {
    const refreshesRemaining = Math.max(0, this.props.dailyQuestResetsAllowed - this.props.dailyQuestResets);
    const refreshTokens = {
      REMAINING: refreshesRemaining.toString(),
      TOTAL: this.props.dailyQuestResetsAllowed.toString()
    };

    return (
      <div className={Container}>
        <div className={ContentCenterer}>
          <div className={Row}>
            <div className={TitleIcon} />
            <div className={Title}>{getStringTableValue(StringIDDailyQuestsTitle, this.props.stringTable)}</div>
          </div>
          <div className={Divider} />
          <div className={DescriptionContainer}>
            <div className={DescriptionLabel}>
              {getStringTableValue(StringIDDailyQuestsDescription, this.props.stringTable)}
            </div>
            <div className={DescriptionLabel}>
              {getStringTableValue(StringIDDailyQuestsRefreshDescription, this.props.stringTable)}
            </div>
            <div className={DescriptionLabel}>
              {getTokenizedStringTableValue(
                StringIDDailyQuestsRefreshesRemaining,
                this.props.stringTable,
                refreshTokens
              )}
            </div>
          </div>

          <div className={QuestsContainer}>{this.getQuestsToDisplay().map(this.renderQuestCell.bind(this))}</div>
          <div className={ButtonsContainer}>
            {this.getActionButton()}
            {this.getBackButton()}
          </div>
        </div>
      </div>
    );
  }

  private renderQuestCell(q: QuestDefGQL): React.ReactNode {
    const progress = this.props.questsProgress.find((qp) => qp.id === q.id);
    const selectClass = q.id === this.state.selectedQuest?.id ? 'Selected' : '';
    return (
      <div
        className={`${QuestContainer} ${selectClass}`}
        key={q.id}
        onClick={() => {
          this.setState({ selectedQuest: q });
        }}
      >
        <div className={QuestHeader}>
          <div className={QuestTitle}>{q.name}</div>
          {this.renderQuestReward(q, progress)}
          {this.renderQuestCompletedText(progress)}
        </div>
        <div className={QuestDescription}>{q.description}</div>
        {this.renderQuestObjectives(q, progress)}
        {this.renderQuestCompletedFooter(q, progress)}

        {q.id === this.state.selectedQuest?.id && <div className={QuestSelectedOverlay} />}
      </div>
    );
  }

  private renderQuestCompletedText(progress: QuestGQL): React.ReactNode {
    if (!this.isQuestCompleted(progress) || !this.isQuestCollected(progress)) {
      return;
    }

    return (
      <div className={QuestCompletedText}>
        {getStringTableValue(StringIDDailyQuestsCompleted, this.props.stringTable)}
      </div>
    );
  }

  private renderQuestReward(quest: QuestDefGQL, progress: QuestGQL): React.ReactNode {
    const isComplete = this.isQuestCompleted(progress);
    if (isComplete && this.isQuestCollected(progress)) {
      return;
    }

    // Once you complete the last link in a quest, the questIndex increments out of bounds.
    // If we're complete, we really want to step back one index and see the last link.
    const linkIndex = (isComplete ? progress?.currentQuestIndex - 1 : progress?.currentQuestIndex) ?? 0;
    const link = quest.links[linkIndex];

    const xp = link?.rewards[0]?.qty ?? 0;
    const perk = this.props.perksByID[link?.rewards[0]?.perkID];
    const rewardName = perk?.name;
    const rewardImage = perk?.iconURL;
    return (
      <div className={QuestReward}>
        <img className={QuestXPIcon} src={rewardImage} />
        <div className={QuestXPText}>{`${addCommasToNumber(xp)} ${rewardName}`}</div>
      </div>
    );
  }

  private renderQuestCompletedFooter(quest: QuestDefGQL, progress: QuestGQL): React.ReactNode {
    if (!this.isQuestCompleted(progress) || !this.isQuestCollected(progress)) {
      return;
    }

    return (
      <div className={QuestObjectivesContainer}>
        <div className={QuestObjectiveContainer}>
          <div className={QuestObjectiveHeader}>
            <div className={QuestCompletedDescription}>
              {getStringTableValue(StringIDDailyQuestsCompletedDescription, this.props.stringTable)}
            </div>
          </div>
          <div className={QuestObjectiveBarContainer}>
            <div className={QuestObjectiveBar} style={{ width: `100%` }} />
          </div>
        </div>
      </div>
    );
  }

  private renderQuestObjectives(quest: QuestDefGQL, progress: QuestGQL): React.ReactNode {
    if (this.isQuestCompleted(progress) && this.isQuestCollected(progress)) {
      return;
    }

    const numSubQuests = quest.subQuestIDs?.length ?? 0;
    const displaySubQuests = numSubQuests > 0 && quest.displaySubQuests;
    const needsTooltip = numSubQuests > 0 && !quest.displaySubQuests;
    const objectiveQuests: QuestDefGQL[] = [];

    if (displaySubQuests) {
      quest.subQuestIDs.forEach((sqId) => {
        objectiveQuests.push(this.props.questsById[sqId]);
      });
    } else {
      objectiveQuests.push(quest);
    }

    return (
      <>
        {needsTooltip && (
          <TooltipSource
            className={QuestObjectiveInfoIcon}
            tooltipParams={{
              id: `quest${quest.id}`,
              content: this.renderQuestTooltip.bind(this, quest)
            }}
          />
        )}
        <div className={QuestObjectivesContainer}>
          {objectiveQuests.map(this.renderQuestObjective.bind(this, displaySubQuests))}
        </div>
      </>
    );
  }

  private renderQuestTooltip(quest: QuestDefGQL): React.ReactNode {
    // We already know that there are at least 3 subquests.  Dig out the relevant data.
    const objectiveData = quest.subQuestIDs.map((sqId) => {
      const q = this.props.questsById[sqId];
      const p = this.props.questsProgress.find((qp) => qp.id === q.id);
      // Once you complete the last link in a quest, the questIndex increments out of bounds.
      const isComplete = p?.currentQuestIndex >= q.links.length;
      // If we're complete, we really want to step back one index and see the last link.
      const linkIndex = (isComplete ? p?.currentQuestIndex - 1 : p?.currentQuestIndex) ?? 0;
      const l = q.links[linkIndex];

      return {
        description: q.description,
        progress: isComplete ? l.progress : p.currentQuestProgress,
        maxProgress: l?.progress,
        isComplete
      };
    });

    return (
      <div className={QuestTooltipWrapper}>
        {objectiveData.map((data, index) => {
          return (
            <div
              className={data.isComplete ? QuestTooltipComplete : QuestTooltipIncomplete}
              key={index}
            >{`${data.description}: ${data.progress} / ${data.maxProgress}`}</div>
          );
        })}
      </div>
    );
  }

  private renderQuestObjective(needsSubquestText: boolean, q: QuestDefGQL): React.ReactNode {
    const progress = this.props.questsProgress.find((qp) => qp.id === q.id);

    // Once you complete the last link in a quest, the questIndex increments out of bounds.
    const isComplete = progress?.currentQuestIndex >= q.links.length;
    // If we're complete, we really want to step back one index and see the last link.
    const linkIndex = (isComplete ? progress?.currentQuestIndex - 1 : progress?.currentQuestIndex) ?? 0;
    const link = q.links[linkIndex];

    const max = link?.progress ?? 1;
    const value = isComplete ? max : progress.currentQuestProgress;

    return (
      <div className={QuestObjectiveContainer}>
        <div className={QuestObjectiveHeader}>
          <div className={QuestObjectiveTitle}>{needsSubquestText ? q.description : ''}</div>
          <div className={QuestObjectiveProgress}>{`${addCommasToNumber(value)} / ${addCommasToNumber(max)}`}</div>
        </div>
        <div className={QuestObjectiveBarContainer}>
          <div className={QuestObjectiveBar} style={{ width: `${(value / max) * 100}%` }} />
        </div>
      </div>
    );
  }

  private getQuestsToDisplay(): QuestDefGQL[] {
    // Your active quests all have progress data, even if that value is zero.
    const quests: QuestDefGQL[] = [];
    this.props.questsProgress.forEach((qp) => {
      // Is this a DailyNormal quest?
      const normalQuest = this.props.quests.DailyNormal.find((q) => q.id === qp.id);
      if (normalQuest) {
        quests.push(normalQuest);
        return;
      }

      // Is this a DailyHard quest?
      const hardQuest = this.props.quests.DailyHard.find((q) => q.id === qp.id);
      if (hardQuest) {
        quests.push(hardQuest);
        return;
      }
    });
    // Cap at 6 for display.
    return quests.slice(0, 6);
  }

  private getActionButton(): JSX.Element {
    const progress = this.props.questsProgress.find((qp) => qp.id === this.state.selectedQuest?.id);
    if (!progress) {
      return;
    }

    const isCompleted = this.isQuestCompleted(progress);
    const isCollected = this.isQuestCollected(progress);
    if (isCompleted && isCollected) {
      return;
    }

    let buttonText: string | JSX.Element = isCompleted
      ? getStringTableValue(StringIDDailyQuestsClaim, this.props.stringTable)
      : getStringTableValue(StringIDDailyQuestsRefresh, this.props.stringTable);

    if (this.props.usingGamepad && this.props.usingGamepadInMainMenu) {
      buttonText = (
        <>
          <span className={`${ConsoleIcon} icon-xb-a`} />
          {buttonText}
        </>
      );
    }

    return (
      <Button
        text={buttonText}
        type={'blue'}
        onClick={isCompleted ? this.onClaimClicked.bind(this) : this.onRefreshClicked.bind(this)}
        styles={ButtonStyleLeft}
        disabled={
          this.state.isWaiting ||
          !this.state.selectedQuest ||
          (!isCompleted && this.props.dailyQuestResets >= this.props.dailyQuestResetsAllowed)
        }
      />
    );
  }

  private isQuestCompleted(quest: QuestGQL): boolean {
    return quest && quest.currentQuestIndex > 0;
  }

  private isQuestCollected(quest: QuestGQL): boolean {
    return quest && quest.nextCollection >= quest.currentQuestIndex;
  }

  private getBackButton(): JSX.Element {
    let buttonText: string | JSX.Element = getStringTableValue(StringIDGeneralBack, this.props.stringTable);
    if (this.props.usingGamepad && this.props.usingGamepadInMainMenu) {
      buttonText = (
        <>
          <span className={`${ConsoleIcon} icon-xb-b`} />
          {` ${buttonText}`}
        </>
      );
    }
    return (
      <Button text={buttonText} type='blue-outline' onClick={this.onBackClick.bind(this)} styles={ButtonStyleRight} />
    );
  }

  private async onClaimClicked() {
    this.setState({ isWaiting: true, waitingForProfileVersion: this.props.localProfileVersion + 1 });

    const res = await ProfileAPI.CollectQuestReward(webConf, this.state.selectedQuest.id);
    if (res.ok) {
      const quest: QuestDefGQL = this.props.questsById[this.state.selectedQuest.id];

      createAlertsForCollectedQuestProgress(
        quest,
        this.props.questsProgress.find((q) => q.id == quest.id),
        this.props.perksByID,
        this.props.dispatch
      );

      const rewardsClaimed = getAllPendingRewardsForQuest(
        quest,
        this.props.quests?.BattlePass,
        this.props.questsProgress,
        this.props.perks
      );
      rewardsClaimed.forEach((reward) => {
        const perk = this.props.perksByID[reward.perkID];
        if (perk.perkType != PerkType.CurrentBattlePassXP) {
          game.trigger('show-bottom-toaster', <ItemGainedToaster perk={perk} perkCount={reward.qty} />);
        }
      });
      // Get the new data.
      this.props.dispatch(startProfileRefresh());
      // The "isWaiting" flag will be cleared in componentDidUpdate() once the updated quest data has been fetched.
    } else {
      this.props.dispatch(showError(res));
      this.setState({ isWaiting: false, waitingForProfileVersion: Number.MAX_VALUE });
    }
  }

  private async onRefreshClicked() {
    this.setState({ isWaiting: true, waitingForProfileVersion: this.props.localProfileVersion + 1 });
    const res = await ProfileAPI.ResetDailyQuest(webConf, this.state.selectedQuest?.id);

    if (res.ok) {
      // Refresh the Profile.
      this.props.dispatch?.(startProfileRefresh());
      // The "isWaiting" flag will be cleared in componentDidUpdate() once the updated quest data has been fetched.
    } else {
      this.setState({ isWaiting: false, waitingForProfileVersion: Number.MAX_VALUE });
    }

    // Deselect the old quest.
    this.setState({ selectedQuest: null });
  }

  private onBackClick() {
    this.props.dispatch(hideRightPanel());
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_NO);
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    // If the user refreshed a quest, we are waiting for the profile refresh to see what new quest we got.
    // When the version updates, we know we have the latest data, so we can stop waiting.
    if (this.props.localProfileVersion >= this.state.waitingForProfileVersion) {
      this.setState({ isWaiting: false, waitingForProfileVersion: Number.MAX_VALUE });
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { usingGamepad, usingGamepadInMainMenu } = state.baseGame;
  const { quests, questsById } = state.quests;
  const questsProgress = state.profile.quests;
  const { dailyQuestResetsAllowed } = state.gameSettings;
  const { perks, dailyQuestResets, localProfileVersion } = state.profile;
  const { stringTable } = state.stringTable;
  const { perksByID } = state.store;

  return {
    ...ownProps,
    usingGamepad,
    usingGamepadInMainMenu,
    quests,
    questsProgress,
    perks,
    dailyQuestResetsAllowed,
    dailyQuestResets,
    localProfileVersion,
    questsById,
    stringTable,
    perksByID
  };
}

export const DailyQuestPanel = connect(mapStateToProps)(ADailyQuestPanel);
