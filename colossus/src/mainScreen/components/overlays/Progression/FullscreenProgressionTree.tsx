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
  StatDefinitionGQL,
  StatDisplayType,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Overlay, hideOverlay, showOverlay } from '../../../redux/navigationSlice';
import { RootState } from '../../../redux/store';
import { Button } from '../../shared/Button';
import { markEquipmentSeen } from '../../../helpers/characterHelpers';
import {
  StringIDGeneralBack,
  StringIDGeneralPan,
  StringIDGeneralZoom,
  getStringTableValue,
  getTokenizedStringTableValue
} from '../../../helpers/stringTableHelpers';
import { ChampionProgressionLevel } from '../../views/Lobby/ChampionProfile/ChampionProgressionLevel';
import { PerkIcon } from '../../views/Lobby/Store/PerkIcon';
import { FormattedTextDiv } from '../../../../shared/components/FormattedTextDiv';
import { getProgressionNodeExtremes, ProgressionTreeDisplay } from './ProgressionTreeDisplay';
import TooltipSource from '../../../../shared/components/TooltipSource';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';

const FullscreenContainer = 'ChampionProfile-ProgressionTree-Container';
const TreeContainer = 'ChampionProfile-ProgressionTree-TreeContainer';
const ChampionName = 'ChampionProfile-ProgressionTree-ChampionName';
const PageTitle = 'ChampionProfile-ProgressionTree-PageTitle';
const LeftPanel = 'ChampionProfile-ProgressionTree-LeftPanel';
const ProgressionLevelContainer = 'ChampionProfile-ProgressionTree-ProgressionLevelContainer';
const ProgressionCurrencyContainer = 'ChampionProfile-ProgressionTree-ProgressionCurrencyContainer';
const TwigLabel = 'ChampionProfile-ProgressionTree-TwigLabel';
const TwigCount = 'ChampionProfile-ProgressionTree-TwigCount';
const TwigIcon = 'ChampionProfile-ProgressionTree-TwigIcon';
const BonusesContainer = 'ChampionProfile-ProgressionTree-BonusesContainer';
const BonusesLabel = 'ChampionProfile-ProgressionTree-BonusesLabel';
const BonusesScroller = 'ChampionProfile-ProgressionTree-BonusesScroller';
const BonusText = 'ChampionProfile-ProgressionTree-BonusText';
const BonusValue = 'ChampionProfile-ProgressionTree-BonusValue';
const BackButton = 'ChampionProfile-ProgressionTree-BackButton';
const ResetButton = 'ChampionProfile-ProgressionTree-ResetButton';
const LegendContainer = 'ChampionProfile-ProgressionTree-LegendContainer';
const LegendRow = 'ChampionProfile-ProgressionTree-LegendRow';
const LegendIcon = 'ChampionProfile-ProgressionTree-LegendIcon';
const LegendText = 'ChampionProfile-ProgressionTree-LegendText';
const StatusTooltipRoot = 'ChampionProfile-ProgressionTree-StatusTooltip-Root';
const StatusTooltipName = 'ChampionProfile-ProgressionTree-StatusTooltip-Name';
const StatusTooltipDescription = 'ChampionProfile-ProgressionTree-StatusTooltip-Description';

// This is the aspect ratio we're going to show the bulk of this UI at (it's the size of the tree image).
// The reason for this is, this image defines very specific locations and sizes for various UI elements.
// We're going to show it centered in the available screen space as big as possible.
const goalAspectRatio: number = 3650 / 2176;

const StringIDChampionInfoDisplayProgressionTreeTitle = 'ChampionInfoDisplayProgressionTreeTitle';
const StringIDProgressionTreeRefundAllPoints = 'ProgressionTreeRefundAllPoints';
const StringIDProgressionTreeAvailablePoints = 'ProgressionTreeAvailablePoints';
const StringIDProgressionTreeBonusesAndStats = 'ProgressionTreeBonusesAndStats';
const StringIDProgressionTreeStatBonus = 'ProgressionTreeStatBonus';
const StringIDProgressionTreeStatBonusPercent = 'ProgressionTreeStatBonusPercent';
const StringIDProgressionTreeNoBonuses = 'ProgressionTreeNoBonuses';

interface ReactProps {}

