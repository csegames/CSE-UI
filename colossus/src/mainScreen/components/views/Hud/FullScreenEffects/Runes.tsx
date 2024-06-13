/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { RuneType } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { game } from '@csegames/library/dist/_baseGame';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';

export function showRuneFullScreenEffect(type: RuneType) {
  game.trigger('show-rune-full-screen-effects', type);
}

const HIDE_DURATION = 1.3;

const Container = 'FullScreenEffects-Runes-Container';

export interface State {
  isVisible: boolean;
  runeType: RuneType;
}

export class RuneFullScreenEffects extends React.Component<{}, State> {
  private evh: ListenerHandle;
  private hideTimeout: number;
  constructor(props: {}) {
    super(props);
    this.state = {
      isVisible: false,
      runeType: null
    };
  }

  public render() {
    return this.state.isVisible ? (
      <div id='RuneFullScreeEffects' className={`${Container} ${RuneType[this.state.runeType]}`} />
    ) : null;
  }

  public componentDidMount() {
    this.evh = game.on('show-rune-full-screen-effects', this.handleShow);
  }

  public componentWillUnmount() {
    this.evh.close();
  }

  private handleShow = (runeType: RuneType) => {
    if (this.hideTimeout) {
      this.setState({ runeType });
      return;
    }

    this.setState({ isVisible: true, runeType });

    this.hideTimeout = window.setTimeout(() => {
      this.setState({ isVisible: false, runeType: null });
      this.hideTimeout = null;
    }, HIDE_DURATION * 1000);
  };
}
