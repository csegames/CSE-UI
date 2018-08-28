/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled, { css } from 'react-emotion';
import { utils, Tooltip } from '@csegames/camelot-unchained';
import { GridStats } from '@csegames/camelot-unchained/lib/components';

import StatListItem from '../StatListItem';
import { colors, characterBodyPartIcons } from '../../../../lib/constants';
import { prettifyText, searchIncludesSection } from '../../../../lib/utils';
import { DamageType_Single } from 'gql/interfaces';

const Container = styled('div')`
  border-top: 1px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)};
`;

const SectionHeader = styled('div')`
  display: flex;
  justify-content: space-between;
  padding: 5px;
  font-size: 18px;
  color: ${utils.lightenColor(colors.filterBackgroundColor, 150)};
  background-color: ${utils.lightenColor(colors.filterBackgroundColor, 20)};
  border-bottom: 1px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)};
`;

const Title = styled('span')`
  margin-left: 5px;
`;

const DoesNotMatchSearch = css`
  opacity: 0.2;
  background-color: rgba(0, 0, 0, 0.2);
`;

const ListHeader = styled('div')`
  display: flex;
  justify-content: flex-end;
  color: #C57C30;
  background-color: ${utils.lightenColor(colors.filterBackgroundColor, 10)};
  border-bottom: 1px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)};
  border-right: 1px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)};
  padding-right: 5px;
  cursor: default;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.5);
`;

const StatValueContainer = styled('div')`
  display: flex;
  color: ${utils.lightenColor(colors.filterBackgroundColor, 150)};
  font-size: 16px;
`;

const ValueText = styled('div')`
  width: 40px;
  border-left: 1px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)};
  margin-left: 5px;
  text-align: right;
`;

const ListHeaderText: React.CSSProperties = {
  width: '40px',
  marginLeft: '5px',
  textAlign: 'right',
};

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

const BodyPartSection = (props: BodyPartSectionProps) => {
  // Prettify name to match what is displayed to user
  const searchIncludes = props.searchValue !== '' ? searchIncludesSection(props.searchValue, props.name) : true;

  const statInfo: DefenseStatInterface = {} as any;
  Object.keys(props.bodyPartStats).forEach((defenseType) => {
    if (defenseType === 'mitigations' || defenseType === 'resistances') {
      Object.keys(props.bodyPartStats[defenseType]).forEach((damageType) => {
        statInfo[damageType] = {
          ...statInfo[damageType] || {},
          name: damageType,
          [`${defenseType}Value`]: props.bodyPartStats[defenseType][damageType],
        };
      });
      return;
    }
  });
  const statsArray = [
    ..._.values(statInfo).sort((a: DefenseStatInterface, b: DefenseStatInterface) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())),
  ];

  const bodyPartName = props.name === '_BODY_BEGIN' ? 'Torso' : props.name;

  return (
    <Container>
      <SectionHeader className={!searchIncludes ? DoesNotMatchSearch : ''}>
        <div>
          <span
            className={characterBodyPartIcons[bodyPartName]}
            style={{
              transform: _.includes(props.name.toLowerCase(), 'right') ? 'scaleX(-1)' : '',
              WebkitTransform: _.includes(props.name.toLowerCase(), 'right') ? 'scaleX(-1)' : '',
            }}
          />
          <Title>{prettifyText(bodyPartName)}</Title>
        </div>
        <div>Armor Class: {Number(props.bodyPartStats['armorClass'].toFixed(2))}</div>
      </SectionHeader>
      <GridStats
        statArray={statsArray}
        searchValue={props.searchValue}
        sectionTitle={props.name}
        howManyGrids={3}
        shouldRenderEmptyListItems={true}
        renderHeaderItem={() => (
          <ListHeader className={!searchIncludes ? DoesNotMatchSearch : ''}>
            <Tooltip content='Resistances' styles={{ Tooltip: ListHeaderText }}>
              R
            </Tooltip>
            <Tooltip content='Mitigations' styles={{ Tooltip: ListHeaderText }}>
              M
            </Tooltip>
          </ListHeader>
        )}
        renderListItem={(item: DefenseStatInterface, index: number) => {
          return (
            <StatListItem
              index={index}
              searchValue={props.searchValue}
              statName={item.name}
              sectionTitle={props.name}
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
};

export default BodyPartSection;
