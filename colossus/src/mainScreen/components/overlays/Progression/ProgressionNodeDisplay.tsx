/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {
  ChampionInfo,
  LAEOp,
  PerkDefGQL,
  PerkRewardDefGQL,
  PerkType,
  ProgressionNodeDef,
  QuestDefGQL,
  QuestGQL,
  StatDefinitionGQL,
  StatDisplayType,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../../redux/store';
import { areLocksFulfilled, getLockDescription, isLockFulfilled } from '../../../helpers/storeHelpers';
import TooltipSource from '../../../../shared/components/TooltipSource';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralLocked,
  StringIDGeneralUnlock
} from '../../../helpers/stringTableHelpers';
import { PerkIcon } from '../../views/Lobby/Store/PerkIcon';
import { TooltipPosition } from '../../../redux/tooltipSlice';
import { FormattedTextDiv } from '../../../../shared/components/FormattedTextDiv';
import { ProfileAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { webConf } from '../../../dataSources/networkConfiguration';
import { refreshProfile } from '../../../dataSources/profileNetworking';
import { showError } from '../../../redux/navigationSlice';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { StarBadge } from '../../../../shared/components/StarBadge';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';

const UNLOCK_DURATION_MS = 200;

const Root = 'ProgressionNodeDisplay-Root';
const Button = 'ProgressionNodeDisplay-Button';
const Icon = 'ProgressionNodeDisplay-Icon';
const LockIcon = 'ProgressionNodeDisplay-LockIcon';
const TooltipRoot = 'ProgressionNodeDisplay-TooltipRoot';
const TooltipSection = 'ProgressionNodeDisplay-TooltipSection';
const CostSection = 'ProgressionNodeDisplay-CostSection';
const CostRow = 'ProgressionNodeDisplay-CostRow';
const RequirementsSection = 'ProgressionNodeDisplay-RequirementsSection';
const RequirementsLabel = 'ProgressionNodeDisplay-RequirementsLabel';
const RequirementDescription = 'ProgressionNodeDisplay-RequirementDescription';
const UnlockSection = 'ProgressionNodeDisplay-UnlockSection';
const TooltipTitle = 'ProgressionNodeDisplay-TooltipTitle';
const CostTitle = 'ProgressionNodeDisplay-CostTitle';
const TwigCostContainer = 'ProgressionNodeDisplay-TwigCostContainer';
const TwigCostValue = 'ProgressionNodeDisplay-TwigCostValue';
const TwigCostIcon = 'ProgressionNodeDisplay-TwigCostIcon';
const BonusText = 'ChampionProfile-ProgressionTree-BonusText';
const BonusValue = 'ChampionProfile-ProgressionTree-BonusValue';
const MouseClickDisplay = 'ProgressionNodeDisplay-MouseClickDisplay';
const MouseClickIcon = 'ProgressionNodeDisplay-MouseClickIcon';
const UnlockLabel = 'ProgressionNodeDisplay-UnlockLabel';
const UnlockBar = 'ProgressionNodeDisplay-UnlockBar';
const Badge = 'ProgressionNodeDisplay-Badge';

const StringIDProgressionTreeCosts = 'ProgressionTreeCosts';
const StringIDLocksProgressionNodeActive = 'LocksProgressionNodeActive';
const StringIDLocksMultipleParentNodes = 'LocksMultipleParentNodes';
const StringIDProgressionTreeStatBonus = 'ProgressionTreeStatBonus';
const StringIDProgressionTreeStatBonusPercent = 'ProgressionTreeStatBonusPercent';

interface State {
  unlockProgress: number;
  isUnlocking: boolean;
  isAnimating: boolean;
}

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  nodeSizePx: number;
  def: ProgressionNodeDef;
}

