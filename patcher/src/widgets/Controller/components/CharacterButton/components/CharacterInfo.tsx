/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled, { keyframes } from 'react-emotion';
import { events, webAPI, Gender, Archetype, Race, Spinner } from '@csegames/camelot-unchained';

import CharacterImages, { shouldFlipCharImage } from '../../../../../lib/characterImages';
import { PatcherServer } from '../../../services/session/controller';

import PlayerCounts from './PlayerCounts';

declare const toastr: any;

const shine = keyframes`
  from {
    left: 20px;
    opacity: 1;
  }
  to {
    left: 80%;
    opacity: 0;
  }
`;

const idleShine = keyframes`
  0% {
    left: 20px;
    opacity: 0;
  }
  90% {
    left: 20px;
    opacity: 0;
  }
  91% {
    opacity: 1;
  }
  100% {
    left: 80%;
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
  transition: -webkit-filter 0.3s ease;
  &:hover {
    -webkit-filter: brightness(150%);
  }

  &:hover:before {
    content: '';
    pointer-events: none;
    opacity: 0;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -10px;
    opacity: 0;
    height: 110%;
    width: 90px;
    z-index: 10;
    background: linear-gradient(transparent, rgba(255,255,255,0.2));
    clip-path: polygon(55% 0%, 100% 0%, 45% 100%, 0% 100%);
    -webkit-clip-path: polygon(55% 0%, 100% 0%, 45% 100%, 0% 100%);
    -webkit-animation: ${shine} 0.5s ease forwards;
    animation: ${shine} 0.5s ease forwards;
    animation-delay: 0.3s;
    -webkit-animation-delay: 0.3s;
  }

  &:hover:after {
    content: '';
    pointer-events: none;
    opacity: 0;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -10px;
    opacity: 0;
    height: 110%;
    width: 90px;
    z-index: 10;
    background: linear-gradient(transparent, rgba(255,255,255,0.2));
    clip-path: polygon(55% 0%, 100% 0%, 45% 100%, 0% 100%);
    -webkit-clip-path: polygon(55% 0%, 100% 0%, 45% 100%, 0% 100%);
    -webkit-animation: ${shine} 0.5s ease forwards;
    animation: ${shine} 0.5s ease forwards;
  }
`;

const IdleShine = styled('div')`
  pointer-events: none;
  opacity: 0;
  position: absolute;
  left: 0;
  right: 0;
  bottom: -10px;
  opacity: 0;
  height: 110%;
  width: 90px;
  z-index: 10;
  background: linear-gradient(transparent, rgba(255,255,255,0.2));
  clip-path: polygon(55% 0%, 100% 0%, 45% 100%, 0% 100%);
  -webkit-clip-path: polygon(55% 0%, 100% 0%, 45% 100%, 0% 100%);
  -webkit-animation: ${idleShine} 9s ease infinite;
  animation: ${idleShine} 9s ease infinite;
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
  cursor: pointer;
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
`;

const CharMask = styled('div')`
  position: absolute;
  left: 105px;
  height: 103px;
  width: 405px;
  cursor: pointer;
  background: url(images/controller/character-info-spot.png);
  background-size: cover;
  transition: width .2s cubic-bezier(0.93, 0.02, 1, 1.01), -webkit-filter 1s ease;
  overflow: hidden;
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
    position: absolute;
    background: url(images/controller/slideout-icon.png) no-repeat;
    width: 50px;
    height: 50px;
    right: 20px;
    top: 15px;
  }
`;

const InfoContainer = styled('div')`
  opacity: 1;
  background-size: 280%;
  background-position: 52% 23%;
  transition: opacity 1s ease;
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
  padding: ${props => props.padding ? props.padding : '8px 0 0 120px'};
  white-space: nowrap;
  pointer-events: none;
`;

const ServerName = styled('div')`
  display: inline;
  margin-left: -20px;
`;

const AccessLevel = styled('div')`
  display: inline;
  margin-left: 30px;
  font-size: 12px;
  color: gray;
`;

const SpinnerContainer = styled('div')`
  position: absolute;
  right: 105px;
  top: 40px;
`;

export interface CharacterInfoProps {
  character: webAPI.SimpleCharacter;
  characters: {[id: string]: webAPI.SimpleCharacter};
  servers: {[id: string]: PatcherServer};
  selectedServer: PatcherServer;
  onNavigateToCharacterSelect: () => void;
  hasAccessToServers: boolean;
}

