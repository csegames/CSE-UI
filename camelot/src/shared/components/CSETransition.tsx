/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { genID } from '@csegames/library/dist/_baseGame/utils/idGen';
import * as React from 'react';
import { RootState } from '../../mainScreen/redux/store';
import { connect } from 'react-redux';

const DefaultEntryAnimationDurationMS = 300;
const DefaultExitAnimationDurationMS = 300;

type CSEAnimationType = 'fade' | 'accordian';

const enum TransitionState {
  NotReady,
  Entering,
  Shown,
  Exiting,
  Hidden
}

interface State {
  needsAnimationUpdate: boolean;
  transitionState: TransitionState;
  animationToggle: boolean;
}

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  show: boolean;
  /** Default is 'fade'. */
  entryAnimation?: CSEAnimationType;
  entryDurationMS?: number;
  /** Default is 'fade'. */
  exitAnimation?: CSEAnimationType;
  exitDurationMS?: number;
  removeWhenHidden?: boolean;
  innerRef?: React.ForwardedRef<unknown>;
  onEnterComplete?: () => void;
  onExitComplete?: () => void;
}

interface InjectedProps {
  vminPx: number;
}

type Props = ReactProps & InjectedProps;

class ACSETransition extends React.Component<Props, State> {
  private entryKeyframeId: string;
  private exitKeyframeId: string;
  private animationTimeout: NodeJS.Timeout;
  private animationInterval: any;

  private rootRef: HTMLDivElement;

  constructor(props: Props) {
    super(props);

    const id = genID();
    this.entryKeyframeId = `Entry${id}`;
    this.exitKeyframeId = `Exit${id}`;

    this.state = { needsAnimationUpdate: true, transitionState: TransitionState.NotReady, animationToggle: true };
  }

  public render(): React.ReactNode {
    const { vminPx, children, className, style, innerRef, ...otherProps } = this.props;

    const finalStyle: React.CSSProperties = { ...(style ?? {}), ...this.getRequiredStylesForAnimation() };
    if (!this.state.needsAnimationUpdate) {
      switch (this.state.transitionState) {
        case TransitionState.Entering: {
          finalStyle.animation = `${this.entryKeyframeId} ${
            this.props.entryDurationMS ?? DefaultEntryAnimationDurationMS
          }ms`;
          break;
        }
        case TransitionState.Exiting: {
          finalStyle.animation = `${this.exitKeyframeId} ${
            this.props.exitDurationMS ?? DefaultExitAnimationDurationMS
          }ms`;
          break;
        }
        case TransitionState.Hidden: {
          if (this.props.entryAnimation === 'accordian' || this.props.exitAnimation === 'accordian') {
            finalStyle.maxHeight = '0vmin';
          }
          break;
        }
      }
    }

    finalStyle.opacity =
      this.state.transitionState === TransitionState.Hidden || this.state.needsAnimationUpdate ? 0 : 1;
    finalStyle.pointerEvents = this.state.transitionState === TransitionState.Shown ? 'auto' : 'none';
    if (this.state.animationToggle) finalStyle.columnCount = 1;

    return (
      <div
        className={`${className} ${this.state.animationToggle}`}
        {...otherProps}
        style={finalStyle}
        ref={(rr) => {
          this.rootRef = rr;
          if (typeof innerRef === 'function') {
            innerRef?.(rr);
          }
          if (this.state.transitionState === TransitionState.NotReady) {
            this.initialize();
          } else if (this.state.needsAnimationUpdate) {
            if (this.getBoundingClientRect()) {
              this.cleanUpAnimations();
              this.createEntryAnimation();
              this.createExitAnimation();
              this.setState({ needsAnimationUpdate: false });
            }
          }
        }}
      >
        {this.props.removeWhenHidden && this.state.transitionState === TransitionState.Hidden ? null : children}
      </div>
    );
  }

  getRequiredStylesForAnimation(): React.CSSProperties {
    if (
      (this.props.entryAnimation === 'accordian' && this.state.transitionState === TransitionState.Entering) ||
      (this.props.exitAnimation === 'accordian' && this.state.transitionState === TransitionState.Exiting)
    ) {
      return {
        overflow: 'hidden'
      };
    }
    return {};
  }

  private initialize(): void {
    this.createEntryAnimation();
    this.createExitAnimation();
    const initialState = this.props.show ? TransitionState.Entering : TransitionState.Hidden;
    this.applyTransitionState(initialState);
    this.setState({ needsAnimationUpdate: false });
  }

  getBoundingClientRect(): DOMRect {
    return this.rootRef?.getBoundingClientRect();
  }

  componentWillUnmount(): void {
    this.cleanUpAnimations();

    // If we were mid-animation, stop waiting for them.
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
      clearInterval(this.animationInterval);
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    // If the screen was resized, we may need to reinitialize the animations.
    if (this.props.vminPx !== prevProps.vminPx) {
      this.setState({ needsAnimationUpdate: true });
    }

    // Is it time to start an entrance animation?
    if (this.props.show && !prevProps.show) {
      this.applyTransitionState(TransitionState.Entering);
    }
    // Is it time to start an exit animation?
    else if (!this.props.show && prevProps.show) {
      this.applyTransitionState(TransitionState.Exiting);
    }
  }

