/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

// Calculate percentage to two decimal places
function P2DP(v: number, m: number) {
  return (((v / m) * 10000)|0) / 100;
}

const PILL_DIVIDER_WIDTH = 2;     // % width of a pill separator
const PILL_MARGIN = 10;            // % widht of pill margin

export enum Orientation {
  Horizontal,
  Vertical,
  CircleBottom,
  CircleTop
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
}

export interface PillsState {
  showTextValues: boolean;
}

class Pills extends React.Component<PillsProps, PillsState> {

  constructor(props: PillsProps) {
    super(props);
    this.state = {
      showTextValues: false
    }
  }

  private hoverTimeoutID: any = null;

  onEnter = () => {
    if (this.hoverTimeoutID != null) return;
    this.hoverTimeoutID = setTimeout(() => this.setState({showTextValues: true} as any), 500);
  }

  onLeave = () => {
    clearTimeout(this.hoverTimeoutID);
    this.hoverTimeoutID = null;
    this.setState({showTextValues: false} as any);
  }

  private lastValue: number = 0;

  // animations
  private componentRef: HTMLUListElement = null;
  private endTimeRed: number = 0;
  startFlashRed = () => {
    if (this.componentRef) {
      if (this.componentRef.className.indexOf('PlayerStatusComponent__pills--flashred') != -1) return;
      this.componentRef.className += ' PlayerStatusComponent__pills--flashred';
    }
  }

  endFlashRed = () => {
    if (Date.now() < this.endTimeRed) return;
    if (this.componentRef) {
      if (this.componentRef.className.indexOf('PlayerStatusComponent__pills--flashred') == -1) return;
      this.componentRef.className = this.componentRef.className.replace(' PlayerStatusComponent__pills--flashred', '').trim();
    }
  }

  private endTimeGreen: number = 0;
  startFlashGreen = () => {
    if (this.componentRef) {
      if (this.componentRef.className.indexOf('PlayerStatusComponent__pills--flashgreen') != -1) return;
      this.componentRef.className += ' PlayerStatusComponent__pills--flashgreen';
    }
  }

  endFlashGreen = () => {
    if (Date.now() < this.endTimeGreen) return;
    if (this.componentRef) {
      if (this.componentRef.className.indexOf('PlayerStatusComponent__pills--flashgreen') == -1) return;
      this.componentRef.className = this.componentRef.className.replace(' PlayerStatusComponent__pills--flashgreen', '').trim();
    }
  }

  // rendering
  circlePill = (fillColor: string, depletedColor: string, fillPercent: number, deg: number, numPills: number, key: number, offsetX: number = 60) => {
    const liHeight = 150 / numPills;
    if (fillPercent <= 0) return <li key={key}
                                     style={{'-webkit-transform': `rotateZ(${deg}deg) translateX(${offsetX}px)`, transform: `rotateZ(${deg}deg) translateX(${offsetX}px)`, height: `${liHeight}px`}}
                                     onMouseEnter={() => this.onEnter()}
                                     onMouseLeave={() => this.onLeave()} ><div  style={{backgroundColor: depletedColor}}></div></li>;
    if (fillPercent >= 100) return <li key={key}
                                       style={{'-webkit-transform': `rotateZ(${deg}deg) translateX(${offsetX}px)`, transform: `rotateZ(${deg}deg) translateX(${offsetX}px)`, height: `${liHeight}px`}}
                                       onMouseEnter={() => this.onEnter()}
                                       onMouseLeave={() => this.onLeave()}  ><div  style={{backgroundColor: fillColor}}></div></li>;

    const remainder = 100 - fillPercent;
    const html = `<div style="background: linear-gradient(to bottom, ${fillColor} ${fillPercent.toFixed(2)}%, ${depletedColor} ${(fillPercent + 0.1).toFixed(2)}%, ${depletedColor} ${remainder.toFixed(2)}%);" />`;
    return <li key={key}
               style={{'-webkit-transform': `rotateZ(${deg}deg) translateX(${offsetX}px)`, transform: `rotateZ(${deg}deg) translateX(${offsetX}px)`, height: `${liHeight}px`}}
               dangerouslySetInnerHTML={{__html: html}}
               onMouseEnter={() => this.onEnter()}
               onMouseLeave={() => this.onLeave()} />;
  }

