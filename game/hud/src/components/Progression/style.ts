/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import styled from 'react-emotion';

export const LoadingContainer = styled('div')`
  position: relative;
`;

export const InnerContainer = styled('div')`
  position: relative;
  pointer-events: all;
  width: 1000px;
  height: 600px;
  padding: 0px;
  margin:0 auto;
  background-color: gray;
  color: white;
  background: url(images/progression/progress-bg-grey.png) no-repeat;
  z-index: 1;
  border: 1px solid #6e6c6c;
  box-shadow: 0 0 30px 0 #000;
`;

export const ProgressionTitle = styled('div')`
  text-align: center;
  background: url(images/progression/progress-top-title.png) center top no-repeat;
  margin: 0 auto -9px auto;
  position: relative;
  z-index: 999;
  width: 319px;
  height: 23px;
  h6 {
    color: #848484;
    font-size: 10px;
    text-transform: uppercase;
    padding: 7px 0 0 0;
    margin: 0 0 0 0;
    font-family: 'Caudex', serif;
  }
`;

export const ProgressionCorner = styled('div')`
  position: absolute;
  min-width: 1000px;
  min-height: 600px;
  background:
  url(images/progression/progress-ornament-top-left.png) left 0 top 0 no-repeat,
  url(images/progression/progress-ornament-top-right.png) right 0 top 0 no-repeat,
  url(images/progression/progress-ornament-bottom-left.png) left 0 bottom 0 no-repeat,
  url(images/progression/progress-ornament-bottom-right.png) right 0 bottom 0 no-repeat;
  z-index: 1;
`;

export const ProgressionContent = styled('div')`
  height: 494px;
  margin-top: 30px;
  max-height: 494px;
  padding: 10px 20px;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
  border-top: 1px solid #3b3634;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10;
  width: calc(100% - 40px);
  position: absolute;
  h2 {
    font-family: 'Caudex', serif;
    font-size: 18px;
  }
  h3 {
    font-size: 18px;
    color: #706764;
    text-transform: uppercase;
    border-bottom: 1px solid #706764;
  }
  h3.RewardHeadline {
    color: #93866c;
    border-bottom: 1px solid #93866c;
  }
  ul {
    margin-bottom: 20px !important;
    li {
      background: #191919;
      margin-bottom: 4px;
      -webkit-transition: all 0.5s ease;
      div {
        display: inline-block;
        padding: 5px 10px;
      }
      div.ProgressionLabel {
        width: calc(40% - 25px);
        background: #141414;
        border-left: 5px solid #3b3634;
        img {
          vertical-align: sub !important;
          margin-right: 5px;
        }
      }
      div.ProgressionValue {
        width: calc(60% - 20px);
        background: #191919;
        color: #93866c;
        img {
          vertical-align: sub !important;
          margin-right: 5px;
        }
      }
      div.RewardLabel {
        width: calc(40% - 25px);
        background: #101010;
        border-left: 5px solid #322e2c;
        color: #7e7a7a;
        img {
          vertical-align: sub !important;
          margin-right: 5px;
        }
      }
      div.RewardValue {
        width: calc(60% - 20px);
        background: #161616;
        color: #93866c;
        img {
          vertical-align: sub !important;
          margin-right: 5px;
        }
      }
      &:hover {
        background: #191919;
        -webkit-transition: all 0.5s ease;
        div.ProgressionLabel {
          width: calc(40% - 25px);
          background: #3b3634;
          border-left: 5px solid #3b3634;
        }
        div.ProgressionValue {
          background: #93866c;
          color: #fff;
        }
        div.RewardLabel {
          width: calc(40% - 25px);
          background: #322e2c;
          border-left: 5px solid #322e2c;
        }
        div.RewardValue {
          background: #897c63;
          color: #fff;
        }
      }
    }
  }
  .ProgressList {
    background-color: rgba(24, 24, 24, 0.35);
    margin-bottom: 30px;
    border: 1px solid #313131;
    border-left: none;
    border-right: none;
    padding: 20px;
  }
  .NoReward {
    width: calc(100% - 25px);
    background: #141414;
    border-left: 5px solid #3b3634;
    padding: 5px 10px;
  }
`;

export const ProgressionLoading = styled('div')`
  text-align: center;
  margin-top: 130px;
`;

export const ProgressionFooter = styled('div')`
  position: absolute;
  min-width: 1000px;
  height: 55px;
  bottom: 0;
  left: 0;
  background: rgba(55, 52, 51, 0.3);
  border-top: 1px solid #3b3634;
  z-index: 11;
  box-shadow: inset 0 0 60px rgba(0,0,0,0.8);
`;
