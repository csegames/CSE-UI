/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-19 15:16:21
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-01-26 12:13:31
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { client, events } from 'camelot-unchained';

import { SessionState } from '../../services/session/reducer';
import { OrderState, fetchGuildInfo } from '../../services/session/order';
import { NavigationState, selectLink, toggleCollapsedCategory, CategoryNav, SocialCategory, NavLink, NavSection, linkAddressEquals } from '../../services/session/navigation';

import PersonalContent from '../PersonalContent';
import OrderContent from '../OrderContent';
import AllianceContent from '../AllianceContent';
import WarbandContent from '../WarbandContent';
import CampaignContent from '../CampaignContent';

function select(state: SessionState): Partial<SocialContentProps> {
  return {
    navigation: state.navigation,
    order: state.order
  };
}

export interface SocialContentProps {
  dispatch: (action: any) => void;
  containerClass: string;
  navigation: NavigationState;
  order: OrderState;
}

export interface SocialContentState { }

class SocialContent extends React.Component<Partial<SocialContentProps>, SocialContentState> {
  constructor(props: SocialContentProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.dispatch(fetchGuildInfo());
  }

  renderLinks = (links: NavLink[]) => {
    return links.map(link => (
      <li className={`${linkAddressEquals(link.address, this.props.navigation.currentView) ? 'active' : ''} ${link.enabled ? '' : 'disabled'}`}
        onClick={link.enabled ? () => this.props.dispatch(selectLink(link.address)) : null}
        key={link.id}>
        {link.icon}
        {link.displayName}
      </li>
    ));
  }

  renderNavSection = (navSection: NavSection) => {
    return (
      <ul className='fa-ul'>
        {this.renderLinks(navSection.links)}
      </ul>
    );
  }

  renderCategoryContent = (category: CategoryNav): any => {
    switch (category.category) {
      case SocialCategory.Warbands:
        return category.warbands.map(v => this.renderCategory(v, true));
      case SocialCategory.Campaigns:
        return category.campaigns.map(v => this.renderCategory(v, true));
      default:
        return this.renderNavSection(category);
    }
  }

  renderCategory = (category: CategoryNav, isSub = false) => {
    return (
      <section key={category.displayName} className={`SocialContent__navigation__group${isSub ? '__subGroup' : ''} ${category.collapsed ? `SocialContent__navigation__group${isSub ? '__subGroup' : ''}--collapsed` : ''}`}>
        <hgroup onClick={() => this.props.dispatch(toggleCollapsedCategory(category.address))}>
          {category.displayName}
          {category.collapsed ? <i className='fa fa-chevron-down'></i> : <i className='fa fa-window-minimize'></i>}
        </hgroup>
        {this.renderCategoryContent(category)}
      </section>
    );
  }

  render() {
    let content: any = null;
    switch (this.props.navigation.currentView.category) {
      case SocialCategory.Personal:
        content = <PersonalContent dispatch={this.props.dispatch} address={this.props.navigation.currentView}/>
        break;
      case SocialCategory.Order:
        content = <OrderContent dispatch={this.props.dispatch} address={this.props.navigation.currentView} order={this.props.order}/>
        break;
      case SocialCategory.Alliance:
        content = <AllianceContent dispatch={this.props.dispatch} address={this.props.navigation.currentView}/>
        break;
      case SocialCategory.Warbands:
        content = <WarbandContent dispatch={this.props.dispatch} address={this.props.navigation.currentView}/>
        break;
      case SocialCategory.Campaigns:
        content = <CampaignContent dispatch={this.props.dispatch} address={this.props.navigation.currentView}/>
        break;
    }
    return (
      <div className='SocialContent'>
        <div className='SocialContent__navigation'>
          {this.props.navigation.categories.map(category => this.renderCategory(category))}
        </div>

        <div className='SocialContent__contentView'>
          {content}
        </div>

        <div className='SocialContent__closeButton'>
          <i className='fa fa-times click-effect' onClick={() => events.fire('hudnav--navigate', 'social')}></i>
        </div>
      </div>
    )
  }
}

export default connect(select)(SocialContent);
