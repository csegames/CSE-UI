/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled, { keyframes } from 'react-emotion';
import { FactionColors } from 'lib/factionColors';
import { TeamPlayer } from './ScenarioResultsContainer';

const HOVER_EFFECT_TIME = 0.4;

const hoverEffect = keyframes`
  from {
    left: -3px;
  }

  to {
    left: 0px;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  top {
    opacity: 1;
  }
`;

const Container = styled('div')`
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 20px;
  height: 34px;
  margin-bottom: 3px;
  color: white;
  cursor: pointer;
  pointer-events: all;
  opacity: ${(props: any) => props.searchIncludes ? 1 : 0.3};
  &:hover .scenario-results-list-item-background {
    animation: ${hoverEffect} ${HOVER_EFFECT_TIME}s forwards;
    -webkit-animation: ${hoverEffect} ${HOVER_EFFECT_TIME}s forwards;
  }

  &:hover .scenario-results-list-item-background::before {
    opacity: 0.65;
    animation: ${hoverEffect} ${HOVER_EFFECT_TIME}s forwards, ${fadeIn} 0.2s forwards;
    -webkit-animation: ${hoverEffect} ${HOVER_EFFECT_TIME}s forwards, ${fadeIn} 0.2s forwards;
  }
`;

const ContainerBackground = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: ${(props: any) => props.searchIncludes ? 1 : 0.3};
  background: linear-gradient(to right, ${(props: any) => props.backgroundColor}, transparent);

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
    border: 1px solid rgba(255,255,255,0.6);
    box-shadow: inset 0 0 25px rgba(255,255,255,0.6);
    -webkit-mask-image: linear-gradient(to right, black, transparent);
    -webkit-mask-size: cover;
  }
`;

const ContainerOverlay = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.65;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.4), transparent);
    -webkit-mask-image: url(images/scenario-results/texture-over-line.png);
  }
`;


export const Team = styled('div')`
  width: 40px;
  color: ${(props: any) => props.color};
`;

export const Name = styled('div')`
  flex: 2;
  display: flex;
  color: ${(props: any) => props.color};
`;

export const KDAContainer = styled('div')`
  display: flex;
  flex: 1;
  margin-right: 15px;
`;

export const Kills = styled('div')`
  width: 50px;
  text-align: center;
`;

export const Deaths = styled('div')`
  width: 50px;
  text-align: center;
`;

export const Assists = styled('div')`
  width: 50px;
  text-align: center;
`;

export const Divider = styled('div')`
  text-align: center;
  color: ${(props: any) => props.color};
`;

export const HealingDealt = styled('div')`
  flex: 1;
`;

export const DamageReceived = styled('div')`
  flex: 1;
`;

export const HealingReceived = styled('div')`
  flex: 1;
`;

export const Score = styled('div')`
  flex: 1;
`;

export const DamageDealt = styled('div')`
  flex: 1;
`;

export const NPCKills = styled('div')`
  flex: 1;
`;

export interface ListItemProps {
  player: TeamPlayer;
  isVisible: boolean;
  searchIncludes: boolean;
  backgroundColor: string;
}

class ListItem extends React.Component<ListItemProps> {
  private listItemRef: HTMLDivElement;
  public render() {
    const { player, searchIncludes, backgroundColor } = this.props;
    const teamString = player.teamID;
    const colors = teamString ? FactionColors[teamString] : { textColor: 'white' };

    return (
      <Container innerRef={(r: HTMLDivElement) => this.listItemRef = r} searchIncludes={searchIncludes}>
        <ContainerBackground
          className='scenario-results-list-item-background'
          searchIncludes={searchIncludes}
          backgroundColor={backgroundColor}
        />
        <ContainerOverlay />
        <Team color={colors.textColor}>{teamString && teamString.substr(0, 1)}</Team>
        <Name>{player.displayName}</Name>
        <KDAContainer>
          <Kills>{player.damage.killCount.playerCharacter}</Kills>
          <Divider>/</Divider>
          <Deaths>{player.damage.deathCount.anyCharacter}</Deaths>
          <Divider>/</Divider>
          <Assists>{player.damage.killAssistCount.playerCharacter}</Assists>
        </KDAContainer>
        <NPCKills>{player.damage.killCount.nonPlayerCharacter}</NPCKills>
        <DamageDealt>{player.damage.damageApplied.anyCharacter} </DamageDealt>
        <DamageReceived>{player.damage.damageReceived.anyCharacter}</DamageReceived>
        <HealingDealt>{player.damage.healingApplied.anyCharacter}</HealingDealt>
        <HealingReceived>{player.damage.healingReceived.anyCharacter}</HealingReceived>
        <Score>{player.score}</Score>
      </Container>
    );
  }

  public shouldComponentUpdate(nextProps: ListItemProps) {
    return nextProps.isVisible;
  }
}

export default ListItem;
