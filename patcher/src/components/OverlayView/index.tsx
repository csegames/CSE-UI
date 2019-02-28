/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from 'linaria/react';

import { Chat } from '@csegames/camelot-unchained';
import { patcher } from '../../services/patcher';

// views
import CharacterCreation from '../../widgets/CharacterCreation';
import News from '../../widgets/News';
import { ServerModel } from 'gql/interfaces';

const NewsContainer = styled.div`
  background: url(/ui/images/news/bg.png) no-repeat, black;
  background-size: contain;
`;

export interface OverlayViewProps {
}

export interface OverlayViewState {
  previousView: view;
  previousProps: any;
  currentView: view;
  currentProps: any;
  inTransition: boolean;
  selectedServer: ServerModel;
}

export enum view {
  NONE,
  CHARACTERCREATION,
  SETTINGS,
  SUPPORT,
  SERVER,
  CHARACTER,
  NEWS,
  CHAT,
  PATCHNOTES,
  CHARACTERSELECT,
}

class OverlayView extends React.Component<OverlayViewProps, OverlayViewState> {
  private patcherSelectListener: EventHandle;
  private viewContentListener: EventHandle;
  constructor(props: OverlayViewProps) {
    super(props);
    this.state = {
      previousView: view.NONE,
      currentView: view.NONE,
      currentProps: null,
      previousProps: null,
      inTransition: false,
      selectedServer: null,
    };
  }

  public render() {
    return (
      <div
        className={`OverlayView ${this.state.previousView === view.NONE && this.state.currentView === view.NONE ?
          'OverlayView--hidden' : ''} ${this.state.currentView === view.CHARACTERCREATION ||
            this.state.currentView === view.CHARACTERSELECT ? 'OverlayView--wholescreen' : ''}`}>
        {this.renderView(false)}
        {this.renderView(true)}

        {patcher.hasAccessToken() ?
        <div className={`View ${this.state.currentView === view.CHAT ? 'View--show' : 'View--hide'}`}>
          <Chat accessToken={patcher.getAccessToken()} />
        </div>
        : null }

        {patcher.hasAccessToken() ?
          <div className={`View ${this.state.currentView === view.CHARACTERCREATION ? 'View--show' : 'View--hide'}`}>
            <CharacterCreation {...this.state.currentProps} />
          </div>
        : null }
      </div>
    );
  }

  public componentDidMount() {
    this.patcherSelectListener = game.on('patcher--select-server', (server) => {
      this.setState({ selectedServer: server });
    });
    this.viewContentListener = game.on('view-content', (v: view, props: any) => {
      if (v === this.state.currentView) return;
      if (v === view.NONE) {
        game.trigger('resume-videos');
      } else {
        game.trigger('pause-videos');
      }

      this.setState({
        previousView: this.state.currentView,
        previousProps: this.state.currentProps,
        currentView: v,
        currentProps: props,
        inTransition: true,
      });
      setTimeout(() => this.setState({
        previousView: view.NONE,
        previousProps: null,
        inTransition: false,
      } as any), 333);
    });
  }

  public componentWillUnmount() {
    if (this.patcherSelectListener) {
      this.patcherSelectListener.clear();
      this.patcherSelectListener = null;
    }

    if (this.viewContentListener) {
      this.viewContentListener.clear();
      this.viewContentListener = null;
    }
  }

  private renderView = (current: boolean): JSX.Element => {
    const v = current ? this.state.currentView : this.state.previousView;
    const props = current ? this.state.currentProps : this.state.previousProps;
    const className = current ? this.state.inTransition ? '' : 'View--show' : '';

    switch (v) {
      default:
      case view.NONE: return null;

      case view.CHARACTERCREATION:
        return null;

      case view.NEWS:
        return (
          <NewsContainer className={`View ${className} cse-ui-scroller-grey`}>
            <News {...props} />
          </NewsContainer>
        );

      case view.CHAT:
        return null;

      // others later
    }
  }
}

export default OverlayView;
