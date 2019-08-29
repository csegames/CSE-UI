/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

const BarContainer = styled.div`
  position: relative;
  height: 15px;
  width: 100%;
  bottom: 0px;
  left: 0px;
  z-index: 2;
  background: url(../images/progressbar/texture-overlay.png),
    linear-gradient(black, #272727);
  background-repeat-y: no-repeat;
  border: 1px solid #464646;
  border-top: 2px solid #1b1b1b;
  border-right: 0px solid #f0F;
  border-bottom: 2px solid #1b1b1b;
  border-left: 0px solid  #09f;
`;

const ProgressText = styled.div`
  font-size: 9px;
  padding: 3px 10px;
  color: #c3c3c3;
  background: url(../images/progressbar/loading-percent.png);
  display: block;
  position: absolute;
  top: -2px;
  left:-2px;
  width: 50px;
  height: 9px;
  z-index: 1;
`;

const Bar = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  transition: all linear .5s;
  &:after {
    content: "";
    background: url(../images/progressbar/loading-bar-end.png) no-repeat center right;
    width: 200px;
    height: 10px;
    margin-top: 2px;
  }

  &:before {
    content: "";
    background: url(../images/progressbar/loading-bar-repeat.png) center;
    width: 100%;
    height: 10px;
    margin-top: 2px;
  }
`;

const ButtonShine = styled.div`
  pointer-events: none;
  opacity: 0;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5px;
  opacity: 0;
  height: 10px;
  width: 85px;
  background: linear-gradient(transparent, rgba(255,255,255,1));
  clip-path: polygon(80% 0%, 100% 0%, 20% 100%, 0% 100%);
  -webkit-clip-path: polygon(80% 0%, 100% 0%, 20% 100%, 0% 100%);
  animation: shine 3s ease forwards;

  @keyframes shine {
    from {
      left: 95%;
      opacity: 1;
    }
    to {
      left: 20px;
      opacity: 0;
    }
  }
`;

export interface Props {
  progress: number;
}

// tslint:disable-next-line:function-name
export function ProgressBar(props: Props) {
  return (
    <BarContainer>
      <ProgressText>{props.progress}%</ProgressText>
      <Bar style={{ left: `${-(100 - props.progress)}%` }} />
      {props.progress === 100 && <ButtonShine />}
    </BarContainer>
  );
}
