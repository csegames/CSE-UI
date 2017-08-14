/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-08-17 12:55:45
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-17 14:31:27
 */

import * as React from 'react';
import OffenseList, { OffenseStatInfoSection } from './OffenseList';
import { StatInterface } from '../StatListItem';

import { TestOffenseStatsInterface } from '../../testCharacterStats';

export interface OffenseContainerProps {
  offenseStats: TestOffenseStatsInterface;
}

export interface OffenseContainerState {
  offenseStatSections: OffenseStatInfoSection[];
}

class OffenseContainer extends React.Component<OffenseContainerProps, OffenseContainerState> {
  constructor(props: OffenseContainerProps) {
    super(props);
    this.state = {
      offenseStatSections: [],
    };
  }

  public render() {
    return (
      <OffenseList statSections={this.state.offenseStatSections} />
    );
  }

  public componentDidMount() {
    this.initOffenseStatsToSections();
  }

  private initOffenseStatsToSections = () => {
    const offenseStats = this.props.offenseStats;
    const offenseStatSections: OffenseStatInfoSection[] = [];
    Object.keys(offenseStats).forEach((weaponSlot) => {
      const weaponStats: StatInterface[] = [];
      Object.keys(offenseStats[weaponSlot]).forEach((weaponStat) => {
        weaponStats.push({
          name: weaponStat,
          value: offenseStats[weaponSlot][weaponStat],
        });
      });

      offenseStatSections.push({
        title: weaponSlot,
        stats: weaponStats,
      });
    });

    this.setState({ offenseStatSections });
  }
}

export default OffenseContainer;
