/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

const HUDNAV_NAVIGATE = 'hudnav--navigate';

interface HudNavWindowState {
  visible: boolean;
}

interface HudNavWindowProps {
  name: string;
  children?: (onClose: () => void) => any;
}

export class HudNavWindow extends React.PureComponent<HudNavWindowProps, HudNavWindowState> {
  private evh: any;
  constructor(props: HudNavWindowProps) {
    super(props);
    this.state = { visible: false };
  }
  public componentDidMount() {
    this.evh = game.on(HUDNAV_NAVIGATE, this.onnavigate);
  }
  public componentWillUnmount() {
    game.off(this.evh);
    this.evh = null;
  }

  public render() {
    return this.state.visible && this.props.children(this.onClose);
  }

  public onClose = () => {
    game.trigger(HUDNAV_NAVIGATE, this.props.name);
  }

  private onnavigate = (name: string) => {
    if (name === this.props.name) {
      this.setState({ visible: !this.state.visible });
    }
  }

}

export default HudNavWindow;
