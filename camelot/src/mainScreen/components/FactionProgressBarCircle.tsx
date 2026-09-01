/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { getFactionData } from '../gameData/factionData';
import { genID } from '@csegames/library/dist/_baseGame/utils/idGen';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import GlareURL from '../../images/progressbar/progress-bar-glare.png';

const Root = 'HUD-FactionProgressBarCircle-Root';
const Background = 'HUD-FactionProgressBarCircle-Background';
const Fill = 'HUD-FactionProgressBarCircle-Fill';
const Glare = 'HUD-FactionProgressBarCircle-Glare';
const GlareLine = 'HUD-FactionProgressBarCircle-GlareLine';

const DEFAULT_SIZE_VMIN = 20;

interface State {
  id: string;
}

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  progressPercent: number; // Between 0 and 1.
  factionIDOverride?: string;
  sizeOverrideVmin?: number;
}

interface InjectedProps {
  uiFactionID: string;
  dispatch?: AppDispatch;
}

type Props = ReactProps & InjectedProps;

class AFactionProgressBarCircle extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { id: genID() };
  }

  render(): JSX.Element {
    const { sizeOverrideVmin, uiFactionID, factionIDOverride, className, style, ...otherProps } = this.props;

    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <div {...otherProps} key={this.state.id} className={`${Root} ${className}`} style={this.buildRootStyle()}>
        <style>{this.buildFillStyle()}</style>
        <img className={Background} src={factionData.progressBarCircleBackgroundImage} />
        <img className={Fill} src={factionData.progressBarCircleFillImage} id={this.state.id} />
        <div className={Glare}>
          <img className={GlareLine} src={GlareURL} />
        </div>
        <div className={Glare} style={{ transform: `rotate(${this.getProgressDegrees()}deg)` }}>
          <img className={GlareLine} src={GlareURL} />
        </div>
      </div>
    );
  }

  private getScale(): number {
    return this.props.sizeOverrideVmin ? this.props.sizeOverrideVmin / DEFAULT_SIZE_VMIN : 1;
  }

  private getProgressDegrees(): number {
    return this.props.progressPercent * 360;
  }

  private getProgressRadians(): number {
    return this.props.progressPercent * 2 * Math.PI;
  }

  private buildRootStyle(): React.CSSProperties {
    const scale = this.getScale();
    let rootStyle: React.CSSProperties = {};
    if (scale !== 1) {
      rootStyle = {
        width: `${DEFAULT_SIZE_VMIN * scale}vmin`,
        height: `${DEFAULT_SIZE_VMIN * scale}vmin`
      };
    }
    return rootStyle;
  }

  private buildFillStyle(): string {
    // No progress, no fill.
    if (this.props.progressPercent === 0) {
      return `#${this.state.id} {opacity:0}`;
    }

    let style = '';

    // At full progress, there's no need for a mask.
    if (this.props.progressPercent < 1) {
      // Sadly, the `shape()` function isn't available to us, so we have to do things the hard way.
      style = `#${this.state.id} {-webkit-clip-path: `;

      // Start by drawing a line from the center to the top-middle.
      style += 'polygon(50% 50%, 50% 0%,';

      const progressRadians = this.getProgressRadians();

      const x = 50 + Math.sin(progressRadians) * 50;
      const y = 50 - Math.cos(progressRadians) * 50;

      if (this.props.progressPercent < 0.25) {
        // Line to the right.
        style += ` ${x}% 0%,`;
        // Then down to the edge of the circle.
        style += ` ${x}% ${y}%) }`;
      } else {
        // All the way to the top-right corner, then down to the center-right.
        style += ' 100% 0%, 100% 50%,';

        if (this.props.progressPercent < 0.5) {
          // Line down.
          style += ` 100% ${y}%,`;
          // Then left to the edge of the circle.
          style += ` ${x}% ${y}%) }`;
        } else {
          // All the way to the bottom-right corner, then left to the bottom-center.
          style += ' 100% 100%, 50% 100%,';

          if (this.props.progressPercent < 0.75) {
            // Line left.
            style += ` ${x}% 100%,`;
            // Then up to the edge of the circle.
            style += ` ${x}% ${y}%) }`;
          } else {
            // All the way to the bottom-left corner, then up to the center-left.
            style += ' 0% 100%, 0% 50%,';

            // We already checked progressPercent < 1 earlier, so we can just finish out.
            // Line up.
            style += ` 0% ${y}%,`;
            // Then right to the edge of the circle.
            style += ` ${x}% ${y}%) }`;
          }
        }
      }
    }
    return style;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    uiFactionID: ownProps.factionIDOverride ?? state.hud.uiFactionID
  };
};

export const FactionProgressBarCircle = connect(mapStateToProps)(AFactionProgressBarCircle);
