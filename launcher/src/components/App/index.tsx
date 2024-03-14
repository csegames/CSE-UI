/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';

// Session
import { GlobalState } from '../../services/session';
import { changeRoute, Routes } from '../../services/session/routes';
import { HeroContentState, fetchHeroContent, validateHeroContent } from '../../services/session/heroContent';
import { NewsState, fetchPage } from '../../services/session/news';
import { SoundsState, muteMusic, unMuteMusic, muteSounds, unMuteSounds } from '../../services/session/sounds';
import { TopVeil, TopLeftVeil, BottomVeil, BottomLeftVeil, BottomRightVeil } from '../Viels';
import { Sound, playSound } from '../../lib/Sound';

// Components
import CUHero from '../CUHero';
import { CSEHero } from '../CSEHero';
import { ColossusHero } from '../ColossusHero';
import { ToolsHero } from '../ToolsHero';
import Header from '../Header';
import WindowHeader from '../WindowHeader';

import OverlayView, { view } from '../OverlayView';

// Widgets
import { Controller } from '../../widgets/Controller';
import { ListenerHandle } from '../../lib/ListenerHandle';
import { SoundPlayer } from '../SoundPlayer';
import { globalEvents } from '../../lib/EventEmitter';
import { patcher, Product } from '../../services/patcher';
import { ContentPhase, currentPhase, toProduct } from '../../services/ContentPhase';

export interface Props {
  dispatch?: (action: any) => void;
  currentRoute: Routes;
  heroContentState: HeroContentState;
  newsState: NewsState;
  soundsState: SoundsState;
}

export interface State {
  phase: ContentPhase;
}

export class PatcherApp extends React.Component<Props, State> {
  public name = 'cse-patcher';
  private heroContentInterval: any = null;
  private handles: ListenerHandle[] = [];

  constructor(props: Props) {
    super(props);
    this.state = {
      phase: currentPhase(patcher)
    };
  }

  public render() {
    return (
      <div className='PatcherApp'>
        <TopVeil />
        <TopLeftVeil />
        <BottomVeil />
        <BottomLeftVeil />
        <BottomRightVeil />
        <WindowHeader
          soundsState={this.props.soundsState}
          onMuteSounds={() =>
            this.props.dispatch(
              this.props.soundsState.playSound
                ? muteSounds(this.props.soundsState)
                : unMuteSounds(this.props.soundsState)
            )
          }
          onMuteMusic={() =>
            this.props.dispatch(
              this.props.soundsState.playMusic ? muteMusic(this.props.soundsState) : unMuteMusic(this.props.soundsState)
            )
          }
        />
        <Header
          phase={this.state.phase}
          changeRoute={this.onRouteChanged.bind(this)}
          activeRoute={this.props.currentRoute}
        />

        <div className='PatcherApp__content'>{this.renderPhase()}</div>

        <Controller phase={this.state.phase} activeRoute={this.props.currentRoute} />
        <SoundPlayer soundsState={this.props.soundsState} />
        <OverlayView phase={this.state.phase} />
      </div>
    );
  }

  private renderPhase(): React.ReactElement {
    switch (this.state.phase) {
      case ContentPhase.Camelot:
      case ContentPhase.Cube:
        return (
          <CUHero
            phase={this.state.phase}
            isFetching={this.props.heroContentState.isFetching}
            lastUpdated={this.props.heroContentState.lastFetchSuccess}
            items={this.props.heroContentState.items}
          />
        );
      case ContentPhase.Colossus:
        return <ColossusHero />;
      case ContentPhase.Tools:
        return <ToolsHero />;
      case ContentPhase.Login:
      default:
        return <CSEHero />;
    }
  }

  public componentDidMount() {
    // fetch initial hero content and then every 30 minutes validate & fetch hero content.
    if (!this.props.heroContentState.isFetching) this.props.dispatch(fetchHeroContent());
    this.heroContentInterval = setInterval(() => {
      this.props.dispatch(validateHeroContent());
      if (!this.props.heroContentState.isFetching) this.props.dispatch(fetchHeroContent());
    }, 60000 * 30);

    this.handles = [
      globalEvents.on('view-content', (v: view) => {
        if (
          (this.props.currentRoute === Routes.NEWS && v !== view.NEWS) ||
          (this.props.currentRoute === Routes.PATCHNOTES && v !== view.PATCHNOTES)
        ) {
          this.props.dispatch(changeRoute(Routes.HERO));
        }
      }),
      globalEvents.on('logged-in', () => {
        this.setState({ phase: currentPhase(patcher) });
      }),
      globalEvents.on('product-selection-changed', (product: Product) => {
        patcher.product = product;
        this.setState({ phase: currentPhase(patcher) });
      })
    ];
  }

  public componentWillUnmount() {
    // unregister intervals
    clearInterval(this.heroContentInterval);
    for (var handle of this.handles) handle.close();
    this.handles = [];
  }

  public componentDidUpdate() {}

  private onRouteChanged(route: Routes) {
    switch (route) {
      case Routes.HERO: {
        globalEvents.trigger('view-content', view.NONE, null);
        globalEvents.trigger('resume-videos');
        break;
      }
      case Routes.NEWS: {
        globalEvents.trigger('view-content', view.NEWS, {
          news: this.props.newsState,
          fetchPage: this.fetchNewsPage
        });
        globalEvents.trigger('pause-videos');
        break;
      }
      case Routes.CHAT: {
        globalEvents.trigger('view-content', view.CHAT, null);
        globalEvents.trigger('pause-videos');
        break;
      }
      case Routes.PATCHNOTES: {
        globalEvents.trigger('view-content', view.PATCHNOTES, null);
        globalEvents.trigger('pause-videos');
        break;
      }
    }
    this.props.dispatch(changeRoute(route));
    playSound(Sound.Select);
  }

  private fetchNewsPage = (page: number) => {
    this.props.dispatch(fetchPage(page, toProduct(this.state.phase)));
    playSound(Sound.Select);
  };
}

function select(state: GlobalState): Props {
  return {
    currentRoute: state.routes.current,
    heroContentState: state.heroContent,
    newsState: state.news,
    soundsState: state.sounds
  };
}

export default connect(select)(PatcherApp);
