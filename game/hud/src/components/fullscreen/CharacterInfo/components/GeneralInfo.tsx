/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { webAPI } from '@csegames/camelot-unchained';
import { getMyPaperDollBG, getMyPaperDollIcon } from 'fullscreen/lib/utils';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const Container = styled.div`
  position: relative;
  flex: 1;
  height: 100%;
  background-size: cover;
  opacity: 0.8;
  overflow: hidden;
`;

// #region CharacterImage constants
const CHARACTER_IMAGE_TOP = -300;
const CHARACTER_IMAGE_RIGHT = -200;
const CHARACTER_IMAGE_DIMENSIONS = 1600;
// #endregion
const CharacterImage = styled.div`
  position: absolute;
  top: ${CHARACTER_IMAGE_TOP}px;
  right: ${CHARACTER_IMAGE_RIGHT}px;
  width: ${CHARACTER_IMAGE_DIMENSIONS}px;
  height: ${CHARACTER_IMAGE_DIMENSIONS}px;
  background-size: cover;
  -webkit-mask: linear-gradient(to right,transparent 35%, black 55%);
  -webkit-mask-size: cover;
  zoom: ${(props: any) => props.shouldZoom ? '120%' : '100%'};

  @media (max-width: 2560px) {
    top: ${CHARACTER_IMAGE_TOP * MID_SCALE}px;
    right: ${CHARACTER_IMAGE_RIGHT * MID_SCALE}px;
    width: ${CHARACTER_IMAGE_DIMENSIONS * MID_SCALE}px;
    height: ${CHARACTER_IMAGE_DIMENSIONS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${CHARACTER_IMAGE_TOP * HD_SCALE}px;
    right: ${CHARACTER_IMAGE_RIGHT * HD_SCALE}px;
    width: ${CHARACTER_IMAGE_DIMENSIONS * HD_SCALE}px;
    height: ${CHARACTER_IMAGE_DIMENSIONS * HD_SCALE}px;
  }
`;

// #region Border constants
const BORDER_ALIGNMENT = 14;
// #endregion
const Border = styled.div`
  position: absolute;
  top: ${BORDER_ALIGNMENT}px;
  right: ${BORDER_ALIGNMENT}px;
  bottom: ${BORDER_ALIGNMENT}px;
  left: ${BORDER_ALIGNMENT}px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 2560px) {
    top: ${BORDER_ALIGNMENT * MID_SCALE}px;
    right: ${BORDER_ALIGNMENT * MID_SCALE}px;
    bottom: ${BORDER_ALIGNMENT * MID_SCALE}px;
    left: ${BORDER_ALIGNMENT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${BORDER_ALIGNMENT * HD_SCALE}px;
    right: ${BORDER_ALIGNMENT * HD_SCALE}px;
    bottom: ${BORDER_ALIGNMENT * HD_SCALE}px;
    left: ${BORDER_ALIGNMENT * HD_SCALE}px;
  }
`;

// #region Ornament constants
const ORNAMENT_ALIGNMENT = 10;
const ORNAMENT_WIDTH = 80;
const ORNAMENT_HEIGHT = 52;
// #endregion
const TopLeftOrnament = styled.div`
  position: absolute;
  top: ${ORNAMENT_ALIGNMENT}px;
  left: ${ORNAMENT_ALIGNMENT}px;
  width: ${ORNAMENT_WIDTH}px;
  height: ${ORNAMENT_HEIGHT}px;
  background: url(../images/character-stats/ornament-top-left-profile.png) no-repeat;
  background-size: contain;

  @media (max-width: 2560px) {
    top: ${ORNAMENT_ALIGNMENT * MID_SCALE}px;
    left: ${ORNAMENT_ALIGNMENT * MID_SCALE}px;
    width: ${ORNAMENT_WIDTH * MID_SCALE}px;
    height: ${ORNAMENT_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${ORNAMENT_ALIGNMENT * HD_SCALE}px;
    left: ${ORNAMENT_ALIGNMENT * HD_SCALE}px;
    width: ${ORNAMENT_WIDTH * HD_SCALE}px;
    height: ${ORNAMENT_HEIGHT * HD_SCALE}px;
  }
`;

