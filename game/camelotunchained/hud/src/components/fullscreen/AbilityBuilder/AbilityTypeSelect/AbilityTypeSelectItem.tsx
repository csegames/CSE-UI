/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { dustParticleDef } from '../particles/dust';
import { snowParticleDef } from '../particles/snow';
import { orbsParticleDef } from '../particles/orbs';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';
import { AbilityType } from 'services/session/AbilityBuilderState';

declare var particlesJS: any;

const Container = styled.div`
  position: relative;
  height: 100%;

  &:hover .name-tag {
    transform: translateX(-50%) scale(1.1);
    filter: brightness(150%);

    &.Melee {
      filter: brightness(150%) hue-rotate(110deg);
    }

    &.Archery {
      filter: brightness(150%) hue-rotate(-75deg);
    }

    &.Shout,
    &.Song {
      filter: brightness(150%) hue-rotate(135deg);
    }

    &.Throwing {
      filter: brightness(150%) hue-rotate(-135deg);
    }
  }
`;

const BackgroundWrapper = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  -webkit-mask-position: center center;
  -webkit-mask-size: auto 100%;
  -webkit-mask-repeat: no-repeat;
  filter: brightness(100%);
  transition: -webkit-mask-size 0.375s, filter 0.375s;
  cursor: pointer;

  &.Magic {
    -webkit-mask-image: url(../images/abilitybuilder/uhd/mask-magic.png);
    &:hover {
      filter: brightness(150%);
      -webkit-mask-size: auto 118%;
    }
  }

  &.Melee {
    filter: hue-rotate(110deg) brightness(100%);
    -webkit-mask-image: url(../images/abilitybuilder/uhd/mask-melee.png);
    &:hover {
      filter: hue-rotate(110deg) brightness(150%);
      -webkit-mask-size: auto 118%;
    }
  }

  &.Archery {
    filter: hue-rotate(-75deg) brightness(100%);
    -webkit-mask-image: url(../images/abilitybuilder/uhd/mask-archery.png);
    &:hover {
      filter: hue-rotate(-75deg) brightness(150%);
      -webkit-mask-size: auto 118%;
    }
  }

  &.Shout,
  &.Song {
    filter: hue-rotate(135deg) brightness(100%);
    -webkit-mask-image: url(../images/abilitybuilder/uhd/mask-shout.png);
    &:hover {
      filter: hue-rotate(135deg) brightness(150%);
      -webkit-mask-size: auto 118%;
    }
  }

  &.Throwing {
    filter: hue-rotate(-135deg) brightness(100%);
    -webkit-mask-image: url(../images/abilitybuilder/uhd/mask-throwing.png);
    &:hover {
      filter: hue-rotate(-135deg) brightness(150%);
      -webkit-mask-size: auto 118%;
    }
  }

  @media (max-width: 1920px) {
    &.Magic {
      -webkit-mask-image: url(../images/abilitybuilder/hd/mask-magic.png);
    }

    &.Melee {
      -webkit-mask-image: url(../images/abilitybuilder/hd/mask-melee.png);
    }

    &.Archery {
      -webkit-mask-image: url(../images/abilitybuilder/hd/mask-archery.png);
    }

    &.Shout,
    &.Song {
      -webkit-mask-image: url(../images/abilitybuilder/hd/mask-shout.png);
    }

    &.Throwing {
      -webkit-mask-image: url(../images/abilitybuilder/hd/mask-Throwing.png);
    }
  }
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(../images/abilitybuilder/uhd/select-rip-bg.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  pointer-events: none;
  transition: left 0.1s, top 0.1s;

  @media (max-width: 1920px) {
    background-image: url(../images/abilitybuilder/hd/select-rip-bg.jpg);
  }
`;

const ParticleBG = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.6;
`;

const Clouds = styled.div`
  position: absolute;
  opacity: 0.7;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: block;
  background: transparent url(../images/visualfx/smoke-close.png) repeat-x center center;
  z-index: 1;
  transform: translateY(-10%);
  animation: move-clouds-close 7s linear infinite;
  transition: opacity 0.7s linear;
  -webkit-transition: opacity 0.7s linear;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: block;
    background: transparent url(../images/visualfx/smoke.png) repeat-x center center;
    background-size: 1000px 700px;
    z-index: 3;
    animation: move-clouds-back 7s linear infinite;
  }

  &.arthurian {
    animation: move-clouds-close-left 15s linear infinite;
    transform: scaleY(-1);
    &:before {
      bottom:50%;
      height:50%;
      animation: move-clouds-back-art 15s linear infinite;
      z-index: 1;
    }
  }

  &.viking {
    animation: move-clouds-close 15s linear infinite;
    &:before {
        z-index: 1;
        opacity: 1;
        animation:move-clouds-back 15s linear infinite;
    }
  }

  &.tdd {
    animation:move-clouds-close-left 15s linear infinite;
    &:before {
      opacity: 1;
      animation: move-clouds-back-left 20s linear infinite;
    }
  }

  &.Melee,
  &.Melee:before {
    animation-delay: 1s;
  }

  &.Archery,
  &.Archery:before {
    animation-delay: 2s;
  }

  &.Shout,
  &.Shout:before,
  &.Song,
  &.Song:before {
    animation-delay: 3s;
  }

  &.Throwing,
  &.Throwing:before {
    animation-delay: 4s;
  }

  @media (max-width: 1920px) {
    &:before {
      background-size: 500px 350px;
    }
  }

  @keyframes move-clouds-back {
    from {background-position:0 bottom;}
    to {background-position:500px bottom;}
  }

  @keyframes move-clouds-back-art {
    from {background-position:800px bottom;}
    to {background-position:0 bottom;}
  }

  @keyframes move-clouds-close {
    from {background-position:0 bottom;}
    to {background-position:1578px bottom;}
  }

  @keyframes move-clouds-back-left {
    from {background-position:500px bottom;}
    to {background-position:0 bottom;}
  }

  @keyframes move-clouds-close-left {
    from {background-position:1578px bottom;}

    to {background-position:0 bottom;}
  }
`;

const Veil = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.85;
  background-image: url(../images/abilitybuilder/uhd/select-rip-veil.png);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  transition: left 0.1s, top 0.1s;
  @media (max-width: 1920px) {
    background-image: url(../images/abilitybuilder/hd/select-rip-veil.png);
  }
`;

const SelectImage = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
  transition: left 0.1s, top 0.1s;
`;

// #region NameTag constants
const NAME_TAG_HEIGHT = 160;
const NAME_TAG_FONT_SIZE = 40;
const NAME_TAG_LETTER_SPACING = 4;
// #endregion
const NameTag = styled.div`
  position: absolute;
  width: 80%;
  height: ${NAME_TAG_HEIGHT}px;
  font-size: ${NAME_TAG_FONT_SIZE}px;
  letter-spacing: ${NAME_TAG_LETTER_SPACING}px;
  background-size: 100% 100%;
  background-position: center center;
  background-repeat: no-repeat;
  text-align: center;
  text-transform: uppercase;
  color: #d3a9ff;
  top: 0;
  bottom: -10%;
  left: 50%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Caudex;
  pointer-events: none;
  transform: translateX(-50%) scale(1);
  filter: brightness(100%);
  transition: transform 0.2s, filter 0.2s;

  &.Melee {
    filter: brightness(100%) hue-rotate(110deg);
  }

  &.Archery {
    filter: brightness(100%) hue-rotate(-75deg);
  }

  &.Shout,
  &.Song {
    filter: brightness(100%) hue-rotate(135deg);
  }

  &.Throwing {
    filter: brightness(100%) hue-rotate(-135deg);
  }

  @media (max-width: 2560px) {
    height: ${NAME_TAG_HEIGHT * MID_SCALE}px;
    font-size: ${NAME_TAG_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${NAME_TAG_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${NAME_TAG_HEIGHT * HD_SCALE}px;
    font-size: ${NAME_TAG_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${NAME_TAG_LETTER_SPACING * HD_SCALE}px;
  }
`;

export interface Props {
  type: AbilityType;
  width: number;
  onSelectType: (type: AbilityType) => void;
}

export interface State {
  bgTranslate: { x: number, y: number };
  veilTranslate: { x: number, y: number };
  characterTranslate: { x: number, y: number };
}

const defaultState: State = {
  bgTranslate: { x: 0, y: 0 },
  veilTranslate: { x: 0, y: 0 },
  characterTranslate: { x: 0, y: 0 },
};

export class AbilityTypeSelectItem extends React.PureComponent<Props, State> {
  private entryPoint: { x: number, y: number } = { x: 0, y: 0 };
  constructor(props: Props) {
    super(props);
    this.state = {
      ...defaultState,
    };
  }

  public render() {
    const { bgTranslate, veilTranslate, characterTranslate } = this.state;
    return (
      <UIContext.Consumer>
        {(uiContext: UIContext) => (
          <Container
            style={{ width: `${this.props.width > 33 ? 33 : this.props.width}%` }}
            onClick={this.onClick}
            onMouseOver={this.handleMouseOver}
            onMouseMove={this.handleMouseMove}
            onMouseLeave={this.handleMouseLeave}>
            <BackgroundWrapper className={this.props.type.name}>
              <BackgroundImage style={{ left: bgTranslate.x, top: bgTranslate.y }} />
              <ParticleBG id={'particles-' + this.props.type.name} />
              <Veil style={{ left: veilTranslate.x, top: veilTranslate.y }} />
              <SelectImage
                style={{
                  left: characterTranslate.x,
                  top: characterTranslate.y,
                  backgroundImage: `url(${this.getSelectImage(uiContext)})`,
                }}
              />
              <Clouds
                className={`${Faction[camelotunchained.game
                  .selfPlayerState.faction].toLowerCase()} ${this.props.type.name}`}
              />
            </BackgroundWrapper>
            <NameTag
              className={`name-tag ${this.props.type.name}`}
              style={{ backgroundImage: `url(${this.getNameTagImage(uiContext)})` }}>
              {this.props.type.name}
            </NameTag>
          </Container>
        )}
      </UIContext.Consumer>
    );
  }

  public componentDidMount() {
    this.initializeParticles();
  }

  private initializeParticles = () => {
    const { faction } = camelotunchained.game.selfPlayerState;
    let particleDef: any = dustParticleDef;
    switch (faction) {
      case Faction.Arthurian: {
        particleDef = dustParticleDef;
        break;
      }
      case Faction.TDD: {
        particleDef = orbsParticleDef;
        break;
      }
      case Faction.Viking: {
        particleDef = snowParticleDef;
        break;
      }
    }

    particlesJS('particles-' + this.props.type.name, particleDef);
  }

  private onClick = () => {
    this.props.onSelectType(this.props.type);
  }

  private handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    this.entryPoint = { x: e.clientX, y: e.clientY };
  }

  private handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = -(e.pageX - this.entryPoint.x);
    const y = -(e.pageY - this.entryPoint.y);
    this.setState({
      bgTranslate: { x: x * 0.05, y: y * 0.01 },
      veilTranslate: { x: x * 0.03, y: y * 0.03 },
      characterTranslate: { x: x * 0.08, y: y * 0.03 },
    });
  }

  private handleMouseLeave = () => {
    this.entryPoint = { x: 0, y: 0 };
    this.setState({ ...defaultState });
  }

  private getSelectImage = (uiContext: UIContext) => {
    const { type } = this.props;
    const { classID } = camelotunchained.game.selfPlayerState;
    const hdPrefix = uiContext.isUHD() ? 'uhd' : 'hd';

    if (classID === Archetype.Skald ||
        classID === Archetype.Minstrel ||
        classID === Archetype.DarkFool) {
      // Support classes that have no art right now. Going to use assets that look like singing :P.
      return `images/abilitybuilder/${hdPrefix}/select-shout-fianna.png`.toLowerCase();
    }

    return `images/abilitybuilder/${hdPrefix}/select-${type.name}-${Archetype[classID]}.png`.toLowerCase();
  }

  private getNameTagImage = (uiContext: UIContext) => {
    const { type } = this.props;
    const { classID } = camelotunchained.game.selfPlayerState;
    const hdPrefix = uiContext.isUHD() ? 'uhd' : 'hd';

    if (classID === Archetype.Skald ||
        classID === Archetype.Minstrel ||
        classID === Archetype.DarkFool) {
      return `images/abilitybuilder/${hdPrefix}/select-name-bg-shout.png`.toLowerCase();
    }

    return `images/abilitybuilder/${hdPrefix}/select-name-bg-${type.name}.png`.toLowerCase();
  }
}
