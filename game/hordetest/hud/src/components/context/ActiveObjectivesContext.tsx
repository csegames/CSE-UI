/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

export interface ActiveObjectivesContextState {
  activeObjectives: ActiveObjective[];
}

const getDefaultActiveObjectivesContextState = (): ActiveObjectivesContextState => ({
  activeObjectives: [],
});

export const ActiveObjectivesContext = React.createContext(getDefaultActiveObjectivesContextState());

export class ActiveObjectivesContextProvider extends React.Component<{}, ActiveObjectivesContextState> {
  private eventHandle: EventHandle;
  constructor(props: {}) {
    super(props);

    this.state = getDefaultActiveObjectivesContextState();
  }

  public render() {
    return (
      <ActiveObjectivesContext.Provider value={this.state}>
        {this.props.children}
      </ActiveObjectivesContext.Provider>
    );
  }

  public componentDidMount() {
    this.eventHandle = hordetest.game.onActiveObjectivesUpdate(this.handleActiveObjectivesUpdate);

    // ----- DEBUG DATA -----
    // this.setState({
    //   activeObjectives: [
    //     {"__Type":"ActiveObjective","bearingDegrees":0,"entityState":{"__Type":"ItemEntityState","faction":3,"entityID":"66aa284","name":"Health Pool 1","isAlive":true,"position":{"__Type":"Vec3f","x":156.5625,"y":-162.3125,"z":3.765625},"statuses":{"0":{"__Type":"Status","id":-702837995,"startTime":578.6333333333333,"duration":null}},"type":"item","health":{"__Type":"CurrentAndMax","current":0,"max":0},"isActiveObjective":true,"objectiveProgress":{"__Type":"CurrentAndMax","current":300,"max":300},"itemDefID":2102772938,"iconClass":"icon-search"}},
    //     {"__Type":"ActiveObjective","bearingDegrees":90,"entityState":{"__Type":"ItemEntityState","faction":3,"entityID":"66aa284","name":"Health Pool 2","isAlive":true,"position":{"__Type":"Vec3f","x":156.5625,"y":-162.3125,"z":3.765625},"statuses":{"0":{"__Type":"Status","id":-702837995,"startTime":578.6333333333333,"duration":null}},"type":"item","health":{"__Type":"CurrentAndMax","current":0,"max":0},"isActiveObjective":true,"objectiveProgress":{"__Type":"CurrentAndMax","current":300,"max":300},"itemDefID":2102772938,"iconClass":"icon-thumbsup"}},
    //     {"__Type":"ActiveObjective","bearingDegrees":180,"entityState":{"__Type":"ItemEntityState","faction":3,"entityID":"66aa284","name":"Health Pool 3","isAlive":true,"position":{"__Type":"Vec3f","x":156.5625,"y":-162.3125,"z":3.765625},"statuses":{"0":{"__Type":"Status","id":-702837995,"startTime":578.6333333333333,"duration":null}},"type":"item","health":{"__Type":"CurrentAndMax","current":0,"max":0},"isActiveObjective":true,"objectiveProgress":{"__Type":"CurrentAndMax","current":300,"max":300},"itemDefID":2102772938,"iconClass":"icon-hat"}},
    //     {"__Type":"ActiveObjective","bearingDegrees":270,"entityState":{"__Type":"ItemEntityState","faction":3,"entityID":"66aa284","name":"Health Pool 4","isAlive":true,"position":{"__Type":"Vec3f","x":156.5625,"y":-162.3125,"z":3.765625},"statuses":{"0":{"__Type":"Status","id":-702837995,"startTime":578.6333333333333,"duration":null}},"type":"item","health":{"__Type":"CurrentAndMax","current":0,"max":0},"isActiveObjective":true,"objectiveProgress":{"__Type":"CurrentAndMax","current":300,"max":300},"itemDefID":2102772938,"iconClass":"icon-horse"}},
    //     {"__Type":"ActiveObjective","bearingDegrees":360,"entityState":{"__Type":"ItemEntityState","faction":3,"entityID":"66aa284","name":"Health Pool 5","isAlive":true,"position":{"__Type":"Vec3f","x":156.5625,"y":-162.3125,"z":3.765625},"statuses":{"0":{"__Type":"Status","id":-702837995,"startTime":578.6333333333333,"duration":null}},"type":"item","health":{"__Type":"CurrentAndMax","current":0,"max":0},"isActiveObjective":true,"objectiveProgress":{"__Type":"CurrentAndMax","current":300,"max":300},"itemDefID":2102772938,"iconClass":"icon-pin"}},
    //   ] as any,
    // });
  }

  public componentWillUnmount() {
    this.eventHandle.clear();
  }

  private handleActiveObjectivesUpdate = (activeObjectives: ActiveObjective[]) => {
    this.setState({ activeObjectives });
  }
}