const BottomLeftOrnament = styled.div`
  position: absolute;
  bottom: ${ORNAMENT_ALIGNMENT}px;
  left: ${ORNAMENT_ALIGNMENT}px;
  width: ${ORNAMENT_WIDTH}px;
  height: ${ORNAMENT_HEIGHT}px;
  background: url(../images/character-stats/ornament-bottom-left-profile.png) no-repeat;
  background-size: contain;

  @media (max-width: 2560px) {
    bottom: ${ORNAMENT_ALIGNMENT * MID_SCALE}px;
    left: ${ORNAMENT_ALIGNMENT * MID_SCALE}px;
    width: ${ORNAMENT_WIDTH * MID_SCALE}px;
    height: ${ORNAMENT_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    bottom: ${ORNAMENT_ALIGNMENT * HD_SCALE}px;
    left: ${ORNAMENT_ALIGNMENT * HD_SCALE}px;
    width: ${ORNAMENT_WIDTH * HD_SCALE}px;
    height: ${ORNAMENT_HEIGHT * HD_SCALE}px;
  }
`;

const TopRightOrnament = styled.div`
  position: absolute;
  top: ${ORNAMENT_ALIGNMENT}px;
  right: ${ORNAMENT_ALIGNMENT}px;
  width: ${ORNAMENT_WIDTH}px;
  height: ${ORNAMENT_HEIGHT}px;
  background: url(../images/character-stats/ornament-top-right-profile.png) no-repeat;
  background-size: contain;

  @media (max-width: 2560px) {
    top: ${ORNAMENT_ALIGNMENT * MID_SCALE}px;
    right: ${ORNAMENT_ALIGNMENT * MID_SCALE}px;
    width: ${ORNAMENT_WIDTH * MID_SCALE}px;
    height: ${ORNAMENT_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${ORNAMENT_ALIGNMENT * HD_SCALE}px;
    right: ${ORNAMENT_ALIGNMENT * HD_SCALE}px;
    width: ${ORNAMENT_WIDTH * HD_SCALE}px;
    height: ${ORNAMENT_HEIGHT * HD_SCALE}px;
  }
`;

const BottomRightOrnament = styled.div`
  position: absolute;
  bottom: ${ORNAMENT_ALIGNMENT}px;
  right: ${ORNAMENT_ALIGNMENT}px;
  width: ${ORNAMENT_WIDTH}px;
  height: ${ORNAMENT_HEIGHT}px;
  background: url(../images/character-stats/ornament-bottom-right-profile.png) no-repeat;
  background-size: contain;

  @media (max-width: 2560px) {
    bottom: ${ORNAMENT_ALIGNMENT * MID_SCALE}px;
    right: ${ORNAMENT_ALIGNMENT * MID_SCALE}px;
    width: ${ORNAMENT_WIDTH * MID_SCALE}px;
    height: ${ORNAMENT_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    bottom: ${ORNAMENT_ALIGNMENT * HD_SCALE}px;
    right: ${ORNAMENT_ALIGNMENT * HD_SCALE}px;
    width: ${ORNAMENT_WIDTH * HD_SCALE}px;
    height: ${ORNAMENT_HEIGHT * HD_SCALE}px;
  }
`;

// #region Content constants
const CONTENT_PADDING = 40;
// #endregion
const Content = styled.div`
  width: 100%;
  height: 100%;
  padding: ${CONTENT_PADDING}px;

  @media (max-width: 2560px) {
    padding: ${CONTENT_PADDING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: ${CONTENT_PADDING * HD_SCALE}px;
  }
`;

// #region Name constants
const NAME_FONT_SIZE = 48;
// #endregion
const Name = styled.div`
  color: white;
  font-size: ${NAME_FONT_SIZE}px;
  font-family: Caudex;

  @media (max-width: 2560px) {
    font-size: ${NAME_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${NAME_FONT_SIZE * HD_SCALE}px;
  }
`;

const InfoContainer = styled.div`
  display: flex;
  width: 50%;
`;


