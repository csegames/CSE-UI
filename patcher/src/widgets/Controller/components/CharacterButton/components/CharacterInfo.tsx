/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled, { keyframes, css } from 'react-emotion';
import { Gender, Archetype, Race, webAPI } from 'camelot-unchained';

import CharacterImages, { shouldFlipCharImage } from '../../../../../lib/characterImages';
import { PatcherServer } from '../../../services/session/controller';

const shine = keyframes`
  0%, 80% {
    width: 0%;
    opacity: 1;
  }
  100% {
    width: 100%;
    opacity: 0;
  }
`;


const Container = styled('div')`
  position: relative;
  height: 92px;
  width: 500px;
  display: flex;
  margin-left: -95px;
  transition: left .2s cubic-bezier(0.93, 0.02, 1, 1.01);
  z-index: 2;
  bottom: 4px;
  &:hover .character-button-char-pic {
    -webkit-filter: ${props => props.mouseOverPic ? 'brightness(150%) !important' : '' };
  }
`;

const CharPic = styled('div')`
  position: relative;
  display: block;
  height: 103px;
  width: 222px;
  background: url(images/controller/character-face-spot.png) no-repeat;
  background-size: contain;
  z-index: 2;
  -webkit-clip-path: polygon(0% 0%, 100% 0%, 57% 100%, 0% 100%);
  transition: -webkit-filter 0.8s ease;
  cursor: ${props => props.mouseOverPic ? 'pointer' : 'default'};
  &:hover {
    -webkit-filter: ${props => props.mouseOverPic ? 'brightness(150%)' : 'brightness(100%)'};
  }
  &:hover + .character-button-char-mask {
    -webkit-filter: brightness(150%);
    &:after {
      opacity: 1;
    }
  }
  &:hover ~ .block-area {
    z-index: 0;
  }
  &:before {
    position:absolute;
    content:"";
    background: url(${props => props.image});
    display:block;
    background-size: ${props => props.maleLuchorpan ? '245%' : '280%'};
    background-position: ${props => props.maleLuchorpan ? '48% 20%' : '50% 20%'};
    transform: ${props => props.flipImage ? 'scale(-1, 1)' : 'none'};
    width: 200px;
    height: 100px;
  }
  &:after {
    content: "";
    position: absolute;
    -webkit-mask-image: url(images/controller/character-face-spot.png);
    -webkit-mask-size: cover;
    width: 0%;
    height: 100%;
    background: linear-gradient(to right, transparent 55%, rgba(255,255,255,0.4));
    -webkit-animation: ${props => !props.mouseOverPic ? `${shine} 7s ease infinite` : ''};
    animation: ${props => !props.mouseOverPic ? `${shine} 7s ease infinite` : ''};
  }
`;

const HoverArea = styled('div')`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  -webkit-clip-path: polygon(40% 0%, 100% 0%, 55% 100%, 0% 100%);
`;

const CharMask = styled('div')`
  position: absolute;
  left: 105px;
  height: 103px;
  width: ${props => props.mouseOverPic ? 405 : 0}px;
  cursor: pointer;
  background: url(images/controller/character-info-spot.png);
  background-size: cover;
  transition: width .2s cubic-bezier(0.93, 0.02, 1, 1.01), -webkit-filter 1s ease;
  overflow: hidden;
  &:hover {
    -webkit-filter: brightness(150%);
    &:after {
      opacity: 1;
    }
  }
  &:hover .character-button-info {
    opacity: 1;
  }
  &:before {
    content:"";
    position:absolute;
    background: url(${props => props.image});
    display:block;
    background-size: ${props => props.maleLuchorpan ? '245%' : '280%'};
    background-position: ${props => props.maleLuchorpan ? '48% 20%' : '50% 20%'};
    transform: ${props => props.flipImage ? 'scale(-1, 1)' : 'none'};
    width: 200px;
    height: 100px;
    left: -107px;
  }
  &:after {
    content: "";
    transition: opacity 1s linear;
    transition-delay: 0.5s;
    opacity: 0;
    position: absolute;
    background: url(images/controller/slideout-icon.png) no-repeat;
    width: 50px;
    height: 50px;
    right: 20px;
    top: 15px;
  }
`;

const InitialCharMaskAnim = css`
  
`;

const InfoContainer = styled('div')`
  opacity: ${props => props.mouseOverPic ? 1 : 0};
  background-size: 280%;
  background-position: 52% 23%;
  transition: opacity 1s ease;
`;

const CharacterInfoContainer = styled('div')`
  
`;

const CharacterName = styled('div')`
  position: relative;
  font-family: "Caudex";
  font-size: ${props => props.longName ? '12px' : '16px'};
  font-weight: normal;
  padding: ${props => props.padding ? props.padding : '10px 0px 0px 120px'};
  color: white;
  white-space: nowrap;
`;

const CharacterMetaInfo = styled('div')`
  font-family: "Titillium Web";
  font-size: 12px;
  font-weight: normal;
  color: #bfa090;
  white-space: nowrap;
  pointer-events: none;
`;

