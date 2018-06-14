/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';

import Boon from '../../BanesAndBoons/Boon';
import Bane from '../../BanesAndBoons/Bane';
import { BanesAndBoonsState } from '../../../services/session/banesAndBoons';
import { colors } from '../../../styleConstants';

const Container = styled('div')`
  display: flex;
  justify-content: space-between;
`;

const BoonsContainer = styled('div')`
  flex: 1;
  padding-right: 10px;
`;

const BanesContainer = styled('div')`
  direction: rtl;
  flex: 1;
  padding-left: 10px;
`;

const BoonsHeader = styled('header')`
  font-size: 22px;
  font-weight: bold;
  color: ${colors.boonPrimary};
  border-bottom: 1px solid ${colors.boonPrimary};
  margin-bottom: 5px;
`;

const BanesHeader = styled('header')`
  font-size: 22px;
  font-weight: bold;
  color: ${colors.banePrimary};
  border-bottom: 1px solid ${colors.banePrimary};
  margin-bottom: 5px;
  text-align: right;
`;

const Boons = styled('div')`
  display: flex;
  flex-wrap: wrap;
`;

const Banes = styled('div')`
  display: flex;
  flex-wrap: wrap;
`;

export interface TraitsSummaryProps {
  banesAndBoonsState: BanesAndBoonsState;
}

export interface TraitsSummaryState {
}

export class TraitsSummary extends React.Component<TraitsSummaryProps, TraitsSummaryState> {
  constructor(props: TraitsSummaryProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    const { addedBoons, addedBanes, traits } = this.props.banesAndBoonsState;

    return (
      <Container>
        <BoonsContainer>
          <BoonsHeader>BOONS</BoonsHeader>
          <Boons>
            {Object.keys(addedBoons).map((id) => {
              return (
                <Boon
                  key={id}
                  shouldBeDefault
                  trait={traits[id]}
                  boonPoints={0}
                  {...this.props.banesAndBoonsState}
                />
              );
            })}
          </Boons>
        </BoonsContainer>
        <BanesContainer>
          <BanesHeader>BANES</BanesHeader>
          <Banes>
            {Object.keys(addedBanes).map((id) => {
              return (
                <Bane
                  key={id}
                  shouldBeDefault
                  trait={traits[id]}
                  banePoints={0}
                  {...this.props.banesAndBoonsState}
                />
              );
            })}
          </Banes>
        </BanesContainer>
      </Container>
    );
  }
}

export default TraitsSummary;

