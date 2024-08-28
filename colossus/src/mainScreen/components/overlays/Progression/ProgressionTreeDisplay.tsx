/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {
  ChampionInfo,
  PerkDefGQL,
  ProgressionNodeDef,
  QuestGQL,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../../redux/store';
import { getProgressionNodeStatus, ProgressionNodeDisplay } from './ProgressionNodeDisplay';

const Root = 'ProgressionTreeDisplay-Root';
const ConnectorContainer = 'ProgressionTreeDisplay-ConnectorContainer';
const TreeBackground = 'ProgressionTreeDisplay-TreeBackground';

interface ConnectorDisplayData {
  path: string;
  lineColor: string;
  lineWidth: number;
}

interface ReactProps {
  nodeSizePx: number;
  widthPx: number;
  heightPx: number;
  xOffsetPx: number;
  yOffsetPx: number;
  zoomLevel: number;
}

interface InjectedProps {
  selectedChampion: ChampionInfo;
  ownedPerks: Dictionary<number>;
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
  progressionNodes: string[];
  nodeDefs: ProgressionNodeDef[];
  quests: QuestGQL[];
  serverTimeDeltaMS: number;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AProgressionTreeDisplay extends React.Component<Props> {
  render(): JSX.Element {
    // In order to align the node connectors properly, the SVG for them needs to have a proper size and viewbox.
    const [top, left, width, height] = this.getTreeBounds();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    return (
      <div
        className={Root}
        style={{
          top: `${this.props.yOffsetPx}px`,
          left: `${this.props.xOffsetPx}px`,
          transformOrigin: `${centerX}px ${centerY}px`,
          transform: `scale(${this.props.zoomLevel})`
        }}
      >
        <div
          className={TreeBackground}
          style={{ width: `${this.props.widthPx}px`, height: `${this.props.heightPx}px` }}
        />
        <svg
          className={ConnectorContainer}
          viewBox={`${left} ${top} ${width} ${height}`}
          style={{
            position: 'absolute',
            top: `${top}px`,
            left: `${left}px`,
            width: `${width}px`,
            height: `${height}px`
          }}
        >
          {this.renderNodeConnectors()}
        </svg>
        {this.props.nodeDefs.map(this.renderNode.bind(this))}
      </div>
    );
  }

  private getTreeBounds(): [number, number, number, number] {
    // We need to support nodes at negative coordinates, so we have to calculate the full bounds instead of just the size.
    const [minNodeX, maxNodeX, minNodeY, maxNodeY] = getProgressionNodeExtremes(this.props.nodeDefs);

    const top = minNodeY * this.props.nodeSizePx;
    const left = minNodeX * this.props.nodeSizePx;
    const width = (maxNodeX - minNodeX + 1) * this.props.nodeSizePx;
    const height = (maxNodeY - minNodeY + 1) * this.props.nodeSizePx;
    // Need to add one because node position is zero-indexed.
    return [top, left, width, height];
  }

  private renderNodeConnectors(): React.ReactNode[] {
    // We want to render connectors in a specific order, so first we will generate all of the
    // display data, and then we will sort it.
    const displayData: ConnectorDisplayData[] = [];

    const size = this.props.nodeSizePx;
    const halfSize = this.props.nodeSizePx / 2;

    this.props.nodeDefs.forEach((parentDef) => {
      parentDef.childrenIDs.forEach((childID) => {
        const childDef = this.props.nodeDefs.find((def) => def.id === childID);
        if (childDef) {
          // The color and thickness of the line depends on the status of the two nodes.
          const parentStatus = getProgressionNodeStatus(
            parentDef,
            this.props.ownedPerks,
            this.props.progressionNodes,
            this.props.quests,
            this.props.serverTimeDeltaMS
          );
          const childStatus = getProgressionNodeStatus(
            childDef,
            this.props.ownedPerks,
            this.props.progressionNodes,
            this.props.quests,
            this.props.serverTimeDeltaMS
          );
          // If either is locked, the line is thin and gray.
          // If only one is active, the line is thin and white.
          // If both are active, the line is thick and white.
          const lineColor: string = parentStatus === 'locked' || childStatus === 'locked' ? '#5c5c5c' : 'white';
          const lineWidth: number = parentStatus === 'active' && childStatus === 'active' ? 5 : 2;
          let path: string = '';
          const px = parentDef.positionX;
          const py = parentDef.positionY;
          const cx = childDef.positionX;
          const cy = childDef.positionY;
          if (childDef.positionY < parentDef.positionY) {
            // If the child is above, exit out the top.
            path =
              `M${px * size + halfSize} ${py * size + halfSize}` + // Start at the center of the parentNode.
              ` L${px * size + halfSize} ${py * size}` + // Move up to the top of the parentNode.
              ` L${cx * size + halfSize} ${cy * size + size}` + // Move to the bottom of the childNode.
              ` L${cx * size + halfSize} ${cy * size + halfSize}`; // Move to the center of the childNode.
          } else if (childDef.positionY > parentDef.positionY) {
            // If the child is below, exit out the bottom.
            path =
              `M${px * size + halfSize} ${py * size + halfSize}` + // Start at the center of the parentNode.
              ` L${px * size + halfSize} ${py * size + size}` + // Move up to the bottom of the parentNode.
              ` L${cx * size + halfSize} ${cy * size}` + // Move to the top of the childNode.
              ` L${cx * size + halfSize} ${cy * size + halfSize}`; // Move to the center of the childNode.
          } else {
            // If the child is at the same level, so we can just draw a horizontal line.
            path =
              `M${px * size + halfSize} ${py * size + halfSize}` + // Start at the center of the parentNode.
              ` L${cx * size + halfSize} ${cy * size + halfSize}`; // End at the center of the childNode.
          }

          displayData.push({ path, lineColor, lineWidth });
        }
      });
    });

    displayData.sort((a, b) => {
      // If the line width is thinner, the line is less important (so we will render it first, and maybe draw over it later).
      if (a.lineWidth !== b.lineWidth) {
        return a.lineWidth - b.lineWidth;
      }
      // If the line is white, it is more important.
      if (a.lineColor !== b.lineColor) {
        if (a.lineColor === 'white') {
          return 1;
        } else {
          return -1;
        }
      }
      // Width and color are the same, so these two are equally important.
      return 0;
    });

    // We will draw connectors FROM the parent node TO each child node.
    const connectors: React.ReactNode[] = displayData.map((data, index) => {
      return (
        <path d={data.path} fill={'transparent'} stroke={data.lineColor} strokeWidth={data.lineWidth} key={index} />
      );
    });
    return connectors;
  }

  private renderNode(def: ProgressionNodeDef): React.ReactNode {
    return (
      <ProgressionNodeDisplay
        def={def}
        nodeSizePx={this.props.nodeSizePx}
        style={{
          left: `${def.positionX * this.props.nodeSizePx}px`,
          top: `${def.positionY * this.props.nodeSizePx}px`
        }}
      />
    );
  }
}

/**
 * Finds the lowest and highest x and y coordinates in the passed set of ProgressionNodes.
 * @param nodeDefs
 * @returns [minNodeX, maxNodeX, minNodeY, maxNodeY]
 */
export function getProgressionNodeExtremes(nodeDefs: ProgressionNodeDef[]): [number, number, number, number] {
  let minNodeX = Number.MAX_SAFE_INTEGER;
  let maxNodeX = Number.MIN_SAFE_INTEGER;
  let minNodeY = Number.MAX_SAFE_INTEGER;
  let maxNodeY = Number.MIN_SAFE_INTEGER;

  nodeDefs.forEach((def) => {
    minNodeX = Math.min(minNodeX, def.positionX);
    maxNodeX = Math.max(maxNodeX, def.positionX);
    minNodeY = Math.min(minNodeY, def.positionY);
    maxNodeY = Math.max(maxNodeY, def.positionY);
  });

  return [minNodeX, maxNodeX, minNodeY, maxNodeY];
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { selectedChampion } = state.championInfo;
  const { ownedPerks, progressionNodes, quests } = state.profile;
  const { stringTable } = state.stringTable;
  const { perksByID } = state.store;
  const nodeDefs = state.championInfo.progressionNodeDefsByChampionID[selectedChampion.id] ?? [];
  const { serverTimeDeltaMS } = state.clock;

  return {
    ...ownProps,
    selectedChampion,
    ownedPerks,
    perksByID,
    stringTable,
    progressionNodes,
    nodeDefs,
    quests,
    serverTimeDeltaMS
  };
}

export const ProgressionTreeDisplay = connect(mapStateToProps)(AProgressionTreeDisplay);
