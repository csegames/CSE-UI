/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { ChampionInfo } from '.';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 70%;
`;

const SkinsSection = styled.div`
  flex: 1;
`;

const ImageSection = styled.div`
  flex: 1;
`;

const ChampionImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover
`;

const InfoSection = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const ChampionName = styled.div`
  font-family: Colus;
  color: white;
  text-transform: uppercase;
  font-size: 48px;
  margin-bottom: 25px;
`;

const AbilitiesContainer = styled.div`
  padding: 0 2px;
`;

const AbilityContainer = styled.div`
  display: flex;
  margin-bottom: 15px;
`;

const AbilityIcon = styled.div`
  font-size: 43px;
  color: white;
  margin-right: 13px;
`;

const AbilityInfoContainer = styled.div`
`;

const AbilityType = styled.div`
  font-size: 15px;
  color: #818080;
  font-family: Lato;
  font-weight: bold;
  text-transform: uppercase;
`;

const AbilityName = styled.div`
  font-size: 30px;
  color: white;
`;

const AbilityDescription = styled.div`
  font-size: 12px;
  color: white;
  font-family: Lato;
  max-width: 70%;
`;

const DescriptionTitle = styled.span`
  font-weight: bold;
`;

export interface Props {
  selectedChampion: ChampionInfo;
}

export function ChampionPreview(props: Props) {
  return (
    <Container>
      <SkinsSection>

      </SkinsSection>
      <ImageSection>
        <ChampionImage src={props.selectedChampion.image} />
      </ImageSection>
      <InfoSection>
        <div>
          <ChampionName>{props.selectedChampion.name}</ChampionName>
          <AbilitiesContainer>
            {props.selectedChampion.abilities.map((ability, i) => {
              return (
                <AbilityContainer key={i}>
                  <AbilityIcon className={ability.iconClass} />
                  <AbilityInfoContainer>
                    <AbilityType>{ability.type}</AbilityType>
                    <AbilityName>{ability.name}</AbilityName>
                    <AbilityDescription>
                      <DescriptionTitle>Description of ability: </DescriptionTitle>{ability.description}
                    </AbilityDescription>
                  </AbilityInfoContainer>
                </AbilityContainer>
              );
            })}
          </AbilitiesContainer>
        </div>
      </InfoSection>
    </Container>
  );
}
