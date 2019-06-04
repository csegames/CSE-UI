/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { GridStats } from '@csegames/camelot-unchained/lib/components';

import StatListItem from '../StatListItem';
import TabSubHeader from 'shared/Tabs/TabSubHeader';
import { characterBodyPartIcons, MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';
import { searchIncludesSection } from 'fullscreen/lib/utils';
import { DamageType_Single } from 'gql/interfaces';

// #region Container constants
const CONTAINER_BORDER_TOP = 2;
// #endregion
const Container = styled.div`
  border-top: ${CONTAINER_BORDER_TOP}px solid #6A6260;

  @media (max-width: 2560px) {
    border-top: ${CONTAINER_BORDER_TOP * MID_SCALE}px solid #6A6260;
  }

  @media (max-width: 1920px) {
    border-top: ${CONTAINER_BORDER_TOP * HD_SCALE}px solid #6A6260;
  }
`;

// #region Title constants
const TITLE_MARGIN_LEFT = 10;
const TITLE_FONT_SIZE = 32;
// #endregion
const Title = styled.span`
  margin-left: ${TITLE_MARGIN_LEFT}px;
  font-size: ${TITLE_FONT_SIZE}px;

  @media (max-width: 2560px) {
    margin-left: ${TITLE_MARGIN_LEFT * MID_SCALE}px;
    font-size: ${TITLE_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-left: ${TITLE_MARGIN_LEFT * HD_SCALE}px;
    font-size: ${TITLE_FONT_SIZE * HD_SCALE}px;
  }
`;

const DoesNotMatchSearch = css`
  opacity: 0.2;
  background-color: rgba(0, 0, 0, 0.2);
`;

const ArmorClass = styled.div`
  font-size: ${TITLE_FONT_SIZE}px;

  @media (max-width: 2560px) {
    font-size: ${TITLE_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${TITLE_FONT_SIZE * HD_SCALE}px;
  }
`;

// const ListHeader = styled.div`
//   display: flex;
//   justify-content: flex-end;
//   color: #C3A186;
//   font-size: 14px;
//   background-color: rgba(0, 0, 0, 0.5);
//   border-bottom: 1px solid black;
//   border-right: 1px solid black;
//   padding-right: 5px;
//   cursor: default;
//   box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.5);
// `;

// #region StatValueContainer constants
const STAT_VALUE_CONTAINER_FONT_SIZE = 32;
// #endregion
const StatValueContainer = styled.div`
  display: flex;
  color: #96827b;
  font-size: ${STAT_VALUE_CONTAINER_FONT_SIZE}px;

  @media (max-width: 2560px) {
    font-size: ${STAT_VALUE_CONTAINER_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${STAT_VALUE_CONTAINER_FONT_SIZE * HD_SCALE}px;
  }
`;

// const ValueText = styled.div`
//   width: 40px;
//   border-left: 1px solid black;
//   margin-left: 5px;
//   text-align: right;
// `;

const SubHeaderContent = css`
  justify-content: space-between;
`;

// const ListHeaderText = styled.div`
//   width: 40px;
//   margin-left: 5px;
//   text-align: right;
//   font-size: 12px;
// `;

export interface DefenseStatInterface {
  name: string;
  resistancesValue: number;
}

export interface BodyPartStatInterface {
  resistances?: Partial<DamageType_Single>;
  armorClass?: number;
}

export interface BodyPartSectionProps {
  bodyPartStats: BodyPartStatInterface;
  name: string;
  searchValue: string;
}

class BodyPartSection extends React.PureComponent<BodyPartSectionProps> {
  public render() {
    const { searchValue, name, bodyPartStats } = this.props;
    // Prettify name to match what is displayed to user
    const bodyPartName = name === '_BODY_BEGIN' ? 'Torso' : name;
    const searchIncludes = this.doesSearchInclude();
    const statsArray = this.getStatsArray();

    return (
      <Container>
        <TabSubHeader useGrayBG className={!searchIncludes ? DoesNotMatchSearch : ''} contentClassName={SubHeaderContent}>
          <div>
            <span
              className={characterBodyPartIcons[bodyPartName]}
              style={{
                transform: _.includes(name.toLowerCase(), 'right') ? 'scaleX(-1)' : '',
                WebkitTransform: _.includes(name.toLowerCase(), 'right') ? 'scaleX(-1)' : '',
              }}
            />
            <Title>Resistances</Title>
          </div>
          <ArmorClass>Armor Class: {Number(bodyPartStats['armorClass'].toFixed(2))}</ArmorClass>
        </TabSubHeader>
        <GridStats
          statArray={statsArray}
          searchValue={searchValue}
          sectionTitle={name}
          howManyGrids={3}
          shouldRenderEmptyListItems={true}
          styles={{
            statListSection: {
              margin: '0 1px',
            },
          }}
          renderListItem={(item: DefenseStatInterface, index: number) => {
            return (
              <StatListItem
                index={index}
                searchValue={searchValue}
                item={item}
                statName={item.name}
                sectionTitle={name}
                statValue={() => typeof item.resistancesValue === 'number' ?
                  <StatValueContainer>
                    <div>{Math.round(item.resistancesValue)}</div>
                  </StatValueContainer> : null
                }
              />
            );
          }}
        />
      </Container>
    );
  }

  private getStatsArray = () => {
    const { bodyPartStats } = this.props;
    const statInfo: DefenseStatInterface = {} as any;
    Object.keys(bodyPartStats).forEach((defenseType) => {
      if (defenseType === 'mitigations' || defenseType === 'resistances') {
        Object.keys(bodyPartStats[defenseType]).forEach((damageType) => {
          statInfo[damageType] = {
            ...statInfo[damageType] || {},
            name: damageType,
            [`${defenseType}Value`]: bodyPartStats[defenseType][damageType],
          };
        });
        return;
      }
    });
    const statsArray = [
      ..._.values(statInfo).sort((a: DefenseStatInterface, b: DefenseStatInterface) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())),
    ];
    return statsArray;
  }

  private doesSearchInclude = () => {
    const searchIncludes = this.props.searchValue !== '' ? searchIncludesSection(this.props.searchValue, name) : true;
    return searchIncludes;
  }
}

export default BodyPartSection;
