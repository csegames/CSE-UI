/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { CSSKey, getCSSVariable } from '../MainScreen-Styles-Variables';
import { RootState } from '../redux/store';
import { DEFAULT_TOAST_DURATION_MILLIS, hideToaster, ToasterParams } from '../redux/toastersSlice';
import { BorderBackground, BorderType, FactionBorder } from './FactionBorder';

// Styles.
const Root = 'HUD-ToasterPane-Root';
const PreviousWrapper = 'HUD-ToasterPane-PreviousToasterWrapper';
const CurrentWrapper = 'HUD-ToasterPane-CurrentToasterWrapper';
const EyebrowText = 'HUD-ToasterPane-EyebrowText';
const TitleText = 'HUD-ToasterPane-TitleText';
const MessageText = 'HUD-ToasterPane-MessageText';

interface State {
  // Stash the displayed modals so we can animate between modals if multiple are queued.
  currentToaster: ToasterParams;
  prevToaster: ToasterParams;
}

interface ReactProps {}

interface InjectedProps {
  toasters: ToasterParams[];
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ToasterPane extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentToaster: null,
      prevToaster: null
    };
  }

  public render(): React.ReactNode {
    const showBottom = this.state.currentToaster || this.state.prevToaster;
    return (
      <div className={Root}>
        {showBottom && (
          <>
            <FactionBorder
              className={PreviousWrapper}
              key={`Prev${this.state.prevToaster?.id ?? 'None'}`}
              type={BorderType.Primary}
              background={BorderBackground.Leather}
            >
              {this.renderToaster(this.state.prevToaster)}
            </FactionBorder>
            <FactionBorder
              className={CurrentWrapper}
              key={`Curr${this.state.currentToaster?.id ?? 'None'}`}
              type={BorderType.Primary}
              background={BorderBackground.Leather}
            >
              {this.renderToaster(this.state.currentToaster)}
            </FactionBorder>
          </>
        )}
      </div>
    );
  }

  private renderToaster(toaster: ToasterParams): React.ReactNode {
    if (!toaster) {
      return null;
    }

    if (typeof toaster.content === 'function') {
      return toaster.content();
    } else {
      return (
        <>
          {toaster.content.eyebrow && <div className={EyebrowText}>{toaster.content.eyebrow}</div>}
          {toaster.content.title && (
            <div className={`${TitleText}${toaster.content.isError ? ' error' : ''}`}>{toaster.content.title}</div>
          )}
          {toaster.content.message && (
            <div className={`${MessageText}${toaster.content.isError ? ' error' : ''}`}>{toaster.content.message}</div>
          )}
        </>
      );
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    // If the current toast has changed, update state.
    if (this.props.toasters[0]?.id != this.state.currentToaster?.id) {
      this.setState({ currentToaster: this.props.toasters[0], prevToaster: this.state.currentToaster });

      if (this.props.toasters.length > 0) {
        // Queue up the exit for the top toast.
        window.setTimeout(() => {
          this.props.dispatch(hideToaster(this.props.toasters[0].id));
        }, this.props.toasters[0].duration ?? DEFAULT_TOAST_DURATION_MILLIS);
      } else {
        window.setTimeout(() => {
          this.setState({ prevToaster: null });
        }, this.getFadeDurationMillis());
      }
    }
  }

  private getFadeDurationMillis(): number {
    // Get rid of anything non-numeric so we can convert safely.
    const stringDuration = getCSSVariable(CSSKey.ToasterFadeDuration).replace(/[^0-9\.]+/g, '');
    const duration = +stringDuration * 1000;
    return duration;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { toasters } = state.toasters;

  return {
    ...ownProps,
    toasters
  };
}

export default connect(mapStateToProps)(ToasterPane);
