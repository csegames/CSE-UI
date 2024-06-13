/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { styled } from '@csegames/linaria/react';

// views
import CamelotCharacterCreation from '../../widgets/CharacterCreation';
import ColossusCharacterCreation from '../../widgets/ColossusCreation';
import News from '../../widgets/News';
import { ListenerHandle } from '../../lib/ListenerHandle';
import { ServerModel } from '../../api/webapi';
import { globalEvents } from '../../lib/EventEmitter';
import { ContentPhase } from '../../services/ContentPhase';

const NewsContainer = styled.div`
  background: url(/ui/images/news/bg.png) no-repeat, black;
  background-size: contain;
`;

export interface OverlayViewProps {
  phase: ContentPhase;
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
  COLOSSUSCREATION
}

class OverlayView extends React.Component<OverlayViewProps, OverlayViewState> {
  private patcherSelectListener: ListenerHandle;
  private viewContentListener: ListenerHandle;
  constructor(props: OverlayViewProps) {
    super(props);
    this.state = {
      previousView: view.NONE,
      currentView: view.NONE,
      currentProps: null,
      previousProps: null,
      inTransition: false,
      selectedServer: null
    };
  }

  public render() {
    return (
      <div className={`OverlayView ${this.getOverlaySubclass()}`}>
        {this.renderNews(this.props.phase, false)}
        {this.renderNews(this.props.phase, true)}
        {this.props.phase !== ContentPhase.Login ? this.renderCharacterContainer() : null}
      </div>
    );
  }

  private getOverlaySubclass(): string {
    switch (this.state.currentView) {
      case view.NONE:
        return this.state.previousView === view.NONE ? 'OverlayView--hidden' : '';
      case view.CHARACTERCREATION:
      case view.COLOSSUSCREATION:
      case view.CHARACTERSELECT:
        return 'OverlayView--wholescreen';
    }
    return '';
  }

  public componentDidMount() {
    this.patcherSelectListener = globalEvents.on('patcher--select-server', (server) => {
      this.setState({ selectedServer: server });
    });
    this.viewContentListener = globalEvents.on('view-content', (v: view, props: any) => {
      if (v === this.state.currentView) return;
      if (v === view.NONE) {
        globalEvents.trigger('resume-videos');
      } else {
        globalEvents.trigger('pause-videos');
      }

      this.setState({
        previousView: this.state.currentView,
        previousProps: this.state.currentProps,
        currentView: v,
        currentProps: props,
        inTransition: true
      });
      window.setTimeout(
        () =>
          this.setState({
            previousView: view.NONE,
            previousProps: null,
            inTransition: false
          } as any),
        333
      );
    });
  }

  public componentWillUnmount() {
    if (this.patcherSelectListener) {
      this.patcherSelectListener.close();
      this.patcherSelectListener = null;
    }

    if (this.viewContentListener) {
      this.viewContentListener.close();
      this.viewContentListener = null;
    }
  }

  private renderNews(phase: ContentPhase, current: boolean): JSX.Element {
    if (phase === ContentPhase.Colossus) return null;
    const v = current ? this.state.currentView : this.state.previousView;
    if (v != view.NEWS) return null;
    const props = current ? this.state.currentProps : this.state.previousProps;
    const className = current ? (this.state.inTransition ? '' : 'View--show') : '';
    return (
      <NewsContainer className={`View ${className} cse-ui-scroller-grey`}>
        <News {...props} />
      </NewsContainer>
    );
  }

  private renderCharacterContainer(): JSX.Element {
    return (
      <div className={`View ${this.hasCreationView() ? 'View--show' : 'View--hide'}`}>
        {this.renderCharacterCreator()}
      </div>
    );
  }

  private renderCharacterCreator(): JSX.Element {
    if (this.state.currentView == view.COLOSSUSCREATION) {
      return <ColossusCharacterCreation {...this.state.currentProps} />;
    }
    return <CamelotCharacterCreation {...this.state.currentProps} />;
  }

  private hasCreationView(): boolean {
    switch (this.state.currentView) {
      case view.CHARACTERCREATION:
      case view.COLOSSUSCREATION:
        return true;
      default:
        return false;
    }
  }
}

export default OverlayView;
