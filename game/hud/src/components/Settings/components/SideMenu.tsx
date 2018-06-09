/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import * as CSS from '../utils/css-helper';
import * as CONFIG from '../config';


/* SideMenu Container: Contains the menu and the selected items content */
const SideMenuContainer = styled('div')`
  ${CSS.IS_ROW} ${CSS.EXPAND_TO_FIT}
`;

/* SideMenu Options: This contains the MenuOption(s) */
const SideMenuOptions = styled('div')`
  ${CSS.IS_COLUMN} ${CSS.DONT_GROW}
  min-width: ${CONFIG.SIDE_MENU_WIDTH + 5}px;
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
    ${CONFIG.SIDE_CONTENT_BORDER_GRADIENT};
    height: 100%;
  }
`;

/* SideMenuContent: The users content is rendered in here for the current
 * option. */
const SideMenuContent = styled('div')`
  ${CSS.IS_ROW} ${CSS.EXPAND_TO_FIT}
  background-color: ${CONFIG.CONTENT_BACKGROUND_COLOR};
  pointer-events: bounding-box;
  overflow: auto;
  border-top: 1px solid rgba(128,128,128,0.4);
`;

/* SideMenuOption: An option in the side menu */
const SideMenuOption = styled('div')`
  width: ${CONFIG.SIDE_MENU_WIDTH + 5}px;
  height: ${CONFIG.SIDE_OPTION_HEIGHT}px;
  line-height: ${CONFIG.SIDE_OPTION_HEIGHT}px;
  color: ${CONFIG.MENU_TEXT_COLOR};
  background-repeat: no-repeat;
  padding-left: 15px;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 1px;
  position: relative;
  box-sizing: border-box!important;
  cursor: pointer;
  pointer-events: bounding-box;
  background-image: url(images/settings/settings-leftnav-arrow-left.png);
  background-position: right 5px center;
  ${CONFIG.DIALOG_FONT}
  z-index: 1;
  border-left: 2px solid black;

  /* side-menu standard border */
  ::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: ${CONFIG.SIDE_MENU_WIDTH}px;
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
      ${CONFIG.SIDE_MENU_HIGHLIGHT}
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
  options: MenuOption[];
  persist?: string;
  children?: (option: MenuOption) => JSX.Element;
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

const PERSIST_KEY = 'cse-settings-sidemenu-option';

export class SideMenu extends React.PureComponent<SideMenuProps, SideMenuState> {
  constructor(props: SideMenuProps) {
    super(props);
    this.state = { activeOption: undefined };
  }
  public componentDidMount() {
    this.selectOption(localStorage[`${PERSIST_KEY}-${this.props.persist}`] | 0);
  }
  public render() {
    const { options } = this.props;
    const activeOption = this.state.activeOption || options[0];
    return (
      <SideMenuContainer data-id='sidemenu-container'>
        <SideMenuOptions data-id='sidemenu-options'>
          { options.map((item, index) => (
            <SideMenuOption key={index}
              className={activeOption === item ? 'selected' : ''}
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                this.selectOption(index);
                e.stopPropagation();
                e.preventDefault();
              }}>
              {item.label}
            </SideMenuOption>
          ))}
        </SideMenuOptions>
        <SideMenuContent data-id='sidemenu-content'>
          {this.props.children(activeOption)}
        </SideMenuContent>
      </SideMenuContainer>
    );
  }
  private selectOption = (index: number) => {
    this.setState({ activeOption: this.props.options[index] });
    localStorage.setItem(`${PERSIST_KEY}-${this.props.persist}`, `${index}`);
  }
}

export default SideMenu;