const ServerActiveIcon = styled('i')`
  color: ${props => props.color};
  margin-right: 5px;
`;

const ServerInfoContainer = styled('div')`
  font-family: "Titillium Web";
  color: white;
  font-size: 14px;
  font-weight: normal;
  padding: 15px 0 0 120px;
  white-space: nowrap;
  pointer-events: none;
`;

export interface CharacterInfoProps {
  character: webAPI.SimpleCharacter;
  selectedServer: PatcherServer;
  onNavigateToCharacterSelect: () => void;
  onCharacterInfoOpen: () => void;
  onCharacterInfoClose: () => void;
  isOpen: boolean;
}

export interface CharacterInfoState {
  initial: boolean;
}

class CharacterInfo extends React.Component<CharacterInfoProps, CharacterInfoState> {
  private initialTimeout: any;  
  private onMouseLeaveTimeout: any;

  constructor(props: CharacterInfoProps) {
    super(props);
    this.state = {
      initial: true,
    };
  }

  public render() {
    const { character, selectedServer, onNavigateToCharacterSelect } = this.props;

    if (character) {
      const isLongName = character.name.length > 17;
      let flipImage = false;
      if (shouldFlipCharImage(character)) {
        flipImage = true;
      }

      return (
        <Container
          className='character-button-char-container'
          onClick={onNavigateToCharacterSelect}
          mouseOverPic={this.props.isOpen}
        >
          <CharPic
            className='character-button-char-pic'
            mouseOverPic={this.props.isOpen}
            flipImage={flipImage}
            image={CharacterImages[`${Race[character.race]}${Gender[character.gender]}`]}
            maleLuchorpan={character.race === Race.Luchorpan && character.gender === Gender.Male}
            onMouseOver={this.props.isOpen ? this.onMouseOver : () => {}}
            onMouseLeave={this.props.isOpen ? this.onMouseLeave : () => {}}>
            <HoverArea
              onMouseOver={this.onMouseOver}
              onMouseLeave={this.onMouseLeave}
            />
          </CharPic>
          <CharMask
            mouseOverPic={this.props.isOpen}
            onMouseOver={this.onMouseOver}
            onMouseLeave={this.onMouseLeave}
            image={CharacterImages[`${Race[character.race]}${Gender[character.gender]}`]}
            maleLuchorpan={character.race === Race.Luchorpan && character.gender === Gender.Male}
            flipImage={flipImage}
            className={(this.state.initial ? InitialCharMaskAnim : '') + ' character-button-char-mask'}>
            <InfoContainer className='character-button-info' mouseOverPic={this.props.isOpen}>
              <CharacterInfoContainer>
                <CharacterName longName={isLongName}>
                  {character.name}
                  <CharacterMetaInfo>{Archetype[character.archetype]} - {Race[character.race]}</CharacterMetaInfo>
                </CharacterName>
              </CharacterInfoContainer>
              {selectedServer &&
                <ServerInfoContainer longName={isLongName}>
                  <ServerActiveIcon
                    className='fa fa-power-off'
                    aria-hidden='true'
                    color={selectedServer.available ? 'green' : 'red'}>
                  </ServerActiveIcon>
                  <span>{selectedServer.name} - {webAPI.accessLevelString(selectedServer.accessLevel)}</span>
                </ServerInfoContainer>
              }
            </InfoContainer>
          </CharMask>
        </Container>
      );
    } else {
      return (
        <Container
          className='character-button-char-container'
          onClick={onNavigateToCharacterSelect}
          mouseOverPic={this.props.isOpen}>
          <CharPic
            className={'character-button-char-pic'}
            onMouseOver={this.props.isOpen ? this.onMouseOver : () => {}}
            image={'images/controller/no-character-shadow.png'}>
            <HoverArea
              onMouseOver={this.onMouseOver}
              onMouseLeave={this.onMouseLeave}
            />
          </CharPic>
          <CharMask
            className={(this.state.initial ? InitialCharMaskAnim : '') + ' character-button-char-mask'}
            mouseOverPic={this.props.isOpen}
            onMouseOver={this.onMouseOver}
            onMouseLeave={this.onMouseLeave}
            image={'images/controller/no-character-shadow.png'}>
            <InfoContainer className='character-button-info' mouseOverPic={this.props.isOpen}>
              <CharacterName padding={'17px 0px 0px 120px'}>No Character Selected</CharacterName>
            </InfoContainer>
          </CharMask>
        </Container>
      );
    }
  }

  public componentDidMount() {
    this.initialTimeout = setTimeout(() => this.setState({ initial: false }), 1000);
  }

  public componentWillUnmount() {
    clearTimeout(this.initialTimeout);
  }

  private onMouseOver = () => {
    if (this.onMouseLeaveTimeout) {
      clearTimeout(this.onMouseLeaveTimeout);
      this.onMouseLeaveTimeout = null;
    }

    this.props.onCharacterInfoOpen();
  }

  private onMouseLeave = () => {
    this.onMouseLeaveTimeout = setTimeout(() => this.props.onCharacterInfoClose(), 10);
  }
}

export default CharacterInfo;
