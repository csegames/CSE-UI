/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

interface ObjectiveIndicator {
  iconClass: string;
  name: string;
  indicator: string;
}

// tslint:disable-next-line
const INDICATORS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

export interface ObjectivesContextState {
  objectives: ObjectiveEntityState[];
  indicatorAssign: {[entityID: string]: ObjectiveIndicator};
}

const getDefaultObjectivesContextState = (): ObjectivesContextState => ({
  objectives: [],
  indicatorAssign: {},
});

export const ObjectivesContext = React.createContext(getDefaultObjectivesContextState());

export class ObjectivesContextProvider extends React.Component<{}, ObjectivesContextState> {
  private eventHandle: EventHandle;
  constructor(props: {}) {
    super(props);

    this.state = getDefaultObjectivesContextState();
  }

  public render() {
    return (
      <ObjectivesContext.Provider value={this.state}>
        {this.props.children}
      </ObjectivesContext.Provider>
    );
  }

  public componentDidMount() {
    this.eventHandle = hordetest.game.onObjectivesUpdate(this.handleObjectivesUpdate);

    // ----- DEBUG DATA -----
    // @ts-ignore
    // const objectives = [{"statuses":{"0":{"duration":null,"startTime":263.6333333333333,"id":-702837995}},"health":{"current":0,"max":0},"faction":3,"entityID":"e0a1c97","itemDefID":2102772938,"objective":{"visibility":7,"bearingDegrees":97.05586242675781,"state":1,"progress":{"current":2000,"max":2000}},"name":"Health Pool","isAlive":true,"type":"item","iconClass":"fs-icon-point-health-pool","position":{"x":-7.53125,"y":0.21875,"z":12.40625}},{"statuses":{"0":{"duration":null,"startTime":263.6333333333333,"id":-702837995}},"health":{"current":0,"max":0},"faction":3,"entityID":"e0a1c8b","itemDefID":2102772938,"objective":{"visibility":7,"bearingDegrees":335.3748779296875,"state":1,"progress":{"current":2000,"max":2000}},"name":"Health Pool","isAlive":true,"type":"item","iconClass":"fs-icon-point-health-pool","position":{"x":-281.75,"y":64.96875,"z":30.6875}},{"statuses":{},"health":{"current":0,"max":0},"controllingEntityID":"e0a1c8a","faction":3,"entityID":"e0a1c8a","itemDefID":3925901537,"objective":{"visibility":7,"bearingDegrees":121.00264739990234,"state":1,"progress":{"current":3000,"max":3000}},"name":"AoE Tower","isAlive":true,"type":"siege","iconClass":"fs-icon-point-tower","position":{"x":-14.078125,"y":-119.546875,"z":11.609375}},{"statuses":{},"health":{"current":0,"max":0},"controllingEntityID":"e0a1c7b","faction":3,"entityID":"e0a1c7b","itemDefID":3925901537,"objective":{"visibility":7,"bearingDegrees":76.14958190917969,"state":1,"progress":{"current":3000,"max":3000}},"name":"AoE Tower","isAlive":true,"type":"siege","iconClass":"fs-icon-point-tower","position":{"x":-5.34375,"y":96.765625,"z":17.328125}},{"statuses":{},"health":{"current":0,"max":0},"faction":3,"entityID":"e0a1c88","itemDefID":3843040618,"objective":{"visibility":7,"bearingDegrees":115.04715728759766,"state":1,"progress":{"current":3000,"max":3000}},"name":"Mana Pool","isAlive":true,"type":"item","iconClass":"fs-icon-point-mana-pool","position":{"x":160.1875,"y":-167.21875,"z":29.46875}}];
    // @ts-ignore
    // this.setState({ objectives, indicatorAssign: this.getUpdatedIndicatorAssign(objectives) });
  }

  public componentWillUnmount() {
    this.eventHandle.clear();
  }

  private handleObjectivesUpdate = (objectives: ObjectiveEntityState[]) => {
    if (objectives.length === 0) {
      this.setState({ objectives: cloneDeep(objectives), indicatorAssign: {} });
    } else {
      this.setState({ objectives: cloneDeep(objectives), indicatorAssign: this.getUpdatedIndicatorAssign(objectives) });
    }
  }

  private getUpdatedIndicatorAssign = (objectives: ObjectiveEntityState[]) => {
    const indicatorAssign = cloneDeep(this.state.indicatorAssign);

    objectives.forEach((objective) => {
      const entityID = objective.entityID;
      if (!indicatorAssign[entityID]) {
        const indicatorAssignArray = Object.values(indicatorAssign);
        const indicator = this.getIndicator(0, objective, indicatorAssignArray);

        indicatorAssign[entityID] = { iconClass: objective.iconClass, name: objective.name, indicator };
      }
    });

    return indicatorAssign;
  }

  private getIndicator = (
    indicatorIndex: number,
    objective: ObjectiveEntityState,
    indicatorAssignArray: ObjectiveIndicator[]
  ): string => {
    const foundIndex = indicatorAssignArray.find((objectiveIndicator) => (
      objectiveIndicator.indicator === INDICATORS[indicatorIndex]
    ));

    if (foundIndex) {
      return this.getIndicator(indicatorIndex + 1, objective, indicatorAssignArray);
    }

    return INDICATORS[indicatorIndex];
  }
}
