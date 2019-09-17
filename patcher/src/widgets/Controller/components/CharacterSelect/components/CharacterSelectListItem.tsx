/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { includes } from 'lodash';
import { styled } from '@csegames/linaria/react';
import { getCharImage } from '../../../../../lib/characterImages';
import { SimpleCharacter, Race, Gender, Archetype } from 'gql/interfaces';

const goldenColor = 'rgba(192, 173, 124, 0.4)';

const activeItem = `
  filter: brightness(150%);
  left: 28px;
  top: -2px;
`;

const Container = styled.div`
  position: relative;
  display: block;
  cursor: pointer;
  color: white;
  font-family: "Caudex";
  font-size: 13px;
  width: 255px;
  padding: 8px 0 12px 90px;
  margin-left: -10px;
  left: 35px;
  top: 0;
  background: url(/ui/images/controller/character-select-bg.png) no-repeat;
  transition: all ease .1s;
  filter: brightness(50%);
  &.activeItem {
    ${activeItem}
  }
  &:hover {
    ${activeItem}
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
      -webkit-animation: activeShine 2s ease;
      animation: activeShine 2s ease;
      -webkit-clip-path: polygon(5% 0%, 100% 0%, 90% 100%, 0% 100%);
      clip-path: polygon(5% 0%, 100% 0%, 90% 100%, 0% 100%);
    }
  }

  @keyframes activeShine {
    from {
      opacity: 1;
      left: 15px;
    }
    to {
      opacity: 0;
      left: 30%;
    }
  }
`;

const CharacterMetaData = styled.div`
  color: #b0917d;
  font-family: "Titillium Web";
  font-size: 12px;
`;

const CharacterName = styled.div`
`;

const ClassMask = `
  -webkit-mask: url(/ui/images/controller/character-profile-mask.png) no-repeat;
  -webkit-mask-size: 95% 100%;
`;

const Class = styled.div`
  display: block;
  position: absolute;
  background-size: 340%;
  background-position: 50% 20%;
  width: 120px;
  height: 70px;
  bottom: 5px;
  left: -40px;
  ${ClassMask}
`;

const ValkyrieWintersShadowClass = styled.div`
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

const TDDHumanArcherClass = styled.div`
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

const LuchorpanArcherClass = styled.div`
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

const LuchorpanClass = styled.div`
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

const WaveWeaverClass = styled.div`
  display: block
  position: absolute;
  background-size: 340%;
  background-position: 50% 42%;
  width: 120px;
  height: 70px;
  bottom: 5px;
  left: -40px;
  ${ClassMask}
`;

const MinstrelClass = styled.div`
  display: block
  position: absolute;
  background-size: 340%;
  background-position: 45% 37%;
  width: 120px;
  height: 70px;
  bottom: 5px;
  left: -40px;
  ${ClassMask}
`;

const DruidClass = styled.div`
  display: block
  position: absolute;
  background-size: 340%;
  background-position: 50% 25%;
  width: 120px;
  height: 70px;
  bottom: 5px;
  left: -40px;
  ${ClassMask}
`;

const DeleteButton = styled.div`
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
  background: url(/ui/images/controller/delete.png) no-repeat;
  opacity: .5;
  cursor: pointer;
  z-index: 10;
  &:hover {
    opacity: 1;
  }
`;

export interface CharacterSelectListItemProps {
  character: SimpleCharacter;
  selected: boolean;
  charSelectVisible: boolean;
  onCharacterSelect: (character: SimpleCharacter) => void;
  onChooseCharacter: (character: SimpleCharacter) => void;
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
    const race = includes(Race[character.race].toLowerCase(), 'human') ? 'Human' :
      Race[character.race];

    const charIdentifier = `${race}${Gender[character.gender]}${Archetype[character.archetype]}`;
    const classImg = getCharImage(character);
    return (
        <Container
          onClick={this.onClick}
          onMouseEnter={this.onMouseEnter}
          className={this.props.selected ? 'activeItem' : ''}
          style={{
            pointerEvents: this.props.charSelectVisible ? 'all' : 'none',
            marginTop: !this.props.marginTop ? '10px' : this.props.marginTop,
            marginBottom: !this.props.marginBottom ? '0px' : this.props.marginBottom,
          }}>
          {this.renderCharImg(charIdentifier, classImg)}
          <CharacterName
            style={{
              fontSize: this.state.fontSize,
              paddingTop: this.state.fontSize === 12 ? '6px' : 0,
            }}>
            {character.name}
          </CharacterName>
          <CharacterMetaData>{Archetype[character.archetype]} - {character.race}</CharacterMetaData>
          <DeleteButton
            style={{ pointerEvents: this.props.charSelectVisible ? 'all' : 'none' }}
            onClick={this.toggleDeleteModal}>
            X
          </DeleteButton>
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
    game.trigger('play-sound', 'select-change');
  }

  private onClick = () => {
    this.props.onChooseCharacter(this.props.character);
  }

  private toggleDeleteModal = (e?: React.MouseEvent<HTMLDivElement>) => {
    if (e) e.stopPropagation();
    game.trigger('character-select-show-delete');
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


      case 'HumanMaleWaveWeaver':
      case 'HumanFemaleWaveWeaver':
      case 'ValkyrieMaleWaveWeaver':
      case 'ValkyrieFemaleWaveWeaver': {
        return <WaveWeaverClass style={{ backgroundImage: `url(${classImg})` }} />;
      }

      case 'HumanMaleMinstrel':
      case 'HumanFemaleMinstrel':
      case 'PictMaleMinstrel':
      case 'PictFemaleMinstrel': {
        return <MinstrelClass style={{ backgroundImage: `url(${classImg})` }} />;
      }

      case 'HumanMaleDruid':
      case 'HumanFemaleDruid':
      case 'LuchorpanMaleDruid':
      case 'LuchorpanFemaleDruid': {
        return <DruidClass style={{ backgroundImage: `url(${classImg})` }} />;
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
