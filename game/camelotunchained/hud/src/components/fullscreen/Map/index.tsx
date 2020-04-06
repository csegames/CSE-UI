/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { WarbandContext, WarbandContextState } from '../../context/WarbandContext';
import { Objective } from './Objective';
import { WarbandMemberIndicator } from './WarbandMemberIndicator';
import { SelfIndicator } from './SelfIndicator';

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: stretch;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(../images/map/map-bg.jpg);
`;

const MapImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url(images/map/map-bg.jpg);
  background-position: center center;
`;

interface InjectedProps {
  warbandContext: WarbandContextState;
}

export interface Props {
}

export interface State {
  entityIdMap: { [entityId: string]: boolean };
}

class MapWithInjectedProps extends React.Component<Props & InjectedProps, State> {
  constructor(props: Props & InjectedProps) {
    super(props);
    this.state = {
      entityIdMap: {},
    }
  }

  public render() {
    return (
      <Container>
        <MapImage style={{ backgroundImage: `url(${this.getMapImage()})` }} />
        {Object.keys(this.state.entityIdMap).map((entityId) => {
          return <Objective entityId={entityId} />;
        })}

        {Object.values(this.props.warbandContext.memberIdToMemberState).map((memberState) => {
          return <WarbandMemberIndicator memberState={memberState} />
        })}

        <SelfIndicator />
      </Container>
    );
  }

  public componentDidMount() {
    this.initializeState();
    game.on('plotUpdate', this.handleBuildingPlotUpdate);
  }

  private initializeState = () => {
    const entityIdMap = { ...this.state.entityIdMap };
    Object.keys(camelotunchained.game.entities).forEach((entityId) => {
      if ((camelotunchained.game.entities[entityId] as any).type === 'plot') {
        entityIdMap[entityId] = true;
      }
    });

    this.setState({ entityIdMap });
  }

  private getMapImage = () => {
    if (game.map.backgroundImageURL) {
      return game.map.backgroundImageURL;
    }

    return 'images/map/map-image.png';
  }

  private handleBuildingPlotUpdate = (entityState: BuildingPlotStateModel) => {
    if (entityState.mapSettings !== BuildingPlotMapUISettings.KeepLordPlot &&
        entityState.mapSettings !== BuildingPlotMapUISettings.CapturePlot) {
      return;
    }

    if (this.state.entityIdMap[entityState.entityID]) {
      return;
    }

    const entityIdMap = { ...this.state.entityIdMap };
    entityIdMap[entityState.entityID] = true;
    this.setState({ entityIdMap });
  }
}

export function Map(props: Props) {
  const warbandContext = useContext(WarbandContext);
  return (
    <MapWithInjectedProps {...props} warbandContext={warbandContext} />
  )
}
