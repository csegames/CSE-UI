/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import * as CSS from '../../lib/css-helper';
import * as CONFIG from './config';
import { DIALOG_FONT } from './TabbedDialog/config';

/* Side Menu UI */
export const SIDE_MENU_WIDTH = 200;
export const SIDE_MENU_BORDER = `
  border-top: 1px solid rgba(0,0,0,0);
  border-bottom: 1px solid ${CONFIG.MENU_BORDER_COLOR};
`;
export const SIDE_MENU_HIGHLIGHT = `
  border-top: 1px solid ${CONFIG.MENU_HIGHLIGHT_BORDER_COLOR};
  border-bottom: 1px solid ${CONFIG.MENU_HIGHLIGHT_BORDER_COLOR};
  background: linear-gradient(
    to right,
    ${CONFIG.MENU_HIGHLIGHT_BACKGROUND_COLOR} 20%,
    rgba(0,0,0,0) 40%
  );
  border-image: linear-gradient(
    to right,
    ${CONFIG.MENU_HIGHLIGHT_BORDER_COLOR} 20%,
    rgba(${CONFIG.HIGHLIGHTED_BUTTON_BORDER}, 0) 80%
  ) 1 0 1 0;
`;
export const SIDE_OPTION_HEIGHT = 30;
export const SIDE_CONTENT_BORDER_GRADIENT =
  `border-image: linear-gradient(
    to bottom,
    ${CONFIG.CONTENT_BORDER_COLOR} 20%,
    rgba(0,0,0,0) 80%
  ) 1 0 0 1;`;


/* SideMenu Container: Contains the menu and the selected items content */
const SideMenuContainer = styled('div')`
  ${CSS.IS_ROW} ${CSS.EXPAND_TO_FIT}
`;

/* SideMenu Options: This contains the MenuOption(s) */
const SideMenuOptions = styled('div')`
  ${CSS.IS_COLUMN} ${CSS.DONT_GROW}
  min-width: ${SIDE_MENU_WIDTH + 5}px;
  position: relative;
  ::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 4px;
    background-color: ${CONFIG.CONTENT_BACKGROUND_COLOR};
    border: 1px solid ${CONFIG.CONTENT_BORDER_COLOR};
    border-right: 0px;
    ${SIDE_CONTENT_BORDER_GRADIENT};
    height: calc(100% - 2px);
  }
`;

/* SideMenuContent: The users content is rendered in here for the current
 * option. It has no padding, but does allow scrolling. */
export const SideMenuContent = styled('div')`
  ${CSS.IS_COLUMN} ${CSS.EXPAND_TO_FIT}
  background-color: ${CONFIG.CONTENT_BACKGROUND_COLOR};
  pointer-events: all;
  overflow: auto;
  border-top: 1px solid rgba(128,128,128,0.4);
`;

/* DialogContent: A container for displaying content that
 * adds standard padding and allows vertical scrolling. [optional] */
export const DialogContent = styled('div')`
  ${CSS.IS_COLUMN} ${CSS.EXPAND_TO_FIT}
  width: 100%;
  padding: 10px;
  box-sizing: border-box!important;
  overflow: auto;
`;

