/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { Tooltip } from 'shared/Tooltip';
import { Faction as GQLFaction, Archetype as GQLArchetype } from 'gql/interfaces';
import { Statuses } from './Statuses';

const PlayerFrameContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  pointer-events: all;
`;

const MainGrid = styled.div`
  position: relative;
  flex: 0 0 auto;
  display: grid;
  cursor: pointer !important;
  grid-template-columns: 32px 70px 339px;
  grid-template-rows: 16px 63px 38px;
  @media (max-width: 1920px) {
    grid-template-columns: 16px 35px 170px;
    grid-template-rows: 8px 32px 19px;
  }
`;

const ArchetypeFrameContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  grid-row-start: 1;
  grid-row-end: 3;
  grid-column-start: 2;
  grid-column-end: 3;
`;

const Name = styled.div`
  color: white;
  grid-row-start: 2;
  grid-row-end: last;
  grid-column-start: 3;
  grid-column-end: last;
  z-index: 1;
  padding: 15px 0 0 10px;
  font-size: 22px;
  @media (max-width: 1920px) {
    font-size: 14px;
    padding: 7px 0 0 5px;
  }
`;

const Image = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const MainFrame = styled.div`
  position: relative;
  grid-column-start: 1;
  grid-column-end: last;
  grid-row-start: 2;
  grid-row-end: last;
`;

const HealthSubGrid = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-areas:
    '. blood nameBG nameBG nameBG nameBG nameBG nameBG .'
    '. blood . . . . . . .'
    '. blood . . . health health health .'
    '. blood . . . . . . .'
    '. blood . . stamina stamina stamina . .'
    '. blood . . . . . . .'
    '. blood . panic panic panic . . .'
    '. blood . . . . . . .'
    '. . . . . . . . .';
  grid-template-columns: 8px 30px 6px 3px 3px 293px 3px 85px 10px;
  grid-template-rows: 57px 4px 13px 6px 4px 1px 4px 3px 9px;
  @media (max-width: 1920px) {
    grid-template-columns: 4px 15px 3px 1px 3px 147px 1px 42px 3px;
    grid-template-rows: 29px 2px 7px 2px 2px 1px 2px 1px 4px;
  }
`;

const NameBG = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  grid-area: nameBG;
`;

const Blood = styled.div`
  grid-area: blood;
  width: 100%;
  align-self: end;
`;

const Health = styled.div`
  grid-area: health;
  height: 100%;
  transform: skewX(31.6deg);
`;

const Wounds = styled.div`
  grid-area: health;
  height: 100%;
  transform: skewX(31.6deg);
  justify-self: end;
`;

const HealthText = styled.div`
  font-size: 1em;
  line-height: 1em;
`;

const Stamina = styled.div`
  grid-area: stamina;
  height: 100%;
  transform: skewX(-30deg);
  border-radius: 3px;
`;

export interface Props {
  player: PlayerState;
  target?: 'enemy' | 'friendly';
}

export interface State {
}

export class PlayerFrame extends React.Component<Props, State> {

  public render() {
    return (
      <UIContext.Consumer>
        {this.uiContextRender}
      </UIContext.Consumer>
    );
  }

  public componentDidMount() {
    game.store.onUpdated(() => this.forceUpdate());
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (Object.is(this.props.player, nextProps.player)) {
      return false;
    }

    if (PlayerState.equals(this.props.player, nextProps.player)) {
      return false;
    }

    return true;
  }

