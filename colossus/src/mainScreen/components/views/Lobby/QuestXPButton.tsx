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

interface State {
  svgWidth: number;
}

class AQuestXPButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      svgWidth: 0
    };
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
    const scaleFactor: number = (digits - 1) * 0.25;
    const marginRight = `${scaleFactor * this.state.svgWidth}px`;

    return (
      <TooltipSource
        tooltipParams={{
          id: `QuestXPButton` + this.props.questType.toString(),
          content: this.renderTooltip.bind(this)
        }}
        key={count}
      >
        <div
          style={{ marginRight }}
          className={`${this.props.styles || ''} ${Container} ${this.props.questType.toString()}`}
          onClick={this.onClick.bind(this)}
        >
          {this.getArrow(scaleFactor)}
          <img className={Icon} src={perkDef.iconURL} />
          <div className={Count}>{addCommasToNumber(count)}</div>
        </div>
      </TooltipSource>
    );
  }

  private getArrow(scaleFactor: number): JSX.Element {
    const stroke: string = this.props.questType == QuestType.BattlePass ? 'var(--Main-Orange, #FFB000)' : '#00B88C';
    const stopColor: string = this.props.questType == QuestType.BattlePass ? '#FBE201' : '#01FBEC';
    const stopColorOffset: string = this.props.questType == QuestType.BattlePass ? '#FF8A00' : '#005445';

    const transform = `scaleX(${scaleFactor + 1})`;
    const marginLeft = `${(scaleFactor * this.state.svgWidth) / 2}px`;

    return (
      <svg
        style={{ transform, marginLeft }}
        className={Arrow}
        viewBox='0 0 71 35'
        fill='none'
        ref={(ref) => {
          if (ref && this.state.svgWidth !== ref.clientWidth) {
            this.setState({ svgWidth: ref.clientWidth });
          }
        }}
      >
        <path
          d='M60.6371 24.8186L52.2537 33H2V2H52.2537L68.1364 17.5L60.6371 24.8186Z'
          fill='url(#paint0_linear_1576_10727)'
          stroke={stroke}
          stroke-width='4'
        />
        <defs>
          <linearGradient
            id='paint0_linear_1576_10727'
            x1='75.0588'
            y1='35'
            x2='22.8324'
            y2='35'
            gradientUnits='userSpaceOnUse'
          >
            <stop stop-color={stopColor} />
            <stop offset='1' stop-color={stopColorOffset} />
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