/* SideMenuOption: An option in the side menu */
const SideMenuOption = styled('div')`
  width: ${SIDE_MENU_WIDTH + 5}px;
  height: ${SIDE_OPTION_HEIGHT}px;
  line-height: ${SIDE_OPTION_HEIGHT}px;
  color: ${CONFIG.MENU_TEXT_COLOR};
  background-repeat: no-repeat;
  padding-left: 15px;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 1px;
  position: relative;
  box-sizing: border-box!important;
  cursor: pointer;
  pointer-events: all;
  background-image: url(images/settings/settings-leftnav-arrow-left.png);
  background-position: right 5px center;
  ${DIALOG_FONT}
  z-index: 1;
  border-left: 2px solid black;

  /* side-menu standard border */
  ::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: ${SIDE_MENU_WIDTH}px;
    height: 100%;
    border-bottom: 1px solid rgba(128,128,128,0.1);
    border-left: 0px;
    border-right: 0px;
    border-top: 1px solid rgba(32,32,32,0.4);
    background-color: rgba(32,32,32,0.4);
    z-index: -1;
  }
  &:hover::before {
    background-color: rgba(39,39,39,0.6);
  }
  :first-child::before {
    border-top: 1px solid rgba(128,128,128,0.1);
  }

  /* side menu option highlighted */
  &.selected {
    background-image: url(images/settings/settings-leftnav-arrow-right.png);
    background-position: right center;
    color: ${CONFIG.MENU_HIGHLIGHTED_TEXT_COLOR};
    ::before {
      ${SIDE_MENU_HIGHLIGHT}
      background-color: rgba(0,0,0,0.4);
    }
    ::after {
      content: '';
      position: absolute;
      top: 0; left: 0;
      background-image: url(images/settings/settings-leftnav-texture.png);
      background-position: 100%;
      z-index: -1;
      width: 100%;
      height: 100%;
    }
  }
`;

/* Menu Option Interface */
export interface MenuOption {
  label: string;            /* The Menu Option Text */
}

/* Side Menu Properties */
/* options: List of MenuOption objects that specify the option properties */
interface SideMenuProps {
  name?: string;             // for serialisation
  id?: string;
  options?: MenuOption[];
  children?: (option: MenuOption) => any;
  onSelectOption?: (option: MenuOption) => any;
}

/* This component tracks the currently selected menu option */
interface SideMenuState {
  activeOption: MenuOption;
}

/*
  SideMenu

  Presents a side menu, that occupies the left of its container, and a set of
  vertical options which can be used to select content.  The content is provided
  by the consumer.

  Usage:

  <SideMenu options={options}>
    {contentRenderer}
  </SideMenu>

  Where:

    options
      Is a list of MenuOption objects that define the menu options that will
      appear in the side menu.
    contentRenderer
      Is a function that is passed the currently select option, and it should
      return the JSX content for that pannel.
*/

const persistKey = (name: string, id: string) => `cse-${name || ''}-sidemenu-${id}-current-option`;

export class SideMenu extends React.PureComponent<SideMenuProps, SideMenuState> {
  constructor(props: SideMenuProps) {
    super(props);
    this.state = { activeOption: undefined };
  }
  public componentWillMount() {
    this.restoreOption(this.props);
  }
  public componentWillReceiveProps(next: SideMenuProps) {
    this.restoreOption(next);
  }
  public render() {
    const { name, id, options, children } = this.props;
    const activeOption = this.state.activeOption || (options && options[0]);
    return (
      <SideMenuContainer data-id='sidemenu-container'>
        { options &&
          <SideMenuOptions data-id='sidemenu-options'>
            { options.map((item, index) => (
              <SideMenuOption key={index}
                className={activeOption === item ? 'selected' : ''}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  if (id) this.selectOption(item, index, persistKey(name, id));
                  e.stopPropagation();
                  e.preventDefault();
                }}>
                {item.label}
              </SideMenuOption>
            ))}
          </SideMenuOptions>
        }
        <SideMenuContent className='cse-ui-scroller-thumbonly' data-id='sidemenu-content'>
          {children && children(activeOption)}
        </SideMenuContent>
      </SideMenuContainer>
    );
  }
  private selectOption = (option: MenuOption, index: number, key?: string) => {
    this.setState({ activeOption: option });
    if (this.props.onSelectOption) this.props.onSelectOption(option);
    if (key) localStorage.setItem(key, `${index}`);
  }
  private restoreOption(props: SideMenuProps) {
    const { name, id, options } = props;
    if (id && options && options.length) {
      const index = localStorage[persistKey(name, id)] | 0;
      this.selectOption(options[index], index);
    }
  }
}

export default SideMenu;
