/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  QuestType,
  PerkDefGQL,
  StringTableEntryDef,
  PerkGQL,
  PerkType,
  QuestDefGQL,
  ChampionInfo
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import * as React from 'react';
import { Dispatch } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';
import TooltipSource from '../../../../shared/components/TooltipSource';
import { getTokenizedStringTableValue } from '../../../helpers/stringTableHelpers';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { updateSpendXPPotionQuest } from '../../../redux/storeSlice';
import { findChampionQuest } from '../../../helpers/characterHelpers';
import { Overlay, showOverlay } from '../../../redux/navigationSlice';
import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { QuestGQL, QuestStatus } from '@csegames/library/dist/hordetest/graphql/schema';

const Container = 'QuestXPButton-Container';
const Icon = 'QuestXPButton-Icon';
const Count = 'QuestXPButton-Count';
const ToolTipContainer = 'QuestXPButton-ToolTipContainer';
const TooltipTitle = 'QuestXPButton-TooltipTitle';
const TooltipDescription = 'QuestXPButton-TooltipDescription';
const Arrow = 'QuestXPButton-Arrow';

const StringIDQuestXPButtonTooltipTitle = 'QuestXPButtonTooltipTitle';
const StringIDQuestXPButtonTooltipDescription = 'QuestXPButtonTooltipDescription';

interface ReactProps {
  questType: QuestType;
  champion?: ChampionInfo;
  styles?: string;
}

interface InjectedProps {
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
  ownedPerks: PerkGQL[];
  championQuests: QuestDefGQL[];
  quests: QuestGQL[];
  currentBattlePass: QuestDefGQL;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AQuestXPButton extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render(): React.ReactNode {
    if (this.props.questType == QuestType.BattlePass && this.props.currentBattlePass == null) {
      return null;
    }

    const questDef = this.getQuestDef();
    if (!questDef) {
      return null;
    }

    const questProgress = this.props.quests.find((q) => q.id == questDef.id);
    if (!questProgress || questProgress.questStatus != QuestStatus.Running) {
      return null;
    }

    const perkDef = this.getPerkDef();

    if (!perkDef) {
      return null;
    }

    const count = this.getCount(perkDef);
    if (count <= 0) {
      return null;
    }

    const digits = String(count).length;

    return (
      <TooltipSource
        tooltipParams={{
          id: `QuestXPButton` + this.props.questType.toString(),
          content: this.renderTooltip.bind(this)
        }}
        key={count}
      >
        <div
          className={`${this.props.styles || ''} ${Container} ${this.props.questType.toString()}`}
          onClick={this.onClick.bind(this)}
        >
          <img className={Icon} src={perkDef.iconURL} />
          <div className={Count}>{addCommasToNumber(count)}</div>
          {this.getArrow(digits)}
        </div>
      </TooltipSource>
    );
  }

  private getArrow(digits: number): JSX.Element {
    const stroke: string = this.props.questType == QuestType.BattlePass ? 'var(--Main-Orange, #FFB000)' : '#00B88C';
    const stopColor: string = this.props.questType == QuestType.BattlePass ? '#FBE201' : '#01FBEC';
    const stopColorOffset: string = this.props.questType == QuestType.BattlePass ? '#FF8A00' : '#005445';

    const width = 50 + (digits - 1) * 17;

    return (
      <svg className={Arrow} viewBox={`0 0 ${width + 20} 40`} fill='none'>
        <path
          d={`
            M 4, 4
            L 4, 36
            H ${width}
            L ${width + 16}, 20
            L ${width}, 4
            Z
          `}
          fill='url(#paint0_linear_1576_10727)'
          stroke={stroke}
          stroke-width='4'
        />
        <defs>
          <linearGradient id='paint0_linear_1576_10727' gradientUnits='userSpaceOnUse'>
            <stop offset='35%' stop-color={stopColorOffset} />
            <stop offset='100%' stop-color={stopColor} />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  private renderTooltip(): JSX.Element {
    const perkDef = this.getPerkDef();
    if (!perkDef) {
      return null;
    }

    const count: number = this.getCount(perkDef);
    if (count <= 0) {
      return null;
    }

    const tokens = {
      COUNT: count.toString(),
      XP_AMOUNT: addCommasToNumber(perkDef.xPAmount)
    };

    return (
      <div className={ToolTipContainer}>
        <span className={TooltipTitle}>
          {getTokenizedStringTableValue(
            StringIDQuestXPButtonTooltipTitle + this.props.questType.toString(),
            this.props.stringTable,
            tokens
          )}
        </span>
        <span className={TooltipDescription}>
          {getTokenizedStringTableValue(
            StringIDQuestXPButtonTooltipDescription + this.props.questType.toString(),
            this.props.stringTable,
            tokens
          )}
        </span>
      </div>
    );
  }

  private onClick(): void {
    const quest = this.getQuestDef();
    if (quest) {
      this.props.dispatch(updateSpendXPPotionQuest(quest));
      this.props.dispatch(showOverlay(Overlay.SpendQuestXPPotions));
      game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_TAB_STORE_OPEN);
    }
  }

  private getQuestDef(): QuestDefGQL {
    if (this.props.questType == QuestType.BattlePass) {
      return this.props.currentBattlePass;
    }

    return findChampionQuest(this.props.champion, this.props.championQuests);
  }

  private getPerkDef(): PerkDefGQL | null {
    return (
      Object.values(this.props.perksByID).find((perkDef) => {
        return perkDef.perkType == PerkType.QuestXP && perkDef.questType == this.props.questType;
      }) ?? null
    );
  }

  private getCount(perkDef: PerkDefGQL): number {
    return this.props.ownedPerks.find((p) => p.id == perkDef.id)?.qty ?? 0;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { perksByID } = state.store;
  const ownedPerks = state.profile?.perks ?? [];
  const { stringTable } = state.stringTable;
  const championQuests = state.quests.quests[QuestType.Champion];
  const { currentBattlePass } = state.quests;
  const { quests } = state.profile;

  return {
    ...ownProps,
    ownedPerks,
    perksByID,
    stringTable,
    championQuests,
    quests,
    currentBattlePass
  };
}

export const QuestXPButton = connect(mapStateToProps)(AQuestXPButton);
