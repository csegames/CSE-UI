/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { ql } from '@csegames/camelot-unchained';
import { colors } from '../../../../lib/constants';

const TraitName = styled('header')`
  font-size: 1.3em;
  margin: 0px 0px -4px 0px;
  color: ${(props: any) => props.color}
`;

const AdditionalInfoContainer = styled('div')`
  display: flex;
  align-items: center;
`;

export interface TraitSummaryProps {
  trait: ql.schema.Trait;
}

export interface TraitSummaryState {

}

class TraitSummary extends React.Component<TraitSummaryProps, TraitSummaryState> {
  constructor(props: TraitSummaryProps) {
    super(props);
    this.state = {

    };
  }

  public render() {
    if (this.props.trait) {
      const { name, description, points, icon } = this.props.trait;
      const isBoon = points >= 0;

      return (
        <div>
          <img src={icon} />
          <TraitName color={isBoon ? colors.boonPrimary : colors.banePrimary}>{name}</TraitName>
          <AdditionalInfoContainer>
            <p>
              Value: {!isBoon ? points * -1 : points}
            </p>
          </AdditionalInfoContainer>
          <p>{description}</p>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default TraitSummary;
