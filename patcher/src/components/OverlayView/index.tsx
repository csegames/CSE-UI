/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as events from '@csegames/camelot-unchained/lib/events';

import { ql } from '@csegames/camelot-unchained';
import { patcher } from '../../services/patcher';

// views
import CharacterCreation from '../../widgets/CharacterCreation';
import News from '../../widgets/News';
import PatchNotes from '../../widgets/PatchNotes';
import Chat from '@csegames/cu-xmpp-chat';

export interface OverlayViewProps {
}

export interface OverlayViewState {
  previousView: view;
  previousProps: any;
  currentView: view;
  currentProps: any;
  inTransition: boolean;
  selectedServer: ql.schema.ServerModel;
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
  private patcherSelectListener: number;
  private viewContentListener: number;
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

        {patcher.hasLoginToken() ?
        <div className={`View ${this.state.currentView === view.CHAT ? 'View--show' : 'View--hide'}`}>
          <Chat loginToken={patcher.getLoginToken()} />
        </div>
        : null }

        {patcher.hasLoginToken() ?
          <div className={`View ${this.state.currentView === view.CHARACTERCREATION ? 'View--show' : 'View--hide'}`}>
            <CharacterCreation {...this.state.currentProps} />
          </div>
        : null }
      </div>
    );
  }

  public componentDidMount() {
    this.patcherSelectListener = events.on('patcher--select-server', (server) => {
      this.setState({ selectedServer: server });
    });
    this.viewContentListener = events.on('view-content', (v: view, props: any) => {
      if (v === this.state.currentView) return;
      if (v === view.NONE) {
        events.fire('resume-videos');
      } else {
        events.fire('pause-videos');
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
    events.off(this.patcherSelectListener);
    events.off(this.viewContentListener);
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
          <div className={`View ${className}`}>
            <News {...props} />
          </div>
        );

      case view.CHAT:
        return null;

      case view.PATCHNOTES:
        return (
          <div className={`View ${className}`}>
            <PatchNotes defaultServer={this.state.selectedServer} />
          </div>
        );

      // others later
    }
  }
}

export default OverlayView;
