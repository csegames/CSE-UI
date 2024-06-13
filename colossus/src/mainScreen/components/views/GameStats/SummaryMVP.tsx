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
  PerkDefGQL
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Button } from '../../shared/Button';
import { StringIDGeneralContinue, getStringTableValue } from '../../../helpers/stringTableHelpers';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';

const MVPPage = 'GameStats-SummaryMVP-MVPPage';
const Container = 'GameStats-SummaryMVP-Container';
const MVPStatsContainer = 'GameStats-SummaryMVP-MVPStatsContainer';
const MVPTitle = 'GameStats-SummaryMVP-MVPTitle';
const MVPName = 'GameStats-SummaryMVP-MVPName';
const MVPDescription = 'GameStats-SummaryMVP-MVPDescription';
const ButtonContainer = 'GameStats-SummaryMVP-ButtonContainer';
const ChampionImage = 'GameStats-SummaryMVP-ChampionImage';
const MVPTitleContainer = 'GameStats-SummaryMVP-MVPTitleContainer';
const MVPPlayerContainer = 'GameStats-SummaryMVP-MVPPlayerContainer';
const MVPIcon = 'GameStats-SummaryMVP-MVPIcon';
const MVPPlayerNameContainer = 'GameStats-SummaryMVP-MVPPlayerNameContainer';
const MVPChampionName = 'GameStats-SummaryMVP-MVPChampionName';

interface ReactProps {
  overmindSummary: OvermindSummaryGQL;
  initialPageShow: boolean;
  onClose: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

interface InjectedProps {
  championCostumes: ChampionCostumeInfo[];
  champions: ChampionInfo[];
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class ASummaryMVP extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div className={MVPPage}>
        {this.renderMVP(2)}
        {this.renderMVP(1)}
        {this.renderMVP(0)}
        {this.renderContinueButton()}
      </div>
    );
  }

  private renderContinueButton() {
    if (this.props.initialPageShow) {
      const showAnimations = this.props.initialPageShow ? 'ShowAnimations' : '';

      return (
        <div className={`${ButtonContainer} ${showAnimations}`}>
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
      <div className={`${Container} ${indexStyle} ${showAnimations}`}>
        <img className={`${ChampionImage} ${primary} ${showAnimations}`} src={costume.standingImageURL} />
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
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { championCostumes, champions } = state.championInfo;
  const { stringTable } = state.stringTable;
  const { perksByID } = state.store;

  return {
    ...ownProps,
    championCostumes,
    champions,
    stringTable,
    perksByID
  };
}

export const SummaryMVP = connect(mapStateToProps)(ASummaryMVP);
