/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { styled } from '@csegames/linaria/react';
import { prettifyText } from 'fullscreen/lib/utils';
import {
  characterBodyPartIcons,
  MORE_THAN_STAT_COLOR,
  LESS_THAN_STAT_COLOR,
  HD_SCALE,
  MID_SCALE,
} from 'fullscreen/lib/constants';

const SectionContainer = styled.div`
`;

// #region SectionTitle constants
const SECTION_TITLE_FONT_SIZE = 28;
const SECTION_TITLE_BG_LEFT = -20;
// #endregion
const SectionTitle = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  font-size: ${SECTION_TITLE_FONT_SIZE}px;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: ${SECTION_TITLE_BG_LEFT}px;
    right: 0;
    background-image: url(../images/item-tooltips/section-title.png);
    background-repeat: no-repeat;
    background-size: contain;
    z-index: -1;
    overflow: hidden;
  }

  @media (max-width: 2560px) {
    font-size: ${SECTION_TITLE_FONT_SIZE * MID_SCALE}px;
    &:before {
      left: ${SECTION_TITLE_BG_LEFT * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    font-size: ${SECTION_TITLE_FONT_SIZE * HD_SCALE}px;
    &:before {
      background-image: url(../images/item-tooltips/section-title.png);
      left: ${SECTION_TITLE_BG_LEFT * HD_SCALE}px;
    }
  }
`;

// #region SectionIcon constants
const SECTION_ICON_MARGIN_TOP = 4;
const SECTION_ICON_MARGIN_RIGHT = 10;
const SECTION_ICON_FONT_SIZE = 28;
// #endregion
const SectionIcon = styled.div`
  display: inline-block;
  -webkit-transform: ${(props: any) => props.isRightSection ? 'scaleX(-1)' : ''};
  transform: ${(props: any) => props.isRightSection ? 'scaleX(-1)' : ''};
  margin-top: ${SECTION_ICON_MARGIN_TOP}px;
  margin-right: ${SECTION_ICON_MARGIN_RIGHT}px;
  font-size: ${SECTION_ICON_FONT_SIZE}px;

  @media (max-width: 2560px) {
    margin-top: ${SECTION_ICON_MARGIN_TOP * MID_SCALE}px;
    margin-right: ${SECTION_ICON_MARGIN_RIGHT * MID_SCALE}px;
    font-size: ${SECTION_ICON_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-top: ${SECTION_ICON_MARGIN_TOP * HD_SCALE}px;
    margin-right: ${SECTION_ICON_MARGIN_RIGHT * HD_SCALE}px;
    font-size: ${SECTION_ICON_FONT_SIZE * HD_SCALE}px;
  }
`;

const SectionListContainer = styled.div`
  column-count: ${(props: any) => props.columnCount};
  padding: ${(props: any) => props.padding};
`;

// #region ListItem constants
const LIST_ITEM_FONT_SIZE = 24;
const LIST_ITEM_LINE_HEIGHT = 28;
// #endregion
const ListItem = styled.div`
  display: flex;
  font-family: "TitilliumWeb";
  font-size: ${LIST_ITEM_FONT_SIZE}px;
  line-height: ${LIST_ITEM_LINE_HEIGHT}px;
  -webkit-column-break-inside: avoid;

  @media (max-width: 2560px) {
    font-size: ${LIST_ITEM_FONT_SIZE * MID_SCALE}px;
    line-height: ${LIST_ITEM_LINE_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${LIST_ITEM_FONT_SIZE * HD_SCALE}px;
    line-height: ${LIST_ITEM_LINE_HEIGHT * HD_SCALE}px;
  }
`;

// #region ListIcon constants
const LIST_ICON_MARGIN_RIGHT = 10;
// #endregion
const ListIcon = styled.span`
  margin-right: ${LIST_ICON_MARGIN_RIGHT}px;

  @media (max-width: 2560px) {
    margin-right: ${LIST_ICON_MARGIN_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-right: ${LIST_ICON_MARGIN_RIGHT * HD_SCALE}px;
  }
`;

const StatValueContainer = styled.div`
  display: flex;
`;

const ComparedStat = styled.div`
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
  padding?: string;
}

class TooltipInfoSection extends React.Component<TooltipInfoSectionProps> {
  public render() {
    const { section, turnValueToPercent } = this.props;
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
        </SectionTitle>
        <SectionListContainer columnCount={this.props.columnCount} padding={this.props.padding}>
          {this.props.stats.map((stat, i) => {
            const comparedStat = stat.compared && (Number(stat.compared.toFixed(1)));
            return (
              <ListItem key={i}>
                {this.props.useIcon ?
                  <ListIcon className={`icon-damage-${stat.name}`}></ListIcon> :
                  <ListIcon>{prettifyText(stat.name)}</ListIcon>
                }
                <StatValueContainer>
                  {Number(stat.value.toFixed(1))}
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
