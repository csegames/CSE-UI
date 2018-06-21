/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { filter } from 'lodash';
import { events } from '@csegames/camelot-unchained';
import { ProgressionAlert, IInteractiveAlert } from '@csegames/camelot-unchained/lib/graphql/schema';

// Utility Functions
export function removeProgressionAlert(alertsList: IInteractiveAlert[], toRemove: ProgressionAlert) {
  const alerts = filter([...alertsList], (a) => {
    return !(a.category === 'Progression' && (a as ProgressionAlert).when === toRemove.when);
  });
  return {
    alerts,
  };
}

const Container = styled('div')`
  background: #646464;
`;

const Button = styled('div')`
  cursor: pointer;
  display: inline-block;
  position: relative;
  width: 120px;
  height: 32px;
  line-height: 32px;
  border-radius: 2px;
  font-size: 0.9em;
  background-color: #fff;
  color: #646464;
  transition: box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.2s;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
`;

export interface Props {
  alert: ProgressionAlert;
  remove: (alert: IInteractiveAlert) => void;
}

export interface State {

}

export class ProgressionAlertView extends React.Component<Props, State> {
  public render() {
    return (
      <Container>
        <h6>A new progression report is available!  Would you like to view it now and collect your rewards?</h6>
        <Button onClick={this.onOpenProgressionClick}>Yes</Button>
        <Button onClick={this.onDismissClick}>No</Button>
      </Container>
    );
  }

  private onOpenProgressionClick = () => {
    events.fire('hudnav--navigate', 'progression', true);
    this.props.remove(this.props.alert);
  }

  private onDismissClick = () => {
    this.props.remove(this.props.alert);
  }
}
