/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { styled } from '@csegames/linaria/react';
import { getCharImage, shouldFlipCharImage } from '../../../../../lib/characterImages';
import { PatcherServer } from '../../../ControllerContext';
import { Spinner } from '../../../../../components/Spinner';
import {
  raceString,
  archetypeString,
  SimpleCharacter,
  Gender,
  Race,
  Archetype,
  accessLevelString
} from '../../../../../api/helpers';
import { Sound, playSound } from '../../../../../lib/Sound';

declare const toastr: any;

const Container = styled.div`
  position: relative;
  height: 92px;
  width: 500px;
  display: flex;
  margin-left: -95px;
  transition: left 0.2s cubic-bezier(0.93, 0.02, 1, 1.01);
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
    background: linear-gradient(transparent, rgba(255, 255, 255, 0.2));
    clip-path: polygon(55% 0%, 100% 0%, 45% 100%, 0% 100%);
    -webkit-clip-path: polygon(55% 0%, 100% 0%, 45% 100%, 0% 100%);
    -webkit-animation: shine 0.5s ease forwards;
    animation: shine 0.5s ease forwards;
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
    background: linear-gradient(transparent, rgba(255, 255, 255, 0.2));
    clip-path: polygon(55% 0%, 100% 0%, 45% 100%, 0% 100%);
    -webkit-clip-path: polygon(55% 0%, 100% 0%, 45% 100%, 0% 100%);
    -webkit-animation: shine 0.5s ease forwards;
    animation: shine 0.5s ease forwards;
  }

  @keyframes shine {
    from {
      left: 20px;
      opacity: 1;
    }
    to {
      left: 80%;
      opacity: 0;
    }
  }
`;

const IdleShine = styled.div`
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
  background: linear-gradient(transparent, rgba(255, 255, 255, 0.2));
  clip-path: polygon(55% 0%, 100% 0%, 45% 100%, 0% 100%);
  -webkit-clip-path: polygon(55% 0%, 100% 0%, 45% 100%, 0% 100%);
  -webkit-animation: idleShine 9s ease infinite;
  animation: idleShine 9s ease infinite;

  @keyframes idleShine {
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
  }
`;

const CharPic = styled.div`
  position: relative;
  display: block;
  height: 103px;
  width: 222px;
  background: url(/ui/images/controller/character-face-spot.png) no-repeat;
  background-size: contain;
  z-index: 2;
  -webkit-clip-path: polygon(45% 0%, 100% 0%, 57% 100%, 0% 100%);
  transition: -webkit-filter 0.8s ease;
  cursor: pointer;
  &:hover ~ .block-area {
    z-index: 0;
  }
`;

const CharPicImage = styled.div`
  position: absolute;
  display: block;
  background-size: 280%;
  width: 200px;
  height: 100px;
  bottom: 0;
`;

const CharMask = styled.div`
  position: absolute;
  left: 105px;
  height: 103px;
  width: 405px;
  cursor: pointer;
  background: url(/ui/images/controller/character-info-spot.png);
  background-size: cover;
  transition: width 0.2s cubic-bezier(0.93, 0.02, 1, 1.01), -webkit-filter 1s ease;
  overflow: hidden;
  &:after {
    content: '';
    transition: opacity 1s linear;
    transition-delay: 0.5s;
    position: absolute;
    background: url(/ui/images/controller/slideout-icon.png) no-repeat;
    width: 50px;
    height: 50px;
    right: 20px;
    top: 15px;
  }
`;

const CharMaskImage = styled.div`
  position: absolute;
  display: block;
  background-size: 280%;
  -webkit-mask: url(/ui/images/controller/character-profile-selected-mask.png) no-repeat;
  -webkit-mask-size: cover;
  -webkit-mask-position-x: 51px;
  width: 200px;
  height: 100px;
  left: -107px;
  bottom: 0;
`;

