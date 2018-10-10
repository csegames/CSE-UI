/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import gql from 'graphql-tag';
import * as React from 'react';
import { isEqual } from 'lodash';
import { webAPI } from '@csegames/camelot-unchained';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import ProgressionView from './ProgressionView';
import { ProgressionGQL } from 'gql/interfaces';

declare const toastr: any;

const query = gql`
  query ProgressionGQL {
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
          skillPartDef {
            ...SkillPartDefinition
          }
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

  fragment SkillPartDefinition on SkillPartDef {
    icon
    id
    name
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
    };
  }
  public render() {
    if (!this.state.visible) {
      return null;
    }

    return (
      <GraphQL query={query} onQueryResult={this.handleQueryResult}>
        {(graphql: GraphQLResult<ProgressionGQL.Query>) => {
          return (
            <ProgressionView
              graphql={graphql}
              logIDs={this.state.logIDs}
              collected={this.state.collected}
              collecting={this.state.collecting}
              onCloseClick={this.onCloseClick}
              onCollectClick={this.onCollectClick}
            />
          );
        }}
      </GraphQL>
    );
  }

  public componentDidMount() {
    game.on('hudnav--navigate', this.handleNav);
  }

  public componentWillUnmount() {
    if (this.isCollectingTimeout) {
      clearTimeout(this.isCollectingTimeout);
      this.isCollectingTimeout = null;
    }
  }

  private handleQueryResult = (result: GraphQLResult<ProgressionGQL.Query>) => {
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
    this.setState({ visible: true });
  }

  private hide = () => {
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
    }
    try {
      const res = await webAPI.ProgressionAPI.CollectCharacterDayProgression(
        webAPI.defaultConfig,
        game.shardID,
        game.selfPlayerState.characterID,
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
    } catch (err) {
      console.error(err);
    }
  }
}

export default Progression;