interface InjectedProps {
  selectedChampion: ChampionInfo;
  ownedPerks: Dictionary<number>;
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
  newEquipment: Dictionary<boolean>;
  progressionNodeDefsByID: Dictionary<ProgressionNodeDef>;
  progressionNodes: string[];
  nodeDefs: ProgressionNodeDef[];
  statDefs: Dictionary<StatDefinitionGQL>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  wideView: boolean;
  treePanStartX: number;
  treePanStartY: number;
  treePrevOffsetX: number;
  treePrevOffsetY: number;
  treeOffsetX: number;
  treeOffsetY: number;
  treeZoomLevel: number;
  initialZoomLevel: number;
}

class AFullscreenProgressionTree extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      wideView: this.isWideView(),
      treePanStartX: 0,
      treePanStartY: 0,
      treePrevOffsetX: 0,
      treePrevOffsetY: 0,
      treeOffsetX: 0,
      treeOffsetY: 0,
      treeZoomLevel: 1,
      initialZoomLevel: 1
    };
    requestAnimationFrame(() => {
      const [treeOffsetX, treeOffsetY, treeZoomLevel] = this.getInitialTreeState();
      this.setState({ treeOffsetX, treeOffsetY, treeZoomLevel, initialZoomLevel: treeZoomLevel });
    });
  }

  render(): JSX.Element {
    const twigPerkCount = this.props.ownedPerks[this.props.selectedChampion.progressionCurrencyID] ?? 0;

    const contentWidthPx = this.getContentWidth();
    const contentHeightPx = this.getContentHeight();

    return (
      <div className={FullscreenContainer}>
        <div
          className={TreeContainer}
          // We're manually setting the width/height of the Container div to make it as big as possible while retaining the right aspect ratio.
          style={{ width: `${contentWidthPx}px`, height: `${contentHeightPx}px` }}
          onWheel={this.onTreeWheel.bind(this)}
          onMouseDown={this.onTreeMouseDown.bind(this)}
        >
          <ProgressionTreeDisplay
            nodeSizePx={this.getDefaultNodeSize()}
            widthPx={contentWidthPx}
            heightPx={contentHeightPx}
            xOffsetPx={this.state.treeOffsetX}
            yOffsetPx={this.state.treeOffsetY}
            zoomLevel={this.state.treeZoomLevel}
          />
          <div className={ChampionName}>{this.props.selectedChampion.name}</div>
          <div className={PageTitle}>
            {getStringTableValue(StringIDChampionInfoDisplayProgressionTreeTitle, this.props.stringTable)}
          </div>
          <div className={LeftPanel}>
            <div className={ProgressionCurrencyContainer}>
              <div className={TwigLabel}>
                {getStringTableValue(StringIDProgressionTreeAvailablePoints, this.props.stringTable)}
              </div>
              <div className={TwigCount}>{twigPerkCount}</div>
              <PerkIcon className={TwigIcon} perkID={this.props.selectedChampion.progressionCurrencyID} />
            </div>
            <div className={ProgressionLevelContainer}>
              <ChampionProgressionLevel />
            </div>
            <div className={BonusesContainer}>
              <div className={BonusesLabel}>
                {getStringTableValue(StringIDProgressionTreeBonusesAndStats, this.props.stringTable)}
              </div>
              <div className={BonusesScroller}>{this.renderBonusesAndStats()}</div>
            </div>
          </div>
          <Button
            type={'blue'}
            text={getStringTableValue(StringIDGeneralBack, this.props.stringTable).toUpperCase()}
            styles={BackButton}
            onClick={this.onBackClick.bind(this)}
            disabled={false}
          />
          <Button
            type={'blue'}
            text={getStringTableValue(StringIDProgressionTreeRefundAllPoints, this.props.stringTable).toUpperCase()}
            styles={ResetButton}
            onClick={this.onRefundClick.bind(this)}
            disabled={false}
          />
          <div className={LegendContainer}>
            <div className={LegendRow}>
              <div className={LegendText}>{getStringTableValue(StringIDGeneralPan, this.props.stringTable)}</div>
              <div className={`${LegendIcon} icon-mouse2`} />
            </div>
            <div className={LegendRow}>
              <div className={LegendText}>{getStringTableValue(StringIDGeneralZoom, this.props.stringTable)}</div>
              <div className={`${LegendIcon} icon-ps-menu`} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  private getContentWidth(): number {
    return this.state.wideView ? window.innerWidth : window.innerHeight * goalAspectRatio;
  }

  private getContentHeight(): number {
    return this.state.wideView ? window.innerWidth / goalAspectRatio : window.innerHeight;
  }

  private onTreeWheel(e: React.WheelEvent<HTMLDivElement>): void {
    // If we happen to build a tree that needs to go below this zoom level to fit on screen, permit the zoom to reach it.
    const minZoomLevel = Math.min(0.6, this.state.initialZoomLevel);
    const treeZoomLevel = Math.min(1, Math.max(minZoomLevel, this.state.treeZoomLevel + (e.deltaY < 0 ? 0.1 : -0.1)));
    this.setState({ treeZoomLevel });

    // Have to wait until the animation frame so that state.treeZoomLevel has finished updating.
    requestAnimationFrame(() => {
      const [treeOffsetX, treeOffsetY] = this.getClampedTreeOffsets(this.state.treeOffsetX, this.state.treeOffsetY);
      this.setState({ treeOffsetX, treeOffsetY });
    });
  }

  private onTreeMouseDown(e: React.MouseEvent<HTMLDivElement>): void {
    if (e.button === 2) {
      this.setState({
        treePanStartX: e.clientX,
        treePanStartY: e.clientY,
        treePrevOffsetX: this.state.treeOffsetX,
        treePrevOffsetY: this.state.treeOffsetY
      });
      window.addEventListener('mousemove', this.handleTreePanning);
      window.addEventListener('mouseup', this.endTreePanning);
    }
  }

  private getInitialTreeState(): [number, number, number] {
    const [minNodeX, maxNodeX, minNodeY, maxNodeY] = getProgressionNodeExtremes(this.props.nodeDefs);
    const defaultNodeSize = this.getDefaultNodeSize();

    // Get the bounds of the window into which we want to fit the tree.
    const treeWindowX = this.getContentWidth() * 0.26;
    const treeWindowY = this.getContentHeight() * 0.02;
    const treeWindowWidth = this.getContentWidth() * 0.735;
    const treeWindowHeight = this.getContentHeight() * 0.96;
    const treeWindowCenterX = treeWindowX + treeWindowWidth / 2;
    const treeWindowCenterY = treeWindowY + treeWindowHeight / 2;

    // Find the non-scaled boundaries of the node tree.
    const minX = minNodeX * defaultNodeSize;
    const maxX = (maxNodeX + 1) * defaultNodeSize;
    const minY = minNodeY * defaultNodeSize;
    const maxY = (maxNodeY + 1) * defaultNodeSize;
    const treeWidth = maxX - minX;
    const treeHeight = maxY - minY;
    const treeCenterX = minX + treeWidth / 2;
    const treeCenterY = minY + treeHeight / 2;

    // The desired zoom level is whichever value fits the entire tree into the window in BOTH dimensions.
    const treeFitWidthScale = Math.min(1, treeWindowWidth / treeWidth);
    const treeFitHeightScale = Math.min(1, treeWindowHeight / treeHeight);
    const treeZoomLevel = Math.min(treeFitWidthScale, treeFitHeightScale);

    // The initial offset needs to put the center of the tree at the center position of the window.
    const treeOffsetX = treeWindowCenterX - treeCenterX;
    const treeOffsetY = treeWindowCenterY - treeCenterY;

    return [treeOffsetX, treeOffsetY, treeZoomLevel];
  }

  private getClampedTreeOffsets(offsetX: number, offsetY: number): [number, number] {
    // This math clamps scrolling relative to the centered/scaled tree container, not necessarily to the edges of the game window.
    // On average, the two will be pretty close to the same thing, and either way it prevents us from scrolling ALL nodes offscreen.
    const [minNodeX, maxNodeX, minNodeY, maxNodeY] = getProgressionNodeExtremes(this.props.nodeDefs);

    const defaultNodeSize = this.getDefaultNodeSize();
    const centerX = this.getContentWidth() / 2;
    const centerY = this.getContentHeight() / 2;

    // We want to keep at least one column and row of nodes on screen at all times, so our mins and maxes are
    // based off the inner edges of the extreme nodes.
    const minX = (minNodeX + 1) * defaultNodeSize;
    const maxX = maxNodeX * defaultNodeSize;
    const minY = (minNodeY + 1) * defaultNodeSize;
    const maxY = maxNodeY * defaultNodeSize;

    // Because the tree scales from its own center point, we need to calculate positions relative to that center point.
    const minXDistFromCenter = centerX - minX;
    const maxXDistFromCenter = centerX - maxX;
    const minYDistFromCenter = centerY - minY;
    const maxYDistFromCenter = centerY - maxY;

    const scaledMinXDistFromCenter = minXDistFromCenter * this.state.treeZoomLevel;
    const scaledMaxXDistFromCenter = maxXDistFromCenter * this.state.treeZoomLevel;
    const scaledMinYDistFromCenter = minYDistFromCenter * this.state.treeZoomLevel;
    const scaledMaxYDistFromCenter = maxYDistFromCenter * this.state.treeZoomLevel;

    const scaledMinX = centerX - scaledMinXDistFromCenter;
    const scaledMaxX = centerX - scaledMaxXDistFromCenter;
    const scaledMinY = centerY - scaledMinYDistFromCenter;
    const scaledMaxY = centerY - scaledMaxYDistFromCenter;

    const minXOffset = -scaledMaxX;
    const maxXOffset = this.getContentWidth() - scaledMinX;
    const minYOffset = -scaledMaxY;
    const maxYOffset = this.getContentHeight() - scaledMinY;

    const clampedOffsetX = Math.min(maxXOffset, Math.max(minXOffset, offsetX));
    const clampedOffsetY = Math.min(maxYOffset, Math.max(minYOffset, offsetY));

    return [clampedOffsetX, clampedOffsetY];
  }

  private getDefaultNodeSize(): number {
    return this.getContentHeight() / 10;
  }

  private handleTreePanning = (event: MouseEvent): void => {
    const [treeOffsetX, treeOffsetY] = this.getClampedTreeOffsets(
      this.state.treePrevOffsetX - this.state.treePanStartX + event.clientX,
      this.state.treePrevOffsetY - this.state.treePanStartY + event.clientY
    );
    this.setState({
      treeOffsetX,
      treeOffsetY
    });
  };

  private endTreePanning = (event: MouseEvent): void => {
    if (event.button === 2) {
      window.removeEventListener('mousemove', this.handleTreePanning);
      window.removeEventListener('mouseup', this.endTreePanning);
    }
  };

  private renderBonusesAndStats(): React.ReactNode[] {
    const nodes: React.ReactNode[] = [];

    // We want to combine all stat bonuses into single displays, so we will accumulate them, sort them, and then generate divs.
    const flatBonuses: Dictionary<number> = {};
    const percentBonuses: Dictionary<number> = {};
    const statusPerks: Dictionary<number> = {};

    this.props.progressionNodes.forEach((progressionNodeID) => {
      const def = this.props.progressionNodeDefsByID[progressionNodeID];
      // The profile has a single flat array of nodes, so it presumably includes all progression nodes for all champions.
      // We only want the ones for the currently selected champion.
      if (def && def.championID === this.props.selectedChampion.id) {
        def.rewards.forEach((rewardDef: PerkRewardDefGQL) => {
          const perk = this.props.perksByID[rewardDef.perkID];
          const statDef = this.props.statDefs[perk.statID];
          switch (perk?.perkType) {
            case PerkType.StatMod: {
              // There are some stats that aren't "percent" under the hood, but that we want to display that way,
              // so if they are explicitly marked for Percent, we'll fall through and put them in the percent set.
              if (perk.statOperation === LAEOp.Add && statDef?.displayType !== StatDisplayType.Percent) {
                flatBonuses[perk.statID] = (flatBonuses[perk.statID] ?? 0) + perk.statAmount;
              } else {
                percentBonuses[perk.statID] = (percentBonuses[perk.statID] ?? 0) + perk.statAmount;
              }
              break;
            }
            case PerkType.StatusMod: {
              statusPerks[perk.id] = (statusPerks[perk.id] ?? 0) + 1;
              break;
            }
          }
        });
      }
    });

    // We should now have the full lists of all stat and status bonuses.
    // Remove duplicates and sort alphabetically by display name.
    const orderedStatIDs = [...new Set([...Object.keys(flatBonuses), ...Object.keys(percentBonuses)])].sort((a, b) => {
      const defA = this.props.statDefs[a];
      const defB = this.props.statDefs[b];

      return defA.name.localeCompare(defB.name);
    });

    orderedStatIDs.forEach((statID, index) => {
      const statDef = this.props.statDefs[statID];

      const flatBonus = flatBonuses[statID] ?? 0;
      if (flatBonus) {
        const text = getTokenizedStringTableValue(StringIDProgressionTreeStatBonus, this.props.stringTable, {
          STAT: statDef.name,
          BONUS: `${flatBonus >= 0 ? '+' : ''}${flatBonus}`
        });
        nodes.push(
          <FormattedTextDiv text={text} textClasses={[BonusText, BonusValue]} nodes={[]} key={`Stat${index}`} />
        );
      }

      const percentBonus = percentBonuses[statID] ?? 0;
      if (percentBonus) {
        const text = getTokenizedStringTableValue(StringIDProgressionTreeStatBonusPercent, this.props.stringTable, {
          STAT: statDef.name,
          BONUS: `${percentBonus >= 0 ? '+' : ''}${percentBonus}`
        });
        nodes.push(
          <FormattedTextDiv text={text} textClasses={[BonusText, BonusValue]} nodes={[]} key={`Stat${index}`} />
        );
      }
    });

    const sortedStatusPerkIDs = Object.keys(statusPerks).sort((a, b) => {
      return this.props.perksByID[a].name.localeCompare(this.props.perksByID[b].name);
    });
    sortedStatusPerkIDs.forEach((statusPerkID, index) => {
      const perkDef = this.props.perksByID[statusPerkID];
      const count = statusPerks[statusPerkID];
      const text = count === 1 ? perkDef.name : `${count}x ${perkDef.name}`;
      nodes.push(
        <TooltipSource
          key={`Status${index}`}
          tooltipParams={{
            id: `Status${index}`,
            content: this.renderStatusTooltip.bind(this, perkDef)
          }}
        >
          <FormattedTextDiv text={text} textClasses={[BonusText, BonusValue]} nodes={[]} />
        </TooltipSource>
      );
    });

    if (nodes.length === 0) {
      nodes.push(
        <div className={BonusText} key={`Stat0`}>
          {getStringTableValue(StringIDProgressionTreeNoBonuses, this.props.stringTable)}
        </div>
      );
    }

    return nodes;
  }

  private renderStatusTooltip(perk: PerkDefGQL): React.ReactNode {
    return (
      <div className={StatusTooltipRoot}>
        <div className={StatusTooltipName}>{perk.name}</div>
        <FormattedTextDiv
          className={StatusTooltipDescription}
          text={perk.description}
          textClasses={[BonusText, BonusValue]}
          nodes={[]}
        />
      </div>
    );
  }

  public componentDidMount(): void {
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  public componentWillUnmount(): void {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }

  private onWindowResize() {
    this.setState({ wideView: this.isWideView() });
  }

  private isWideView(): boolean {
    const aspect: number = window.innerWidth / window.innerHeight;
    return aspect < goalAspectRatio;
  }

  private onBackClick(): void {
    // When the player visits the ProgressionTree page, we need to mark all "unseen" Progression-related items for the champion as seen.
    Object.keys(this.props.newEquipment).forEach((perkID) => {
      const perk = this.props.perksByID[perkID];
      if (perk.champion.id === this.props.selectedChampion.id) {
        if (perk.id === this.props.selectedChampion.progressionCurrencyID) {
          markEquipmentSeen(perk.id, this.props.newEquipment, this.props.ownedPerks, this.props.dispatch);
        }
      }
    });

    this.props.dispatch(hideOverlay(Overlay.ProgressionTree));
  }

  private async onRefundClick(): Promise<void> {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_PROGRESSION_REFUND_SELECT);
    this.props.dispatch(showOverlay(Overlay.ConfirmProgressionReset));
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { progressionNodeDefsByID, selectedChampion } = state.championInfo;
  const nodeDefs = state.championInfo.progressionNodeDefsByChampionID[selectedChampion.id] ?? [];
  const { ownedPerks, progressionNodes } = state.profile;
  const { stringTable } = state.stringTable;
  const { perksByID, newEquipment } = state.store;
  const { statDefs } = state.game;

  return {
    ...ownProps,
    selectedChampion,
    ownedPerks,
    perksByID,
    stringTable,
    newEquipment,
    progressionNodeDefsByID,
    progressionNodes,
    nodeDefs,
    statDefs
  };
}

export const FullscreenProgressionTree = connect(mapStateToProps)(AFullscreenProgressionTree);
