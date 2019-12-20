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

// const ListContainer = styled.div`
//   flex: 1;
// `;

const TopStatBlockSpacing = css`
  margin-top: 10px;
`;

const TitleStyles = css`
  display: flex;
  justify-content: space-between;
`;

const ThumbsupContainer = styled.div`
  margin-right: 20px;
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
            containerStyles={TopStatBlockSpacing}
          />
          <StatBlock
            name='Kills'
            iconClass='icon-category-weapons'
            best={54234}
            total={2345123}
            average={21344}
            containerStyles={TopStatBlockSpacing}
          />
          <StatBlock
            name='Kill Streak'
            iconClass='icon-damage-spirit'
            best={234}
            total={2345123}
            average={21344}
            containerStyles={TopStatBlockSpacing}
          />
          <StatBlock
            name='Longest Life'
            iconClass='icon-slot-left-hand-weapon'
            best={321234}
            total={2345123}
            average={21344}
          />
          <StatBlock
            name='Damage Taken'
            iconClass='icon-category-light-chest'
            best={43567112}
            total={2345123}
            average={21344}
          />
          <StatBlock
            name='Total Damage'
            iconClass='icon-damage-physics-impact'
            best={214622432}
            total={2345123}
            average={21344}
          />
        </StatBlockContainer>
      </LeftSection>
      {/* <ListContainer>
        <List />
      </ListContainer> */}
    </Container>
  );
}
