/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { printWithSeparator } from '@csegames/library/dist/_baseGame/utils/numberUtils';
import { ScorePanelGQL, StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import TooltipSource from '../../../../shared/components/TooltipSource';
import { Dictionary } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';
import { getStringTableValue, getTokenizedStringTableValue } from '../../../helpers/stringTableHelpers';

const Container = 'GameStats-ScorePanelItem-Container';
const Title = 'GameStats-ScorePanelItem-Title';
const Outcome = 'GameStats-ScorePanelItem-Outcome';
const Score = 'GameStats-ScorePanelItem-Score';
const Points = 'GameStats-ScorePanelItem-Points';
const RankContainer = 'GameStats-ScorePanelItem-RankContainer';
const RankIcon = 'GameStats-ScorePanelItem-RankIcon';
const RankInfoContainer = 'GameStats-ScorePanelItem-RankInfoContainer';
const RankInfoTitle = 'GameStats-ScorePanelItem-RankInfoTitle';

const RankInfo = 'GameStats-ScorePanelItem-RankInfo';

const StringIDGameStatsPanelFail = 'GameStatsPanelFail';
const StringIDGameStatsPanelSuccess = 'GameStatsPanelSuccess';
const StringIDGameStatsPanelPoints = 'GameStatsPanelPoints';
const StringIDGameStatsPanelRank = 'GameStatsPanelRank';

interface ReactProps {
  scorePanel: ScorePanelGQL;
}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

export class AScorePanelItem extends React.Component<Props> {
  render() {
    const scorePanel = this.props.scorePanel;
    if (this.props.scorePanel.def == null || this.props.scorePanel.instance == null) {
      return null;
    }

    const overallOutcome = scorePanel.instance.rank < 1 ? 'failed' : 'achieved';
    const overallOutcomeText =
      scorePanel.instance.rank < 1
        ? getStringTableValue(StringIDGameStatsPanelFail, this.props.stringTable)
        : getStringTableValue(StringIDGameStatsPanelSuccess, this.props.stringTable);

    return (
      <div
        className={`${Container} ${overallOutcome}`}
        style={{ backgroundImage: `url("${this.props.scorePanel.def.backgroundImage}")` }}
      >
        <div className={Title}>{scorePanel.def.displayName}</div>
        <div className={`${Outcome} ${overallOutcome}`}>{overallOutcomeText}</div>
        <div className={Score}>{printWithSeparator(scorePanel.instance.score, ',')}</div>
        <div className={Points}>{getStringTableValue(StringIDGameStatsPanelPoints, this.props.stringTable)}</div>
        <div className={RankContainer}>
          {scorePanel.def.ranks.map((def, index) => {
            const outcome = index < scorePanel.instance.rank ? 'achieved' : 'failed';
            const rankBackgroundImage =
              outcome === 'achieved' ? scorePanel.def.rankImageWon : scorePanel.def.rankImageLost;
            return (
              <TooltipSource
                className={`${RankIcon} ${outcome}`}
                style={{ backgroundImage: `url("${rankBackgroundImage}")` }}
                tooltipParams={{
                  id: `Rank ${index + 1}`,
                  content: this.renderRankInfoTooltip.bind(this, scorePanel.def.ranks[index].description, index + 1)
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  private renderRankInfoTooltip(description: string, rank: string): JSX.Element {
    return (
      <div className={RankInfoContainer}>
        <span className={RankInfoTitle}>
          {getTokenizedStringTableValue(StringIDGameStatsPanelRank, this.props.stringTable, { RANK: rank })}
        </span>
        <span className={RankInfo}>{description}</span>
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    stringTable
  };
}

export const ScorePanelItem = connect(mapStateToProps)(AScorePanelItem);
