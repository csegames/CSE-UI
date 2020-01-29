/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { isEqual } from 'lodash';

export interface Props {
  animationClass: string;
  animationDuration: number;
  changeVariable: any;

  defaultShouldPlayAnimation?: boolean;
  containerStyles?: string;
}

export interface State {
  shouldPlayAnimation: boolean;
}

export class TransitionAnimation extends React.Component<Props, State> {
  private animationTimeout: number;
  constructor(props: Props) {
    super(props);
    this.state = {
      shouldPlayAnimation: props.defaultShouldPlayAnimation,
    };
  }

  public render() {
    const animationClass = this.state.shouldPlayAnimation ? this.props.animationClass : '';
    const containerClass = this.props.containerStyles ? this.props.containerStyles : '';
    return (
      <div className={`${animationClass} ${containerClass}`}>
        {this.props.children}
      </div>
    );
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (nextProps.changeVariable !== this.props.changeVariable) {
      return true;
    }

    if ((typeof nextProps.changeVariable === 'object' || typeof this.props.changeVariable === 'object' ||
        (Array.isArray(nextProps.changeVariable) || Array.isArray(this.props.changeVariable))) &&
        !isEqual(nextProps.changeVariable, this.props.changeVariable)) {
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
      return;
    }

    if ((typeof prevProps.changeVariable === 'object' || typeof this.props.changeVariable === 'object' ||
        (Array.isArray(prevProps.changeVariable) || Array.isArray(this.props.changeVariable))) &&
        !isEqual(prevProps.changeVariable, this.props.changeVariable)) {
      // If changeVariable is an array or an object use deep comparison to see if values changed
      this.playTransitionAnimation();
      return;
    }
  }

  public componentWillUnmount() {
    window.clearTimeout(this.animationTimeout);
  }

  private playTransitionAnimation = () => {
    this.setState({ shouldPlayAnimation: false });

    window.setTimeout(() => {
      this.setState({ shouldPlayAnimation: true });
    }, 1);
  }
}
