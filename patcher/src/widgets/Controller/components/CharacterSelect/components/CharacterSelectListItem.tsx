/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { includes } from 'lodash';
import { webAPI, Race, Gender, Archetype, events } from '@csegames/camelot-unchained';
import styled, { css, keyframes } from 'react-emotion';
import { getCharImage } from '../../../../../lib/characterImages';

const goldenColor = 'rgba(192, 173, 124, 0.4)';

const activeShine = keyframes`
  from {
    opacity: 1;
    left: 15px;
  }

  to {
    opacity: 0;
    left: 30%;
  }
`;

const activeItem = css`
  filter: brightness(150%);
  left: 28px;
  top: -2px;
`;

const Container = styled('div')`
  position: relative;
  display: block;
  pointer-events: ${(props: any) => props.visible ? 'all' : 'none'};
  cursor: pointer;
  color: white;
  font-family: "Caudex";
  font-size: 13px;
  width: 255px;
  padding: 8px 0 12px 90px;
  margin-top: ${(props: any) => props.marginTop};
  margin-bottom: ${(props: any) => props.marginBottom};
  margin-left: -10px;
  left: 35px;
  top: 0;
  background: url(images/controller/character-select-bg.png) no-repeat;
  transition: all ease .1s;
  filter: brightness(50%);
  &:hover {
    ${activeItem};
    &:before {
      content: "";
      position: absolute;
      height: 90%;
      width: 70%;
      border-left-radius: 50%;
      background: linear-gradient(to right, transparent, ${goldenColor}, transparent);
      bottom: 5px;
      left: 15px;
      opacity: 0;
      -webkit-animation: ${activeShine} 2s ease;
      animation: ${activeShine} 2s ease;
      -webkit-clip-path: polygon(5% 0%, 100% 0%, 90% 100%, 0% 100%);
      clip-path: polygon(5% 0%, 100% 0%, 90% 100%, 0% 100%);
    }
  }
`;

const CharacterMetaData = styled('div')`
  color: #b0917d;
  font-family: "Titillium Web";
  font-size: 12px;
`;

const CharacterName = styled('div')`
  padding-top: ${(props: any) => props.fontSize === 12 ? '6px' : 0};
  font-size: ${(props: any) => props.fontSize}px;
`;

const ClassMask = css`
  -webkit-mask: url(images/controller/character-profile-mask.png) no-repeat;
  -webkit-mask-size: 95% 100%;
`;

const Class = styled('div')`
  transform: ${(props: any) => props.flipImage ? 'scale(-1, 1)' : 'none'};
  display: block;
  position: absolute;
  background-size: 340%;
  background-position: 50% 20%;
  width: 120px;
  height: 70px;
  bottom: 5px;
  left: ${(props: any) => props.left ? props.left : -40}px;
  ${ClassMask}
`;

const ValkyrieWintersShadowClass = styled('div')`
  transform: scale(-1, 1);
  display: block;
  position: absolute;
  background-size: 295%;
  background-position: 45% 24%;
  width: 120px;
  height: 70px;
  bottom: 5px;
  left: -40px;
  ${ClassMask}
`;

const TDDHumanArcherClass = styled('div')`
  transform: none;
  display: block;
  position: absolute;
  background-size: 340%;
  background-position: 50% 18%;
  width: 120px;
  height: 70px;
  bottom: 5px;
  left: -40px;
  ${ClassMask}
`;

const LuchorpanArcherClass = styled('div')`
  display: block;
  position: absolute;
  background-size: 340%;
  background-position: 50% 23%;
  width: 100px;
  height: 70px;
  bottom: 5px;
  left: -35px;
  ${ClassMask}
`;

const LuchorpanClass = styled('div')`
  display: block;
  position: absolute;
  background-size: 340%;
  background-position: 50% 25%;
  width: 100px;
  height: 70px;
  bottom: 5px;
  left: -35px;
  ${ClassMask}
`;

const DeleteButton = styled('div')`
  display: block;
  position: absolute;
  font-size: 12px;
  bottom: 5px;
  right: 15px;
  padding: 2px 5px;
  height: 14px;
  width: 35px;
  text-align: center;
  color: #ffe0c7;
  background: url(images/controller/delete.png) no-repeat;
  opacity: .5;
  pointer-events: ${(props: any) => props.visible ? 'all' : 'none'};
  cursor: pointer;
  z-index: 10;
  &:hover {
    opacity: 1;
  }
`;

export interface CharacterSelectListItemProps {
  character: webAPI.SimpleCharacter;
  selected: boolean;
  charSelectVisible: boolean;
  onCharacterSelect: (character: webAPI.SimpleCharacter) => void;
  onChooseCharacter: (character: webAPI.SimpleCharacter) => void;
  marginTop?: string;
  marginBottom?: string;
}

