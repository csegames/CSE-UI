/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-23 21:48:36
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-24 11:52:27
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { ql } from 'camelot-unchained';
import * as classNames from 'classnames';

import { CategoryNav, SocialCategory, NavLink, NavSection, linkAddressEquals } from '../services/session/nav/navTypes';
import { NavigationState, selectLink, toggleCollapsedCategory } from '../services/session/navigation';

interface SocialNavStyle extends StyleDeclaration {
  container: React.CSSProperties;
  navGroup: React.CSSProperties;
  subGroup: React.CSSProperties;
  navGroupCollapsed: React.CSSProperties;
  navGroupHeader: React.CSSProperties;
  subGroupHeader: React.CSSProperties;
  navGroupHeaderIcon: React.CSSProperties;
  headerItem: React.CSSProperties;
  navGroupList: React.CSSProperties;
  navGroupListItem: React.CSSProperties;
  navGroupListItemIcon: React.CSSProperties;
  activeNavGroupListItem: React.CSSProperties;
  disabledNavGroupListItem: React.CSSProperties;
}

export const defaultSocialNavStyle: SocialNavStyle = {
  container: {
    flex: '0 0 auto',
    width: '240px',
    backgroundColor: '#222',
    userSelect: 'none',
    overflowY: 'auto',
  },

  navGroup: {
    cursor: 'default',
    borderBottom: 'solid 2px #111',
    maxHeight: '9999px',
  },

  subGroup: {
    marginLeft: '10px',
    maxHeight: '9999px',
  },

  navGroupCollapsed: {
    overflow: 'hidden',
  },

  navGroupHeader: {
    padding: '10px 20px 10px 10px',
    color: '#777',
    fontSize: '1.2em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    ':hover': {
      color: '#757575',
      backgroundColor: '#1c1c1c',
    },
  },

  subGroupHeader: {
    fontSize: '1.05em',
    padding: '10px 10px 5px 10px',
    textTransform: 'uppercase',
    color: '#777',
    cursor: 'pointer',
    ':hover': {
      color: '#757575',
      backgroundColor: '#1c1c1c',
    },
  },

  navGroupHeaderIcon: {
    float: 'right',
  },

  headerItem: {

  },

  navGroupList: {
    margin: '0',
    listStyle: 'none',
    maxHeight: '9999px',
    overflow: 'hidden',
    paddingBottom: '20px',
  },

  navGroupListItem: {
    padding: '10px 0px 10px 20px',
    cursor: 'pointer',
    color: '#cdcdcd',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  },

  activeNavGroupListItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderLeft: 'solid 2px #cdcdcd',
  },

  disabledNavGroupListItem: {
    padding: '10px 0px 10px 20px',
    cursor: 'not-allowed',
    color: '#777',
  },

  navGroupListItemIcon: {
    color: '#777',
    marginRight: '5px',
  },
};

export interface SocialNavProps {
  mySocial: ql.MySocialQuery;
  refresh: () => void;
  navigation: NavigationState;
  dispatch: (action: any) => void;
  styles?: Partial<SocialNavStyle>;
}

export interface SocialNavState {
  minimized: boolean;
}

export class SocialNav extends React.Component<SocialNavProps, SocialNavState> {
  constructor(props: SocialNavProps) {
    super(props);
    this.state = {
      minimized: false,
    }
  }

  renderLinks = (links: NavLink[], ss: SocialNavStyle, custom: Partial<SocialNavStyle>) => {
    const activeClass = css(ss.activeNavGroupListItem, custom.activeNavGroupListItem);
    const disabledClass = css(ss.disabledNavGroupListItem, custom.disabledNavGroupListItem);
    return links.map(link => {
      if (link.display(this.props.mySocial) == false) return null;
      const isActive = linkAddressEquals(link.address, this.props.navigation.currentView);
      return (
        <li className={classNames(
              { [css(ss.navGroupListItem, custom.navGroupListItem)]: link.enabled },
              { [activeClass]: isActive },
              { [disabledClass]: !link.enabled },
            )}
            onClick={link.enabled ? () => this.props.dispatch(selectLink(link.address)) : null}
            key={link.id}>
          <span className={css(ss.navGroupListItemIcon, custom.navGroupListItemIcon)}>{link.icon}</span>
          {link.displayName}
        </li>
      )
    });
  }

  renderNavSection = (navSection: NavSection, ss: SocialNavStyle, custom: Partial<SocialNavStyle>) => {
    return (
      <ul className={classNames('fa-ul', css(ss.navGroupList, custom.navGroupList))}>
        {this.renderLinks(navSection.links, ss, custom)}
      </ul>
    );
  }

  renderCategoryContent = (category: CategoryNav, ss: SocialNavStyle, custom: Partial<SocialNavStyle>): any => {
    switch (category.category) {
      case SocialCategory.Warbands:
        return category.warbands.map(v => this.renderCategory(v, true, ss, custom));
      case SocialCategory.Campaigns:
        return category.campaigns.map(v => this.renderCategory(v, true, ss, custom));
      default:
        return this.renderNavSection(category, ss, custom);
    }
  }

  renderCategory = (category: CategoryNav, isSub: boolean, ss: SocialNavStyle, custom: Partial<SocialNavStyle>) => {
    const subGroupClass = css(ss.subGroup, custom.subGroup);
    const collapsedClass = css(ss.navGroupCollapsed, custom.navGroupCollapsed);
    return (
      <section key={category.displayName}
               className={classNames(
                 css(ss.navGroup, custom.navGroup),
                 { [subGroupClass]: isSub },
                 { [collapsedClass]: category.collapsed },
               )}>
        <hgroup className={isSub ? css(ss.subGroupHeader, custom.subGroupHeader) : css(ss.navGroupHeader, custom.navGroupHeader)}
                onClick={() => this.props.dispatch(toggleCollapsedCategory(category.address))}>
          {category.displayName}
          {
            category.collapsed ? 
              <i className={classNames('fa fa-chevron-down', css(ss.navGroupHeaderIcon, custom.navGroupHeaderIcon))}></i> : 
              <i className={classNames('fa fa-window-minimize', css(ss.navGroupHeaderIcon, custom.navGroupHeaderIcon))}></i>
          }
        </hgroup>
        { category.collapsed ? null : this.renderCategoryContent(category, ss, custom)}
      </section>
    );
  }

  render() {
    const ss = StyleSheet.create(defaultSocialNavStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    return (
      <div className={css(ss.container, custom.container)}>
          {this.props.navigation.categories.map(category => this.renderCategory(category, false, ss, custom))}
      </div>
    );
  }
}

export default SocialNav;
