/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { RootState } from '../redux/store';
import { connect, DispatchProp } from 'react-redux';
import { Launchable } from '../redux/launchablesSlice';
import { Product, updateSelection } from '../redux/navigationSlice';
import { ChannelInfo } from '../api/patcher/channelInfo';

const InfoContainer = 'ToolSelector-InfoContainer';
const ToolButton = 'ToolSelector-ToolButton';

interface ReactProps {}

interface InjectedProps {
  currentProduct: Product;
  channels: Record<number, ChannelInfo>;
  launchables: Record<string, Launchable>;
  selections: Record<Product, string | null>;
}

type Props = ReactProps & InjectedProps;

class AToolSelector extends React.Component<Props & DispatchProp> {
  public render() {
    const { currentProduct, channels, selections, launchables } = this.props;
    const selected = selections[currentProduct];

    const omit = new Set();
    for (const launchable of Object.values(launchables)) {
      omit.add(launchable.channelID);
    }

    const filtered = [];
    for (const channel of Object.values(channels)) {
      if (omit.has(channel.id)) continue;
      filtered.push(channel);
    }

    filtered.sort((l, r) => l.name.localeCompare(r.name));

    return (
      <div className={InfoContainer}>
        {filtered.map((ch) => {
          return (
            <div
              key={ch.id}
              className={`${ToolButton} ${selected === ch.name ? 'activeTool' : ''}`}
              onClick={() => this.onToolClick(ch)}
            >
              {ch.name}
            </div>
          );
        })}
      </div>
    );
  }

  private onToolClick = (channel: ChannelInfo) => {
    this.props.dispatch(updateSelection({ product: Product.Tools, key: channel.name }));
  };
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { product: currentProduct, selections } = state.navigation;
  const { channels, launchables } = state;
  return {
    ...ownProps,
    currentProduct,
    channels,
    launchables,
    selections
  };
};

export const ToolSelector = connect(mapStateToProps)(AToolSelector);