// #region InfoDivider constants
const INFO_DIVIDER_LEFT = 310;
const INFO_DIVIDER_HEIGHT = 138;
const INFO_DIVIDER_WIDTH = 18;
// #endregion
const InfoDivider = styled.div`
  position: absolute;
  left: ${INFO_DIVIDER_LEFT}px;
  height: ${INFO_DIVIDER_HEIGHT}px;
  width: ${INFO_DIVIDER_WIDTH}px;
  background: url(../images/character-stats/ornament-profile-content.png);
  background-size: contain;

  @media (max-width: 2560px) {
    left: ${INFO_DIVIDER_LEFT * MID_SCALE}px;
    height: ${INFO_DIVIDER_HEIGHT * MID_SCALE}px;
    width: ${INFO_DIVIDER_WIDTH * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    left: ${INFO_DIVIDER_LEFT * HD_SCALE}px;
    height: ${INFO_DIVIDER_HEIGHT * HD_SCALE}px;
    width: ${INFO_DIVIDER_WIDTH * HD_SCALE}px;
  }
`;

// #region CharacterInfo constants
const CHARACTER_INFO_MARGIN_TOP = 20;
const CHARACTER_INFO_FONT_SIZE = 28;
const CHARACTER_INFO_WIDTH = 350;
// #endregion
const CharacterInfo = styled.div`
  margin-top: ${CHARACTER_INFO_MARGIN_TOP}px;
  font-size: ${CHARACTER_INFO_FONT_SIZE}px;
  width: ${CHARACTER_INFO_WIDTH}px;
  color: #CCC;

  @media (max-width: 2560px) {
    margin-top: ${CHARACTER_INFO_MARGIN_TOP * MID_SCALE}px;
    font-size: ${CHARACTER_INFO_FONT_SIZE * MID_SCALE}px;
    width: ${CHARACTER_INFO_WIDTH * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-top: ${CHARACTER_INFO_MARGIN_TOP * HD_SCALE}px;
    font-size: ${CHARACTER_INFO_FONT_SIZE * HD_SCALE}px;
    width: ${CHARACTER_INFO_WIDTH * HD_SCALE}px;
  }
`;

// const InfoDivider = styled.div`
//   background: url(../images/character-stats/ornament-profile-content.png)
// `;

// #region BiographyInfo constants
const BIOGRAPHY_INFO_MARGIN_TOP = 20;
const BIOGRAPHY_INFO_FONT_SIZE = 28;
const BIOGRAPHY_INFO_WIDTH = 600;
// #endregion
const BiographyInfo = styled.div`
  margin-top: ${BIOGRAPHY_INFO_MARGIN_TOP}px;
  font-size: ${BIOGRAPHY_INFO_FONT_SIZE}px;
  width: ${BIOGRAPHY_INFO_WIDTH}px;
  color: #CCC;

  @media (max-width: 2560px) {
    margin-top: ${BIOGRAPHY_INFO_MARGIN_TOP * MID_SCALE}px;
    font-size: ${BIOGRAPHY_INFO_FONT_SIZE * MID_SCALE}px;
    width: ${BIOGRAPHY_INFO_WIDTH * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-top: ${BIOGRAPHY_INFO_MARGIN_TOP * HD_SCALE}px;
    font-size: ${BIOGRAPHY_INFO_FONT_SIZE * HD_SCALE}px;
    width: ${BIOGRAPHY_INFO_WIDTH * HD_SCALE}px;
  }
`;

// #region Text constants
const TEXT_FONT_SIZE = 32;
// #endregion
const Text = styled.div`
  font-family: Caudex;
  font-size: ${TEXT_FONT_SIZE}px;

  @media (max-width: 2560px) {
    font-size: ${TEXT_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${TEXT_FONT_SIZE * HD_SCALE}px;
  }
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
      <Container style={{ backgroundImage: `url(${this.paperdollBG})` }}>
        <CharacterImage shouldZoom={shouldZoom} style={{ backgroundImage: `url(${this.paperdollIcon})` }} />
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
              <Text>{Archetype[game.selfPlayerState.classID]}</Text>
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
    const archetype = game.selfPlayerState.classID;

    if (race === Race.Luchorpan || archetype === Archetype.WintersShadow) {
      return false;
    }

    return true;
  }
}

export default GeneralInfo;