export interface CharacterInfoState {
  initial: boolean;
  isLoading: boolean;
}

class CharacterInfo extends React.Component<CharacterInfoProps, CharacterInfoState> {
  private initialTimeout: any;
  private loadingInterval: any;

  constructor(props: CharacterInfoProps) {
    super(props);
    this.state = {
      initial: true,
      isLoading: true,
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
          onMouseEnter={this.playSound}
          onClick={onNavigateToCharacterSelect}
        >
          <IdleShine />
          <CharPic
            className='character-button-char-pic'
            flipImage={flipImage}
            image={CharacterImages[`${Race[character.race]}${Gender[character.gender]}`]}
            maleLuchorpan={character.race === Race.Luchorpan && character.gender === Gender.Male}>
          </CharPic>
          <CharMask
            image={CharacterImages[`${Race[character.race]}${Gender[character.gender]}`]}
            maleLuchorpan={character.race === Race.Luchorpan && character.gender === Gender.Male}
            flipImage={flipImage}
            className='character-button-char-mask'>
            <InfoContainer className='character-button-info'>
              <CharacterName longName={isLongName}>
                {character.name}
                <CharacterMetaInfo>
                  {Archetype[character.archetype]} - {webAPI.raceString(character.race)}
                </CharacterMetaInfo>
              </CharacterName>
              {selectedServer &&
                <ServerInfoContainer longName={isLongName}>
                  <ServerName>
                    <ServerActiveIcon
                      className='fa fa-power-off'
                      aria-hidden='true'
                      color={selectedServer.available ? 'green' : 'red'}>
                    </ServerActiveIcon>
                    {selectedServer.name}
                  </ServerName>
                  <AccessLevel>
                    {selectedServer.accessLevel && `Accessible to ${webAPI.accessLevelString(selectedServer.accessLevel)}`}
                  </AccessLevel>
                  <PlayerCounts server={selectedServer.name} />
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
          onClick={this.props.hasAccessToServers ? onNavigateToCharacterSelect : this.noAccessError}>
          <CharPic
            className='character-button-char-pic'
            image={'images/controller/no-character-shadow.png'}>
            {this.state.isLoading && <SpinnerContainer><Spinner /></SpinnerContainer>}
          </CharPic>
          <CharMask
            className='character-button-char-mask'
            image={'images/controller/no-character-shadow.png'}>
            {!this.state.isLoading &&
              <InfoContainer className='character-button-info'>
                <CharacterName>
                  {this.props.hasAccessToServers ? 'No Character Selected' : 'There are no servers available'}
                  {this.props.hasAccessToServers && <CharacterMetaInfo>Click to select character</CharacterMetaInfo>}
                </CharacterName>
                {selectedServer &&
                  <ServerInfoContainer>
                    <ServerName>
                      <ServerActiveIcon
                        className='fa fa-power-off'
                        aria-hidden='true'
                        color={selectedServer.available ? 'green' : 'red'}>
                      </ServerActiveIcon>
                      {selectedServer.name}
                    </ServerName>
                    <PlayerCounts server={selectedServer.name} />
                    <AccessLevel>
                      {selectedServer.accessLevel && `Accessible to ${webAPI.accessLevelString(selectedServer.accessLevel)}`}
                    </AccessLevel>
                  </ServerInfoContainer>
                }
              </InfoContainer>
            }
          </CharMask>
        </Container>
      );
    }
  }

  public componentDidMount() {
    this.initialTimeout = setTimeout(() => this.setState({ initial: false }), 1000);

    let loadingIntervalCount = 0;
    this.loadingInterval = setInterval(() => {
      if (this.props.character) {
        this.setState({ isLoading: false });
        clearInterval(this.loadingInterval);
      } else {
        if (loadingIntervalCount < 10 && _.isEmpty(this.props.servers)) {
          loadingIntervalCount++;
        } else {
          clearInterval(this.loadingInterval);
          this.setState({ isLoading: false });
        }
      }
    }, 500);
  }

  public componentWillUnmount() {
    clearTimeout(this.initialTimeout);
  }

  private playSound = () => {
    events.fire('play-sound', 'select-change');
  }

  private noAccessError = () => {
    toastr.error('You do not have access to any servers', 'Oh No!!', {timeOut: 5000});
  }
}

export default CharacterInfo;
