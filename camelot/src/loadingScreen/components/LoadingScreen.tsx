/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { clientAPI } from '@csegames/library/dist/camelotunchained/LoadingScreenClientAPI';
import { LoadingScreenReason } from '@csegames/library/dist/_baseGame/clientFunctions/LoadingScreenFunctions';
import { ParallaxContainer } from './ParallaxBG/ParallaxContainer';
import { FittingView } from '../../shared/components/FittingView';
import { SpriteSheetAnimator } from '../../shared/components/SpriteSheetAnimator';
import { LoadingScreenState } from '@csegames/library/dist/_baseGame/clientFunctions/LoadingScreenFunctions';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import LoadingSpriteURL from '../../images/spritesheet-loading.png';
import { ParallaxInfo, parallaxInfo } from './ParallaxBG/parallaxInfo';

import '../LoadingScreen-Styles.scss';

// Styles
const Container = 'LoadingScreen-Container';
const Overlay = 'LoadingScreen-Overlay';
const LogoWrapper = 'LoadingScreen-LogoWrapper';
const TriRealm = 'LoadingScreen-TriRealm';
const Logo = 'LoadingScreen-Logo';
const Trademark = 'LoadingScreen-Trademark';
const PoweredBy = 'LoadingScreen-PoweredBy';
const LoadingWrapper = 'LoadingScreen-LoadingWrapper';
const LoadingMessage = 'LoadingScreen-LoadingMessage';
const LoadingIcon = 'LoadingScreen-LoadingIcon';
const LoadingIconSizer = 'LoadingScreen-LoadingIconSizer';

interface Props {
  initialMessage?: string;
}

interface State {
  loadingState: LoadingScreenState;
}

export class LoadingScreen extends React.PureComponent<Props, State> {
  private loadingStateEventHandle: ListenerHandle;
  private parallaxInfoEntry: ParallaxInfo = parallaxInfo[Math.floor(Math.random() * 3)];

  constructor(props: Props) {
    super(props);

    this.state = {
      loadingState: { reason: LoadingScreenReason.Initialization, message: props.initialMessage, visible: true }
    };

    // Hook up to listen for loading state changes
    this.loadingStateEventHandle = clientAPI.bindLoadingScreenListener(this.loadingStateChanged.bind(this));
  }

  public render() {
    if (!this.state.loadingState?.visible) {
      return null;
    }

    return (
      <div className={Container}>
        <ParallaxContainer layerInfo={this.parallaxInfoEntry.layerInfo} miscInfo={this.parallaxInfoEntry.miscInfo} />

        <div className={Overlay}>
          <div className={LogoWrapper}>
            <div className={Logo} />
            <h3 className={TriRealm}>A TriRealm™ MMORPG</h3>
            <div className={Trademark}>
              Camelot Unchained and TriRealm are trademarks of City State Entertainment, LLC.
            </div>
          </div>
          <div className={PoweredBy} />
          <div className={LoadingWrapper}>
            <FittingView className={LoadingIconSizer}>
              <SpriteSheetAnimator
                styles={LoadingIcon}
                backgroundUrl={LoadingSpriteURL}
                numberOfRows={15}
                numberOfColumns={13}
                spriteHeight={300}
                spriteWidth={300}
                lastFrame={195}
              />
            </FittingView>
            <h3 className={LoadingMessage}>{this.state.loadingState.message}</h3>
          </div>
        </div>
      </div>
    );
  }

  public componentWillUnmount() {
    this.loadingStateEventHandle && this.loadingStateEventHandle.close();
  }

  private loadingStateChanged(loadingState: LoadingScreenState): void {
    this.setState({ loadingState });
  }
}
