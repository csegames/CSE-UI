/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

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
  displayWounds?: boolean;
  woundColor?: string;
  mirror?: boolean;
  valuePerPill: number;
  currentValue: number;
  maxValue: number;
  valueColor: string;
  depletedColor: string;
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
    if (this.componentRef.className.indexOf('PlayerStatusComponent__pills--flashred') != -1) return;
    this.componentRef.className += ' PlayerStatusComponent__pills--flashred';
  }

  endFlashRed = () => {
    if (Date.now() < this.endTimeRed) return;
    if (this.componentRef.className.indexOf('PlayerStatusComponent__pills--flashred') == -1) return;
    this.componentRef.className = this.componentRef.className.replace(' PlayerStatusComponent__pills--flashred', '').trim();
  }

  private endTimeGreen: number = 0;
  startFlashGreen = () => {
    if (this.componentRef.className.indexOf('PlayerStatusComponent__pills--flashgreen') != -1) return;
    this.componentRef.className += ' PlayerStatusComponent__pills--flashgreen';
  }

  endFlashGreen = () => {
    if (Date.now() < this.endTimeGreen) return;
    if (this.componentRef.className.indexOf('PlayerStatusComponent__pills--flashgreen') == -1) return;
    this.componentRef.className = this.componentRef.className.replace(' PlayerStatusComponent__pills--flashgreen', '').trim();
  }

  // rendering

  pill = (fillColor: string, depletedColor: string, fillPercent: number, orientation: Orientation, key: number) => {
    if (fillPercent <= 0) return <li key={key}><div  style={{backgroundColor: depletedColor}}></div></li>;
    if (fillPercent >= 100) return <li key={key}><div  style={{backgroundColor: fillColor}}></div></li>;

    const remainder = 100 - fillPercent;
    const html = `<div style="background: linear-gradient(to ${orientation == Orientation.Horizontal ? 'right' : 'bottom'}, ${fillColor} ${fillPercent.toFixed(2)}%, ${depletedColor} ${(fillPercent + 0.1).toFixed(2)}%, ${depletedColor} ${remainder.toFixed(2)}%);" />`;
    return <li key={key} dangerouslySetInnerHTML={{__html: html}}/>;
  }

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

  render() {
    const numPills = (this.props.maxValue / this.props.valuePerPill);
    let orientation = this.props.orientation || Orientation.Horizontal;

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
    const pills: any[] = [];
    if (orientation > Orientation.Vertical) {
      // Circle mode

      const totalDegrees = 132;
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

    } else {
      // Horizontal or Vertical mode

      let displayedHealth = 0;
      for (let i = 0; i < numPills; ++i) {
        const remainder = this.props.currentValue - displayedHealth;
        const pillHealth = remainder > this.props.valuePerPill ? this.props.valuePerPill : remainder;
        const fillPercent = (pillHealth / this.props.valuePerPill) * 100;
        pills.push(this.pill(this.props.valueColor, this.props.depletedColor, fillPercent, orientation, i));
        displayedHealth += pillHealth;
      }
    }

    let textValue: any = null;
    if (this.state.showTextValues) {
      textValue = <div className={`PlayerStatusComponent__pills__textValue ${this.props.mirror ? 'PlayerStatusComponent--mirrored' : ''} ${orientation > Orientation.Vertical ? 'PlayerStatusComponent__pills__textValue--circle' : ''}`}>{`${this.props.currentValue}/${this.props.maxValue}`}</div>;
    }

    return (
      <ul className={`PlayerStatusComponent__pills ${this.props.containerClass ? this.props.containerClass : ''} ${this.props.orientation == Orientation.Vertical ? 'PlayerStatusComponent__pills--vertical' : ''}`}
          ref={(r: any) => this.componentRef = r}
          onMouseEnter={() => this.onEnter()}
          onMouseLeave={() => this.onLeave()}>
        {pills}
        {textValue}
      </ul>
    )
  }
}

export default Pills;
