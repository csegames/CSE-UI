/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { LifeState } from '@csegames/library/dist/hordetest/game/types/LifeState';
import * as React from 'react';

const ResourceBarContainer = 'Shared-ResourceBar-ResourceBarContainer';
const BackFill = 'Shared-ResourceBar-BackFill';
const BackFillFlash = 'Shared-ResourceBar-BackFillFlash';
const FillContainer = 'Shared-ResourceBar-FillContainer';
const Fill = 'Shared-ResourceBar-Fill';

const Text = 'Shared-ResourceBar-Text';

export interface Props {
  type: 'blue' | 'green' | 'orange' | 'red' | 'rage' | 'down' | 'reviving' | 'characterMod';
  current: number;
  max: number;
  text?: string;
  hideText?: boolean;
  containerClasses?: string;
  fillClasses?: string;
  isSquare?: boolean;
  unsquareText?: boolean;
  textStyles?: string;
  fixedBackfillAmount?: number;
  fixedBackfillStyle?: string;
  shouldPlayBackfill?: boolean;
  shouldFlashBackfill?: boolean;
  containerStyle?: object;
  showHighlights?: boolean;
  lifeState?: LifeState;
  startedReviving?: boolean;
}

export interface State {
  backFillPercentage: number;
}

export class ResourceBar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      backFillPercentage: (this.props.current / this.props.max) * 100
    };
  }

  public render() {
    const squareClass = this.props.isSquare ? 'square' : '';
    const barPercentage = (this.props.current / this.props.max) * 100;
    const highlightedClass = this.props.showHighlights ? '' : 'highlights';

    return (
      <div
        className={`${ResourceBarContainer} ${squareClass} ${this.props.containerClasses || ''}`}
        style={this.props.containerStyle ? this.props.containerStyle : {}}
      >
        {this.getBackfill()}
        <div className={`${FillContainer} ${this.props.type}`} style={{ width: `${barPercentage}%` }}>
          <div className={`${Fill} ${this.props.type} ${highlightedClass}  ${this.props.fillClasses || ''}`} />
        </div>
        {this.getText()}
        {this.props.text && (
          <div className={`${Text} ${squareClass} ${this.props.textStyles ? this.props.textStyles : ''}`}>
            {this.props.text}
          </div>
        )}
      </div>
    );
  }

  private getBackfill(): JSX.Element {
    if (!this.props.shouldPlayBackfill && this.props.fixedBackfillAmount === undefined) {
      return null;
    }

    const backfillAmount = this.props.shouldPlayBackfill
      ? this.state.backFillPercentage
      : (this.props.fixedBackfillAmount * 100) / this.props.max;
    return (
      <div
        className={`${BackFill} ${this.props.shouldFlashBackfill ? BackFillFlash : ''} ${
          this.props.fixedBackfillStyle ? this.props.fixedBackfillStyle : ''
        }`}
        style={{ width: `${backfillAmount}%` }}
      />
    );
  }

  private getText() {
    const textSquareClass = !this.props.unsquareText && this.props.isSquare ? 'square' : '';
    let downed = '';
    let text = 'REVIVING';
    if (this.props.lifeState == LifeState.Downed) {
      downed = 'downed';
      if (!this.props.startedReviving) {
        text = `${Math.round(this.props.current).toFixed(0)}`;
      }
    } else {
      text = `${Math.round(this.props.current).toFixed(0)} / ${Math.round(this.props.max).toFixed(0)}`;
    }
    return (
      !this.props.hideText &&
      !this.props.text && (
        <div className={`${Text} ${textSquareClass} ${downed} ${this.props.textStyles ? this.props.textStyles : ''}`}>
          {text}
        </div>
      )
    );
  }

  public componentDidUpdate(prevProps: Props) {
    if (
      this.props.shouldPlayBackfill &&
      (prevProps.current !== this.props.current || prevProps.max !== this.props.max)
    ) {
      this.setState({ backFillPercentage: (this.props.current / this.props.max) * 100 });
    }
  }
}