const InfoContainer = styled.div`
  opacity: 1;
  background-size: 280%;
  background-position: 52% 23%;
  transition: opacity 1s ease;
`;

const CharacterName = styled.div`
  position: relative;
  font-family: 'Caudex';
  font-weight: normal;
  padding: 10px 0px 0px 120px;
  color: white;
  white-space: nowrap;
`;

const CharacterMetaInfo = styled.div`
  font-family: 'Titillium Web';
  font-size: 12px;
  font-weight: normal;
  color: #bfa090;
  white-space: nowrap;
  pointer-events: none;
`;

const ServerActiveIcon = styled.i`
  margin-right: 5px;
`;

const ServerInfoContainer = styled.div`
  display: flex;
  font-family: 'Titillium Web';
  color: white;
  font-size: 14px;
  font-weight: normal;
  padding: 8px 0 0 140px;
  white-space: nowrap;
  pointer-events: none;
`;

const ServerName = styled.div`
  margin-left: -20px;
`;

const AccessLevel = styled.div`
  margin-left: 15px;
  font-size: 12px;
  color: gray;
  white-space: normal;
  width: 130px;
`;

const SpinnerContainer = styled.div`
  position: absolute;
  right: 105px;
  top: 40px;
`;

export interface CharacterInfoProps {
  character: SimpleCharacter;
  characters: { [id: string]: SimpleCharacter };
  servers: { [id: string]: PatcherServer };
  selectedServer: PatcherServer;
  onNavigateToCharacterSelect: () => void;
  hasAccessToServers: boolean;
}

export interface CharacterInfoState {
  initial: boolean;
  isLoading: boolean;
  playAnimation: boolean;
}

class CharacterInfo extends React.Component<CharacterInfoProps, CharacterInfoState> {
  private initialTimeout: any;
  private loadingInterval: any;

  constructor(props: CharacterInfoProps) {
    super(props);
    this.state = {
      initial: true,
      isLoading: true,
      playAnimation: true
    };
  }

