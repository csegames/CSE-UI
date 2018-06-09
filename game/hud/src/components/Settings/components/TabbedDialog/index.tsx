/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import * as CSS from '../../utils/css-helper';
import * as CONFIG from '../../config';
import { NavButton, NavButtonLabel } from './NavButton';

/* Dialog Container */
const DialogContainer = styled('div')`
  ${CSS.IS_COLUMN}
  width: 100%;
  height: 100%;
  &.has-title {
    ::before {
      ${CSS.DONT_GROW}
      ${CONFIG.DIALOG_FONT}
      content: '';
      height: 23px;
      width: 100%;
      background-image: url(images/settings/settings-top-title.png);
      background-position: center top;
      background-repeat: no-repeat;
      padding-top: 8px;
      z-index: 2;
      position: relative;
      box-sizing: border-box;
    }
  }
`;

const DialogTitle = styled('div')`
  position: absolute;
  top: 7px;
  text-transform: uppercase;
  color: ${CONFIG.NORMAL_TEXT_COLOR};
  text-align: center;
  font-size: 9px;
  letter-spacing: 2px;
  width: 100%;
  z-index: 2;
`;

// because the title div is positioned absolute, in the dialog container
// we move the dialog-window up 17px (top: -17px) which also moves the
// bottom up, we need to stretch that back down by 17px (margin-bottom: -17px)
const DialogWindow = styled('div')`
  ${CSS.IS_COLUMN} ${CSS.EXPAND_TO_FIT} ${CONFIG.DIALOG_SHADOW} ${CONFIG.DIALOG_BORDER}
  position: relative;
  top: -17px;
  margin-bottom: -17px;
  z-index: 1;
`;

const OrnamentTopLeft = styled('div')`
  position: absolute;
  top: 0; left: 0;
  background-image: url(images/settings/settings-ornament-top-left.png);
  width: 35px;
  height: 31px;
  z-index: 2;
`;

const OrnamentTopRight = styled('div')`
  position: absolute;
  top: 0; right: 0;
  background-image: url(images/settings/settings-ornament-top-right.png);
  width: 49px;
  height: 48px;
  padding-left: 25px;
  box-sizing: border-box!important;
  z-index: 2;
`;

const CloseIcon = styled('span')`
  position: relative;
  left: -5px;
  width: 30px;
  height: 25px;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  pointer-events: bounding-box;
  background-image: url(images/settings/close-button-grey.png);
  background-position: center;
  background-repeat: no-repeat;
`;

const OrnamentBottomLeft = styled('div')`
  position: absolute;
  bottom: 0; left: 0;
  background-image: url(images/settings/settings-ornament-bottom-left.png);
  width: 35px;
  height: 31px;
  z-index: 2;
`;

const OrnamentBottomRight = styled('div')`
  position: absolute;
  bottom: 0; right: 0;
  background-image: url(images/settings/settings-ornament-bottom-right.png);
  width: 35px;
  height: 31px;
  z-index: 2;
`;

/* Dialog Heading */
const DialogNavigation = styled('div')`
  ${CSS.DONT_GROW} ${CSS.IS_ROW} ${CSS.CENTERED}
  width: 100%;
  height: ${CONFIG.DIALOG_HEADING_HEIGHT}px;
  background-image: url(images/settings/bag-bg-grey.png);
  background-repeat: no-repeat;
  background-position: top center;
  background-color: rgb(27,26,24);
  padding-top: 6px;
  position: relative;
  box-sizing: border-box!important;
  margin-bottom: 10px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.5);
  z-index: 1;
  box-shadow: inset 0 0 60px rgba(0,0,0,0.8);
`;

const DialogNavInnerBorder = styled('div')`
  position: absolute;
  ${CSS.IS_ROW} ${CSS.EXPAND_TO_FIT}
  width: 100%;
  height: 60px;
  left: 0;
  box-sizing: border-box!important;
  padding: 7px;
  top: -1px;
  ::before {
    content: '';
    border: 1px solid rgba(101,100,98,0.8);
    ${CSS.IS_ROW} ${CSS.EXPAND_TO_FIT}
    height: 100%;
    border-image: linear-gradient(
      to right,
      rgba(0,0,0,0.0), rgba(101,100,98,1), rgba(0,0,0,0.0)
    ) 1;
  }
`;

/* Dialog Content */
const DialogTabContent = styled('div')`
  ${CONFIG.DIALOG_BACKGROUND}
  ${CSS.IS_COLUMN}
  ${CSS.EXPAND_TO_FIT}
  margin-top: -10px;
  padding-top: 10px;
`;

const DialogContent = styled('div')`
  ${CSS.IS_ROW}
  ${CSS.EXPAND_TO_FIT}
  height: 557px;
`;

/* Dialog Footer */
const DialogFooter = styled('div')`
  ${CSS.DONT_GROW} ${CSS.IS_ROW} ${CSS.CENTERED}
  height: ${CONFIG.DIALOG_FOOTER_HEIGHT}px;
  position: relative;
  background-image: url(images/settings/bag-bg-grey.png);
  background-repeat: no-repeat;
  background-position: top center;
  padding: 3px;
  z-index: 1;
  box-shadow: inset 0 0 60px rgba(0,0,0,0.8);
  ::before {
    content: '';
    background-image: url(images/settings/settings-botnav-left-ornament.png);
    background-repeat: no-repeat;
    margin: 0 3px;
    width: 75px;
    height: 55px;
  }
  ::after {
    content: '';
    background-image: url(images/settings/settings-botnav-right-ornament.png);
    background-repeat: no-repeat;
    margin: 0 3px;
    width: 75px;
    height: 55px;
  }
`;

