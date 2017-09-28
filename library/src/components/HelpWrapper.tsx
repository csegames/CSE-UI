/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { Steps } from 'intro.js-react';

export interface HelpWrapperStyle extends StyleDeclaration {
  HelpWrapper: React.CSSProperties;
}

export const defaultHelpWrapperStyle: HelpWrapperStyle = {
  HelpWrapper: {
    height: '100%',
  },
};

export interface StepInfo {
  element: string;
  intro: string;
  position?: string;
  tooltipClass?: string;
  highlightClass?: string;
}

export interface StepsProps {
  enabled?: boolean;
  initialStep: number;
  steps: StepInfo[];
  onExit: (index: number) => void;
  onStart?: (index: number) => void;
  onChange?: (nextIndex: number, nextElement: string) => void;
  onBeforeChange?: (nextIndex: number) => void;
  onAfterChange?: (index: number, element: string) => void;
  onPreventChange?: (index: number) => void;
  onComplete?: () => void;
  options?: any;
}

export interface HelpWrapperProps extends StepsProps {
  styles?: Partial<HelpWrapperStyle>;
}

export interface HelpWrapperState {
}

export class HelpWrapper extends React.Component<HelpWrapperProps, HelpWrapperState> {
  constructor(props: HelpWrapperProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultHelpWrapperStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    return (
      <div className={css(ss.HelpWrapper, custom.HelpWrapper)}>
        <Steps {...this.props} />
        {this.props.children}
      </div>
    );
  }
}

export default HelpWrapper;

