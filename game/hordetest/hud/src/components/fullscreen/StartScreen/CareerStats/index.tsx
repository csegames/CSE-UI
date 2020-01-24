/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { StatBlock } from './StatBlock';
// import { List } from './List';
import { Title } from 'components/fullscreen/Title';

const Container = styled.div`
  display: flex;
  width: 80%;
  height: 80%;
  padding: 20px 10% 0 10%;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 2;
  padding: 20px 40px 0 0;
`;

const StatBlockContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
`;

const StatBlockAnimation = css`
  animation: popIn 0.7s forwards;
  bottom: -10%;
  opacity: 0;
  transform: scale(1);

  &.stat1 {
    animation-delay: 0.1s;
  }

  &.stat2 {
    animation-delay: 0.2s;
  }

  &.stat3 {
    animation-delay: 0.3s;
  }

  &.stat4 {
    animation-delay: 0.25s;
  }

  &.stat5 {
    animation-delay: 0.35s;
  }

  &.stat6 {
    animation-delay: 0.45s;
  }


  @keyframes popIn {
    0% {
      opacity: 0;
      bottom: -10%;
      transform:scale(1);
    }
    70%{
      transform:scale(1.05);
      bottom: 0;
    }
    100% {
      opacity: 1;
      bottom: 0;
      transform:scale(1);
    }
  }
`;

// const ListContainer = styled.div`
//   flex: 1;
// `;

const TopStatBlockSpacing = css`
  margin-top: 20px;
`;

const TitleStyles = css`
  display: flex;
  justify-content: space-between;
  opacity: 0;
  margin-top: -5%;
  animation: slideIn 0.5s forwards ;

  @keyframes slideIn {
    from {
      opacity: 0;
      margin-top: -5%;
    }
    to {
      opacity: 1;
      margin-top: 0;
    }
  }
`;

const ThumbsupContainer = styled.div`
  margin-right: 20px;
  left: -5%;
  opacity: 0;
  animation: slideIn 0.3s forwards ;
  animation-delay:0.3s;
  @keyframes slideIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ThumbsUp = styled.span`
  margin-right: 5px;
`;

export interface Props {
}

export function CareerStats(props: Props) {
  return (
    <Container>
      <LeftSection>
        <Title className={TitleStyles}>
          Career Stats

          <ThumbsupContainer>
            You've earned 1000 <ThumbsUp className='icon-thumbsup'></ThumbsUp>
          </ThumbsupContainer>
        </Title>
        <StatBlockContainer>
          <StatBlock
            name='Test Block'
            iconClass='icon-category-vial'
            best={54234}
            total={2345123}
            average={21344}
            containerStyles={`${TopStatBlockSpacing} ${StatBlockAnimation} stat1`}
          />
          <StatBlock
            name='Kills'
            iconClass='icon-category-weapons'
            best={54234}
            total={2345123}
            average={21344}
            containerStyles={`${TopStatBlockSpacing} ${StatBlockAnimation} stat2`}
          />
          <StatBlock
            name='Kill Streak'
            iconClass='icon-damage-spirit'
            best={234}
            total={2345123}
            average={21344}
            containerStyles={`${TopStatBlockSpacing} ${StatBlockAnimation} stat3`}
          />
          <StatBlock
            name='Longest Life'
            iconClass='icon-slot-left-hand-weapon'
            best={321234}
            total={2345123}
            average={21344}
            containerStyles={`${StatBlockAnimation} stat4`}
          />
          <StatBlock
            name='Damage Taken'
            iconClass='icon-category-light-chest'
            best={43567112}
            total={2345123}
            average={21344}
            containerStyles={`${StatBlockAnimation} stat5`}
          />
          <StatBlock
            name='Total Damage'
            iconClass='icon-damage-physics-impact'
            best={214622432}
            total={2345123}
            average={21344}
            containerStyles={`${StatBlockAnimation} stat6`}
          />
        </StatBlockContainer>
      </LeftSection>
      {/* <ListContainer>
        <List />
      </ListContainer> */}
    </Container>
  );
}
