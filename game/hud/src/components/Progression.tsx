/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { isEqual, isEmpty } from 'lodash';
import styled from 'react-emotion';
import { events, client, webAPI, Spinner } from '@csegames/camelot-unchained';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { CharacterProgressionData } from '@csegames/camelot-unchained/lib/graphql/schema';
import ObjectDisplay from './ObjectDisplay';

declare const toastr: any;

const query = `
fragment craftingJobSummary on JobSummaryDBModel {
  started
  canceled
  collected
}

fragment damagePerTarget on CountPerTargetTypeDBModel {
  self
  playerCharacter
  nonPlayerCharacter
  building
  item
  resourceNode
}
{
  myprogression {
    unCollectedDayLogs {
      id
      dayStart
      dayEnd
      secondsActive
      distanceMoved
      skillPartsUsed {
        skillPartID
        usedInCombatCount
        usedNonCombatCount
      }
      damage {
        healingApplied {
          ...damagePerTarget
        }
        healingReceived {
          ...damagePerTarget
        }
        damageApplied {
          ...damagePerTarget
        }
        killCount {
          ...damagePerTarget
        }
        deathCount {
          ...damagePerTarget
        }
        killAssistCount {
          ...damagePerTarget
        }
        createCount {
          ...damagePerTarget
        }
      }
      plots {
        factionPlotsCaptured
        scenarioPlotsCaptured
      }
      crafting {
        blockSummary {
          ...craftingJobSummary
        }
        grindSummary {
          ...craftingJobSummary
        }
        makeSummary {
          ...craftingJobSummary
        }
        purifySummary {
          ...craftingJobSummary
        }
        refineSummary {
          ...craftingJobSummary
        }
        repairSummary {
          ...craftingJobSummary
        }
        salvageSummary {
          ...craftingJobSummary
        }
        shapeSummary {
          ...craftingJobSummary
        }
      }
      state
      scenarios {
        outcome
        activeAtEnd
        score
      }
    }
  }
}
`;

type QueryType = {
  myprogression: CharacterProgressionData;
};

const Container = styled('div')`
  position: relative;
  pointer-events: all;
  width: 500px;
  height: 400px;
  padding: 20px;
  background-color: gray;
  color: white;
`;

const LoadingContainer = styled('div')`
  position: relative;
  pointer-events: all;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 500px;
  height: 400px;
  padding: 20px;
  background-color: gray;
  color: white;
`;

const ObjectDisplayContainer = styled('div')`
  height: 90%;
`;

const CloseButton = styled('div')`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 12px;
  height: 12px;
  background: url(images/inventory/close-button-grey.png) no-repeat;
  cursor: pointer;
  &:hover {
    -webkit-filter: drop-shadow(2px 2px 2px rgba(255, 255, 255, 0.9));
  }
  &:active {
    -webkit-filter: drop-shadow(2px 2px 2px rgba(255, 255, 255, 1));
  }
`;

export interface Props {

}

export interface State {
  visible: boolean;
  collecting: boolean;
  collected: boolean;
  logIDs: string[];
}

class Progression extends React.Component<Props, State> {
  private isCollectingTimeout: number;
  constructor(props: Props) {
    super(props);
    this.state = {
      visible: false,
      collecting: false,
      collected: false,
      logIDs: [],
    }
  }
  public render() {
    if (!this.state.visible) {
      return null;
    }

    if (this.state.collecting) {
      return (
        <LoadingContainer>
          <CloseButton onClick={this.onCloseClick} />
          <div>Collecting...</div>
          <Spinner />
        </LoadingContainer>
      );
    } else {
      return (
        <GraphQL query={query} onQueryResult={this.handleQueryResult}>
          {(graphql: GraphQLResult<QueryType>) => {
            if (graphql.lastError && graphql.lastError !== 'OK') {
              return (
                <LoadingContainer>
                  <CloseButton onClick={this.onCloseClick} />
                  <div>{graphql.lastError}</div>
                </LoadingContainer>
              );
            }

            if (graphql.loading || !graphql.data || !graphql.data.myprogression) {
              return (
                <LoadingContainer>
                  <CloseButton onClick={this.onCloseClick} />
                  <div>Loading...</div>
                  <Spinner />
                </LoadingContainer>
              );
            }

            if (this.state.collected || isEmpty(graphql.data.myprogression.unCollectedDayLogs)) {
              return (
                <LoadingContainer>
                  <CloseButton onClick={this.onCloseClick} />
                  <div>All progression packages have been collected</div>
                </LoadingContainer>
              );
            }

            return (
              <Container>
                <CloseButton onClick={this.onCloseClick} />
                <ObjectDisplayContainer>
                  <ObjectDisplay data={graphql.data.myprogression} skipFunctions />
                </ObjectDisplayContainer>
                <button onClick={this.onCollectClick}>Collect All</button>
              </Container>
            );
          }}
        </GraphQL>
      );
    }
  }

  public componentDidMount() {
    events.on('hudnav--navigate', this.handleNav);
  }

  public componentWillUnmount() {
    if (this.isCollectingTimeout) {
      clearTimeout(this.isCollectingTimeout);
      this.isCollectingTimeout = null;
    }
  }

  private handleQueryResult = (result: GraphQLResult<QueryType>) => {
    if (!result.data || !result.data.myprogression) {
      return result;
    }

    const logIDs: string[] = [];
    result.data.myprogression.unCollectedDayLogs.forEach((uncollectedDayLog) => {
      logIDs.push(uncollectedDayLog.id);
    });
    if (!isEqual(logIDs, this.state.logIDs)) {
      this.setState({ logIDs });
    }

    return result;
  }

  private handleNav = (name: string) => {
    if (name === 'progression') {
      if (this.state.visible) {
        this.hide();
      } else {
        this.show();
      }
    }
  }

  private onCloseClick = () => {
    this.hide();
  }

  private show = () => {
    client.RequestInputOwnership();
    this.setState({ visible: true });
  }

  private hide = () => {
    client.ReleaseInputOwnership();
    this.setState({ visible: false, collected: false });
  }

  private onCollectClick = () => {
    this.setState({ collecting: true });
    this.collectCharacterDayProgression(0);
  }
  
  private collectCharacterDayProgression = async (logIDIndex: number) => {
    if (!this.state.logIDs[logIDIndex]) {
      // set a timeout for the api server to update
      this.setState({ collecting: false, collected: true });
      return;
    };
    try {
      const res = await webAPI.ProgressionAPI.CollectCharacterDayProgression(
        webAPI.defaultConfig,
        client.loginToken,
        client.shardID,
        client.characterID,
        this.state.logIDs[logIDIndex],
      );
      if (!res.ok) {
        const resultData = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
        if (resultData.FieldCodes && resultData.FieldCodes.length > 0) {
          toastr.error(resultData.FieldCodes[0].Message, 'Oh No!!', { timeout: 3000 });
        }
      }

      // Recursively collect next days character progression
      this.collectCharacterDayProgression(logIDIndex + 1);
    } catch(err) {
      console.error(err);
    }
  }
}

export default Progression;
