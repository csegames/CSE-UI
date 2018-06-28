/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { filter } from 'lodash';
import { events } from '@csegames/camelot-unchained';
import { ProgressionAlert, IInteractiveAlert } from '@csegames/camelot-unchained/lib/graphql/schema';
import { Container, InputContainer, Button, ButtonOverlay } from './lib/styles';

// Utility Functions
export function removeProgressionAlert(alertsList: IInteractiveAlert[], toRemove: ProgressionAlert) {
  const alerts = filter([...alertsList], (a) => {
    return !(a.category === 'Progression' && (a as ProgressionAlert).when === toRemove.when);
  });
  return {
    alerts,
  };
}

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
        <InputContainer>
            <Button onClick={this.onOpenProgressionClick}><ButtonOverlay>Yes</ButtonOverlay></Button>
            <Button onClick={this.onDismissClick}><ButtonOverlay>No</ButtonOverlay></Button>
        </InputContainer>
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
