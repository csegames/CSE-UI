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
  background: rgba(0, 0, 0, 0.8);
  z-index: 10;
  width: calc(100% - 40px);
  position: absolute;
  h2 {
    color: #f0f0f0;
    font-size: 14px;
    font-family: 'Caudex',serif;
    text-transform: uppercase;
    font-weight: initial;
  }
  h3 {
    color: #dcdcdc;
    font-size: 14px;
    font-family: 'Caudex',serif;
    text-transform: uppercase;
    font-weight: initial;
    border-bottom: 1px solid #313131;
  }
  h3.RewardHeadline {
    color: #93866c;
    border-bottom: 1px solid #93866c;
  }
  ul {
    li {
      -webkit-transition: all 0.5s ease;
      background: #1f1f1f;
      margin-bottom: 4px;
      &:last-of-type {
        margin-bottom: 20px;
      }
      div {
        display: inline-block;
        padding: 0;
      }
      div.ProgressionInfo {
        border: 1px solid #313131;
        margin: 5px;
        width: calc(100% - 12px);
        -webkit-transition: all 0.5s ease;
      }
      div.ProgressionLabel {
        -webkit-transition: all 0.5s ease;
        width: calc(40% - 10px);
        color: #ccc;
        font-size: 15px;
        padding: 10px 5px;
        img {
          vertical-align: sub !important;
          margin-right: 4px;
        }
      }
      div.ProgressionValue {
        width: calc(60% - 10px);
        color: #777777;
        padding: 10px 5px;
        background-color: #1c1c1c;
        -webkit-transition: all 0.5s ease;
        img {
          margin-right: 4px;
          vertical-align: sub !important;
        }
      }
      div.ProgressionValue2 {
        width: calc(30% - 20px);
        color: #777777;
        padding: 10px 5px;
        background-color: #1c1c1c;
        -webkit-transition: all 0.5s ease;
        img {
          vertical-align: sub !important;
          margin-right: 4px;
        }
      }
      div.ProgressionValue3 {
        width: calc(20% - 10px);
        background: #1c1c1c;
        color: #777777;
        padding: 10px 5px;
        -webkit-transition: all 0.5s ease;
        img {
          vertical-align: sub !important;
          margin-right: 4px;
        }
      }
      div.RewardLabel {
        -webkit-transition: all 0.5s ease;
        width: calc(40% - 10px);
        color: #ccc;
        font-size: 15px;
        padding: 10px 5px;
        img {
          vertical-align: sub !important;
          margin-right: 4px;
        }
      }
      div.RewardValue {
        width: calc(60% - 10px);
        color: #777777;
        padding: 10px 5px;
        background-color: #1c1c1c;
        -webkit-transition: all 0.5s ease;
        img {
          margin-right: 4px;
          vertical-align: sub !important;
        }
      }
      &:hover {
        -webkit-box-shadow: 0 0 20px 0 #000;
        box-shadow: 0 0 20px 0 #000;
        -webkit-transition: all 0.5s ease;
        div.ProgressionInfo {
          width: calc(100% - 12px);
          border: 1px solid #93866c;
          -webkit-transition: all 0.5s ease;
        }
        div.ProgressionLabel {
          color: #93866c;
          -webkit-transition: all 0.5s ease;
        }
        div.ProgressionValue {
          -webkit-transition: all 0.5s ease;
          color: #fff;
        }
        div.ProgressionValue2 {
          color: #fff;
        }
        div.ProgressionValue3 {
          color: #fff;
          -webkit-transition: all 0.5s ease;
        }
        div.RewardLabel {
          color: #93866c;
          -webkit-transition: all 0.5s ease;
        }
        div.RewardValue {
          color: #fff;
          -webkit-transition: all 0.5s ease;
        }
      }
    }
    li.ProgressHeader {
      background: none;
      div.ProgressionLabelHeader {
        color: #989898;
        font-size: 14px;
        font-family: 'Caudex',serif;
        text-transform: inherit;
        font-weight: initial;
        border-bottom: 1px solid #313131;
        width: calc(40% - 7px);
        padding-left: 7px;
      }
      div.RewardLabelHeader {
        width: calc(40% - 7px);
        color: #989898;
        font-size: 14px;
        font-family: 'Caudex',serif;
        text-transform: inherit;
        font-weight: initial;
        border-bottom: 1px solid #313131;
        padding-left: 7px;
      }
      div.RewardValueHeader {
        width: calc(60% - 0px);
        color: #989898;
        font-size: 14px;
        font-family: 'Caudex',serif;
        text-transform: inherit;
        font-weight: initial;
        border-bottom: 1px solid #313131;
      }
      div.ProgressionValue2Header {
        width: calc(30% - 10px);
        color: #989898;
        font-size: 14px;
        font-family: 'Caudex',serif;
        text-transform: inherit;
        font-weight: initial;
        border-bottom: 1px solid #313131;
      }
      div.ProgressionValue3Header {
        width: calc(20% - 0px);
        color: #989898;
        font-size: 14px;
        font-family: 'Caudex',serif;
        text-transform: inherit;
        font-weight: initial;
        border-bottom: 1px solid #313131;
        padding-left: 0px;
      }
    }
  }
  .ProgressList {
    background-color: #0f0f0e;
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