  public render() {
    const { character, selectedServer, onNavigateToCharacterSelect } = this.props;
    if (character) {
      const longCharacterName = character.name.length > 17;
      let flipImage = false;
      if (shouldFlipCharImage(character)) {
        flipImage = true;
      }

      const longServerName = selectedServer && selectedServer.name.length > 12;

      return (
        <Container
          className='character-button-char-container'
          onMouseEnter={this.handleMouseOver}
          onClick={onNavigateToCharacterSelect}
        >
          {this.state.playAnimation && <IdleShine />}
          <CharPic className='character-button-char-pic'>
            <CharPicImage
              style={{
                backgroundImage: `url(${getCharImage(character)})`,
                backgroundPosition:
                  character.archetype === Archetype.DarkFool
                    ? '50% 20%'
                    : character.race === Race.Luchorpan ||
                      (character.gender === Gender.Male &&
                        character.race === Race.HumanMaleT &&
                        character.archetype === Archetype.ForestStalker)
                    ? '50% 25%'
                    : character.archetype === Archetype.WintersShadow
                    ? '45% 25%'
                    : character.archetype === Archetype.WaveWeaver
                    ? '50% 42%'
                    : character.archetype === Archetype.Minstrel
                    ? '45% 37%'
                    : character.archetype === Archetype.Skald
                    ? '50% 30%'
                    : '50% 20%',
                transform: flipImage ? 'scale(-1, 1)' : 'none'
              }}
            />
          </CharPic>
          <CharMask className='character-button-char-mask'>
            <CharMaskImage
              style={{
                backgroundImage: `url(${getCharImage(character)})`,
                backgroundPosition:
                  character.archetype === Archetype.DarkFool
                    ? '50% 20%'
                    : character.race === Race.Luchorpan ||
                      (character.race === Race.HumanMaleT && character.archetype === Archetype.ForestStalker)
                    ? '50% 25%'
                    : character.archetype === Archetype.WintersShadow
                    ? '45% 25%'
                    : character.archetype === Archetype.WaveWeaver
                    ? '50% 42%'
                    : character.archetype === Archetype.Minstrel
                    ? '45% 37%'
                    : character.archetype === Archetype.Skald
                    ? '50% 30%'
                    : '50% 20%',
                transform: flipImage ? 'scale(-1, 1)' : 'none'
              }}
            />
            <InfoContainer className='character-button-info'>
              <CharacterName style={{ fontSize: longCharacterName ? '12px' : '16px' }}>
                {character.name}
                <CharacterMetaInfo>
                  {archetypeString(Archetype[character.archetype])} - {raceString(character.race)}
                </CharacterMetaInfo>
              </CharacterName>
              {selectedServer && (
                <ServerInfoContainer>
                  <ServerName style={{ fontSize: longServerName ? '12px' : '16px' }}>
                    <ServerActiveIcon
                      className='fa fa-power-off'
                      aria-hidden='true'
                      style={{ color: selectedServer.available ? 'green' : 'red' }}
                    ></ServerActiveIcon>
                    {selectedServer.name}
                    {/* <PlayerCounts shard={selectedServer.shardID} host={selectedServer.apiHost} /> */}
                  </ServerName>
                  <AccessLevel>
                    {selectedServer.accessLevel && `Accessible to ${accessLevelString(selectedServer.accessLevel)}`}
                  </AccessLevel>
                </ServerInfoContainer>
              )}
            </InfoContainer>
          </CharMask>
        </Container>
      );
    } else {
      return (
        <Container
          className='character-button-char-container'
          onClick={this.props.hasAccessToServers ? onNavigateToCharacterSelect : this.noAccessError}
        >
          <CharPic className='character-button-char-pic'>
            <CharPicImage style={{ backgroundImage: 'url(../ui/images/controller/no-character-shadow.png)' }} />
            {this.state.isLoading && (
              <SpinnerContainer>
                <Spinner />
              </SpinnerContainer>
            )}
          </CharPic>
          <CharMask className='character-button-char-mask'>
            <CharMaskImage style={{ backgroundImage: 'url(../ui/images/controller/no-character-shadow.png)' }} />
            {!this.state.isLoading && (
              <InfoContainer className='character-button-info'>
                <CharacterName>
                  {this.props.hasAccessToServers ? 'No Character Selected' : 'There are no servers available'}
                  <CharacterMetaInfo>
                    {this.props.hasAccessToServers ? 'Click to select character' : ''}
                  </CharacterMetaInfo>
                </CharacterName>
                {selectedServer && (
                  <ServerInfoContainer>
                    <ServerName>
                      <ServerActiveIcon
                        className='fa fa-power-off'
                        aria-hidden='true'
                        color={selectedServer.available ? 'green' : 'red'}
                      ></ServerActiveIcon>
                      {selectedServer.name}
                    </ServerName>
                    <AccessLevel>
                      {selectedServer.accessLevel && `Accessible to ${accessLevelString(selectedServer.accessLevel)}`}
                    </AccessLevel>
                  </ServerInfoContainer>
                )}
              </InfoContainer>
            )}
          </CharMask>
        </Container>
      );
    }
  }

  public componentDidMount() {
    this.initialTimeout = window.setTimeout(() => this.setState({ initial: false }), 1000);

    let loadingIntervalCount = 0;
    this.loadingInterval = window.setInterval(() => {
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

  private noAccessError = () => {
    toastr.error('You do not have access to any servers', 'Oh No!!', { timeOut: 5000 });
  };

  private updateAnimation = () => {
    this.setState(
      {
        playAnimation: false
      },
      () => {
        this.setState({
          playAnimation: true
        });
      }
    );
  };

  private handleMouseOver = () => {
    playSound(Sound.Select);
    this.updateAnimation();
  };
}

export default CharacterInfo;
