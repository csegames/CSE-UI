/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { webAPI } from '@csegames/camelot-unchained';
import { getMyPaperDollBG, getMyPaperDollIcon } from '../../../lib/utils';

interface ContainerProps {
  characterImage: string;
  backgroundImage: string;
  shouldZoom: boolean;
}

const Container = styled('div')`
  position: relative;
  flex: 1;
  height: 100%;
  background: url(${(props: ContainerProps) => props.backgroundImage});
  background-size: cover;
  opacity: 0.8;
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    top: -150px;
    right: -100px;
    width: 800px;
    height: 800px;
    background: url(${(props: ContainerProps) => props.characterImage});
    background-size: cover;
    -webkit-mask: linear-gradient(to right,transparent 35%, black 55%);
    -webkit-mask-size: cover;
    zoom: ${(props: ContainerProps) => props.shouldZoom ? '120%' : '100%'};
  }
`;

const Border = styled('div')`
  position: absolute;
  top: 7px;
  right: 7px;
  bottom: 7px;
  left: 7px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const TopLeftOrnament = styled('div')`
  position: absolute;
  top: 5px;
  left: 5px;
  width: 40px;
  height: 26px;
  background: url(images/character-stats/ornament-top-left-profile.png) no-repeat;
  background-size: contain;
`;

const BottomLeftOrnament = styled('div')`
  position: absolute;
  bottom: 5px;
  left: 5px;
  width: 40px;
  height: 26px;
  background: url(images/character-stats/ornament-bottom-left-profile.png) no-repeat;
  background-size: contain;
`;

const TopRightOrnament = styled('div')`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 40px;
  height: 26px;
  background: url(images/character-stats/ornament-top-right-profile.png) no-repeat;
  background-size: contain;
`;

const BottomRightOrnament = styled('div')`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 40px;
  height: 26px;
  background: url(images/character-stats/ornament-bottom-right-profile.png) no-repeat;
  background-size: contain;
`;

const Content = styled('div')`
  width: 100%;
  height: 100%;
  padding: 20px;
`;

const Name = styled('div')`
  color: white;
  font-size: 24px;
  font-family: Caudex;
`;

const InfoContainer = styled('div')`
  display: flex;
  width: 50%;
`;

const InfoDivider = styled('div')`
  position: absolute;
  left: 155px;
  height: 69px;
  width: 9px;
  background: url(images/character-stats/ornament-profile-content.png);
  background-size: contain;
`;

const CharacterInfo = styled('div')`
  margin-top: 10px;
  font-size: 14px;
  width: 175px;
  color: #CCC;
`;

// const InfoDivider = styled('div')`
//   background: url(images/character-stats/ornament-profile-content.png)
// `;

const BiographyInfo = styled('div')`
  margin-top: 10px;
  font-size: 14px;
  width: 300px;
  color: #CCC;
`;

const Text = styled('div')`
  font-family: Caudex;
`;

export interface GeneralInfoProps {
}

export interface GeneralInfoState {

}

class GeneralInfo extends React.PureComponent<GeneralInfoProps, GeneralInfoState> {
  private paperdollIcon: string;
  private paperdollBG: string;
  constructor(props: GeneralInfoProps) {
    super(props);
    this.paperdollIcon = getMyPaperDollIcon();
    this.paperdollBG = getMyPaperDollBG();
  }

  public render() {
    const shouldZoom = this.shouldZoom();
    return (
      <Container shouldZoom={shouldZoom} characterImage={this.paperdollIcon} backgroundImage={this.paperdollBG}>
        <Border />
        <TopLeftOrnament />
        <BottomLeftOrnament />
        <TopRightOrnament />
        <BottomRightOrnament />
        <Content>
          <Name>{game.selfPlayerState.name}</Name>
          <InfoContainer>
            <CharacterInfo>
              <Text>{Faction[game.selfPlayerState.faction]}</Text>
              <Text>{Gender[game.selfPlayerState.gender]} {webAPI.raceString(game.selfPlayerState.race)}</Text>
              <Text>{Archetype[game.selfPlayerState.class]}</Text>
            </CharacterInfo>
            <InfoDivider />
            <BiographyInfo>
              <Text>
                Biography coming soon... Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation
              </Text>
            </BiographyInfo>
          </InfoContainer>
        </Content>
      </Container>
    );
  }

  private shouldZoom = () => {
    const race = game.selfPlayerState.race;
    const archetype = game.selfPlayerState.class;

    if (race === Race.Luchorpan || archetype === Archetype.WintersShadow) {
      return false;
    }

    return true;
  }
}

export default GeneralInfo;
