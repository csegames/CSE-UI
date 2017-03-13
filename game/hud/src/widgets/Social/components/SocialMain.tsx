/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-19 15:16:21
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-28 16:37:34
 */

import * as React from 'react';
import { ApolloClient } from 'apollo-client';
import { graphql, InjectedGraphQLProps } from 'react-apollo';
import { connect } from 'react-redux';
import { client, events, ql, FloatSpinner } from 'camelot-unchained';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';

import { SessionState } from '../services/session/reducer';
import { NavigationState, selectLink, toggleCollapsedCategory} from '../services/session/navigation';
import { CategoryNav, SocialCategory, NavLink, NavSection, linkAddressEquals } from '../services/session/nav/navTypes';

import PersonalContent from './PersonalContent';
import OrderContent from './OrderContent';
import AllianceContent from './AllianceContent';
import WarbandContent from './WarbandContent';
import CampaignContent from './CampaignContent';
import SocialNav from './SocialNav';


export interface SocialMainStyle extends StyleDeclaration {
  container: React.CSSProperties;
  closeButton: React.CSSProperties;
  content: React.CSSProperties;
}

export const defaultSocialMainStyle: SocialMainStyle = {
  container: {
    position: 'fixed',
    left: '0',
    top: '0',
    width: '100%',
    height: '100%',
    overflowX: 'hidden',
    overflowY: 'hidden',
    backgroundColor: '#333',
    display: 'flex',
    alignItems: 'stretch',
  },

  closeButton: {
    position: 'absolute',
    top: '2px',
    right: '10px',
    color: '#cdcdcd',
    fontSize: '2em',
    cursor: 'pointer',
    userSelect: 'none',
    ':hover': {
      color: '#bbb',
    },
  },

  content: {
    flex: '1 1 auto',
    color: '#cdcdcd',
    display: 'flex',
    alignItems: 'stretch',
  }
}


export interface SocialMainProps extends InjectedGraphQLProps<ql.MySocialQuery> {
  dispatch: (action: any) => void;
  containerClass: string;
  navigation: NavigationState;
  styles?: Partial<SocialMainStyle>;
}

export interface SocialMainState {
  orderName: string
 }

class SocialMain extends React.Component<Partial<SocialMainProps>, SocialMainState> {
  constructor(props: SocialMainProps) {
    super(props);
    this.state = {
      orderName: '',
    };
  }

  componentWillReceiveProps(props: SocialMainProps) {
    if (props.data && props.data.myOrder && props.data.myOrder.name !== this.state.orderName) {
      
        events.fire('chat-leave-room', this.state.orderName);
      
      // we either are just loading up, or we've changed order.
      if (props.data.myOrder.id) {
        // we left our order, leave chat room
        events.fire('chat-show-room', props.data.myOrder.name);
      }
      
      this.setState({
        orderName: props.data.myOrder.name,
      });
    }
  }

  componentDidMount() {
    this.props.data.refetch();
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
      <section key={category.displayName} className={`SocialMain__navigation__group${isSub ? '__subGroup' : ''} ${category.collapsed ? `SocialMain__navigation__group${isSub ? '__subGroup' : ''}--collapsed` : ''}`}>
        <hgroup onClick={() => this.props.dispatch(toggleCollapsedCategory(category.address))}>
          {category.displayName}
          {category.collapsed ? <i className='fa fa-chevron-down'></i> : <i className='fa fa-window-minimize'></i>}
        </hgroup>
        {this.renderCategoryContent(category)}
      </section>
    );
  }

  // Refresh Apollo GraphQL data, ignore what is in the cache
  // and hit the server!
  public refresh = () => {
    this.props.data.refetch();
  }

  ready = false;
  render() {

    const ss = StyleSheet.create(defaultSocialMainStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    let content: any = null;

    if (this.props.data.loading && !this.ready) {
      content = <div>Loading</div>;
    } else {
      this.ready = true;

    switch (this.props.navigation.currentView.category) {
      case SocialCategory.Personal:
        content = <PersonalContent dispatch={this.props.dispatch}
                                   address={this.props.navigation.currentView}
                                   refetch={this.refresh}
                                   myCharacter={this.props.data.myCharacter}/>
        break;
      case SocialCategory.Order:
        content = <OrderContent dispatch={this.props.dispatch} address={this.props.navigation.currentView} order={this.props.data.myOrder} refetch={this.refresh}/>
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
    }

    return (
      <div className={css(ss.container, custom.container)}>

        <SocialNav navigation={this.props.navigation}
                   dispatch={this.props.dispatch}
                   refresh={this.refresh}
                   mySocial={this.props.data} />


        <div className={css(ss.content, custom.content)}>
          {content}
        </div>

        <div className={css(ss.closeButton, custom.closeButton)}>
          <i className='fa fa-times click-effect' onClick={() => events.fire('hudnav--navigate', 'social')}></i>
        </div>

        {
          this.props.data.loading ? <FloatSpinner /> : null
        }
      </div>
    )
  }
}

const SocialMainWithQL = graphql(ql.queries.MySocial, {
  options: {
  }
})(SocialMain);
export default connect(s => s)(SocialMainWithQL);
