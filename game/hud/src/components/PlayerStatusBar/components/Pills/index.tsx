/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export enum Orientation {
  Horizontal,
  Vertical,
}

export interface PillsProps {
  orientation?: Orientation;
  containerClass?: string;
  pillClass?: string;
  displayWounds?: boolean;
  woundColor?: string;
  valuePerPill: number;
  currentValue: number;
  maxValue: number;
  valueColor: string;
  depletedColor: string;
  size: number;
}

export interface PillsState {
}

class Pills extends React.Component<PillsProps, PillsState> {

  private numPills: number;

  constructor(props: PillsProps) {
    super(props);
    this.numPills = (this.props.maxValue / this.props.valuePerPill);
  }

  public render() {
    this.numPills = (this.props.maxValue / this.props.valuePerPill);
    const orientation = this.props.orientation || Orientation.Horizontal;
    return (
      <ul className={`player-status-bar__pills ${Orientation[this.props.orientation ||
       Orientation.Horizontal]} ${this.props.containerClass || ''}`}>
        {orientation === Orientation.Horizontal ? this.horizontalPills() : this.verticalPills()}
      </ul>
    );
  }

  private horizontalPills = (): any[] => {
    const pills: any[] = [];
    let displayedHealth = 0;
    for (let i = 0; i < this.numPills; ++i) {
      const remainder = this.props.currentValue - displayedHealth;
      const pillHealth = remainder > this.props.valuePerPill ? this.props.valuePerPill : remainder;
      const fillPercent = (pillHealth / this.props.valuePerPill) * 100;

      let html = '';
      if (fillPercent > 0) {
        html = `<div class='${this.props.pillClass || ''}' style='background:linear-gradient(to right,
         ${this.props.valueColor} ${fillPercent}%, ${this.props.depletedColor} ${100 - fillPercent}%);' />`;
      } else {
        html = `<div class='${this.props.pillClass || ''}' style='background-color: ${this.props.depletedColor};' />`;
      }

      pills.push(<li key={i} className='player-status-bar__pills__pill' dangerouslySetInnerHTML={{ __html: html }}/>);
      displayedHealth += pillHealth;
    }
    return pills;
  }

  private verticalPills = (): any[] => {
    const pills: any[] = [];
    let displayedHealth = 0;
    for (let i = 0; i < this.numPills; ++i) {
      const remainder = this.props.currentValue - displayedHealth;
      const pillHealth = remainder > this.props.valuePerPill ? this.props.valuePerPill : remainder;
      const fillPercent = (pillHealth / this.props.valuePerPill) * 100;

      const isWound = fillPercent === 0 && i === this.numPills - Math.floor(this.numPills / 3) ||
        i === this.numPills - Math.floor(this.numPills / 3) * 2;

      let html = '';
      if (fillPercent > 0) {
        html = `<div class='${this.props.pillClass || ''}' style='background:linear-gradient(to bottom,
         ${this.props.valueColor} ${fillPercent}%, ${this.props.depletedColor} ${100 - fillPercent}%);' />`;
      } else if (isWound) {
        html = `<div class='${this.props.pillClass || ''}' style='background-color: ${this.props.woundColor};' />`;
      } else {
        html = `<div class='${this.props.pillClass || ''}' style='background-color: ${this.props.depletedColor};' />`;
      }
      pills.push(<li key={i} className='player-status-bar__pills__pill' dangerouslySetInnerHTML={{ __html: html }} />);
      displayedHealth += pillHealth;
    }
    return pills;
  }
}

export default Pills;
