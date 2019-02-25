/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { GridStats } from '@csegames/camelot-unchained/lib/components';

import StatListItem from '../StatListItem';
import TabSubHeader from '../../../TabSubHeader';
import { characterBodyPartIcons } from '../../../../lib/constants';
import { prettifyText, searchIncludesSection } from '../../../../lib/utils';
import { DamageType_Single } from 'gql/interfaces';

const Container = styled.div`
  border-top: 1px solid #6A6260;
`;

const Title = styled.span`
  margin-left: 5px;
`;

const DoesNotMatchSearch = css`
  opacity: 0.2;
  background-color: rgba(0, 0, 0, 0.2);
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  color: #C3A186;
  font-size: 14px;
  background-color: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid black;
  border-right: 1px solid black;
  padding-right: 5px;
  cursor: default;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.5);
`;

const StatValueContainer = styled.div`
  display: flex;
  color: #96827b;
  font-size: 16px;
`;

const ValueText = styled.div`
  width: 40px;
  border-left: 1px solid black;
  margin-left: 5px;
  text-align: right;
`;

const SubHeaderContent = css`
  justify-content: space-between;
`;

const ListHeaderText = styled.div`
  width: 40px;
  margin-left: 5px;
  text-align: right;
  font-size: 12px;
`;

export interface DefenseStatInterface {
  name: string;
  resistancesValue: number;
  mitigationsValue: number;
}

// The BodyPartStatInterface is used so we can break up the ArmorStats sections into sub-sections of bodyParts.
// So Head will have (slashing, arcane, poison, etc.) resistances and Torso will have it's own (slashing, arcane, etc.)
// resistances. Same with mitigation.
export interface BodyPartStatInterface {
  subpartID?: string;
  resistances?: Partial<DamageType_Single>;
  mitigations?: Partial<DamageType_Single>;
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
            <Title>{prettifyText(bodyPartName)}</Title>
          </div>
          <div>Armor Class: {Number(bodyPartStats['armorClass'].toFixed(2))}</div>
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
          renderHeaderItem={() => (
            <ListHeader className={!searchIncludes ? DoesNotMatchSearch : ''}>
              <ListHeaderText>R</ListHeaderText>
              <ListHeaderText>M</ListHeaderText>
            </ListHeader>
          )}
          renderListItem={(item: DefenseStatInterface, index: number) => {
            return (
              <StatListItem
                index={index}
                searchValue={searchValue}
                item={item}
                statName={item.name}
                sectionTitle={name}
                statValue={() => typeof item.mitigationsValue === 'number' && typeof item.resistancesValue === 'number' ?
                  <StatValueContainer>
                    <div>{Math.round(item.resistancesValue * 100)}%</div>
                    <ValueText>{Math.round(item.mitigationsValue * 100)}%</ValueText>
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
