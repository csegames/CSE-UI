/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import * as CSS from 'lib/css-helper';

import {
  DIALOG_FONT,
  DIALOG_SHADOW,
  DIALOG_BORDER,
  NORMAL_TEXT_COLOR,
} from './config';
import { CloseButton } from 'UI/CloseButton';

/* Dialog Container */
const DialogContainer = styled.div`
  pointer-events: none;
  ${CSS.IS_COLUMN}
  width: 100%;
  height: 100%;
  &.has-title {
    ::before {
      ${CSS.DONT_GROW}
      ${DIALOG_FONT}
      content: '';
      height: 23px;
      width: calc(100% - 50px);
      left: 25px;
      background-image: url(../images/settings/settings-top-title.png);
      background-position: center top;
      background-repeat: no-repeat;
      padding-top: 8px;
      z-index: 2;
      position: relative;
      box-sizing: border-box;
    }
    &.small-title::before {
      ${CSS.DONT_GROW}
      ${DIALOG_FONT}
      content: '';
      height: 18px;
      width: calc(100% - 50px);
      left: 25px;
      top: -5px;
      background-image: url(../images/settings/top-title.png);
      background-position: center top;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      padding-top: 8px;
      z-index: 2;
      position: relative;
      box-sizing: border-box;
    }
  }
`;

const DialogTitle = styled.div`
  position: absolute;
  top: 5px;
  text-transform: uppercase;
  color: ${NORMAL_TEXT_COLOR};
  text-align: center;
  font-size: 9px;
  letter-spacing: 2px;
  width: 100%;
  z-index: 2;
  font-family: Titillium Web Regular;
`;

// because the title div is positioned absolute, in the dialog container
// we move the dialog-window up 17px (top: -17px) which also moves the
// bottom up, we need to stretch that back down by 17px (margin-bottom: -17px)
const DialogWindow = styled.div`
  ${CSS.IS_COLUMN} ${CSS.EXPAND_TO_FIT} ${DIALOG_SHADOW} ${DIALOG_BORDER}
  position: relative;
  top: -17px;
  margin-bottom: -17px;
  z-index: 1;
`;

const OrnamentTopLeft = styled.div`
  position: absolute;
  top: 0; left: 0;
  background-image: url(../images/settings/settings-ornament-top-left.png);
  width: 35px;
  height: 31px;
  z-index: 2;
`;

const OrnamentTopRight = styled.div`
  position: absolute;
  top: 0; right: 0;
  background-image: url(../images/settings/settings-ornament-top-right.png);
  width: 49px;
  height: 48px;
  padding-left: 25px;
  box-sizing: border-box!important;
  pointer-events: none;
  z-index: 2;
`;

const OrnamentBottomLeft = styled.div`
  position: absolute;
  bottom: 0; left: 0;
  background-image: url(../images/settings/settings-ornament-bottom-left.png);
  width: 35px;
  height: 31px;
  z-index: 2;
`;

const OrnamentBottomRight = styled.div`
  position: absolute;
  bottom: 0; right: 0;
  background-image: url(../images/settings/settings-ornament-bottom-right.png);
  width: 35px;
  height: 31px;
  z-index: 2;
`;

const CloseButtonClass = css`
  position: absolute;
  top: 5px;
  right: 7px;
`;

export const DialogHeading = styled.div`
  ${CSS.DONT_GROW} ${CSS.IS_ROW}
  ${DIALOG_FONT}
  font-size: 18px;
  color: ${NORMAL_TEXT_COLOR};
  text-transform: uppercase;
  line-height: 40px;
  margin-left: 20px;
  text-align: center;
`;

export interface DialogButton {
  label: string;
}

interface DialogProps {
  name?: string;
  title: string;
  onClose: () => void;
  heading?: boolean;
  renderHeader?: () => any;
  children: React.ReactNode;
  useSmallTitle?: boolean;
}

export const Dialog = function(props: DialogProps) {
  const { children, renderHeader, heading, useSmallTitle } = props;
  const cls = [];
  const clsInner = [];
  if (heading === false) {
    cls.push('bar-only');
    clsInner.push('bar-only');
  }
  if (renderHeader) clsInner.push('no-bottom-border');
  return (
    <DialogContainer
      className={`has-title cse-ui-scroller-thumbonly ${useSmallTitle ? 'small-title' : ''}`}
      data-id='dialog-container'
      data-input-group='block'
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogWindow data-id='dialog-window'>
        <OrnamentTopLeft/>
        <OrnamentTopRight>
        <CloseButton className={CloseButtonClass} onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
          props.onClose();
          e.preventDefault();
        }}/>
        </OrnamentTopRight>
        { children }
        <OrnamentBottomLeft/>
        <OrnamentBottomRight/>
      </DialogWindow>
    </DialogContainer>
  );
};

