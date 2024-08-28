/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { Dispatch } from 'redux';
import {
  ChampionCostumeInfo,
  ChampionGQL,
  PerkDefGQL,
  QuestGQL,
  QuestLinkDefGQL,
  StringTableEntryDef,
  QuestDefGQL
} from '@csegames/library/dist/hordetest/graphql/schema';
import { ResourceBar } from '../../../shared/ResourceBar';
import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { FittingView } from '../../../../../shared/components/FittingView';
import { LobbyView, navigateTo } from '../../../../redux/navigationSlice';
import { getStringTableValue, getTokenizedStringTableValue } from '../../../../helpers/stringTableHelpers';
import { formatCountdown } from '../../../../helpers/timeHelpers';
import { getServerTimeMS } from '@csegames/library/dist/_baseGame/utils/timeUtils';
import { isBattlePassVisible } from '../BattlePass/BattlePassUtils';

const Root = 'LobbyBattlePassStatus-Root';
const Row = 'Row';
const Background = 'LobbyBattlePassStatus-Background';
const Title = 'LobbyBattlePassStatus-Title';
const ProgressContainer = 'LobbyBattlePassStatus-ProgressContainer';
const LevelLabel = 'LobbyBattlePassStatus-LevelLabel';
const XPLabel = 'LobbyBattlePassStatus-XPLabel';
const XPBar = 'LobbyBattlePassStatus-XPBar';
const ComingSoonFooter = 'LobbyBattlePassStatus-ComingSoonFooter';
const PreviewNameContainer = 'LobbyBattlePassStatus-PreviewNameContainer';
const StartDateContainer = 'LobbyBattlePassStatus-StartDateContainer';
const StartDateLockIcon = 'LobbyBattlePassStatus-StartDateLockIcon';

const StringIDBattlePassComingSoon = 'BattlePassComingSoon';
const StringIDBattlePassMax = 'BattlePassMax';
const StringIDBattlePassTierProgressLabel = 'BattlePassTierProgressLabel';
const StringIDBattlePassStartsSoon = 'BattlePassStartsSoon';

interface ReactProps {}

interface InjectedProps {
  currentBattlePass: QuestDefGQL;
  nextBattlePass: QuestDefGQL;
  quests: QuestGQL[];
  perksByID: Dictionary<PerkDefGQL>;
  defaultChampionID: string;
  champions: ChampionGQL[];
  championCostumes: ChampionCostumeInfo[];
  stringTable: Dictionary<StringTableEntryDef>;
  minuteTicker: number;
  serverTimeDeltaMS: number;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ALobbyBattlePassStatus extends React.Component<Props> {
  public render(): JSX.Element {
    // TODO: This is temporary disabled as there is not enough vertical space in the lobby
    return null;
    const bp = this.props.currentBattlePass;
    if (bp) {
      const currentProgress = this.props.quests.find((quest) => {
        return quest.id === bp.id;
      });
      const currentIndex = currentProgress?.currentQuestIndex ?? 0;
      const currentLink = bp.links[currentIndex];
      const atMaxLevel = currentIndex >= bp.links.length;
      const tokens: Dictionary<string> = {
        CURRENT_TIER: `${(currentProgress?.currentQuestIndex ?? 0) + 1}`,
        MAX_TIER: `${bp.links.length}`
      };
      const levelText = atMaxLevel
        ? getStringTableValue(StringIDBattlePassMax, this.props.stringTable)
        : getTokenizedStringTableValue(StringIDBattlePassTierProgressLabel, this.props.stringTable, tokens);

      return (
        <div className={Root} onClick={this.onRootClick.bind(this)}>
          <img className={Background} src={this.getBackgroundImageURL()} />
          <div className={Title}>{bp.name}</div>
          <div className={Row}>
            <div className={ProgressContainer}>
              <ResourceBar
                isSquare
                type={'blue'}
                // If there is no current link you have reached max level, so return a full bar.
                current={currentLink ? currentProgress?.currentQuestProgress ?? 0 : 100}
                max={currentLink?.progress ?? 100}
                hideText={true}
                containerClasses={XPBar}
              />
              <div className={`${XPLabel} ShowOnHover`}>{this.getProgress(currentProgress, currentLink, bp)}</div>
            </div>
            <div className={LevelLabel}>{levelText}</div>
          </div>
        </div>
      );
    } else {
      const bp = this.props.nextBattlePass;
      // We hide future BPs that aren't in Preview yet.
      if (bp && isBattlePassVisible(bp, this.props.serverTimeDeltaMS)) {
        return (
          <div className={Root}>
            <div className={`${Background} comingSoon`} />
            <div className={Title}>{getStringTableValue(StringIDBattlePassComingSoon, this.props.stringTable)}</div>
            <div className={ComingSoonFooter}>
              <FittingView className={PreviewNameContainer}>
                <div className={Title}>{bp.name}</div>
              </FittingView>
              <div className={StartDateContainer}>
                <div className={StartDateLockIcon} />
                {this.getStartDateText(bp)}
              </div>
            </div>
          </div>
        );
      } else {
        // If the BattlePass feature is turned off, or there is no current or future battle pass,
        // we still maintain the empty space for positioning purposes.
        return <div className={`${Root} hidden`} />;
      }
    }
  }

  private onRootClick(): void {
    this.props.dispatch(navigateTo(LobbyView.BattlePass));
  }

  private getStartDateText(battlePass: QuestDefGQL): string {
    const startDate = new Date(
      battlePass.questLock?.find((lock) => {
        return !!lock.startTime;
      })?.startTime
    );

    const startDelta = startDate.getTime() - getServerTimeMS(this.props.serverTimeDeltaMS);
    const seconds = startDelta / 1000;

    if (seconds > 60) {
      return formatCountdown(seconds, this.props.stringTable);
    } else {
      return getStringTableValue(StringIDBattlePassStartsSoon, this.props.stringTable);
    }
  }

  private getProgress(questGQL: QuestGQL, questLink: QuestLinkDefGQL, quest: QuestDefGQL): string {
    if (questLink && questLink.progress) {
      return `${addCommasToNumber(questGQL?.currentQuestProgress ?? 0)} / ${addCommasToNumber(questLink.progress)} XP`;
    } else {
      return getStringTableValue(StringIDBattlePassMax, this.props.stringTable);
    }
  }

  private getBackgroundImageURL(): string {
    let defaultChampion = this.props.champions.find((c) => c.championID == this.props.defaultChampionID);
    let defaultChampionCostume: ChampionCostumeInfo = null;
    if (defaultChampion) {
      const costumePerk = this.props.perksByID[defaultChampion.costumePerkID];
      if (costumePerk) {
        defaultChampionCostume = this.props.championCostumes.find((costume) => costume.id == costumePerk.costume.id);
      }
    }

    return defaultChampionCostume
      ? defaultChampionCostume.backgroundImageURL
      : 'images/hud/champions/berserker-champion-card-bg.png';
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps) {
  const { currentBattlePass, nextBattlePass } = state.quests;
  const { quests, defaultChampionID, champions } = state.profile;
  const { perksByID } = state.store;
  const { championCostumes } = state.championInfo;
  const { stringTable } = state.stringTable;
  const { minuteTicker, serverTimeDeltaMS } = state.clock;

  return {
    ...ownProps,
    currentBattlePass,
    nextBattlePass,
    quests,
    perksByID,
    defaultChampionID,
    champions,
    championCostumes,
    stringTable,
    minuteTicker,
    serverTimeDeltaMS
  };
}

export const LobbyBattlePassStatus = connect(mapStateToProps)(ALobbyBattlePassStatus);
