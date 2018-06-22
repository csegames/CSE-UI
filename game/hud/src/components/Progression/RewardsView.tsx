/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { Spinner } from '@csegames/camelot-unchained';
import { CharacterProgressionData, CharacterAdjustmentDBModel } from '@csegames/camelot-unchained/lib/graphql/schema';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import {
  LoadingContainer,
  InnerContainer,
  ProgressionTitle,
  ProgressionCorner,
  ProgressionContent,
  ProgressionLoading,
  ProgressionFooter,
} from './style';

const progressionAdjustmentFragments = `
  fragment ItemDefinition on ItemDefRef {
    id
    numericItemDefID
    defaultResourceID
    iconUrl
    name
    description
    tags
    itemType
  }

  fragment SkillPartDefinition on SkillPartDef {
    icon
    id
    name
  }

  fragment SkillPartLevelReason on CharacterAdjustmentReasonSkillPartLevel {
    skillPartID
    skillPartLevel
    skillPartDef {
      ...SkillPartDefinition
    }
  }

  fragment UseSkillPartReason on CharacterAdjustmentReasonUseSkillPart {
    skillID
    inCombatCount
    nonCombatCount
    skillPartDef {
      ...SkillPartDefinition
    }
  }

  fragment UseSkillsReason on CharacterAdjustmentReasonUseSkills {
    inCombatCount
    nonCombatCount
  }

  fragment AddItemAdjustment on CharacterAdjustmentAddItem {
    itemInstanceIDS
    staticDefinitionID
    unitCount
    quality
    itemDef {
      ...ItemDefinition
    }
  }

  fragment PlayerStatAdjustment on CharacterAdjustmentPlayerStat {
    playerStat
    previousBonus
    newBonus
    previousProgressionPoints
    newProgressionPoints
  }

  fragment SkillPartAdjustment on CharacterAdjustmentSkillPartProgress {
    skillPartID
    previousLevel
    previousProgressionPoints
    newLevel
    newProgressPoints
    skillPartDef {
      ...SkillPartDefinition
    }
  }

  fragment SkillNodeAdjustment on CharacterAdjustmentApplySkillNode {
    skillNodePath
  }

  fragment AdjustmentModel on CharacterAdjustmentDBModel {
    reason {
      skillPartLevel {
        ...SkillPartLevelReason
      }
      useSkillPart {
        ...UseSkillPartReason
      }
      useSkills {
        ...UseSkillsReason
      }
    }
    adjustment {
      addItem {
        ...AddItemAdjustment
      }
      playerStat {
        ...PlayerStatAdjustment
      }
      skillPart {
        ...SkillPartAdjustment
      }
      skillNode {
        ...SkillNodeAdjustment
      }
    }
  }
`;

const adjustmentsByDayLogIDQuery = (logID: string) => `
${progressionAdjustmentFragments}
{
  myprogression {
    adjustmentsByDayLogID(logID: "${logID}") {
      ...AdjustmentModel
    }
  }
}
`;

type QueryType = {
  myprogression: CharacterProgressionData;
};

export interface Props {
  logID: string;
}

export interface State {

}

class RewardsView extends React.Component<Props, State> {
  public render() {
    const query = adjustmentsByDayLogIDQuery(this.props.logID);
    return (
      <GraphQL query={query}>
        {(graphql: GraphQLResult<QueryType>) => {
          if (graphql.lastError && graphql.lastError !== 'OK') {
            return (
            <LoadingContainer>
              <ProgressionTitle><h6>Progression</h6></ProgressionTitle>
              <InnerContainer>
                <ProgressionCorner />
                <ProgressionContent>
                  <ProgressionLoading>
                  <div>{graphql.lastError}</div>
                  </ProgressionLoading>
                </ProgressionContent>
                <ProgressionFooter />
              </InnerContainer>
            </LoadingContainer>
            );
          }
          if (graphql.loading || !graphql.data || !graphql.data.myprogression) {
            return (
              <LoadingContainer>
                <ProgressionTitle><h6>Progression</h6></ProgressionTitle>
                <InnerContainer>
                  <ProgressionCorner />
                  <ProgressionContent>
                    <ProgressionLoading>
                      <div>Loading...</div>
                      <Spinner />
                    </ProgressionLoading>
                  </ProgressionContent>
                  <ProgressionFooter />
                </InnerContainer>
              </LoadingContainer>
            );
          }
          return (
            <ul>{ this.showRewards(graphql.data.myprogression) }</ul>
          );
        }}
      </GraphQL>
    );
  }

