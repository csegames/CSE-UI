// Typescript conversion based on https://github.com/thiagoc7/react-animate.css
//  which is under the MIT license as indicated below
//
// The MIT License (MIT)
//
// Copyright (c) 2015 Ryan Florence
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import * as React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

export interface AnimateProps {
  animationEnter: string;
  animationLeave: string;
  durationEnter: number;
  durationLeave: number;
  className?: string;
  key?: number | string;
  component?: string;
}

function renderStyle(animationEnter: string, animationLeave: string, durationEnter: number, durationLeave: number) {
  return (
    `
    .default-enter {
      opacity: 0;
    }
    .default-enter.${animationEnter} {
      animation-duration: ${durationEnter / 1000}s;
      animation-fill-mode: both;
      opacity: 1;
    }
    .default-leave {
      opacity: 1;
    }
    .default-leave.${animationLeave} {
      animation-duration: ${durationLeave / 1000}s;
      animation-fill-mode: both;
    }
    `
  );
}

class Animate extends React.Component<AnimateProps> {
  public render() {
    const { children, animationEnter, animationLeave, durationEnter, durationLeave } = this.props;

    return (
      <CSSTransitionGroup
        key={this.props.key}
        component={this.props.component ? this.props.component : 'div'}
        transitionName={{
          enter: 'default-enter',
          enterActive: animationEnter,
          leave: 'default-leave',
          leaveActive: animationLeave,
        }}
        transitionEnterTimeout={durationEnter}
        transitionLeaveTimeout={durationLeave}
        className={`${this.props.className ? this.props.className : ''}`}>
        <style dangerouslySetInnerHTML={{
          __html: renderStyle(animationEnter, animationLeave, durationEnter, durationLeave),
        }} />
        {children}
      </CSSTransitionGroup>
    );
  }
}

export default Animate;
