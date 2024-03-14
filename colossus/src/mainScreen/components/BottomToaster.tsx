/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { game } from '@csegames/library/dist/_baseGame';
import { Button } from './shared/Button';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { StringIDGeneralHide, getStringTableValue } from '../helpers/stringTableHelpers';

const kToasterAnimationDurationMS = 500;
const kToasterDurationMS = 2000;
const kToasterDelayMS = 500;

const Container = 'BottomToaster-Container';
const ButtonStyle = 'BottomToaster-Button';

enum ToasterStatus {
  None,
  Showing,
  Entering,
  Exiting
}

interface ReactProps {}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = InjectedProps & ReactProps;

interface State {
  /** New toaster content is pushed to the back.  Current toaster is at the front. */
  content: JSX.Element[];
  status: ToasterStatus;
}

export class ABottomToaster extends React.Component<Props, State> {
  private showHandle: ListenerHandle;

  private transitionTimer: number = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      content: [],
      status: ToasterStatus.None
    };
  }

  public render() {
    const visibleClass =
      (this.state.status === ToasterStatus.Entering || this.state.status === ToasterStatus.Showing) &&
      this.state.content.length > 0
        ? 'visible'
        : '';

    return (
      <div
        className={`${Container} ${visibleClass}`}
        style={{ transitionDuration: `${kToasterAnimationDurationMS / 1000}s` }}
      >
        {this.state.content.length > 0 && this.state.content[0]}
        {this.getCloseButton(visibleClass)}
      </div>
    );
  }

  public componentDidMount() {
    this.showHandle = game.on('show-bottom-toaster', this.show);
  }

  public componentWillUnmount() {
    this.showHandle.close();
    this.showHandle = null;

    if (this.transitionTimer) {
      window.clearTimeout(this.transitionTimer);
      this.transitionTimer = null;
    }
  }

  private show = (content: JSX.Element) => {
    const newContent = [...this.state.content, content];
    this.setState({ content: newContent });

    this.transitionNextToasterIn();
  };

  private transitionNextToasterIn(): void {
    requestAnimationFrame(() => {
      // If there are no queued toasters, stop.
      if (this.state.content.length < 1) {
        this.transitionTimer = null;
        return;
      }

      // If we already have a toaster on screen, don't interrupt it.
      if (this.state.status !== ToasterStatus.None) {
        return;
      }

      // Tell the toaster to start an entrance transition.
      this.setState({ status: ToasterStatus.Entering });

      // Wait out the transition, then update status.
      this.transitionTimer = window.setTimeout(() => {
        // Tell the toaster that it should now be fully visible.
        this.setState({ status: ToasterStatus.Showing });

        // Wait until the toaster expires, then get rid of it.
        this.transitionTimer = window.setTimeout(() => {
          this.transitionToasterOut();
        }, kToasterDurationMS);
      }, kToasterAnimationDurationMS);
    });
  }

  private transitionToasterOut(): void {
    requestAnimationFrame(() => {
      // Tell the toaster to start an exit transition.
      this.setState({ status: ToasterStatus.Exiting });

      // Wait out the transition, then update status.
      this.transitionTimer = window.setTimeout(() => {
        // Tell the toaster that it should now be gone, and remove the expired toaster from the content array.
        this.setState({ content: this.state.content.slice(1), status: ToasterStatus.None });

        // Wait a moment before checking if there is another toaster to show.
        this.transitionTimer = window.setTimeout(() => {
          this.transitionNextToasterIn();
        }, kToasterDelayMS);
      }, kToasterAnimationDurationMS);
    });
  }

  private emptyContent(): void {
    this.setState({ content: [], status: ToasterStatus.None });
  }

  private getCloseButton(visible: string): JSX.Element {
    if (visible === 'visible') {
      return (
        <Button
          type={'double-border'}
          text={getStringTableValue(StringIDGeneralHide, this.props.stringTable)}
          styles={ButtonStyle}
          onClick={this.emptyContent.bind(this)}
          disabled={false}
        />
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    stringTable
  };
}

export const BottomToaster = connect(mapStateToProps)(ABottomToaster);