export interface CharacterSelectListItemState {
  fontSize: number;
}

class CharacterSelectListItem extends React.Component<CharacterSelectListItemProps, CharacterSelectListItemState> {
  constructor(props: CharacterSelectListItemProps) {
    super(props);
    this.state = {
      fontSize: 16,
    };
  }
  public render() {
    const { character } = this.props;
    const race = includes(Race[character.race].toLowerCase(), 'human') ? webAPI.raceString(character.race) :
      Race[character.race];

    const charIdentifier = `${race}${Gender[character.gender]}${Archetype[character.archetype]}`;
    const classImg = getCharImage(character);
    return (
        <Container
          onClick={this.onClick}
          onMouseEnter={this.onMouseEnter}
          backgroundColor={this.props.selected ? 'white' : 'transparent'}
          marginTop={!this.props.marginTop ? '10px' : this.props.marginTop}
          marginBottom={!this.props.marginBottom ? '0px' : this.props.marginBottom}
          className={this.props.selected ? activeItem : ''}
          visible={this.props.charSelectVisible}>
          {this.renderCharImg(charIdentifier, classImg)}
          <CharacterName fontSize={this.state.fontSize}>
            {character.name}
          </CharacterName>
          <CharacterMetaData>{Archetype[character.archetype]} - {webAPI.raceString(character.race)}</CharacterMetaData>
          <DeleteButton visible={this.props.charSelectVisible} onClick={this.toggleDeleteModal}>X</DeleteButton>
        </Container>
    );
  }

  public componentDidMount() {
    if (this.props.character.name.length > 17) {
      this.setState({ fontSize: 12 });
    }
  }

  private onMouseEnter = () => {
    this.props.onCharacterSelect(this.props.character);
    events.fire('play-sound', 'select-change');
  }

  private onClick = () => {
    this.props.onChooseCharacter(this.props.character);
  }

  private toggleDeleteModal = (e?: React.MouseEvent<HTMLDivElement>) => {
    if (e) e.stopPropagation();
    events.fire('character-select-show-delete');
  }

  private renderCharImg = (charIdentifier: string, classImg: string) => {
    switch (charIdentifier) {
      case 'HumanMaleForestStalker':
      case 'LuchorpanMaleForestStalker':
      case 'LuchorpanFemaleForestStalker': {
        return (
          <LuchorpanArcherClass
            style={{
              backgroundImage: `url(${classImg})`,
              transform: 'scale(-1, 1)',
              backgroundSize: charIdentifier === 'LuchorpanMaleForestStalker' ? '290%' : '340%',
            }}
          />
        );
      }

      case 'LuchorpanMaleEmpath':
      case 'LuchorpanFemaleEmpath':
      case 'LuchorpanMaleFianna':
      case 'LuchorpanFemaleFianna': {
        const shouldFlip = includes(charIdentifier, 'Empath');
        return (
          <LuchorpanClass
            style={{ backgroundImage: `url(${classImg})`, transform: shouldFlip ? 'scale(-1, 1)' : 'none' }}
          />
        );
      }

      case 'HumanFemaleForestStalker': {
        return <TDDHumanArcherClass style={{ backgroundImage: `url(${classImg})`, transform: 'scale(-1, 1)' }} />;
      }

      case 'ValkyrieMaleWintersShadow':
      case 'ValkyrieFemaleWintersShadow':
      case 'HumanMaleWintersShadow':
      case 'HumanFemaleWintersShadow': {
        return (
          <ValkyrieWintersShadowClass style={{ backgroundImage: `url(${classImg})`, transform: 'scale(-1, 1)' }} />
        );
      }

      case 'HumanMaleEmpath':
      case 'HumanFemaleEmpath':
      case 'HumanMalePhysician':
      case 'HumanFemalePhysician':
      case 'PictMalePhysician':
      case 'PictFemalePhysician':
      case 'HumanFemaleBlackguard':
      case 'PictMaleBlackguard':
      case 'PictFemaleBlackguard':
      case 'HumanMaleStonehealer':
      case 'ValkyrieMaleStonehealer':
      case 'ValkyrieFemaleStonehealer': {
        return <Class style={{ backgroundImage: `url(${classImg})`, transform: 'scale(-1, 1)' }} />;
      }

      default: {
        return (
          <Class
            style={{
              backgroundImage: `url(${classImg})`,
              backgroundSize: charIdentifier === 'HumanMaleMjolnir' ? '400%' : '340%',
            }}
          />
        );
      }
    }
  }
}

export default CharacterSelectListItem;
