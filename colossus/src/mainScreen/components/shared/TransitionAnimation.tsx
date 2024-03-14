/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*

The TransitionAnimation class is intended for use only in a narrow set of circumstances.
Most of the time, a standard CSS transition is sufficient.

TransitionAnimation allows you to trigger or retrigger animations in response to the change
of an arbitrary value (the 'changeVariable').  This is useful when you want to trigger an
animation in response to a value that CSS does not animate, such as the 'src' of an <img>.

*/

import * as React from 'react';

export interface Props {
  animationClass: string;
  changeVariable: any;

  defaultShouldPlayAnimation?: boolean;
  containerStyles?: string;
}

export interface State {
  shouldPlayAnimation: boolean;
}

export class TransitionAnimation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      shouldPlayAnimation: props.defaultShouldPlayAnimation
    };
  }

  public render() {
    const animationClass = this.state.shouldPlayAnimation ? this.props.animationClass : '';
    const containerClass = this.props.containerStyles ? this.props.containerStyles : '';
    return <div className={`${animationClass} ${containerClass}`}>{this.props.children}</div>;
  }

  // TODO : understand why we're trying to filter this.
  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (nextProps.changeVariable !== this.props.changeVariable) {
      return true;
    }

    if (nextState.shouldPlayAnimation !== this.state.shouldPlayAnimation) {
      return true;
    }

    return false;
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.changeVariable !== this.props.changeVariable) {
      this.playTransitionAnimation();
    }
  }

  private playTransitionAnimation = () => {
    // This cancels and restarts the animation one frame later.
    this.setState({ shouldPlayAnimation: false });

    window.setTimeout(() => {
      this.setState({ shouldPlayAnimation: true });
    }, 1);
  };
}
