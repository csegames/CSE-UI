/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import styled from 'react-emotion';

export const PATCH_NOTES_COLOR = 'rgba(122, 184, 227, 1)';
export const NEWS_COLOR = 'rgba(236, 119, 127, 1)';

export const FeaturedContainer = styled('div')`
  position: relative;
  width: calc(100% - 10px);
  height: 500px;
  right: -5px;
  background-color: #101010;
  border: 1px solid #2E2E2E;
  display: flex;
  overflow: hidden;
  padding: 20px 0;
  margin-bottom: 10px;
  background:
    linear-gradient(
      to bottom,
      transparent,
      rgba(16, 16, 16, 0.5) 10%,
      rgba(16, 16, 16, 1) 60%
    ),
    linear-gradient(
      to right,
      transparent,
      rgba(16, 16, 16, 0.5) 10%,
      rgba(16, 16, 16, 1) 60%
    ),
    url(${(props: any) => props.backgroundImage}) left top/80% no-repeat,
    #101010;
`;

// const fadeIn = keyframes`
//   from {
//     opacity: 0;
//   }
//   to {
//     opacity: 1;
//   }
// `;

export const FullWrapper = styled('div')`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999;
`;

export const FullContainer = styled('div')`
  position: relative;
  top: 30px;
  height: 80%;
  width: 80%;
  margin: auto;
  background-color: #101010;
  border: 1px solid #2E2E2E;
  display: flex;
  overflow: hidden;
  padding: 20px 0;
  color: white;
  pointer-events: all;
  background:
    linear-gradient(
      to bottom,
      transparent,
      rgba(16, 16, 16, 0.5) 10%,
      rgba(16, 16, 16, 1) 60%
    ),
    linear-gradient(
      to right,
      transparent,
      rgba(16, 16, 16, 0.5) 10%,
      rgba(16, 16, 16, 1) 60%
    ),
    url(${(props: any) => props.backgroundImage}) left top/80% no-repeat;
`;

export const TitleContainer = styled('div')`
  text-align: right;
  flex: 1;
  margin-left: 80px;
`;

export const ContentContainer = styled('div')`
  flex: 3;
  margin-right: 6px;
  padding-right: 75px;
  overflow: auto;
`;

export const ContentImage = styled('img')`
  width: 100%;
  height: 500px;
  object-fit: cover;
`;

export const Title = styled('div')`
  font-family: Caudex;
  font-size: 24px;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
`;

export const DescriptionText = styled('div')`
  font-family: Titillium Web;
  font-size: 14px;
`;

export const ContentText = styled('div')`
  font-family: Titillium Web;
  font-size: 16px;
`;

export const CloseButton = styled('div')`
  position: absolute;
  top: 4px;
  right: 4px;
  pointer-events: all;
  font-size: 14px;
  color: #C3C3C3;
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: white;
  }
`;

export const ReadMoreButton = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: absolute;
  right: 0;
  bottom: 0;
  background: url(images/news/read-more-bg.png);
  width: 201px;
  height: 43px;
  font-family: Caudex;
  font-size: 14px;
  color: #939393;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  &:hover {
    filter: brightness(120%);
  }
`;

export const ReadMoreText = styled('div')`
  padding-right: 30px;
`;
