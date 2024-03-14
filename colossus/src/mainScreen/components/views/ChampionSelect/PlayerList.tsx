/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { RootState } from '../../../redux/store';
import { connect } from 'react-redux';
import {
  ChampionCostumeInfo,
  ChampionInfo,
  ChampionSelection,
  SelectionPlayer,
  PerkDefGQL
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';

const Container = 'ChampionSelect-LockedList-Container';
const ListItem = 'ChampionSelect-LockedList-ListItem';
const BGImage = 'ChampionSelect-LockedList-BGImage';
const NameOfPlayer = 'ChampionSelect-LockedList-NameOfPlayer';

interface ReactProps {}

interface InjectedProps {
  champions: ChampionInfo[];
  costumes: ChampionCostumeInfo[];
  currentSelection: ChampionSelection;
  perksByID: Dictionary<PerkDefGQL>;
}

type Props = ReactProps & InjectedProps;

class APlayerList extends React.Component<Props> {
  render() {
    const players = this.props.currentSelection.players.slice(); // copy is necessary to change ordering
    players.sort((a, b) => a.displayName.localeCompare(b.displayName));

    return (
      <div className={`${Container}`}>
        {this.props.currentSelection.players.map((player, index) => {
          return this.renderPlayerPortrait(player, index);
        })}
      </div>
    );
  }

  private renderPlayerPortrait(player: SelectionPlayer, index: number): JSX.Element {
    const lockedClass = player.locked ? 'locked' : '';
    const championID = player.selectedChampion?.championID ?? player.defaultChampion.championID;
    const champion = this.props.champions.find((c) => c.id == championID) ?? this.props.champions[0];
    const championSelectURL = this.getChampionSelectURL(player);

    let playerName = player.displayName ? `${player.displayName} - ${champion.name}` : '';
    return (
      <div className={`${ListItem} ${lockedClass}`} key={index}>
        <img className={BGImage} src={championSelectURL} />
        <div className={NameOfPlayer}>{playerName}</div>
      </div>
    );
  }

  private getChampionSelectURL(player: SelectionPlayer): string {
    const portraitID = player.selectedChampion?.portraitID ?? player.defaultChampion.portraitID;
    const portraitPerk = this.props.perksByID[portraitID ?? ''];
    if (portraitPerk) {
      return portraitPerk.portraitChampionSelectImageUrl;
    }

    const costumeID = player.selectedChampion?.costumeID ?? player.defaultChampion.costumeID;
    const costume = this.props.costumes.find((c) => c.id === costumeID) ?? this.props.costumes[0];
    return costume.championSelectImageURL ?? '';
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { champions, championCostumes } = state.championInfo;
  const { currentSelection } = state.match;
  const { perksByID } = state.store;

  return {
    ...ownProps,
    champions,
    costumes: championCostumes,
    currentSelection,
    perksByID
  };
}

export const PlayerList = connect(mapStateToProps)(APlayerList);
