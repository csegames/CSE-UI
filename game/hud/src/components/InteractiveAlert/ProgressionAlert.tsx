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
import * as CONFIG from '../../widgets/Settings/config';

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
    margin-top: 20px;
    height: 100px;
    text-align: center;
    color: #baa892;
    ${CONFIG.INTERACTIVE_FONT}
    font-size: 20px;
    margin: 30px 150px 0px 150px;
`;

const InputContainer = styled('div')`
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    position: absolute;
    bottom: 20px;
    left: 250px;
`;

const Button = styled('div')`
    cursor: pointer;
    width: ${CONFIG.ACTION_BUTTON_WIDTH}px;
    height: ${CONFIG.ACTION_BUTTON_HEIGHT}px;
    line-height: ${CONFIG.ACTION_BUTTON_HEIGHT}px;
    text-align: center;
    text-transform: uppercase;
    margin: 0 3px;
    font-size: 9px;
    background-image: url(images/settings/button-off.png);
    letter-spacing: 2px;
    position: relative;
    &:hover {
    color: ${CONFIG.HIGHLIGHTED_TEXT_COLOR};
    background-image: url(images/settings/button-on.png);
    ::before {
      content: '';
      position: absolute;
      background-image: url(images/settings/button-glow.png);
      width: 93px;
      height: 30px;
      left: 1px;
      background-size: cover;
    }
    }
`;

const ButtonOverlay = styled('div')`
    color: ${CONFIG.NORMAL_TEXT_COLOR};
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(images/ui/interactive-alert/button-texture.png);
    padding-left: 2px;
    padding-right: 2px;
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
