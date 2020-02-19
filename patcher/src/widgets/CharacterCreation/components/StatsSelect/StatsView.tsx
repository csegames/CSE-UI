/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozillstatInfo.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { Tooltip } from '../../../../components/Tooltip';
import { GridStats } from '../../../../components/GridStats';
import { StatDefinitionGQL } from 'gql/interfaces';

export const colors = {
  filterBackgroundColor: '#372F2D',
};

export interface StatsViewStyle {
  tooltip: React.CSSProperties;
}

const StatsListItem = styled.div`
  width: calc(100% - 5px);
  display: flex;
  position: relative;
  cursor: default;
  padding: 5px 10px;
  height: 25px;
  background-color: rgba(33, 29, 28, 0.7);
  outline: 1px solid rgba(100, 85, 81, 0.43);
  outline-offset: -3px;
  margin-bottom: 1px;
  &:hover {
    filter: brightness(150%);
  }
`;

const LightListItem = css`
  background-color: rgba(33, 29, 28, 0.9);
`;

const StatText = styled.span`
  flex: 1;
  display: inline-block;
  font-size: 16px;
  padding: 3px;
  color: #CEBBB7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StatValue = css`
  padding: 3px;
  background: linear-gradient(to right,rgba(0,0,0,0.7), transparent);
  max-width: 100px;
  color: #D2D2D2;
`;

const SectionTitleContainer = styled.span`
  font-size: 18px;
  font-family: 'Caudex';
  color: #ECC5A7;
  width: 100%;
  height: 1.1em;
  display: block;
  border-style: solid;
  border-width: 0 0 1px 0;
  border-image: linear-gradient(to right, #84634A 70%, transparent );
  margin-bottom: 5px;
  border-image-slice: 1;
  padding: 0 5px;
`;

const TooltipContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const defaultAttributeViewStyle: StatsViewStyle = {
  tooltip: {
    border: '1px solid #352A22',
    boxShadow: 'inset 0 0 10px 2px rgba(40, 32, 20, 0.2)',
    background: 'black',
    maxWidth: '300px',
    minWidth: '200px',
  },
};

export interface StatObjectInfo {
  statDef: StatDefinitionGQL;
  value: number;
}

export interface Props {
  howManyGrids?: number;
  statArray: StatObjectInfo[];
  title: string;
}

export interface State {
}

export class StatsView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  public render() {
    return (
      <div className='row'>
        <SectionTitleContainer id={this.props.title}>
          {this.props.title}
        </SectionTitleContainer>
        <GridStats
          statArray={this.props.statArray}
          howManyGrids={this.props.howManyGrids || 3}
          searchValue={''}
          shouldRenderEmptyListItems={true}
          styles={{
            listItemContainer: { display: 'flex', marginRight:'20px' },
          }}
          renderListItem={(statInfo: StatObjectInfo, i: number) => {
            const isOdd = i % 2 !== 0;
            if (statInfo.statDef) {
              return (
                <Tooltip
                  styles={{
                    Tooltip: {
                      width: '100%',
                    },

                    tooltip: defaultAttributeViewStyle.tooltip,
                  }}
                  content={() => statInfo.statDef &&
                    <TooltipContent>
                      <div>{statInfo.statDef.name} {statInfo.value}</div>
                      <div>{statInfo.statDef.description}</div>
                    </TooltipContent>
                  }>
                  <StatsListItem id={statInfo.statDef.name} className={isOdd ? LightListItem : ''}>
                    <StatText id={`${statInfo.statDef.name}-title`}>
                      {statInfo.statDef && statInfo.statDef.name}
                    </StatText>
                    <StatText id={`${statInfo.statDef.name}-value`} className={statInfo.value ? StatValue : ''}>
                      {statInfo.value ? parseFloat(statInfo.value.toFixed(2)) : ''}
                    </StatText>
                  </StatsListItem>
                </Tooltip>
              );
            } else {
              return (
                <StatsListItem className={isOdd ? LightListItem : ''}>
                  <StatText>{statInfo.statDef && statInfo.statDef.name}</StatText>
                  <StatText className={statInfo.value ? StatValue : ''}>
                    {statInfo.value ? parseFloat(statInfo.value.toFixed(2)) : ''}
                  </StatText>
                </StatsListItem>
              );
            }
          }}
        />
      </div>
    );
  }
}

export default StatsView;