  private cleanUpAnimations(): void {
    // Remove our keyframes to avoid polluting the style sheets indefinitely.
    // We have to find these by iteration because insertRule() and deleteRule() do not preserve previous indices.
    const styleSheet = window.document.styleSheets[0];
    const rules = styleSheet.cssRules;
    let entryIndex: number = -1;
    let exitIndex: number = -1;
    for (let i = 0; i < rules.length; ++i) {
      if (entryIndex === -1 && rules.item(i).cssText.includes(this.entryKeyframeId)) {
        entryIndex = i;
      }
      if (exitIndex === -1 && rules.item(i).cssText.includes(this.exitKeyframeId)) {
        exitIndex = i;
      }
    }
    // Delete them in the order that won't wreck the other index before we use it.
    if (entryIndex > exitIndex) {
      if (entryIndex > -1 && entryIndex < styleSheet.cssRules.length) styleSheet.deleteRule(entryIndex);
      if (exitIndex > -1 && exitIndex < styleSheet.cssRules.length) styleSheet.deleteRule(exitIndex);
    } else {
      if (exitIndex > -1 && exitIndex < styleSheet.cssRules.length) styleSheet.deleteRule(exitIndex);
      if (entryIndex > -1 && entryIndex < styleSheet.cssRules.length) styleSheet.deleteRule(entryIndex);
    }
  }

  private createEntryAnimation(): void {
    const animType = this.props.entryAnimation ?? 'fade';
    switch (animType) {
      case 'accordian': {
        const { height } = this.getBoundingClientRect();
        window.document.styleSheets[0].insertRule(
          `@keyframes ${this.entryKeyframeId} { 0% {max-height:0vmin;} 100% {max-height:${
            height / this.props.vminPx
          }vmin;}}`
        );
        break;
      }
      case 'fade': {
        window.document.styleSheets[0].insertRule(
          `@keyframes ${this.entryKeyframeId} { 0% {opacity:0;} 100% {opacity:1;}}`
        );
        break;
      }
    }
  }

  private createExitAnimation(): void {
    const animType = this.props.exitAnimation ?? 'fade';
    switch (animType) {
      case 'accordian': {
        const { height } = this.getBoundingClientRect();
        window.document.styleSheets[0].insertRule(
          `@keyframes ${this.exitKeyframeId} { 0% {max-height:${
            height / this.props.vminPx
          }vmin;} 100% {max-height: 0vmin;}}`
        );
        break;
      }
      case 'fade': {
        window.document.styleSheets[0].insertRule(
          `@keyframes ${this.exitKeyframeId} { 0% {opacity:1;} 100% {opacity:0;}}`
        );
        break;
      }
    }
  }

  private applyTransitionState(newState: TransitionState): void {
    // If another animation was running, we can interrupt it.
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
      clearInterval(this.animationInterval);
      this.animationTimeout = null;
      this.animationInterval = null;
    }

    // Any bookkeeping for the new state.
    switch (newState) {
      case TransitionState.Entering: {
        this.animationInterval = setInterval(() => {
          this.setState({ animationToggle: !this.state.animationToggle });
        }, 16);
        this.animationTimeout = setTimeout(() => {
          // When the animation concludes, move to the Shown state!
          this.animationTimeout = null;
          clearInterval(this.animationInterval);
          this.animationInterval = null;
          this.applyTransitionState(TransitionState.Shown);
          this.props.onEnterComplete?.();
        }, this.props.entryDurationMS ?? DefaultEntryAnimationDurationMS);
        break;
      }
      case TransitionState.Exiting: {
        this.animationInterval = setInterval(() => {
          this.setState({ animationToggle: !this.state.animationToggle });
        }, 16);
        this.animationTimeout = setTimeout(() => {
          // When the animation concludes, move to the Shown state!
          this.animationTimeout = null;
          clearInterval(this.animationInterval);
          this.animationInterval = null;
          this.applyTransitionState(TransitionState.Hidden);
          this.props.onExitComplete?.();
        }, this.props.exitDurationMS ?? DefaultExitAnimationDurationMS);
        break;
      }
      case TransitionState.Shown:
      case TransitionState.Hidden: {
        // These are just resting states.  They don't do anything for now.
        break;
      }
    }

    // And then actually enter the new state.  This should trigger animations if appropriate.
    this.setState({ transitionState: newState });
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { vminPx } = state.hud;

  return {
    ...ownProps,
    vminPx
  };
}

// We use forwardRef as this.props.ref is forbidden inside of render methods: https://react.dev/reference/react/forwardRef
const ForwardedCSETransition = React.forwardRef((props: Props, ref) => <ACSETransition {...props} innerRef={ref} />);

export const CSETransition = connect(mapStateToProps, null, null, { forwardRef: true })(ForwardedCSETransition);
