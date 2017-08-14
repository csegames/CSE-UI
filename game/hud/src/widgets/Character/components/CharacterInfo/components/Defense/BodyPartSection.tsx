/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-08-16 10:56:35
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-17 15:42:26
 */

import * as React from 'react';
import * as _ from 'lodash';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';
import { utils } from 'camelot-unchained';

import GridStats from '../GridStats';
import { StatInterface } from '../StatListItem';
import { colors, characterBodyPartIcons } from '../../../../lib/constants';
import { prettifyText, doesSearchInclude } from '../../../../lib/utils';

export interface BodyPartSectionStyles extends StyleDeclaration {
  bodyPartSection: React.CSSProperties;
  bodyPartSectionHeader: React.CSSProperties;
  bodyPartTitle: React.CSSProperties;
  statContainer: React.CSSProperties;
  statListSection: React.CSSProperties;
  doesNotMatchSearch: React.CSSProperties;
}

const defaultBodyPartSectionStyle: BodyPartSectionStyles = {
  bodyPartSection: {
    borderTop: `1px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)}`,
  },

  bodyPartSectionHeader: {
    display: 'flex',
    padding:'5px',
    fontSize: 18,
    color: utils.lightenColor(colors.filterBackgroundColor, 150),
    backgroundColor: colors.filterBackgroundColor,
    borderBottom: `1px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)}`,
    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.5)',
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
};

// The BodyPartStatInterface is used so we can break up the ArmorStats sections into sub-sections of bodyParts.
// So Head will have (slashing, arcane, poison, etc.) resistances and Torso will have it's own (slashing, arcane, etc.)
// resistances. Same with mitigation.
export interface BodyPartStatInterface {
  [bodyPart: string]: StatInterface[];
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
  const statArray = props.bodyPartStats[props.name];

  // Prettify name to match what is displayed to user
  const searchIncludesSection = doesSearchInclude(prettifyText(props.name), props.searchValue) ||
    doesSearchInclude(props.searchValue, prettifyText(props.name));

  return (
    <div className={css(ss.bodyPartSection, custom.bodyPartSection)}>
      <header className={css(
        ss.bodyPartSectionHeader,
        custom.bodyPartSectionHeader,
        !searchIncludesSection && ss.doesNotMatchSearch,
        !searchIncludesSection && custom.doesNotMatchSearch,
      )}>
        <div className={characterBodyPartIcons[props.name]} style={{
          transform: _.includes(props.name.toLowerCase(), 'right') ? 'scaleX(-1)' : '',
          webkitTransform: _.includes(props.name.toLowerCase(), 'right') ? 'scaleX(-1)' : '',
        }} />
        <span className={css(ss.bodyPartTitle, custom.bodyPartTitle)}>{prettifyText(props.name)}</span>
      </header>
      <GridStats
        statArray={statArray}
        searchValue={props.searchValue}
        sectionTitle={props.name}
        howManyGrids={3}
      />
    </div>
  );
};

export default BodyPartSection;
