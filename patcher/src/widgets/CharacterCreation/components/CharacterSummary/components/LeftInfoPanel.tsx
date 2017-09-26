/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { utils, Race, Gender, Archetype } from 'camelot-unchained';

import { AttributeInfo, attributeType } from '../../../services/session/attributes';
import { AttributeOffsetInfo } from '../../../services/session/attributeOffsets';
import { BanesAndBoonsState } from '../../../services/session/banesAndBoons';

import AttributeView from '../../AttributesSelect/AttributeView';
import TraitsInfo from './TraitsInfo';

export const colors = {
  filterBackgroundColor: '#372F2D',
};

export interface LeftInfoPanelStyle extends StyleDeclaration {
  LeftInfoPanel: React.CSSProperties;
  listHeader: React.CSSProperties;
  statValueContainer: React.CSSProperties;
  valueText: React.CSSProperties;
  listHeaderText: React.CSSProperties;
  statsListItem: React.CSSProperties;
  lightListItem: React.CSSProperties;
  statText: React.CSSProperties;
  statValue: React.CSSProperties;
  doesNotMatchSearch: React.CSSProperties;
  sectionTitleContainer: React.CSSProperties;
}

export const defaultLeftInfoPanelStyle: LeftInfoPanelStyle = {
  LeftInfoPanel: {
    flex: 2,
    overflowY: 'auto',
    background: 'linear-gradient(top left, rgba(0,0,0,0.8), rgba(0,0,0,0.4), rgba(0,0,0,0.8))',
    padding: '10px',
    zIndex: 999,
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

  statsListItem: {
    width: 'calc(100% - 5px)',
    display: 'flex',
    position: 'relative',
    cursor: 'default',
    padding: '0 0 0 5px',
    height: '25px',
    backgroundColor: `rgba(55, 47, 45, 0.5)`,
    boxShadow: 'inset 0px 0px 3px rgba(0,0,0,0.5)',
    opacity: 0.8,
    borderRight: `1px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)}`,
    borderBottom: `1px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)}`,
    ':hover': {
      backgroundColor: utils.lightenColor(colors.filterBackgroundColor, 20),
    },
  },

  lightListItem: {
    backgroundColor: colors.filterBackgroundColor,
  },

  statText: {
    flex: 1,
    display: 'inline-block',
    fontSize: 16,
    padding: 0,
    color: utils.lightenColor(colors.filterBackgroundColor, 150),
    textOverflow: 'ellipsis',
  },

  statValue: {
    paddingLeft: '5px',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#d2d2d2',
  },

  doesNotMatchSearch: {
    opacity: 0.2,
    backgroundColor: `rgba(0,0,0,0.2)`,
  },

  sectionTitleContainer: {
    display: 'flex',
    padding:'5px',
    fontSize: 18,
    color: utils.lightenColor(colors.filterBackgroundColor, 150),
    backgroundColor: utils.lightenColor(colors.filterBackgroundColor, 15),
    borderBottom: `1px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)}`,
  },
};

export interface LeftInfoPanelProps {
  styles?: Partial<LeftInfoPanelStyle>;
  attributes: AttributeInfo[];
  attributeOffsets: AttributeOffsetInfo[];
  selectedRace: Race;
  selectedGender: Gender;
  selectedClass: Archetype;
  remainingPoints: number;
  banesAndBoonsState: BanesAndBoonsState;
}

export interface LeftInfoPanelState {
}

export class LeftInfoPanel extends React.Component<LeftInfoPanelProps, LeftInfoPanelState> {
  constructor(props: LeftInfoPanelProps) {
    super(props);
    this.state = {

    };
  }

  public render() {
    const ss = StyleSheet.create(defaultLeftInfoPanelStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    let offset = this.props.attributeOffsets.find((o: AttributeOffsetInfo) => o.gender === this.props.selectedGender &&
    o.race === this.props.selectedRace);

    if (typeof offset === 'undefined') offset = null;

    const sortedAttributes = this.props.attributes.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    const primaries = sortedAttributes.filter((a: AttributeInfo) => a.type === attributeType.PRIMARY)
      .map((a: AttributeInfo) => ({
        attributeInfo: a,
        value: (offset.attributeOffsets[a.name] || 0) + a.baseValue + a.allocatedPoints,
      }));
    const secondaries = sortedAttributes.filter((a: AttributeInfo) => a.type === attributeType.SECONDARY)
      .map((a: AttributeInfo) => ({
        attributeInfo: a,
        value: (offset.attributeOffsets[a.name] || 0) + a.baseValue,
      }));
    const derived = sortedAttributes.filter((a: AttributeInfo) => a.type === attributeType.DERIVED)
      .map((a: AttributeInfo) => ({
        attributeInfo: a,
        value: this.calculateDerivedValue(a, offset),
      }));
    
    return (
      <div className={css(ss.LeftInfoPanel, custom.LeftInfoPanel)}>
        <AttributeView title='Primary' statArray={primaries} howManyGrids={2} />
        <AttributeView title='Secondary' statArray={secondaries} howManyGrids={2} />
        <AttributeView title='Derived' statArray={derived} howManyGrids={2} />
        <TraitsInfo banesAndBoonsState={this.props.banesAndBoonsState} />
      </div>
    );
  }

  private calculateDerivedValue = (derivedInfo: AttributeInfo, offset: AttributeOffsetInfo) => {
    const primaryInfo = this.props.attributes.find((a: AttributeInfo) => a.name === derivedInfo.derivedFrom);
    const primaryOffsetValue = offset === null ? 0 : typeof offset.attributeOffsets[primaryInfo.name] === 'undefined' ?
      0 : offset.attributeOffsets[primaryInfo.name];
    const primaryValue = primaryInfo.baseValue + primaryInfo.allocatedPoints + primaryOffsetValue;

    const derivedMax = derivedInfo.baseValue + derivedInfo.baseValue * derivedInfo.maxOrMultipler;

    const derived = derivedInfo.baseValue + (derivedMax - derivedInfo.baseValue) / primaryInfo.maxOrMultipler * primaryValue;
    return derived;
  }
}

export default LeftInfoPanel;

