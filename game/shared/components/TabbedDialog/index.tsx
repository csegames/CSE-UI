/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import * as CSS from '../../lib/css-helper';
import * as CONFIG from '../config';
import { NavButton, NavButtonLabel } from './NavButton';
import { DialogTitle } from './DialogTitle';

import {
  DIALOG_FONT,
  DIALOG_SHADOW,
  DIALOG_BACKGROUND,
  DIALOG_HEADING_HEIGHT,
  DIALOG_FOOTER_HEIGHT,
  DIALOG_BORDER,
  FOOTER_BORDER_COLOR_RGB,
  FOOTER_BUTTON_WIDTH,
  FOOTER_BUTTON_HEIGHT,
} from './config';
import { CloseButton } from '../CloseButton';

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
  }
  &.auto-height {
    height: auto;
  }
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

/* Dialog Heading */
const BAR_ONLY = 'bar-only';
const DialogNavigation = styled.div`
  ${CSS.DONT_GROW} ${CSS.IS_ROW} ${CSS.CENTERED}
  width: 100%;
  height: ${DIALOG_HEADING_HEIGHT}px;
  background-image: url(../images/settings/bag-bg-grey.png);
  background-repeat: no-repeat;
  background-position: top center;
  background-color: rgb(27,26,24);
  padding-top: 6px;
  position: relative;
  box-sizing: border-box!important;
  margin-bottom: 10px;
  z-index: 1;
  &.bar-only {
    height: 28px;
  }
`;

const DialogNavInnerBorder = styled.div`
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
  &.no-bottom-border::before {
    border-bottom: 0;
  }
  &.bar-only {
    height: 32px;
  }
`;

const DialogNavigationTabs = styled.div`
  position: absolute;
  ${CSS.IS_ROW} ${CSS.EXPAND_TO_FIT}
  width: 100%;
  top: 10px;
  justify-content: center;
  left: 0;
`;

/* Dialog Content */
const DialogTabContent = styled.div`
  ${DIALOG_BACKGROUND}
  ${CSS.IS_COLUMN}
  ${CSS.EXPAND_TO_FIT}
  margin-top: -10px;
  padding-top: 10px;
  color: white;
  .no-tabs & {
    margin-top: 0;
    padding-top: 25px;
    background-image: url(../images/settings/bag-bg-grey.png);
    background-repeat: no-repeat;
    background-position: top center;
    background-color: rgb(27,26,24);
  }
`;

const DialogContent = styled.div`
  ${CSS.IS_ROW}
  ${CSS.EXPAND_TO_FIT}
  height: 557px;
  .auto-height & {
    height: auto;
  }
`;

/* Dialog Footer */
const DialogFooter = styled.div`
  ${CSS.DONT_GROW} ${CSS.IS_ROW} ${CSS.CENTERED}
  height: ${DIALOG_FOOTER_HEIGHT}px;
  position: relative;
  background-image: url(../images/settings/bag-bg-grey.png);
  background-repeat: no-repeat;
  background-position: top center;
  padding: 3px;
  z-index: 1;
  ::before {
    content: '';
    background-image: url(../images/settings/settings-botnav-left-ornament.png);
    background-repeat: no-repeat;
    margin: 0 3px;
    width: 75px;
    height: 55px;
  }
  ::after {
    content: '';
    background-image: url(../images/settings/settings-botnav-right-ornament.png);
    background-repeat: no-repeat;
    margin: 0 3px;
    width: 75px;
    height: 55px;
  }
`;

const DialogFooterInnerBorder = styled.div`
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
    border: 1px solid rgba(${FOOTER_BORDER_COLOR_RGB},0.8);
    ${CSS.IS_ROW} ${CSS.EXPAND_TO_FIT}
    height: 100%;
    border-image: linear-gradient(
      to right,
      rgba(${FOOTER_BORDER_COLOR_RGB},0.2),
      rgba(${FOOTER_BORDER_COLOR_RGB},0.8),
      rgba(${FOOTER_BORDER_COLOR_RGB},0.2)
    ) 1;
  }
`;

const DialogFooterButton = styled.div`
  ${CSS.ALLOW_MOUSE}
  width: ${FOOTER_BUTTON_WIDTH}px;
  height: ${FOOTER_BUTTON_HEIGHT}px;
  line-height: ${FOOTER_BUTTON_HEIGHT}px;
  text-align: center;
  text-transform: uppercase;
  color: ${CONFIG.NORMAL_TEXT_COLOR};
  margin: 0 3px;
  font-size: 9px;
  background-image: url(../images/settings/button-off.png);
  ${DIALOG_FONT}
  letter-spacing: 2px;
  position: relative;
  &:hover {
    color: ${CONFIG.HIGHLIGHTED_TEXT_COLOR};
    background-image: url(../images/settings/button-on.png);
    ::before {
      content: '';
      position: absolute;
      background-image: url(../images/settings/button-glow.png);
      width: 93px;
      height: 30px;
      left: 1px;
      background-size: cover;
    }
  }
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
  color: ${CONFIG.NORMAL_TEXT_COLOR};
  text-transform: uppercase;
  line-height: 40px;
  margin-left: 20px;
  text-align: center;
`;

