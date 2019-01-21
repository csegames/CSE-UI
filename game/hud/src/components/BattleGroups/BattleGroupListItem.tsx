/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
// import { Faction as GQLFaction, Archetype as GQLArchetype } from 'gql/interfaces';

const Container = styled('div')`
  cursor: pointer;
  font-size: 12px;
  font-family: TitilliumWeb;
  margin-left: 10px;
  margin-bottom: 5px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const RankIcon = styled('span')`
  margin-right: 5px;
  font-size: 12px;
  font-family: TitilliumWeb;
  color: #FFD156;
`;

export interface BattleGroupListItemProps {
  item: GroupMemberState;
}

export interface BattleGroupListItemState {
}

export class BattleGroupListItem extends React.Component<BattleGroupListItemProps, BattleGroupListItemState> {
  public render() {
    const { item } = this.props;
    // const imgDir = 'images/unit-frames/1080/';
    // const realmPrefix = this.realmPrefix(item.faction);
    // const archetypePrefix = this.archetypePrefix(item.classID);
    return (
      <Container>
        <RankIcon className={`icon-rank-${item.rankLevel}`} />
        {this.props.item.name}
      </Container>
    );
  }

  public shouldComponentUpdate(nextProps: BattleGroupListItemProps) {
    return nextProps.item.name !== this.props.item.name ||
      nextProps.item.rankLevel !== this.props.item.rankLevel;
  }

  // private realmPrefix = (faction: Faction | GQLFaction) => {
  //   switch (faction) {
  //     case Faction.Arthurian:
  //     case GQLFaction.Arthurian: {
  //       return 'art-';
  //     }
  //     case Faction.Viking:
  //     case GQLFaction.Viking: {
  //       return 'vik-';
  //     }
  //     case Faction.TDD:
  //     case GQLFaction.TDD: {
  //       return 'tdd-';
  //     }
  //     default: return '';
  //   }
  // }

  // private archetypePrefix = (archetype: Archetype | GQLArchetype) => {
  //   switch (archetype) {
  //     case Archetype.BlackKnight:
  //     case Archetype.Fianna:
  //     case Archetype.Mjolnir:
  //     case GQLArchetype.BlackKnight:
  //     case GQLArchetype.Fianna:
  //     case GQLArchetype.Mjolnir: {
  //       return 'heavy-fighter-';
  //     }
  //     case Archetype.Blackguard:
  //     case Archetype.ForestStalker:
  //     case Archetype.WintersShadow:
  //     case GQLArchetype.Blackguard:
  //     case GQLArchetype.ForestStalker:
  //     case GQLArchetype.WintersShadow: {
  //       return 'archer-';
  //     }
  //     case Archetype.Physician:
  //     case Archetype.Empath:
  //     case Archetype.Stonehealer:
  //     case GQLArchetype.Physician:
  //     case GQLArchetype.Empath:
  //     case GQLArchetype.Stonehealer: {
  //       return 'healer-';
  //     }
  //     default: return '';
  //   }
  // }
}

export default BattleGroupListItem;
