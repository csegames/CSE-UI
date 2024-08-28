/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { RootState } from '../../../redux/store';
import { connect } from 'react-redux';
import {
  ChampionCostumeInfo,
  ChampionInfo,
  OvermindCharacter,
  OvermindSummaryGQL,
  MVP,
  StringTableEntryDef,
  PerkDefGQL,
  ScenarioDefGQL
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Button } from '../../shared/Button';
import {
  StringIDGeneralContinue,
  getStringTableValue,
  getTokenizedStringTableValue
} from '../../../helpers/stringTableHelpers';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { printWithSeparator } from '@csegames/library/dist/_baseGame/utils/numberUtils';

const MVPPage = 'GameStats-SummaryMVP-MVPPage';
const MVPContainer = 'GameStats-SummaryMVP-MVPContainer';
const MVPStatsContainer = 'GameStats-SummaryMVP-MVPStatsContainer';
const MVPTitle = 'GameStats-SummaryMVP-MVPTitle';
const MVPName = 'GameStats-SummaryMVP-MVPName';
const MVPDescription = 'GameStats-SummaryMVP-MVPDescription';
const ContinueButtonContainer = 'GameStats-SummaryMVP-ContinueButtonContainer';
const MVPChampionImage = 'GameStats-SummaryMVP-MVPChampionImage';
const MVPTitleContainer = 'GameStats-SummaryMVP-MVPTitleContainer';
const MVPPlayerContainer = 'GameStats-SummaryMVP-MVPPlayerContainer';
const MVPIcon = 'GameStats-SummaryMVP-MVPIcon';
const MVPPlayerNameContainer = 'GameStats-SummaryMVP-MVPPlayerNameContainer';
const MVPChampionName = 'GameStats-SummaryMVP-MVPChampionName';
const PersonalStatsContainer = 'GameStats-SummaryMVP-PersonalStatsContainer';
const PersonalStatsChampionImage = 'GameStats-SummaryMVP-PersonalStatsChampionImage';
const PersonalStatsValuesContainer = 'GameStats-SummaryMVP-PersonalStatsValuesContainer';
const PersonalStatsTitleContainer = 'GameStats-SummaryMVP-PersonalStatsTitleContainer';
const PersonalStatsTitle = 'GameStats-SummaryMVP-PersonalStatsTitle';
const PersonalStatsDescription = 'GameStats-SummaryMVP-PersonalStatsDescription';
const PersonalStatsPlayerContainer = 'GameStats-SummaryMVP-PersonalStatsPlayerContainer';
const PersonalStatsIcon = 'GameStats-SummaryMVP-PersonalStatsIcon';
const PersonalStatsPlayerNameContainer = 'GameStats-SummaryMVP-PersonalStatsPlayerNameContainer';
const PersonalStatsName = 'GameStats-SummaryMVP-PersonalStatsName';
const PersonalStatsChampionName = 'GameStats-SummaryMVP-PersonalStatsChampionName';

const StringIDGameStatsPersonalHeading = 'GameStatsPersonalHeading';
const StringIDGameStatsPersonalKills = 'GameStatsPersonalKills';
const StringIDGameStatsPersonalDamageDealt = 'GameStatsPersonalDamageDealt';

