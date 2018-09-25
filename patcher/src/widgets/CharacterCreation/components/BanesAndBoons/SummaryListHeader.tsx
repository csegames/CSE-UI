/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { Tooltip } from '@csegames/camelot-unchained';
import { colors } from '../../styleConstants';

const PointsContainer = styled('div')`
  display: flex;
  flex-direction: column;
`;

const PointsBarContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TotalPointsText = styled('div')`
  font-size: 1em;
  text-align: center;
  margin-top: ${(props: any) => props.marginTop ? props.marginTop : 0};
  margin-bottom: ${(props: any) => props.marginBottom ? props.marginBottom : -28}px;
  color: ${(props: any) => props.color};
`;

const TooManyTraitsText = styled('div')`
  font-size: 24px;
  text-align: center;
  margin: 0;
  color: ${(props: any) => props.color};
`;

const PointsMeter = styled('div')`
  display: flex;
  height: 20px;
  margin-top: 10px;
  margin-bottom: 2px;
`;

const BalanceBar = styled('div')`
  transition: flex 0.5s, background-color 0.5s;
  flex: ${(props: any) => props.flex};
  background-color: ${(props: any) => props.backgroundColor};
`;

const ResetButtonsContainer = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const ResetButton = styled('div')`
  cursor: pointer;
  font-size: 1em;
  transition: color 0.3s;
  text-align: center;
  color: ${(props: any) => props.color};
  margin: 0;
  &:hover: {
    color: ${(props: any) => props.hoverColor};
  }
`;

export interface SummaryListHeaderProps {
  flexOfBoonBar: number;
  flexOfBaneBar: number;
  banePoints: number;
  boonPoints: number;
  minPoints: number;
  maxPoints: number;
  totalPoints: number;

  onResetBoonsClick: () => void;
  onResetBanesClick: () => void;
  onResetAllClick: () => void;
}

export interface SummaryListHeaderState {
  showResetBoonAlertDialog: boolean;
  showResetBaneAlertDialog: boolean;
  showResetAllAlertDialog: boolean;
}

class SummaryListHeader extends React.Component<SummaryListHeaderProps, SummaryListHeaderState> {
  constructor(props: SummaryListHeaderProps) {
    super(props);
    this.state = {
      showResetBoonAlertDialog: false,
      showResetBaneAlertDialog: false,
      showResetAllAlertDialog: false,
    };
  }

  public render() {
    const { banePoints, boonPoints, minPoints, maxPoints, totalPoints } = this.props;
    return (
      <PointsContainer id={'trait-pointsContainer'}>
        <PointsBarContainer>
          <TotalPointsText color={colors.boonPrimary} marginBottom={-5}>{boonPoints}</TotalPointsText>
          <Tooltip
            styles={{
              tooltip: {
                backgroundColor: 'rgba(0,0,0,0.9)',
                maxWidth: '200px',
                direction: 'ltr',
              },
            }}
            content={() => (
              <p>
                {
                  banePoints + boonPoints < minPoints ? `A minimumn of ${minPoints} points spent
                  in both Banes and Boons is required. Current value: ${banePoints + boonPoints}` :
                  banePoints + boonPoints > maxPoints ?
                  `The maximumn number of points spent in both Banes and Boons is
                  ${maxPoints}. Current value: ${banePoints + boonPoints}` :
                  totalPoints > 0 ?
                    `The value of Banes, ${banePoints}, must equal the value of Boons, ${boonPoints}` :
                  totalPoints < 0 ?
                    `The value of Boons, ${boonPoints}, must equal the value of Boons, ${banePoints}` :
                    'Balanced'
                }
              </p>
          )}>
            <TooManyTraitsText
              color={totalPoints > 0 ? colors.boonPrimary : totalPoints < 0 ||
              banePoints + boonPoints < minPoints || banePoints + boonPoints > maxPoints ?
              colors.banePrimary : colors.success}>
              {
                banePoints + boonPoints < minPoints ? 'Too few Banes and Boons' :
                banePoints + boonPoints > maxPoints ? 'Too many Banes and Boons' :
                totalPoints > 0 ? 'Not enough Banes' :
                totalPoints < 0 ? 'Not enough Boons' :
                'Balanced'
              }
            </TooManyTraitsText>
          </Tooltip>
          <TotalPointsText color={colors.banePrimary}>{banePoints}</TotalPointsText>
        </PointsBarContainer>
        <PointsMeter>
          <BalanceBar
            flex={this.props.flexOfBoonBar}
            backgroundColor={totalPoints !== 0 || banePoints + boonPoints < minPoints ||
              banePoints + boonPoints > maxPoints ? colors.boonPrimary : colors.success}
          />
          <BalanceBar
            flex={this.props.flexOfBaneBar}
            backgroundColor={totalPoints !== 0 || banePoints + boonPoints < minPoints ||
              banePoints + boonPoints > maxPoints ? colors.banePrimary : colors.success}
          />
        </PointsMeter>
        <ResetButtonsContainer>
          <ResetButton
            onClick={this.props.onResetBoonsClick}
            color={colors.boonPrimary}
            hoverColor={colors.transparentBoon}>
            Reset boons
          </ResetButton>
          <ResetButton
            onClick={this.props.onResetAllClick}
            color={colors.success}
            hoverColor={colors.transparentSuccess}>
              Reset all
          </ResetButton>
          <ResetButton
            onClick={this.props.onResetBanesClick}
            color={colors.banePrimary}
            hoverColor={colors.transparentBane}>
              Reset banes
          </ResetButton>
        </ResetButtonsContainer>
      </PointsContainer>
    );
  }
}

export default SummaryListHeader;
