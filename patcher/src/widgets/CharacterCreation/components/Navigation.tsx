/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { utils, Tooltip } from 'camelot-unchained';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { CharacterCreationPage } from '../index';

export interface NavigationStyle extends StyleDeclaration {
  Navigation: React.CSSProperties;
  section: React.CSSProperties;
  cancelHelpContainer: React.CSSProperties;
  middleNavContainer: React.CSSProperties;
  createContainer: React.CSSProperties;
  progressContainer: React.CSSProperties;
  progressImage: React.CSSProperties;
  navProgressSection: React.CSSProperties;
  navButton: React.CSSProperties;
  navConnector: React.CSSProperties;
  navConnectorCompleted: React.CSSProperties;
  navArrow: React.CSSProperties;
  otherActionButton: React.CSSProperties;
  createButton: React.CSSProperties;
  disabled: React.CSSProperties;
}

export const defaultNavigationStyle: NavigationStyle = {
  Navigation: {
    display: 'flex',
    position: 'absolute',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: '#0D0D0D',
    height: '50px',
    padding: '0 10px',
    zIndex: 10,
    userSelect: 'none',
    webkitUserSelect: 'none',
  },

  section: {
    flex: 1,
  },

  middleNavContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelHelpContainer: {
    display: 'flex',
    alignItems: 'center',
  },

  createContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  progressContainer: {
    display: 'flex',
    alignItems: 'center',
  },

  progressImage: {
    cursor: 'pointer',
    width: '55px',
    height: '55px',
  },

  navProgressSection: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },

  navButton: {
    fontSize: '14px',
    fontWeight: 'bold',
    letterSpacing: '0.1px',
    cursor: 'pointer',
    color: '#919177',
    backgroundColor: 'transparent',
    border: '0px',
    outline: 'none',
    ':hover': {
      color: utils.lightenColor('#919177', 25),
    },
  },

  navConnector: {
    height: '1px',
    width: '20px',
    backgroundColor: utils.lightenColor('#0D0D0D', 20),
  },

  navConnectorCompleted: {
    backgroundColor: '#776759',
  },

  navArrow: {
    margin: '0 2px',
  },

  completedNavConnector: {
    backgroundColor: '#FFD981',
  },

  otherActionButton: {
    fontSize: '14px',
    fontWeight: 'bold',
    letterSpacing: '0.1px',
    cursor: 'pointer',
    color: '#A1A1A1',
    backgroundColor: 'transparent',
    border: '0px',
    outline: 'none',
    marginRight: '15px',
    ':hover': {
      color: utils.lightenColor('#A1A1A1', 35),
    },
  },


  createButton: {
    color: '#F2F2C6',
  },

  disabled: {
    color: '#454545',
    ':hover': {
      color: '#454545',
    },
  },
};

export interface NavigationPageInfo {
  pageNumber: CharacterCreationPage;
  pageComplete: boolean;
  pageVisited: boolean;
  onClick: () => void;
}

export interface NavigationProps {
  styles?: Partial<NavigationStyle>;
  onNextClick: () => void;
  onBackClick: () => void;
  onCancelClick: () => void;
  onHelpClick: () => void;
  pages: NavigationPageInfo[];
  currentPage: CharacterCreationPage;
  disableNavButtons: boolean;
}

export interface NavigationState {
}

export const navImages = {
  current: 'images/character-creation-nav/current.png',
  done: 'images/character-creation-nav/done.png',
  empty: 'images/character-creation-nav/empty.png',
  visited: 'images/character-creation-nav/visited.png',
};

export class Navigation extends React.Component<NavigationProps, NavigationState> {
  constructor(props: NavigationProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultNavigationStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    const nextDisabled = this.props.currentPage === this.props.pages.length - 1;
    const backDisabled = this.props.currentPage === 0;
    
    return (
      <div className={css(ss.Navigation, custom.Navigation)}>
        <div className={css(ss.cancelHelpContainer, custom.cancelHelpContainer, ss.section, custom.section)}>
          <button
            className={css(ss.otherActionButton, custom.otherActionButton)}
            onClick={this.props.onCancelClick}>
            CANCEL
          </button>
          <button
            className={css(ss.otherActionButton, custom.otherActionButton)}
            onClick={this.props.onHelpClick}>
            HELP?
          </button>
        </div>
        <div className={css(ss.middleNavContainer, custom.middleNavContainer, ss.section, custom.section)}>
          <button
            disabled={backDisabled}
            className={css(
              ss.navButton,
              custom.navButton,
              backDisabled && ss.disabled,
              backDisabled && custom.disabled,
            )}
            onClick={this.props.onBackClick}>
            <span className={`fa fa-angle-left ${css(ss.navArrow, custom.navArrow)}`} />
            BACK
          </button>
          <div className={css(ss.progressContainer, custom.progressContainer)}>
            {this.props.pages.map((page, i) => {
              const imageSource = page.pageNumber === this.props.currentPage ? navImages.current :
                page.pageComplete ? navImages.done :
                page.pageVisited && !page.pageComplete ? navImages.visited :
                !page.pageVisited && !page.pageComplete && navImages.empty;
              const pageName = CharacterCreationPage[page.pageNumber];
              return (
                <div className={css(ss.navProgressSection, custom.navProgressSection)}>
                  <Tooltip
                    styles={{
                      tooltip: {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                      },
                    }}
                  content={pageName}>
                    <img
                      className={css(ss.progressImage, custom.progressImage)}
                      src={imageSource}
                      onClick={!this.props.disableNavButtons ? page.onClick : () => {}}
                    />
                  </Tooltip>
                  {i < this.props.pages.length - 1 &&
                    <div className={css(
                      ss.navConnector,
                      custom.navConnector,
                      page.pageComplete && ss.navConnectorCompleted,
                      page.pageComplete && custom.navConnectorCompleted,
                    )} />
                  }
                </div>
              );
            })}
          </div>
          <button
            disabled={nextDisabled}
            className={css(
              ss.navButton,
              custom.navButton,
              nextDisabled && ss.disabled,
              nextDisabled && custom.disabled,
            )}
            onClick={this.props.onNextClick}>
            NEXT
            <span className={`fa fa-angle-right ${css(ss.navArrow, custom.navArrow)}`} />
          </button>
        </div>
        <div className={css(ss.createContainer, custom.createContainer, ss.section, custom.section)}>
          {nextDisabled &&
            <button
              className={css(
                ss.createButton, custom.createButton,
                ss.navButton, custom.navButton,
              )}
              onClick={this.props.onNextClick}>
              CREATE
            </button>
          }
        </div>
      </div>
    );
  }
}

export default Navigation;
