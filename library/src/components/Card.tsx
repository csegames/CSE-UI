/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-13 19:06:38
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-13 21:00:47
 */

import * as React from 'react';
import {StyleSheet, css, StyleDeclaration} from 'aphrodite';

export const defaultCardStyle : CardStyle = {
  card: {
    backgroundColor: '#3c3c3c',
    color: '#ececec',
    padding: '10px',
    margin: '1em',
    borderRadius: '2px',
  },

  levelOne: {
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
  },

  levelTwo: {
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
  },

  levelThree: {
    boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
  },

  levelFour: {
    boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
  },

  levelFive: {
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
  },
};

export interface CardStyle extends StyleDeclaration {
  card : React.CSSProperties;
  levelOne: React.CSSProperties;
  levelTwo: React.CSSProperties;
  levelThree: React.CSSProperties;
  levelFour: React.CSSProperties;
  levelFive: React.CSSProperties;
}

export enum CardLevel {
  One,
  Two,
  Three,
  Four,
  Five,
}

export const Card = (props : {
  styles?: Partial<CardStyle>;
  level?: CardLevel;
  children?: React.ReactNode;
}) => {
  const ss = StyleSheet.create(defaultCardStyle);
  const custom = StyleSheet.create(props.styles || {});
  const level = props.level || CardLevel.One;
  let levelCSS = ss.levelOne;
  let customLevelCSS = custom.levelOne;
  switch (level) {
    case CardLevel.Two: 
      levelCSS = ss.levelTwo;
      customLevelCSS = custom.levelTwo;
      break;
    case CardLevel.Three:
    levelCSS = ss.levelThree;
    customLevelCSS = custom.levelThree;
    break;
    case CardLevel.Four:
      levelCSS = ss.levelFour;
      customLevelCSS = custom.levelFour;
      break;
    case CardLevel.Five:
      levelCSS = ss.levelFive;
      customLevelCSS = custom.levelFive;
      break;
  }
  return (
    <div className={css(ss.card, levelCSS, custom.card, customLevelCSS)}>
      {props.children}
    </div>
  );
};

export default Card;