export interface DialogButton {
  label: string;
}

interface DialogProps {
  name?: string;               // dialog name (used for serialisation)
  title: string;
  titleIcon?: string;
  onClose: () => void;
  heading?: boolean;
  tabs?: DialogButton[];
  renderNav?: () => any;
  renderHeader?: () => any;
  children?: (tab: DialogButton) => any;
  autoHeight?: boolean;
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
    titleIcon
      Optional icon class name to display before the title.
    tabs
      Is a list of DialogButtons that define the nav buttons that will appear
      at the top of the dialog.
    contentRenderer
      Is a function that is passed the currently select tab, and it should
      return the JSX content for that tab.
*/

const persistKey = (name: string) => `cse-${name}-current-tab`;

export class TabbedDialog extends React.PureComponent<DialogProps, DialogState> {
  constructor(props: DialogProps) {
    super(props);
    this.state = { activeTab: undefined };
  }
  public componentWillMount() {
    this.restoreTab(this.props);
  }
  public componentWillReceiveProps(next: DialogProps) {
    this.restoreTab(next);
  }
  public render() {
    const { tabs, children, renderNav, renderHeader, heading, autoHeight } = this.props;
    const activeTab = this.state.activeTab || (tabs && tabs[0]);
    const clsContainer = ['has-title cse-ui-scroller-thumbonly'];
    const clsWindow = [];
    const cls = [];
    const clsInner = [];
    if (heading === false) {
      cls.push(BAR_ONLY);
      clsInner.push(BAR_ONLY);
    }
    if (!tabs) {
      clsWindow.push('no-tabs');
    }
    if (autoHeight) clsContainer.push('auto-height');
    if (renderHeader) clsInner.push('no-bottom-border');
    return (
      <DialogContainer
        className={clsContainer.join(' ')}
        data-id='dialog-container'
      >
        <DialogTitle title={this.props.title} titleIcon={this.props.titleIcon}/>
        <DialogWindow data-id='dialog-window' className={clsWindow.join(' ')}>
          <OrnamentTopLeft/>
          <OrnamentTopRight>
          <CloseButton className={CloseButtonClass} onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
            this.props.onClose();
            e.preventDefault();
          }}/>
          </OrnamentTopRight>
          { /* Only render navigation if have tabs or a renderHeader callback */ }
          { (tabs || renderHeader) && (
            <DialogNavigation className={cls.join()} data-id='dialog-heading'>
              <DialogNavInnerBorder className={clsInner.join()}/>
              { renderHeader && renderHeader() || (
                  heading !== false && (
                    <DialogNavigationTabs>
                    { renderNav && renderNav() || this.renderTabs(activeTab) }
                    </DialogNavigationTabs>
                  )
                )
              }
            </DialogNavigation>
          )}
          { children && children(activeTab) }
          <OrnamentBottomLeft/>
          <OrnamentBottomRight/>
        </DialogWindow>
      </DialogContainer>
    );
  }

  private selectTab = (tab: DialogButton, index: number, name?: string) => {
    const { tabs } = this.props;
    this.setState({ activeTab: tab });
    if (name && tabs && tabs.length) localStorage.setItem(persistKey(name), `${index}`);
  }

  private restoreTab(props: DialogProps) {
    const { name, tabs } = this.props;
    if (name && tabs && tabs.length) {
      const index = localStorage[persistKey(name)] | 0;
      this.selectTab(tabs[index], index);
    }
  }

  private renderTabs = (activeTab: DialogButton) => {
    const { name, tabs } = this.props;
    return tabs && tabs.map((item, index) => (
      <NavButton key={index} className={activeTab === item && 'selected'}
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          this.selectTab(tabs[index], index, name);
          e.stopPropagation();
          e.preventDefault();
        }}>
        <NavButtonLabel>
          {item.label}
        </NavButtonLabel>
      </NavButton>
    ));
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
  renderFooter?: (props: DialogTabProps) => JSX.Element;
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
      { props.renderFooter && props.renderFooter(props) }
      { !props.renderFooter && props.buttons && props.buttons.length &&
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
      }
    </DialogTabContent>
  );
}

export default TabbedDialog;
