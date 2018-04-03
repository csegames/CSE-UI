/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { utils } from 'camelot-unchained';
import { Tooltip } from 'camelot-unchained/lib/components';

import { AttributeInfo } from '../../services/session/attributes';
import { GridStats } from 'camelot-unchained/lib/components';

export const colors = {
  filterBackgroundColor: '#372F2D',
};

export interface AttributeViewStyle extends StyleDeclaration {
  AttributeView: React.CSSProperties;
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
  tooltip: React.CSSProperties;
  tooltipContent: React.CSSProperties;
}

export const defaultAttributeViewStyle: AttributeViewStyle = {
  AttributeView: {
    
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
    whiteSpace: 'nowrap',
    overflow: 'hidden',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ccc',
  },

  tooltip: {
    border: '1px solid #352A22',
    boxShadow: 'inset 0 0 10px 2px rgba(40, 32, 20, 0.2)',
    background: 'black',
    maxWidth: '300px',
    minWidth: '200px',
  },

  tooltipContent: {
    display: 'flex',
    flexDirection: 'column',
  },
};

export interface AttributeObjectInfo {
  attributeInfo: AttributeInfo;
  value: number;
}

export interface AttributeViewProps {
  styles?: Partial<AttributeViewStyle>;
  howManyGrids?: number;
  statArray: AttributeObjectInfo[];
  title: string;
}

export interface AttributeViewState {
}

export class AttributeView extends React.Component<AttributeViewProps, AttributeViewState> {
  constructor(props: AttributeViewProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultAttributeViewStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    return (
      <div className='row'>
        <span id={this.props.title} className={css(ss.sectionTitleContainer, custom.sectionTitleContainer)}>
          {this.props.title}
        </span>
        <GridStats
          statArray={this.props.statArray}
          howManyGrids={this.props.howManyGrids || 3}
          searchValue={''}
          shouldRenderEmptyListItems={true}
          styles={{
            listItemContainer: { display: 'flex' },
          }}
          renderListItem={(a: AttributeObjectInfo, i: number) => {
            const isOdd = i % 2 !== 0;
            if (a.attributeInfo) {
              return (
                <Tooltip
                  styles={{
                    Tooltip: {
                      width: '100%',
                    },
                    
                    tooltip: defaultAttributeViewStyle.tooltip,
                  }}
                  content={() => a.attributeInfo &&
                    <div className={css(ss.tooltipContent, custom.tooltipContent)}>
                      <div>{a.attributeInfo.name} {a.value}</div>
                      <div>{a.attributeInfo.description}</div>
                    </div>
                  }>
                  <div id={a.attributeInfo.name} className={css(
                    ss.statsListItem,
                    custom.statsListItem,
                    isOdd && ss.lightListItem,
                    isOdd && custom.lightListItem,
                  )}>
                    <span
                      id={`${a.attributeInfo.name}-title`}
                      className={css(ss.statText, custom.statText)}>
                      {a.attributeInfo && a.attributeInfo.name}
                    </span>
                    <span
                      id={`${a.attributeInfo.name}-value`}
                      className={css(
                        ss.statText,
                        custom.statText,
                        a.value && ss.statValue,
                        a.value && custom.statValue,
                      )}>
                      {a.value ? parseFloat(a.value.toFixed(2)) : ''}
                    </span>
                  </div>
                </Tooltip>
              );
            } else {
              return (
                <div className={css(
                  ss.statsListItem,
                  custom.statsListItem,
                  isOdd && ss.lightListItem,
                  isOdd && custom.lightListItem,
                )}>
                  <span className={css(ss.statText, custom.statText)}>{a.attributeInfo && a.attributeInfo.name}</span>
                  <span className={css(
                    ss.statText,
                    custom.statText,
                    a.value && ss.statValue,
                    a.value && custom.statValue,
                  )}>{a.value ? parseFloat(a.value.toFixed(2)) : ''}</span>
                </div>
              );
            }
          }}
        />
      </div>
    );
  }
}

export default AttributeView;

