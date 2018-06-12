/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { prettifyText } from '../../../lib/utils';
import {
  characterBodyPartIcons,
  defaultSlotIcons,
  MORE_THAN_STAT_COLOR,
  LESS_THAN_STAT_COLOR,
} from '../../../lib/constants';

const SectionContainer = styled('div')`
`;

const SectionTitle = styled('div')`
  position: relative;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: -10px;
    right: 0;
    background: url(images/item-tooltips/section-title.png) no-repeat;
    background-size: 100% 25px;
    z-index: -1;
    overflow: hidden;
  }
`;

const SectionIcon = styled('div')`
  display: inline-block;
  -webkit-transform: ${(props: any) => props.isRightSection ? 'scaleX(-1)' : ''};
  transform: ${(props: any) => props.isRightSection ? 'scaleX(-1)' : ''};
  margin-top: 2px;
  margin-right: 5px;
  font-size: 14px;
`;

const SectionListContainer = styled('div')`
  column-count: ${(props: any) => props.columnCount};
  padding: ${(props: any) => props.padding};
`;

const ListItem = styled('div')`
  display: flex;
  font-family: "TitilliumWeb";
  font-size: 12px;
  line-height: 14px;
  -webkit-column-break-inside: avoid;
`;

const ListIcon = styled('span')`
  margin-right: 5px;
`;

const StatValueContainer = styled('div')`
  display: flex;
`;

const ComparedStat = styled('div')`
  color: ${(props: any) => props.color};
`;

export interface TooltipSection {
  name: string;
  value: number;
  compared?: number;
}

export interface TooltipInfoSectionProps {
  name: string;
  stats: TooltipSection[];
  columnCount: number;
  useIcon?: boolean;
  turnValueToPercent?: boolean;
  section?: string;
  slotNames?: string[];
  padding?: string;
}

class TooltipInfoSection extends React.Component<TooltipInfoSectionProps> {
  public render() {
    const { section, slotNames, turnValueToPercent } = this.props;
    let isRightSection = false;
    if (section && _.includes(section.toLowerCase(), 'right')) {
      isRightSection = true;
    }
    return (
      <SectionContainer>
        <SectionTitle>
          <div>
            {section && <SectionIcon isRightSection={isRightSection} className={characterBodyPartIcons[section]} />}
            {this.props.name}
          </div>
          {slotNames &&
            <div>
              {slotNames.map((statName: string, i) => {
                const isRight = _.includes(statName.toLowerCase(), 'right');
                return (
                  <SectionIcon key={`${statName}-${i}`} isRightSection={isRight} className={defaultSlotIcons[statName]} />
                );
              })}
            </div>
          }
        </SectionTitle>
        <SectionListContainer columnCount={this.props.columnCount} padding={this.props.padding}>
          {this.props.stats.map((stat, i) => {
            const comparedStat = stat.compared && (turnValueToPercent ?
              Number((stat.compared * 100).toFixed(1)) : Number(stat.compared.toFixed(1)));
            return (
              <ListItem key={i} hasWidth={i !== this.props.stats.length - 1}>
                {this.props.useIcon ?
                  <ListIcon className={`icon-damage-${stat.name}`}></ListIcon> :
                  <ListIcon>{prettifyText(stat.name)}</ListIcon>
                }
                <StatValueContainer>
                  {turnValueToPercent ? `${Number((stat.value * 100).toFixed(1))}` : Number(stat.value.toFixed(1))}
                  &nbsp;
                  <ComparedStat color={comparedStat > 0 ? MORE_THAN_STAT_COLOR : LESS_THAN_STAT_COLOR}>
                    {typeof comparedStat === 'number' && comparedStat !== 0 ?
                      `(${comparedStat > 0 ? '+' : ''}${comparedStat})` : ''
                    }
                  </ComparedStat>
                  {turnValueToPercent && '%'}
                </StatValueContainer>
              </ListItem>
            );
          })}
        </SectionListContainer>
      </SectionContainer>
    );
  }

  public shouldComponentUpdate(nextProps: TooltipInfoSectionProps) {
    return !_.isEqual(this.props.stats, nextProps.stats);
  }
}

export default TooltipInfoSection;
