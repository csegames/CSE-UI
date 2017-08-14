/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-08-16 10:45:14
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-17 15:49:28
 */

import * as React from 'react';
import DefenseList, { DefenseStatInfoSection } from './DefenseList';
import { prettifyText } from '../../../../lib/utils';

// TEMPORARY TEST DATA
import { TestDefenseStatsInterface } from '../../testCharacterStats';

export interface DefenseInfoProps {
  defenseStats: TestDefenseStatsInterface;
}

export interface DefenseInfoState {
  defenseStatSections: DefenseStatInfoSection[];
}

export class DefenseInfo extends React.Component<DefenseInfoProps, DefenseInfoState> {
  constructor(props: DefenseInfoProps) {
    super(props);
    this.state = {
      defenseStatSections: [],
    };
  }

  public render() {
    return (
      <DefenseList statSections={this.state.defenseStatSections} />
    );
  }

  public componentDidMount() {
    this.initDefenseStatsToSections();
  }

  private initDefenseStatsToSections = () => {
    const defenseStats = this.props.defenseStats;
    const defenseStatSections: DefenseStatInfoSection[] = [];
    Object.keys(defenseStats).forEach((statType) => {
      const bodyParts = {};
      Object.keys(defenseStats[statType]).forEach((bodyPart) => {
        Object.keys(defenseStats[statType][bodyPart]).forEach((damageType) => {
          // ex.) Poison Resistance | Poison Mitigation
          const name = `${damageType} ${statType.charAt(0).toUpperCase()}${statType.substr(1, statType.length - 2)}`;
          if (bodyParts[bodyPart]) {
            bodyParts[bodyPart].push({
              name,
              value: `${Math.round(defenseStats[statType][bodyPart][damageType] * 100)}%`,
            });
          } else {
            bodyParts[bodyPart] = [{
              name,
              value: `${Math.round(defenseStats[statType][bodyPart][damageType] * 100)}%`,
            }];
          }
        });
      });

      const statInfoSection: DefenseStatInfoSection = {
        title: prettifyText(statType),
        bodyPartsStats: bodyParts,
      };
      defenseStatSections.push(statInfoSection);
    });

    this.setState({ defenseStatSections });
  }
}

export default DefenseInfo;