interface ReactProps {
  overmindSummary: OvermindSummaryGQL;
  initialPageShow: boolean;
  showContinue?: boolean;
  onClose: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

interface InjectedProps {
  championCostumes: ChampionCostumeInfo[];
  champions: ChampionInfo[];
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
  overmindSummary: OvermindSummaryGQL;
  accountID: string;
  scenarioDef: ScenarioDefGQL;
}

type Props = ReactProps & InjectedProps;

class ASummaryMVP extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div className={MVPPage}>
        {!this.props.scenarioDef?.showScoreAsRank && (
          <>
            {this.renderMVP(2)}
            {this.renderMVP(1)}
            {this.renderMVP(0)}
          </>
        )}
        {this.props.scenarioDef?.showScoreAsRank && this.renderPersonalStats()}
        {this.props.showContinue && this.renderContinueButton()}
      </div>
    );
  }

  private renderContinueButton() {
    if (this.props.initialPageShow) {
      const showAnimations = this.props.initialPageShow ? 'ShowAnimations' : '';

      return (
        <div className={`${ContinueButtonContainer} ${showAnimations}`}>
          <Button
            type={'blue'}
            text={getStringTableValue(StringIDGeneralContinue, this.props.stringTable)}
            onClick={this.props.onClose.bind(this)}
            disabled={false}
          />
        </div>
      );
    }

    return null;
  }

  private renderMVP(index: number) {
    const mvp: MVP = this.props.overmindSummary?.mVPs[index];
    if (!mvp) {
      return null;
    }

    const mvpCharacter: OvermindCharacter = this.props.overmindSummary.characterSummaries.find(
      (c) => c.accountID == mvp.accountID
    );

    const champion = this.props.champions.find((c) => c.id == mvpCharacter.classID);
    if (champion == null) {
      return null;
    }

    const costume = this.props.championCostumes.find((c) => c.id == mvpCharacter.raceID);
    if (costume == null) {
      return null;
    }

    const portrait = this.props.perksByID[mvpCharacter.portraitPerkID]?.portraitThumbnailURL ?? costume.thumbnailURL;

    const primary = index == 0 ? 'Primary' : '';
    const showAnimations = this.props.initialPageShow ? 'ShowAnimations' : '';
    const indexStyle = `Index${index}`;

    return (
      <div className={`${MVPContainer} ${indexStyle} ${showAnimations}`}>
        <img className={`${MVPChampionImage} ${primary} ${showAnimations}`} src={costume.standingImageURL} />
        <div className={`${MVPStatsContainer} ${showAnimations} ${indexStyle}`}>
          <div className={MVPTitleContainer}>
            <div className={MVPTitle}>{mvp.mVPName}</div>
            <div className={MVPDescription}>{mvp.mVPDescription}</div>
          </div>
          <div className={MVPPlayerContainer}>
            <div className={MVPIcon} style={{ backgroundImage: `url(${portrait})` }} />
            <div className={MVPPlayerNameContainer}>
              <div className={MVPName}>{mvpCharacter.userName}</div>
              <div className={MVPChampionName}>{champion.name}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private renderPersonalStats(): JSX.Element {
    const characterSummary = this.props.overmindSummary.characterSummaries.find(
      (summary) => summary.accountID === this.props.accountID
    );

    const champion = this.props.champions.find((c) => c.id == characterSummary.classID);
    if (champion == null) {
      return null;
    }

    const costume = this.props.championCostumes.find((c) => c.id == characterSummary.raceID);
    if (costume == null) {
      return null;
    }

    const showAnimations = this.props.initialPageShow ? 'ShowAnimations' : '';

    const portrait =
      this.props.perksByID[characterSummary.portraitPerkID]?.portraitThumbnailURL ?? costume.thumbnailURL;

    return (
      <div className={`${PersonalStatsContainer} ${showAnimations}`}>
        <img className={`${PersonalStatsChampionImage} ${showAnimations}`} src={costume.standingImageURL} />
        <div className={`${PersonalStatsValuesContainer} ${showAnimations}`}>
          <div className={PersonalStatsTitleContainer}>
            <div className={PersonalStatsTitle}>
              {getStringTableValue(StringIDGameStatsPersonalHeading, this.props.stringTable)}
            </div>
            <div className={PersonalStatsDescription}>
              {getTokenizedStringTableValue(StringIDGameStatsPersonalKills, this.props.stringTable, {
                KILLS: printWithSeparator(characterSummary.kills, ',')
              })}
            </div>
            <div className={PersonalStatsDescription}>
              {getTokenizedStringTableValue(StringIDGameStatsPersonalDamageDealt, this.props.stringTable, {
                DAMAGE: printWithSeparator(characterSummary.damageApplied, ',')
              })}
            </div>
          </div>
          <div className={PersonalStatsPlayerContainer}>
            <div className={PersonalStatsIcon} style={{ backgroundImage: `url(${portrait})` }} />
            <div className={PersonalStatsPlayerNameContainer}>
              <div className={PersonalStatsName}>{characterSummary.userName}</div>
              <div className={PersonalStatsChampionName}>{champion.name}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { championCostumes, champions } = state.championInfo;
  const { stringTable } = state.stringTable;
  const { perksByID } = state.store;
  const { overmindSummary } = state.gameStats;
  const { id: accountID } = state.user;
  const { scenarioDefs } = state.scenarios;

  return {
    ...ownProps,
    championCostumes,
    champions,
    stringTable,
    perksByID,
    overmindSummary,
    accountID,
    scenarioDef: scenarioDefs[overmindSummary?.scenarioID]
  };
}

export const SummaryMVP = connect(mapStateToProps)(ASummaryMVP);
