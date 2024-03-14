/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import {
  HUDHorizontalAnchor,
  HUDLayer,
  HUDVerticalAnchor,
  HUDWidgetRegistration,
  addMenuWidgetExiting
} from '../../redux/hudSlice';
import { RootState } from '../../redux/store';
import { Menu } from '../menu/Menu';
import { MyScenarioQueue } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { JoinScenarioRow } from './JoinScenarioRow';

const Root = 'HUD-JoinScenario-Root';
const Container = 'HUD-JoinScenario-Container';
const Scroller = 'Scroller-ThumbOnly';

interface ReactProps {}

interface InjectedProps {
  scenarioQueue: MyScenarioQueue | null;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AJoinScenario extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <div className={Root}>
        <Menu title='Scenarios' menuID={WIDGET_NAME_JOIN_SCENARIO} closeSelf={this.closeSelf.bind(this)} escapable>
          <div className={`${Container} ${Scroller}`}>
            {this.props.scenarioQueue?.availableMatches?.map((match) => (
              <JoinScenarioRow match={match} key={match.id} />
            ))}
          </div>
        </Menu>
      </div>
    );
  }

  closeSelf(): void {
    this.props.dispatch(addMenuWidgetExiting(WIDGET_NAME_JOIN_SCENARIO));
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    scenarioQueue: state.scenario.queue
  };
};

const JoinScenario = connect(mapStateToProps)(AJoinScenario);

export const WIDGET_NAME_JOIN_SCENARIO = 'Join Scenario';
export const joinScenarioRegistry: HUDWidgetRegistration = {
  name: WIDGET_NAME_JOIN_SCENARIO,
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Center,
    xOffset: 0,
    yOffset: 0
  },
  layer: HUDLayer.Menus,
  render: () => {
    return <JoinScenario />;
  }
};
