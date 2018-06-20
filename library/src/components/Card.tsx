/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';

const Container = styled('div')`
  background-color: #3C3C3C;
  color: #ECECEC;
  padding: 10px;
  margin: 1em;
  border-radius: 2px;
`;

const LevelOne = css`
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
`;

const LevelTwo = css`
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
`;

const LevelThree = css`
  box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
`;

const LevelFour = css`
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
`;

const LevelFive = css`
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
`;

export enum CardLevel {
  One,
  Two,
  Three,
  Four,
  Five,
}

export const Card = (props: {
  level?: CardLevel;
  children?: React.ReactNode;
}) => {
  const level = props.level || CardLevel.One;
  let levelCSS = LevelOne;
  switch (level) {
    case CardLevel.Two:
      levelCSS = LevelTwo;
      break;
    case CardLevel.Three:
      levelCSS = LevelThree;
      break;
    case CardLevel.Four:
      levelCSS = LevelFour;
      break;
    case CardLevel.Five:
      levelCSS = LevelFive;
      break;
  }
  return (
    <Card className={levelCSS}>
      {props.children}
    </Card>
  );
};

export default Card;
