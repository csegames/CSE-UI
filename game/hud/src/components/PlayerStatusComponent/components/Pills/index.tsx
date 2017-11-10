/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

// Calculate percentage to two decimal places
// tslint:disable-next-line
function P2DP(v: number, m: number) {
  return (((v / m) * 10000) | 0) / 100;
}

export enum Orientation {
  Horizontal,
  Vertical,
  CircleBottom,
  CircleTop,
}

export interface PillsProps {
  orientation?: Orientation;
  containerClass?: string;
  containerStyle?: Object;
  pillClass?: string;
  mirror?: boolean;
  valuePerPill: number;
  currentValue: number;
  maxValue: number;
  valueColor: string;
  depletedColor: string;
  wounds?: number;
  woundColor?: string;
  flashThreshold: number;
}

export interface PillsState {
  showTextValues: boolean;
}

class Pills extends React.PureComponent<PillsProps, PillsState> {

  private mounted = false;
  private hoverTimeoutID: any = null;
  private lastValue: number = 0;

  // animations
  private componentRef: HTMLUListElement = null;
  private endTimeRed: number = 0;
  private endTimeGreen: number = 0;

  constructor(props: PillsProps) {
    super(props);
    this.state = {
      showTextValues: false,
    };
  }

  public render() {
    const orientation = this.props.orientation || Orientation.Horizontal;

    // text value
    let textValue: any = null;
    if (this.state.showTextValues) {
      const classes: string[] = [];
      classes.push('PlayerStatusComponent__pills__textValue');
      if (this.props.mirror) classes.push('PlayerStatusComponent--mirrored');
      if (orientation > Orientation.Vertical) classes.push('PlayerStatusComponent__pills__textValue--circle');
      textValue = <div className={classes.join(' ')}>{`${this.props.currentValue}/${this.props.maxValue}`}</div>;
    }

    const now = Date.now();
    const flashThreshold = this.props.maxValue * this.props.flashThreshold / 100;
    if (this.lastValue - this.props.currentValue > flashThreshold) {
      this.endTimeRed = now + 200;
      setTimeout(() => this.startFlashRed(), 1);
      setTimeout(() => this.endFlashRed(), 201);
    } else if (this.props.currentValue - this.lastValue > flashThreshold) {
      this.endTimeGreen = now + 200;
      setTimeout(() => this.startFlashGreen(), 1);
      setTimeout(() => this.endFlashGreen(), 201);
    }
    this.lastValue = this.props.currentValue;

    if (orientation > Orientation.Vertical) {
      // Circle mode
      const pills: any[] = [];
      const totalDegrees = 132;
      const numPills = (this.props.maxValue / this.props.valuePerPill);
      const degPerPill = totalDegrees / numPills;
      let currentDegrees = orientation === Orientation.CircleBottom ? 47 : 175 + degPerPill;
      let displayedHealth = 0;

      for (let i = 0; i < numPills; ++i) {
        const remainder = this.props.currentValue - displayedHealth;
        const pillHealth = remainder > this.props.valuePerPill ? this.props.valuePerPill : remainder;
        const fillPercent = (pillHealth / this.props.valuePerPill) * 100;
        pills.push(this.circlePill(
          this.props.valueColor,
          this.props.depletedColor,
          fillPercent,
          currentDegrees,
          numPills,
          i,
        ));
        currentDegrees += degPerPill;
        displayedHealth += pillHealth;
      }

      return (
        <ul
          className={`PlayerStatusComponent__pills ${this.props.containerClass ? this.props.containerClass : ''}
          ${orientation === Orientation.Vertical ? 'PlayerStatusComponent__pills--vertical' : ''}`}
            ref={(r: any) => this.componentRef = r}
            onMouseEnter={() => this.onEnter()}
            onMouseLeave={() => this.onLeave()}>
          {pills}
          {textValue}
        </ul>
      );
    }

    // Horizontal or Vertical pills, rendered as a bar with a mask to render them as pills
    const max = this.props.maxValue;
    const filled = P2DP(this.props.currentValue, max);
    const wounds = this.props.wounds;
    const wmax = wounds ? 99 - (wounds * 33) : 100;     // 1=66%,2=33%,3=0%

    // Build class list for pills
    const classes: string[] = [];
    classes.push('PlayerStatusComponent__pills');
    classes.push(this.props.containerClass);
    if (this.props.orientation === Orientation.Vertical) {
      classes.push('PlayerStatusComponent__pills--vertical');
    }


    const dimension = orientation === Orientation.Horizontal ? 'width' : 'height';

    const bgLayer = (
      <div className='PlayerStatusComponent__pills__layer'
            style={{ background: this.props.depletedColor }}>
      </div>
    );

    const valueLayer = (
      <div className='PlayerStatusComponent__pills__layer'
          style={{ background: this.props.valueColor, [dimension]: filled + '%' }}>
      </div>
    );

    let woundsLayer: JSX.Element = undefined;
    if (wounds) {
      woundsLayer = (
        <div className='PlayerStatusComponent__pills__layer PlayerStatusComponent__pills__layer--wounds'
            style={{
              background: this.props.woundColor,
              [dimension]: (100 - wmax) + '%',
              [dimension === 'width' ? 'right' : 'bottom']: '0',
            }}>
        </div>
      );
    }

    return (
      <ul className={classes.join(' ')}
          ref={(r: any) => this.componentRef = r}
          onMouseEnter={() => this.onEnter()}
          onMouseLeave={() => this.onLeave()}>
        {bgLayer}
        {valueLayer}
        {woundsLayer}
        {textValue}
      </ul>
    );
  }

