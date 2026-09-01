/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import moment from 'moment';
import { UpdateMessage } from './Update/UpdateMessage';
import { PatchButton } from './PatchButton';
import { RootState } from '../redux/store';
import { connect, DispatchProp } from 'react-redux';
import { ProgressBar } from './Update/ProgressBar';
import { Product } from '../redux/navigationSlice';
import { Launchable } from '../redux/launchablesSlice';
import { ChannelInfo } from '../api/patcher/channelInfo';

const Root = 'Controller-PatchButton-Root';
const UpdateInfoContainer = 'Controller-PatchButton-UpdateInfoContainer';
const LastUpdatedText = 'Controller-PatchButton-LastUpdatedText';
const ButtonContainer = 'Controller-PatchButton-ButtonContainer';

interface ReactProps {}

interface InjectedProps {
  product: Product;
  launchables: Record<string, Launchable>;
  channels: Record<number, ChannelInfo>;
  selections: Record<Product, string | null>;
}

type Props = ReactProps & InjectedProps;

interface State {
  commandLine: string;
}

class APatchDisplay extends React.Component<Props & DispatchProp, State> {
  public render() {
    const selected = this.getSelected();
    const lastUpdatedText = selected?.lastUpdated ? `Updated ${moment(selected.lastUpdated).fromNow()}` : null;
    return (
      <>
        <div className={Root}>
          <div className={UpdateInfoContainer}>
            <UpdateMessage />
            {lastUpdatedText && <div className={LastUpdatedText}>{lastUpdatedText}</div>}
            <ProgressBar />
            <div className={ButtonContainer}>
              <PatchButton selected={selected} />
            </div>
          </div>
        </div>
      </>
    );
  }

  private getSelected(): Launchable | ChannelInfo | undefined {
    const { product, selections, launchables, channels } = this.props;
    const selection = selections[product] ?? '0';
    switch (product) {
      case Product.CamelotUnchained:
        return launchables[selection];
      case Product.Tools:
        return Object.values(channels).find((ch) => ch.name === selection);
      default:
        return undefined;
    }
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { product, selections } = state.navigation;
  const { launchables, channels } = state;
  return {
    ...ownProps,
    product,
    launchables,
    channels,
    selections
  };
};

export const PatchDisplay = connect(mapStateToProps)(APatchDisplay);