  private showRewards(progressionData: CharacterProgressionData) {
    const adjustmentsElement: JSX.Element[] = [];
    if (!progressionData.adjustmentsByDayLogID || progressionData.adjustmentsByDayLogID.length === 0) {
      adjustmentsElement.push(<li key='noreward'><div className='NoReward'>No new rewards.</div></li>);
    } else {
      let keyCounter = 0;
      progressionData.adjustmentsByDayLogID.forEach((adjustment: CharacterAdjustmentDBModel, adjustmentID: number) => {
        const { addItem, playerStat, skillNode, skillPart } = adjustment.adjustment;
        const { skillPartLevel, useSkillPart, useSkills, adminGrant } = adjustment.reason;
        let reasonDescription: JSX.Element = null;
        if (skillPartLevel) {
          // Reason is skill level up
          reasonDescription =
            <span>
              <img height='20px' width='20px' src={skillPartLevel.skillPartDef.icon} />
              Obtained Level {skillPartLevel.skillPartLevel}
              &nbsp;{skillPartLevel.skillPartDef.name}
            </span>;
        } else if (useSkillPart) {
          // Reason is individual skill usage
          reasonDescription =
            <span>
              <img height='20px' width='20px' src={useSkillPart.skillPartDef.icon} />
              Used &nbsp;{useSkillPart.skillPartDef.name}: {useSkillPart.inCombatCount + useSkillPart.nonCombatCount}
            </span>;
        } else if (useSkills) {
          // Reason is any skill usage
          reasonDescription =
            <span>
              Any Skill Used: {useSkills.inCombatCount + useSkills.nonCombatCount}
            </span>;
        } else if (adminGrant) {
          // Given by administrator
          reasonDescription = <span>Granted by Administrator</span>;
        }

        const adjustmentDescription: JSX.Element[] = [];
        if (addItem) {
          // Adjustment is a new item
          adjustmentDescription.push(
            <li key={++keyCounter}>
              <div className='ProgressionLabel'>Item{addItem.unitCount > 1 ? 's' : null} Received:</div>
              <div className='ProgressionValue'>
                <img height='20px' width='20px' src={addItem.itemDef.iconUrl} />
                &nbsp;{addItem.unitCount}x {addItem.staticDefinitionID}
              </div>
              <div className='RewardLabel'>Reason:</div><div className='RewardValue'>{reasonDescription}</div>
            </li>
          ,);
        } else if (playerStat) {
          // Adjustment is stat progression
          if (playerStat.newBonus !== playerStat.previousBonus) {
            adjustmentDescription.push(
              <li key={++keyCounter}>
                <div className='ProgressionLabel'>Attribute Bonus Applied:</div>
                <div className='ProgressionValue'>
                  +{playerStat.newBonus - playerStat.previousBonus} to {playerStat.playerStat}
                </div>
                <div className='RewardLabel'>Reason:</div><div className='RewardValue'>{reasonDescription}</div>
              </li>
            ,);
          }
          if (playerStat.newProgressionPoints - playerStat.previousProgressionPoints > 0) {
            adjustmentDescription.push(
              <li key={++keyCounter}>
                <div className='ProgressionLabel'>Attribute Progression Increase:</div>
                <div className='ProgressionValue'>
                {playerStat.newProgressionPoints - playerStat.previousProgressionPoints} points for {playerStat.playerStat}
                </div>
                <div className='RewardLabel'>Reason:</div><div className='RewardValue'>{reasonDescription}</div>
              </li>
            ,);
          }
        } else if (skillNode) {
          // Adjustment is a skill node
          adjustmentDescription.push(
            <li key={++keyCounter}>
              <div className='ProgressionLabel'>Skill Node Applied:</div>
              <div className='ProgressionValue'>{skillNode.skillNodePath}</div>
              <div className='RewardLabel'>Reason:</div><div className='RewardValue'>{reasonDescription}</div>
            </li>
          ,);
        } else if (skillPart) {
          // Adjustment is skill progression
          if (skillPart.newLevel !== skillPart.previousLevel) {
            adjustmentDescription.push(
              <li key={++keyCounter}>
                <div className='ProgressionLabel'>New Skill Level Obtained:</div>
                <div className='ProgressionValue'>
                  <img height='20px' width='20px' src={skillPart.skillPartDef.icon} />
                  Level {skillPart.newLevel} {skillPart.skillPartDef.name}
                </div>
                <div className='RewardLabel'>Reason:</div><div className='RewardValue'>{reasonDescription}</div>
              </li>
            ,);
          }
          if (skillPart.newProgressPoints - skillPart.previousProgressionPoints > 0) {
            adjustmentDescription.push(
              <li key={++keyCounter}>
                <div className='ProgressionLabel'>Skill Progression Increase:</div>
                <div className='ProgressionValue'>
                  <img height='20px' width='20px' src={skillPart.skillPartDef.icon} />
                  {skillPart.newProgressPoints - skillPart.previousProgressionPoints} points for
                  &nbsp;{skillPart.skillPartDef.name}
                </div>
                <div className='RewardLabel'>Reason:</div><div className='RewardValue'>{reasonDescription}</div>
              </li>
            ,);
          }
        }

        adjustmentDescription.forEach((adjustment) => {
          adjustmentsElement.push(adjustment);
        });

      });
    }
    return adjustmentsElement;
  }
}

export default RewardsView;