  public componentDidMount() {
    this.mounted = true;
  }

  public componentWillUnmount() {
    this.mounted = false;
  }

  private onEnter = () => {
    if (this.hoverTimeoutID != null || !this.mounted) return;
    this.hoverTimeoutID = setTimeout(() => this.setState({ showTextValues: true } as any), 500);
  }

  private onLeave = () => {
    if (!this.mounted) return;
    clearTimeout(this.hoverTimeoutID);
    this.hoverTimeoutID = null;
    this.setState({ showTextValues: false } as any);
  }


  private startFlashRed = () => {
    if (this.componentRef) {
      if (this.componentRef.className.indexOf('PlayerStatusComponent__pills--flashred') !== -1) return;
      this.componentRef.className += ' PlayerStatusComponent__pills--flashred';
    }
  }

  private endFlashRed = () => {
    if (Date.now() < this.endTimeRed) return;
    if (this.componentRef) {
      if (this.componentRef.className.indexOf('PlayerStatusComponent__pills--flashred') === -1) return;
      this.componentRef.className = this.componentRef.className.replace(' PlayerStatusComponent__pills--flashred', '')
        .trim();
    }
  }

  private startFlashGreen = () => {
    if (this.componentRef) {
      if (this.componentRef.className.indexOf('PlayerStatusComponent__pills--flashgreen') !== -1) return;
      this.componentRef.className += ' PlayerStatusComponent__pills--flashgreen';
    }
  }

  private endFlashGreen = () => {
    if (Date.now() < this.endTimeGreen) return;
    if (this.componentRef) {
      if (this.componentRef.className.indexOf('PlayerStatusComponent__pills--flashgreen') === -1) return;
      this.componentRef.className = this.componentRef.className.replace(' PlayerStatusComponent__pills--flashgreen', '')
        .trim();
    }
  }

  // rendering
  private circlePill = (
    fillColor: string,
    depletedColor: string,
    fillPercent: number,
    deg: number,
    numPills: number,
    key: number,
    offsetX: number = 60) => {
    const liHeight = 150 / numPills;
    if (fillPercent <= 0) {
      return <li key={key}
                style={{
                  WebkitTransform: `rotateZ(${deg}deg) translateX(${offsetX}px)`,
                  transform: `rotateZ(${deg}deg) translateX(${offsetX}px)`,
                  height: `${liHeight}px`,
                }}
                onMouseEnter={() => this.onEnter()}
                onMouseLeave={() => this.onLeave()} ><div  style={{ backgroundColor: depletedColor }}></div></li>;
    }
    if (fillPercent >= 100) {
      return <li key={key}
                style={{
                  WebkitTransform: `rotateZ(${deg}deg) translateX(${offsetX}px)`,
                  transform: `rotateZ(${deg}deg) translateX(${offsetX}px)`,
                  height: `${liHeight}px`,
                }}
                onMouseEnter={() => this.onEnter()}
                onMouseLeave={() => this.onLeave()}  ><div  style={{ backgroundColor: fillColor }}></div></li>;
    }

    const remainder = 100 - fillPercent;
    const html = `<div style="background: linear-gradient(to bottom, ${fillColor} ${fillPercent.toFixed(2)}%,
     ${depletedColor} ${(fillPercent + 0.1).toFixed(2)}%, ${depletedColor} ${remainder.toFixed(2)}%);" />`;
    return <li key={key}
              style={{
                WebkitTransform: `rotateZ(${deg}deg) translateX(${offsetX}px)`,
                transform: `rotateZ(${deg}deg) translateX(${offsetX}px)`,
                height: `${liHeight}px`,
              }}
              dangerouslySetInnerHTML={{ __html: html }}
              onMouseEnter={() => this.onEnter()}
              onMouseLeave={() => this.onLeave()} />;
  }
}

export default Pills;