interface InjectedProps {
  selectedChampion: ChampionInfo;
  champions: ChampionInfo[];
  ownedPerks: Dictionary<number>;
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
  progressionNodes: string[];
  quests: QuestGQL[];
  serverTimeDeltaMS: number;
  progressionNodeDefsByID: Dictionary<ProgressionNodeDef>;
  questsById: Dictionary<QuestDefGQL>;
  statDefs: Dictionary<StatDefinitionGQL>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AProgressionNodeDisplay extends React.Component<Props, State> {
  private unlockTimer: number = 0;
  private animationTimer: number = 0;

  constructor(props: Props) {
    super(props);
    this.state = {
      unlockProgress: 0,
      isUnlocking: false,
      isAnimating: false
    };
  }

  componentWillUnmount(): void {
    if (this.unlockTimer) {
      window.clearInterval(this.unlockTimer);
      this.unlockTimer = 0;
    }
    if (this.animationTimer) {
      window.clearTimeout(this.animationTimer);
      this.animationTimer = 0;
    }
  }

  render(): JSX.Element {
    const {
      nodeSizePx,
      def,
      selectedChampion,
      champions,
      ownedPerks,
      perksByID,
      stringTable,
      progressionNodes,
      quests,
      serverTimeDeltaMS,
      progressionNodeDefsByID,
      questsById,
      statDefs,
      dispatch,
      className,
      style,
      ...otherProps
    } = this.props;

    const status = getProgressionNodeStatus(def, ownedPerks, progressionNodes, quests, serverTimeDeltaMS);

    const finalStyle: React.CSSProperties = {
      ...style,
      width: `${nodeSizePx}px`,
      height: `${nodeSizePx}px`,
      fontSize: `${nodeSizePx * 0.45}px`,
      borderWidth: `${nodeSizePx * 0.03}px`
    };

    const animating = this.state.isAnimating ? 'animating' : '';
    const unseen = clientAPI.getUnseenUnlockedProgressionNodesForChampion(this.props.selectedChampion.id);
    const isUnseen = unseen.includes(this.props.def.id);

    return (
      <div className={`${Root} ${className}`} style={finalStyle} {...otherProps}>
        <TooltipSource
          className={`${Button} ${status} ${animating}`}
          tooltipParams={{
            id: `Node${def.id}`,
            content: this.renderNodeTooltip.bind(this, status),
            position: TooltipPosition.OutsideSource
          }}
          onMouseDown={this.onMouseDown.bind(this, status)}
          onMouseUp={this.onMouseUp.bind(this)}
          onMouseEnter={this.onMouseEnter.bind(this, status)}
          onMouseLeave={this.onMouseLeave.bind(this)}
        >
          <div className={`${Icon} ${def.icon}`} />
          {status === 'locked' && (
            <div className={`${LockIcon} fs-icon-misc-lock`} style={{ fontSize: `${nodeSizePx * 0.2}px` }} />
          )}
          {isUnseen && <StarBadge className={Badge} />}
        </TooltipSource>
      </div>
    );
  }

  private renderNodeTooltip(status: ProgressionNodeStatus): React.ReactNode {
    const tooPoor = this.props.def.costs.find((costDef) => {
      // You are too poor if we find a cost that we are unable to pay.
      return (this.props.ownedPerks[costDef.perkID] ?? 0) < costDef.qty;
    })
      ? 'tooPoor'
      : '';
    return (
      <div className={TooltipRoot}>
        <div className={TooltipSection}>
          <div className={TooltipTitle}>{this.props.def.name}</div>
          {this.renderTooltipRewards()}
        </div>
        <div className={`${CostSection} ${tooPoor}`}>
          <div className={TwigCostContainer}>
            {this.props.def.costs.map((costDef, index) => {
              return (
                <div className={CostRow} key={`Cost${index}`}>
                  <div className={CostTitle}>
                    {index === 0 ? getStringTableValue(StringIDProgressionTreeCosts, this.props.stringTable) : ''}
                  </div>
                  <div className={`${TwigCostValue} ${tooPoor}`}>{costDef.qty}</div>
                  <PerkIcon className={TwigCostIcon} perkID={costDef.perkID} />
                </div>
              );
            })}
          </div>
        </div>
        {status === 'locked' && (
          <div className={RequirementsSection}>
            <div className={RequirementsLabel}>
              {this.getUnmetRequirements()}
              {getStringTableValue(StringIDGeneralLocked, this.props.stringTable)}
            </div>
          </div>
        )}
        {status === 'available' && (
          <div className={UnlockSection}>
            {this.state.unlockProgress > 0 ? (
              <div
                className={UnlockBar}
                style={{
                  width: `${this.state.unlockProgress}%`
                }}
              />
            ) : null}
            <div className={`${MouseClickDisplay} ${tooPoor}`}>
              <div className={`${MouseClickIcon} ${tooPoor} icon-mouse1`} />
            </div>
            <div className={UnlockLabel}>{getStringTableValue(StringIDGeneralUnlock, this.props.stringTable)}</div>
          </div>
        )}
      </div>
    );
  }

  private renderTooltipRewards(): React.ReactNode[] {
    const nodes: React.ReactNode[] = [];

    this.props.def.rewards.forEach((rewardDef: PerkRewardDefGQL, index: number) => {
      const perk = this.props.perksByID[rewardDef.perkID];
      if (perk) {
        switch (perk.perkType) {
          case PerkType.StatMod: {
            const statDef = this.props.statDefs[perk.statID];
            const text = getTokenizedStringTableValue(
              // There are some stats that aren't "percent" under the hood, but that we want to display that way.
              perk.statOperation === LAEOp.Add && statDef.displayType !== StatDisplayType.Percent
                ? StringIDProgressionTreeStatBonus
                : StringIDProgressionTreeStatBonusPercent,
              this.props.stringTable,
              { STAT: statDef.name, BONUS: `${perk.statAmount >= 0 ? '+' : ''}${perk.statAmount}` }
            );
            nodes.push(<FormattedTextDiv text={text} textClasses={[BonusText, BonusValue]} nodes={[]} />);
            break;
          }
          default: {
            nodes.push(<FormattedTextDiv text={perk.description} textClasses={[BonusText, BonusValue]} nodes={[]} />);
            break;
          }
        }
      }
    });

    return nodes;
  }

  private getUnmetRequirements(): React.ReactNode[] {
    const nodes: React.ReactNode[] = [];

    // A node with parents must have at least one active parent.
    if (this.props.def.parentIDs.length > 0) {
      if (
        !this.props.def.parentIDs.find((pid) => {
          return this.props.progressionNodes.includes(pid);
        })
      ) {
        if (this.props.def.parentIDs.length === 1) {
          // Only a single parent node is the same as a single arbitrary node.
          const parentNode = this.props.progressionNodeDefsByID[this.props.def.parentIDs[0]];
          const text = getTokenizedStringTableValue(StringIDLocksProgressionNodeActive, this.props.stringTable, {
            NAME: parentNode.name
          });
          nodes.push(
            <div className={RequirementDescription} key={-1}>
              {text}
            </div>
          );
        } else {
          nodes.push(
            <div className={RequirementDescription} key={-1}>
              {getStringTableValue(StringIDLocksMultipleParentNodes, this.props.stringTable)}
            </div>
          );
          this.props.def.parentIDs.forEach((pid) => {
            const parentNode = this.props.progressionNodeDefsByID[pid];
            nodes.push(
              <div className={RequirementDescription} key={pid}>
                {`\xa0\xa0\xa0${parentNode.name}`}
              </div>
            );
          });
        }
      }
    }
    // Add a list of all unmet lock requirements.
    this.props.def.locks.forEach((lock, index) => {
      if (
        !isLockFulfilled(
          lock,
          this.props.ownedPerks,
          this.props.progressionNodes,
          this.props.quests,
          this.props.serverTimeDeltaMS
        )
      ) {
        const text = getLockDescription(
          lock,
          this.props.perksByID,
          this.props.questsById,
          this.props.champions,
          this.props.progressionNodeDefsByID,
          this.props.stringTable
        );
        nodes.push(
          <div className={RequirementDescription} key={index}>
            {text}
          </div>
        );
      }
    });

    return nodes;
  }

  private onMouseDown(status: ProgressionNodeStatus, e: React.MouseEvent): void {
    // Left-click only.
    if (e.button !== 0) {
      return;
    }

    // If an unlock is already in progress, don't start another just yet.
    if (this.state.isUnlocking || this.state.unlockProgress > 0) {
      return;
    }

    // Only do the unlock if the user has met the requirements and hasn't yet unlocked this node.
    if (status !== 'available') {
      return;
    }

    // // Only do the unlock if the user can afford it.
    const tooPoor = !!this.props.def.costs.find((costDef) => {
      // You are too poor if we find a cost that we are unable to pay.
      return (this.props.ownedPerks[costDef.perkID] ?? 0) < costDef.qty;
    });
    if (tooPoor) {
      return;
    }

    // ProgressBar sound plays while holding to unlock.
    clientAPI.playGameSound(SoundEvents.PLAY_UI_PROGRESSION_HOLD_SELECT_PROGRESS_BAR);

    // The user qualifies to unlock this node, but they have to click and hold for a while as a means
    // of confirmation.  We animate a progress bar to communicate that to the user.
    const unlockStartMS = Date.now();
    this.unlockTimer = window.setInterval(() => {
      const progress =
        this.state.isUnlocking || this.state.isAnimating
          ? 100 // Keeps the progress bar full during unlock even if the player releases the mouse button.
          : Math.min(100, ((Date.now() - unlockStartMS) / UNLOCK_DURATION_MS) * 100);
      if (Date.now() >= unlockStartMS + UNLOCK_DURATION_MS) {
        // Confirmation complete, so clean up and request the unlock.
        this.setState({ isUnlocking: true });
        window.clearInterval(this.unlockTimer);
        this.unlockTimer = 0;
        this.requestUnlock();
      }
      // Advance the progress bar.
      this.setState({ unlockProgress: progress });
    }, 16);
  }

  private onMouseUp(): void {
    this.cancelUnlock();
  }

  private onMouseLeave(): void {
    this.cancelUnlock();
  }

  private onMouseEnter(status: ProgressionNodeStatus): void {
    if (status === 'available') {
      // If this was badged, we can unbadge it.
      const seen = clientAPI.getSeenProgressionNodesForChampion(this.props.selectedChampion.id);
      if (!seen.includes(this.props.def.id)) {
        // This node has now been seen.
        seen.push(this.props.def.id);
        clientAPI.setSeenProgressionNodesForChampion(this.props.selectedChampion.id, seen);
        // THis node is no longer unseen.
        const unseen = clientAPI
          .getUnseenUnlockedProgressionNodesForChampion(this.props.selectedChampion.id)
          .filter((nid) => nid !== this.props.def.id);
        clientAPI.setUnseenUnlockedProgressionNodesForChampion(this.props.selectedChampion.id, unseen);
      }
    }
  }

  private cancelUnlock(): void {
    // If we're already in the middle of processing an unlock, don't make it look like we've stopped.
    if (!this.state.isAnimating && !this.state.isUnlocking) {
      this.setState({ unlockProgress: 0 });
    }
    // If we're still in the confirmation animation stage, stop everything.
    if (this.unlockTimer) {
      window.clearInterval(this.unlockTimer);
      this.unlockTimer = 0;
    }
  }

  private async requestUnlock(): Promise<void> {
    this.setState({ isUnlocking: true });

    // Make the server call.
    const res = await ProfileAPI.PurchaseProgressionNode(webConf, this.props.def.id);
    if (res.ok) {
      // If unlock succeeds, run the unlock animation and sound.
      this.beginUnlockAnimation();
      clientAPI.playGameSound(SoundEvents.PLAY_UI_PROGRESSION_UNLOCK);
      // We refresh the profile after the actual animation finishes. The full animation is 3x this long
      // so it can show the post-unlock state while profile is busy refreshing.
      window.setTimeout(() => {
        refreshProfile();
      }, 500);
    } else {
      // If unlock fails, pop an error dialog.
      this.props.dispatch(showError(res));
    }
    this.setState({ isUnlocking: false });
  }

  private beginUnlockAnimation(): void {
    this.setState({ isAnimating: true });
    this.animationTimer = window.setTimeout(() => {
      this.setState({ isAnimating: false, unlockProgress: 0 });
    }, 1500);
  }
}

export type ProgressionNodeStatus = 'active' | 'available' | 'locked';
export function getProgressionNodeStatus(
  def: ProgressionNodeDef,
  ownedPerks: Dictionary<number>,
  progressionNodes: string[],
  quests: QuestGQL[],
  serverTimeDeltaMS: number
): ProgressionNodeStatus {
  if (progressionNodes.includes(def.id)) {
    return 'active';
  }

  if (
    // Are any of the quest or item-related locks still locked?
    !areLocksFulfilled(def.locks, ownedPerks, progressionNodes, quests, serverTimeDeltaMS) ||
    // If this node has parents, is at least one of those parents active?
    (def.parentIDs.length > 0 && !def.parentIDs.find((pid) => progressionNodes.includes(pid)))
  ) {
    return 'locked';
  }

  return 'available';
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { champions, selectedChampion } = state.championInfo;
  const { ownedPerks, progressionNodes, quests } = state.profile;
  const { stringTable } = state.stringTable;
  const { perksByID } = state.store;
  const { progressionNodeDefsByID } = state.championInfo;
  const { serverTimeDeltaMS } = state.clock;
  const { questsById } = state.quests;
  const { statDefs } = state.game;

  return {
    ...ownProps,
    selectedChampion,
    ownedPerks,
    perksByID,
    stringTable,
    progressionNodes,
    quests,
    serverTimeDeltaMS,
    champions,
    progressionNodeDefsByID,
    questsById,
    statDefs
  };
}

export const ProgressionNodeDisplay = connect(mapStateToProps)(AProgressionNodeDisplay);