  private uiContextRender = (uiContext: UIContext) => {
    const { player } = this.props;
    const imgDir = 'images/unit-frames/' + (uiContext.isUHD() ? '4k/' : '1080/');
    const realmPrefix = this.realmPrefix(player.faction);
    const archetypePrefix = this.archetypePrefix(player.classID);
    const theme = uiContext.currentTheme();

    return (
      <PlayerFrameContainer data-input-group='block'>
        <Tooltip
          updateValues={[
            player.health && player.health[0],
            player.blood && player.blood.current,
            player.stamina && player.stamina.current,
          ]}
          content={(
            <>
              <HealthText style={{
                color: theme.unitFrames.color.health,
                fontWeight: 900,
                fontSize: '1.1em',
              }}>
                <div style={{ display: 'inline-block', width: '101px' }}>Health:</div>
                {`${player.health && player.health[0] ? player.health[0].current.printWithSeparator(' ') : 0}  /`}
                {`  ${player.health && player.health[0] ? player.health[0].max.printWithSeparator(' ') : 0}`}
              </HealthText>
              <HealthText style={{ color: theme.unitFrames.color.blood }}>
                <div style={{ display: 'inline-block', width: '100px' }}>Blood:</div>
                {`${player.blood && player.blood ? player.blood.current.printWithSeparator(' ') : 0}  /`}
                {`  ${player.blood && player.blood ? player.blood.max.printWithSeparator(' ') : 0}`}
              </HealthText>
              <HealthText style={{ color: theme.unitFrames.color.stamina }}>
                <div style={{ display: 'inline-block', width: '100px' }}>Stamina:</div>
                {`${player.stamina && player.stamina ? player.stamina.current.printWithSeparator(' ') : 0}  /`}
                {`  ${player.stamina && player.stamina ? player.stamina.max.printWithSeparator(' ') : 0}`}
              </HealthText>
            </>
          )}
        >
          <MainGrid>
            <MainFrame>
              <Image src={imgDir + 'bg.png'} />

              <HealthSubGrid>
                <NameBG src={imgDir + realmPrefix + 'nameplate-bg.png'} />
              </HealthSubGrid>

              <HealthSubGrid style={{ WebkitMaskImage: `url(${imgDir}main-frame-mask.png)` }}>
                <Blood style={{
                  height: CurrentMax.cssPercent(player.blood),
                  backgroundColor: theme.unitFrames.color.blood,
                }} />
                <Health style={{
                  width: player.health && player.health[0] ? CurrentMax.cssPercent(player.health[0]) : 0,
                  backgroundColor: theme.unitFrames.color.health,
                }} />
                <Wounds style={{
                  width: player.health
                  && player.health[0]
                  && player.health[0].wounds ? ((player.health[0].wounds * .333) * 100 + '%') : 0,
                  background: `url(${imgDir}wounds-texture.png) ${theme.unitFrames.color.wound} repeat-x`,
                }}
                />
                <Stamina style={{
                  width: CurrentMax.cssPercent(player.stamina),
                  backgroundColor: theme.unitFrames.color.stamina,
                }} />
                <NameBG src={imgDir + realmPrefix + 'nameplate-bg.png'} />
              </HealthSubGrid>

              {/* Overlay */}
              <Image src={imgDir + realmPrefix + 'main-frame.png'} />

            </MainFrame>

            <ArchetypeFrameContainer>
              <Image src={imgDir + archetypePrefix + 'bg.png'} />
              <Image
                src={imgDir + realmPrefix + 'propic.png'}
                style={{ WebkitMaskImage: `url(${imgDir + archetypePrefix}bg.png)` }}
              />
              <Image src={imgDir + realmPrefix + archetypePrefix + 'frame.png'} />
            </ArchetypeFrameContainer>

            <Name>{player.name}{!player.isAlive ? ' (Corpse)' : ''}</Name>
          </MainGrid>
        </Tooltip>

        {player.statuses &&
          <Statuses statuses={Object.values(player.statuses)} realmPrefix={this.realmPrefix(player.faction)} />
        }
      </PlayerFrameContainer>
    );
  }

  private realmPrefix = (faction: Faction | GQLFaction) => {
    switch (faction) {
      case Faction.Arthurian:
      case GQLFaction.Arthurian: {
        return 'art-';
      }
      case Faction.Viking:
      case GQLFaction.Viking: {
        return 'vik-';
      }
      case Faction.TDD:
      case GQLFaction.TDD: {
        return 'tdd-';
      }
      default: return '';
    }
  }

  private archetypePrefix = (archetype: Archetype | GQLArchetype) => {
    switch (archetype) {
      case Archetype.BlackKnight:
      case Archetype.Fianna:
      case Archetype.Mjolnir:
      case GQLArchetype.BlackKnight:
      case GQLArchetype.Fianna:
      case GQLArchetype.Mjolnir: {
        return 'heavy-fighter-';
      }
      case Archetype.Blackguard:
      case Archetype.ForestStalker:
      case Archetype.WintersShadow:
      case GQLArchetype.Blackguard:
      case GQLArchetype.ForestStalker:
      case GQLArchetype.WintersShadow: {
        return 'archer-';
      }
      case Archetype.Physician:
      case Archetype.Empath:
      case Archetype.Stonehealer:
      case GQLArchetype.Physician:
      case GQLArchetype.Empath:
      case GQLArchetype.Stonehealer: {
        return 'healer-';
      }
      case Archetype.Druid:
      case Archetype.FlameWarden:
      case Archetype.WaveWeaver:
      case GQLArchetype.Druid:
      case GQLArchetype.FlameWarden:
      case GQLArchetype.Stonehealer: {
        return 'mage-';
      }
      default: return '';
    }
  }
}
