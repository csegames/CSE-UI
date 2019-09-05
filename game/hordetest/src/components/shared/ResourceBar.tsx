/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const ResourceBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  transform: skewX(-10deg);

  &.square {
    transform: none;
  }
`;

const FillContainer = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  z-index: 0;

  &.blue {
    backgronud-color: #1d2c54;
  }

  &.green {
    background-color: #002e0b;
  }

  &.orange {
    background-color: #1b1b1b;
  }

  &.red {
    background-color: #3e0000;
  }
`;

const Fill = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  &:before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    background: linear-gradient(to right, transparent 85%, rgba(255, 255, 255, 0.6));
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border: 2px solid rgba(255, 255, 255, 0.15);
  }

  &.blue {
    background-color: #2a52b9;
    &:before {
      background: linear-gradient(138deg, transparent 70%, rgba(5, 255, 251,  0.6));
    }

    &:after {
      border: 2px solid rgba(40, 235, 255, 0.25);
    }
  }

  &.green {
    background-color: rgba(68, 174, 104, 1);

    &:before {
      background: linear-gradient(138deg, transparent 85%, rgba(227, 255, 89, 0.8));
    }

    &:after {
      border: 2px solid rgba(254, 255, 64, 0.3);
    }
  }

  &.orange {
    background-color: #ec7b20;
    &:before {
      background: linear-gradient(138deg, transparent 85%, rgba(227, 255, 89, 0.8));
    }

    &:after {
      border: 2px solid rgba(254, 255, 64, 0.3);
    }
  }

  &.red {
    background-color: rgba(125, 4, 2, 1);

    &: before {
      background: linear-gradient(138deg, transparent 85%, rgba(255, 8, 5, 0.3));
    }

    &:after {
      border: 2px solid rgba(201, 26, 20, 0.3);
    }
  }
`;

// box-shadow: inset -3px 1px 15px rgba(255, 255, 255, 0.8);

const Text = styled.div`
  color: white;
  font-size: 13px;
  z-index: 1;
  transform: skewX(10deg);

  &.square {
    transform: none;
  }
`;

export interface Props {
  type: 'blue' | 'green' | 'orange' | 'red';
  current: number;
  max: number;
  text?: string;
  hideText?: boolean;
  containerStyles?: string;
  isSquare?: boolean;
}

export function ResourceBar(props: Props) {
  const squareClass = props.isSquare ? 'square' : '';
  return (
    <ResourceBarContainer className={`${squareClass} ${props.containerStyles || ''}`}>
      <FillContainer className={props.type} style={{ width: `${(props.current / props.max) * 100}%` }}>
        <Fill className={props.type} />
      </FillContainer>
      {!props.hideText && !props.text &&
        <Text className={squareClass}>
          {Math.round(props.current).toFixed(0)} / {Math.round(props.max).toFixed(0)}
        </Text>
      }
      {props.text && <Text className={squareClass}>{props.text}</Text>}
    </ResourceBarContainer>
  );
}
