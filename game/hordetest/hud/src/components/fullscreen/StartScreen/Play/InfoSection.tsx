/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { ResourceBar } from 'components/shared/ResourceBar';
import { Button } from '../../Button';
import { Challenge } from './Challenge';
import { InputContext, InputContextState } from 'context/InputContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 35px);
  height: 60%;
  padding-left: 25px;
  padding-right: 10px;
  background-image: url(../images/fullscreen/startscreen/right-nav-bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
`;

const SeasonText = styled.div`
  font-size: 16px;
  color: #797979;
  margin-top: 15px;
`;

const LevelText = styled.div`
  font-size: 30px;
  color: white;
  text-transform: uppercase;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
`;

const ProgressText = styled.div`
  font-family: Lato;
  font-weight: bold;
  font-size: 16px;
  color: white;
  margin-bottom: 14px;
`;

const ButtonStyle = css`
  padding: 15px 0;
  font-size: 20px;
  width: 50%;
`;

const SpecialText = styled.span`
  color: #4c93e1;
`;

const ChallengesContainer = styled.div`
  margin-top: 7px;
`;

const ChallengeSpacing = css`
  margin-bottom: 3px;
`;

const ChallengesText = styled.div`
  font-size: 16px;
  font-family: Colus;
  color: #797979;
  margin-bottom: 7px;
`;

const ConsoleButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonIcon = styled.span`
  margin-right: 2px;
`;

export interface Props {

}

export function InfoSection() {
  return (
    <InputContext.Consumer>
      {(inputContext: InputContextState) => {
        return (
          <Container>
            <SeasonText>Season 1</SeasonText>
            <LevelText>Level 14</LevelText>
            <Row>
              <ResourceBar type='blue' current={90} max={100} />
            </Row>
            <ProgressText><SpecialText>70</SpecialText> / 100</ProgressText>
            <Row>
              <Button type={'secondary'} text={'Free Pass'} styles={ButtonStyle} />
              {!inputContext.isConsole ?
                <Button type={'primary'} text={'Upgrade'} styles={ButtonStyle} /> :
                <Button
                  type={'primary'}
                  styles={ButtonStyle}
                  text={
                    <ConsoleButton>
                      <ButtonIcon className='icon-xb-y'></ButtonIcon> Upgrade
                    </ConsoleButton>
                  }
                />
              }
            </Row>
            <ChallengesContainer>
              <ChallengesText>Challenges</ChallengesText>
              <Challenge
                styles={ChallengeSpacing}
                challengeText={'Play matches in a party'}
                progress={{ current: 70, max: 100 }}
              />
              <Challenge
                styles={ChallengeSpacing}
                challengeText={'Defeat Elites in battle'}
                progress={{ current: 65, max: 75 }}
              />
            </ChallengesContainer>
          </Container>
        );
      }}
    </InputContext.Consumer>
  );
}