  clipPathForPills = (pillSize: number) => {
    // generate a clip-path to represent the pills.  Work based on the following
    //
    // All values are in %
    // pillSize is the size of a pill in % of total width (excluding any dividers)
    // A divider starts off as 1% wide (for now)
    // The number of pills is 100 / pill size
    // The number of dividers is pills - 1
    // The available width for pills is 100 minus dividers total width
    // Pill size is re-calculated based on the number we need (calculated above)
    //  and the available width
    // Finally any remaining unused width is spread accross the deviders
    let divider = PILL_DIVIDER_WIDTH;                         // divider start size
    const count = (100 / pillSize)|0;                         // how many pills we need
    const sep = (count - 1) * divider;                        // total divider space
    const size = ((((100 - sep) / count) * 100)|0) / 100;     // pill size
    const spare = 100 - (count * size + sep);                 // leftovers
    divider += (((spare / (count - 1)) * 100)|0) / 100;       // spread across dividers

    // Now build a polygon that will mask each pill
    //
    //  The aim is to produce a path that looks like this (repeated for each pill required)
    //  The sequence is across, up, accorss, down repeated for each pill
    //  When the path closes, it completes the last side of the pill, and becase the joining
    //  lines are not closed and 0 width, they cannot be seen.
    //
    //   +-----+ +-----+ +-----+ +-----+
    //   |     | |     | |     | |     |
    //   |     | |     | |     | |     |
    //   +-----+-+-----+-+-----+-+-----+
    //
    let path: string = '';
    let pcnt = 0;
    while (pcnt < 100) {
      if (path !== '') path += ',';
      path += `${pcnt}% ${PILL_MARGIN}%,${pcnt}% ${100-PILL_MARGIN}%,`;        // Accross, Up
      pcnt += size;
      path += `${pcnt}% ${100-PILL_MARGIN}%,${pcnt}% ${PILL_MARGIN}%`;         // Accross, Down
      if (pcnt < 100) {
        pcnt += divider;        // divider width
      }
    }
    return `polygon(${path})`;
  }

  render() {
    let orientation = this.props.orientation || Orientation.Horizontal;

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
    if (this.props.currentValue < this.lastValue) {
      this.endTimeRed = now + 200;
      setTimeout(() => this.startFlashRed(), 1);
      setTimeout(() => this.endFlashRed(), 201);
    } else if (this.props.currentValue > this.lastValue) {
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
      let currentDegrees = orientation == Orientation.CircleBottom ? 47 : 175 + degPerPill;
      let displayedHealth = 0;

      for (let i = 0; i < numPills; ++i) {
        const remainder = this.props.currentValue - displayedHealth;
        const pillHealth = remainder > this.props.valuePerPill ? this.props.valuePerPill : remainder;
        const fillPercent = (pillHealth / this.props.valuePerPill) * 100;
        pills.push(this.circlePill(this.props.valueColor, this.props.depletedColor, fillPercent, currentDegrees, numPills, i));
        currentDegrees += degPerPill;
        displayedHealth += pillHealth;
      }

      return (
        <ul className={`PlayerStatusComponent__pills ${this.props.containerClass ? this.props.containerClass : ''} ${orientation == Orientation.Vertical ? 'PlayerStatusComponent__pills--vertical' : ''}`}
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
    const pill = P2DP(this.props.valuePerPill, max);
    let filled = P2DP(this.props.currentValue, max);
    const wounds = this.props.wounds;
    const wmax = wounds ? 99 - (wounds * 33) : 100;     // 1=66%,2=33%,3=0%

    // Build class list for pills
    const classes: string[] = [];
    classes.push('PlayerStatusComponent__pills');
    classes.push(this.props.containerClass);
    if (this.props.orientation === Orientation.Vertical) {
        classes.push('PlayerStatusComponent__pills--vertical');
    }

    // build clip path for pills
    const clipPath: any = { '-webkit-clip-path': this.clipPathForPills(pill) };

    let dimension = orientation === Orientation.Horizontal ? 'width' : 'height';

    const bgLayer = (
      <div className='PlayerStatusComponent__pills__layer'
            style={{ background: this.props.depletedColor}}>
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
        <div className='PlayerStatusComponent__pills__layer playerStatusComponent__pills__layer--wounds'
            style={{
              background: this.props.woundColor,
              [dimension]: (100 - wmax) + '%',
              [dimension === 'width' ? 'right' : 'bottom']: '0'
            }}>
        </div>
      );
    }

    return (
      <ul className={classes.join(' ')}
          ref={(r: any) => this.componentRef = r}
          onMouseEnter={() => this.onEnter()}
          onMouseLeave={() => this.onLeave()}>
        <div style={clipPath}>
          {bgLayer}
          {valueLayer}
          {woundsLayer}
        </div>
        {textValue}
      </ul>
    );
  }
}

export default Pills;