const DialogFooterInnerBorder = styled('div')`
  position: absolute;
  ${CSS.IS_ROW} ${CSS.EXPAND_TO_FIT}
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  padding: 7px;
  box-sizing: border-box!important;
  ::before {
    content: '';
    border: 1px solid rgba(${CONFIG.FOOTER_BORDER_COLOR_RGB},0.8);
    ${CSS.IS_ROW} ${CSS.EXPAND_TO_FIT}
    height: 100%;
    border-image: linear-gradient(
      to right,
      rgba(${CONFIG.FOOTER_BORDER_COLOR_RGB},0.2),
      rgba(${CONFIG.FOOTER_BORDER_COLOR_RGB},0.8),
      rgba(${CONFIG.FOOTER_BORDER_COLOR_RGB},0.2)
    ) 1;
  }

`;

const DialogFooterButton = styled('div')`
  ${CSS.ALLOW_MOUSE}
  width: ${CONFIG.FOOTER_BUTTON_WIDTH}px;
  height: ${CONFIG.FOOTER_BUTTON_HEIGHT}px;
  line-height: ${CONFIG.FOOTER_BUTTON_HEIGHT}px;
  text-align: center;
  text-transform: uppercase;
  color: ${CONFIG.NORMAL_TEXT_COLOR};
  margin: 0 3px;
  font-size: 9px;
  background-image: url(images/settings/button-off.png);
  ${CONFIG.DIALOG_FONT}
  letter-spacing: 2px;
  position: relative;
  &:hover {
    color: ${CONFIG.HIGHLIGHTED_TEXT_COLOR};
    background-image: url(images/settings/button-on.png);
    ::before {
      content: '';
      position: absolute;
      background-image: url(images/settings/button-glow.png);
      width: 93px;
      height: 30px;
      left: 1px;
      background-size: cover;
    }
  }
`;

export interface DialogButton {
  label: string;
}

interface DialogProps {
  title: string;
  tabs: DialogButton[];
  onClose: () => void;
  children?: (tab: DialogButton) => JSX.Element;
}

interface DialogState {
  activeTab: DialogButton;
}

/*
  TabbedDialog

  Presents a dialog, that fills it's container, with a close icon top right, and a set of buttons
  accross the top which can be used to select content.

  Usage:

  <TabbedDialog title={title} tabs={tabs}>
    {contentRenderer}
  </TabbedDialog>

  Where:

    title
      Title is the name of the dialog that will be displayed as the title of
      the dialog.
    tabs
      Is a list of DialogButtons that define the nav buttons that will appear
      at the top of the dialog.
    contentRenderer
      Is a function that is passed the currently select tab, and it should
      return the JSX content for that tab.
*/

const PERSIST_KEY = 'cse-settings-current-tab';

export class TabbedDialog extends React.PureComponent<DialogProps, DialogState> {
  constructor(props: DialogProps) {
    super(props);
    this.state = { activeTab: undefined };
  }
  public componentDidMount() {
    this.selectTab(localStorage[PERSIST_KEY] | 0);
  }
  public selectTab = (index: number) => {
    this.setState({ activeTab: this.props.tabs[index] });
    localStorage.setItem(PERSIST_KEY, `${index}`);
  }
  public render() {
    const { tabs } = this.props;
    const activeTab = this.state.activeTab || tabs[0];
    return (
      <DialogContainer className={`has-title`} data-id='dialog-container'>
        <DialogTitle>{this.props.title}</DialogTitle>
        <DialogWindow data-id='dialog-window'>
          <OrnamentTopLeft/>
          <OrnamentTopRight>
            <CloseIcon onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
              this.props.onClose();
              e.preventDefault();
            }}/>
          </OrnamentTopRight>
          <DialogNavigation data-id='dialog-heading'>
            <DialogNavInnerBorder/>
            { tabs.map((item, index) => (
              <NavButton key={index} className={activeTab === item && 'selected'}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  this.selectTab(index);
                  e.stopPropagation();
                  e.preventDefault();
                }}>
                <NavButtonLabel>
                  {item.label}
                </NavButtonLabel>
              </NavButton>
            ))}
          </DialogNavigation>
          {this.props.children(activeTab)}
          <OrnamentBottomLeft/>
          <OrnamentBottomRight/>
        </DialogWindow>
      </DialogContainer>
    );
  }
}

/*
  DialogTab

  Provides a content area with footer containing buttons.

  Usage:

  <DialogTab buttons={buttons}>
    content
  </DialogTab>

  Where:

  buttons
    Is a array of DialogButton(s) to show in the footer
  content
    Is the JSX content to display in the content area.
*/

interface DialogTabProps {
  buttons?: DialogButton[];
  onAction?: (button: DialogButton) => void;
  children?: any;
}

/* tslint:disable:function-name */
export function DialogTab(props: DialogTabProps) {
  const { buttons } = props;
  return (
    <DialogTabContent data-id='dialog-tab-content'>
      <DialogContent data-id='dialog-content'>
        {props.children}
      </DialogContent>
      <DialogFooter data-id='dialog-footer'>
        <DialogFooterInnerBorder/>
        { buttons && buttons.map(button => (
          <DialogFooterButton key={button.label}
            onClick={props.onAction && ((e: React.MouseEvent<HTMLDivElement>) => {
              props.onAction(button);
              e.stopPropagation();
              e.preventDefault();
            })}>
            {button.label}
          </DialogFooterButton>
        ))}
      </DialogFooter>
    </DialogTabContent>
  );
}

export default TabbedDialog;
