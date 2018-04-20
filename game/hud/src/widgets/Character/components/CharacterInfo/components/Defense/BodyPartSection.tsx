/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';
import { ql, utils, Tooltip } from '@csegames/camelot-unchained';
import { GridStats } from '@csegames/camelot-unchained/lib/components';

import StatListItem from '../StatListItem';
import { colors, characterBodyPartIcons } from '../../../../lib/constants';
import { prettifyText, searchIncludesSection } from '../../../../lib/utils';

export interface BodyPartSectionStyles extends StyleDeclaration {
  bodyPartSection: React.CSSProperties;
  bodyPartSectionHeader: React.CSSProperties;
  bodyPartTitle: React.CSSProperties;
  statContainer: React.CSSProperties;
  statListSection: React.CSSProperties;
  doesNotMatchSearch: React.CSSProperties;

  listHeader: React.CSSProperties;
  statValueContainer: React.CSSProperties;
  valueText: React.CSSProperties;
  listHeaderText: React.CSSProperties;
}

const defaultBodyPartSectionStyle: BodyPartSectionStyles = {
  bodyPartSection: {
    borderTop: `1px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)}`,
  },

  bodyPartSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5px',
    fontSize: 18,
    color: utils.lightenColor(colors.filterBackgroundColor, 150),
    backgroundColor: utils.lightenColor(colors.filterBackgroundColor, 15),
    borderBottom: `1px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)}`,
  },

  bodyPartTitle: {
    marginLeft: '5px',
  },

  statContainer: {
    display: 'flex',
  },

  statListSection: {
    flex: 1,
  },

  doesNotMatchSearch: {
    opacity: 0.2,
    backgroundColor: `rgba(0,0,0,0.2)`,
  },

  listHeader: {
    display: 'flex',
    justifyContent: 'flex-end',
    color: '#C57C30',
    backgroundColor: utils.lightenColor(colors.filterBackgroundColor, 10),
    borderBottom: `1px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)}`,
    borderRight: `1px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)}`,
    paddingRight: '5px',
    cursor: 'default',
    boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.5)',
  },

  statValueContainer: {
    display: 'flex',
    color: utils.lightenColor(colors.filterBackgroundColor, 150),
    fontSize: 16,
  },

  valueText: {
    width: '40px',
    borderLeft: `1px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)}`,
    marginLeft: '5px',
    textAlign: 'right',
  },

  listHeaderText: {
    width: '40px',
    marginLeft: '5px',
    textAlign: 'right',
  },
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
  subpartID: string;
  resistances: Partial<ql.schema.DamageType_Single>;
  mitigations: Partial<ql.schema.DamageType_Single>;
}

export interface BodyPartSectionProps {
  styles?: Partial<BodyPartSectionStyles>;
  bodyPartStats: BodyPartStatInterface;
  name: string;
  searchValue: string;
}

const BodyPartSection = (props: BodyPartSectionProps) => {
  const ss = StyleSheet.create(defaultBodyPartSectionStyle);
  const custom = StyleSheet.create(props.styles || {});

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
    <div className={css(ss.bodyPartSection, custom.bodyPartSection)}>
      <header className={css(
        ss.bodyPartSectionHeader,
        custom.bodyPartSectionHeader,
        !searchIncludes && ss.doesNotMatchSearch,
        !searchIncludes && custom.doesNotMatchSearch,
      )}>
        <div>
          <span className={characterBodyPartIcons[bodyPartName]} style={{
            transform: _.includes(props.name.toLowerCase(), 'right') ? 'scaleX(-1)' : '',
            webkitTransform: _.includes(props.name.toLowerCase(), 'right') ? 'scaleX(-1)' : '',
          }} />
          <span className={css(ss.bodyPartTitle, custom.bodyPartTitle)}>{prettifyText(bodyPartName)}</span>
        </div>
        <div>Armor Class: {Number(props.bodyPartStats['armorClass'].toFixed(2))}</div>
      </header>
      <GridStats
        statArray={statsArray}
        searchValue={props.searchValue}
        sectionTitle={props.name}
        howManyGrids={3}
        shouldRenderEmptyListItems={true}
        renderHeaderItem={() => (
          <div className={css(
            ss.listHeader,
            custom.listHeader,
            !searchIncludes && ss.doesNotMatchSearch,
            !searchIncludes && custom.doesNotMatchSearch)}
          >
            <Tooltip content='Resistances' styles={{ Tooltip: defaultBodyPartSectionStyle.listHeaderText }}>
              R
            </Tooltip>
            <Tooltip content='Mitigations' styles={{ Tooltip: defaultBodyPartSectionStyle.listHeaderText }}>
              M
            </Tooltip>
          </div>
        )}
        renderListItem={(item: DefenseStatInterface, index: number) => {
          return (
            <StatListItem
              index={index}
              searchValue={props.searchValue}
              statName={item.name}
              sectionTitle={props.name}
              statValue={() => typeof item.mitigationsValue === 'number' && typeof item.resistancesValue === 'number' ?
                <div className={css(ss.statValueContainer, custom.statValueContainer)}>
                  <div>{Math.round(item.resistancesValue * 100)}%</div>
                  <div className={css(ss.valueText, custom.valueText)}>
                    {Math.round(item.mitigationsValue * 100)}%
                  </div>
                </div> : null
              }
            />
          );
        }}
      />
    </div>
  );
};

export default BodyPartSection;
