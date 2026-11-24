/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { HUDLayer, HUDWidgetRegistration } from '../../redux/hudSlice';
import { RootState } from '../../redux/store';
import {
  CompassHeadingSource,
  HUDHorizontalAnchor,
  HUDVerticalAnchor
} from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { AnimationData } from '@csegames/library/dist/_baseGame/GameClientModels/AnimationData';
import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import {
  AnyEntityStateModel,
  isEntityItem,
  isEntityPlayer
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { PersonalMapMarker } from '@csegames/library/dist/camelotunchained/clientFunctions/HUDFunctions';
import { FactionDef } from '../../dataSources/manifest/factionManifest';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { getFactionData } from '../../gameData/factionData';
import { getStringTableValue } from '../../helpers/stringTableHelpers';
import { getNPCTierIconImage } from '../../helpers/npcTierHelpers';
import { getResourceNodeIconURL } from '../../helpers/resourceNodeHelpers';
import { yawToCompassBearing } from '../../helpers/mapHelpers';
import { BorderBackground, BorderType, FactionBorder } from '../FactionBorder';

// CSS classes
const Root = 'HUD-Compass-Root';
const Frame = 'HUD-Compass-Frame';
const Canvas = 'HUD-Compass-Canvas';
const CenterIndicator = 'HUD-Compass-CenterIndicator';
const EndCap = 'HUD-Compass-EndCap';

const StringIDCompassDirectionN = 'CompassDirectionN';
const StringIDCompassDirectionNE = 'CompassDirectionNE';
const StringIDCompassDirectionE = 'CompassDirectionE';
const StringIDCompassDirectionSE = 'CompassDirectionSE';
const StringIDCompassDirectionS = 'CompassDirectionS';
const StringIDCompassDirectionSW = 'CompassDirectionSW';
const StringIDCompassDirectionW = 'CompassDirectionW';
const StringIDCompassDirectionNW = 'CompassDirectionNW';

export const CompassWidthDefault = 33;
export const CompassHeadingSourceDefault = CompassHeadingSource.Camera;
const DEFAULT_WIDTH_VMIN = 34;
// Keeps the pixel math finite before the HUD has measured its size.
const MIN_WINDOW_WIDTH_PX = 1;

const MARKER_SIZE_VMIN = 2.4;
// Taller than the bar so markers can overhang its top and bottom. Matches .HUD-Compass-Canvas's height.
const CANVAS_HEIGHT_VMIN = MARKER_SIZE_VMIN;
const MARKER_INNER_ICON_SCALE = 0.6;
const DOT_RADIUS_VMIN = 0.2;
const LABEL_FONT_SIZE_VMIN = 1.3;
const LABEL_FONT_FAMILY = "'Caudex', serif";
const TICK_COLOR = 'white';
const FULL_CIRCLE_RADIANS = Math.PI * 2;

const FOV_DEGREES = 90;
const DIRECTION_INTERVAL_DEGREES = 45;
const DEGREES_PER_RADIAN = 180 / Math.PI;
// Each redraw costs the engine time, so the compass redraws at most this often. A time limit
// keeps the rate the same at any frame rate; at 30 fps this is every other frame.
const MAX_UPDATES_PER_SECOND = 20;
const MIN_UPDATE_INTERVAL_MS = 1000 / MAX_UPDATES_PER_SECOND;
const DIRECTION_STRING_IDS = [
  StringIDCompassDirectionN,
  StringIDCompassDirectionNE,
  StringIDCompassDirectionE,
  StringIDCompassDirectionSE,
  StringIDCompassDirectionS,
  StringIDCompassDirectionSW,
  StringIDCompassDirectionW,
  StringIDCompassDirectionNW
];

function getWindowWidthVmin(widthPercent: number): number {
  return (DEFAULT_WIDTH_VMIN * widthPercent) / 100;
}

// Normalizes an angle difference to the range [-180, 180).
function normalizeDelta(delta: number): number {
  return (((delta % 360) + 540) % 360) - 180;
}

// Rounds an angle to the nearest one that lands on a whole screen pixel, so a turn too small to see
// doesn't redraw anything.
function snapToPixel(degrees: number, degreesPerPixel: number): number {
  return Math.round(degrees / degreesPerPixel) * degreesPerPixel;
}

// NaN means no target; treat two NaNs as equal so no target doesn't redraw every frame.
function bearingEquals(a: number, b: number): boolean {
  return a === b || (isNaN(a) && isNaN(b));
}

// Draws the image as large as fits in a square box centered on the point, keeping its aspect ratio.
function drawImageContained(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement | null,
  centerX: number,
  centerY: number,
  boxSize: number
): void {
  if (!image) {
    return;
  }
  const scale = boxSize / Math.max(image.naturalWidth, image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  context.drawImage(image, centerX - width / 2, centerY - height / 2, width, height);
}

const FactionlessMarkerFrameURL = getFactionData(Faction[Faction.Factionless]).compassIconImage;

function getTargetInnerIconURL(
  target: AnyEntityStateModel | null,
  tagAffixIDByStringID: Record<string, number>
): string | null {
  if (isEntityPlayer(target)) {
    return target.faction === Faction.Factionless ? getNPCTierIconImage(target.characterKind) : null;
  }
  if (isEntityItem(target)) {
    return getResourceNodeIconURL(target.tags, tagAffixIDByStringID);
  }
  return null;
}

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  uiFactionID: string;
  factions: Record<string, FactionDef>;
  selfID: string | null;
  friendlyTargetID: string | null;
  friendlyTargetFaction: Faction | null;
  friendlyTargetInnerIconURL: string | null;
  enemyTargetID: string | null;
  enemyTargetFaction: Faction | null;
  enemyTargetInnerIconURL: string | null;
  personalMarker: PersonalMapMarker | null;
  personalMapMarkerVisible: boolean;
  widthPercent: number;
  // Screen pixels per vmin, including UI scale and the compass's own scale, so the canvas stays sharp.
  pxPerVmin: number;
  headingSource: CompassHeadingSource;
  stringTable: Record<string, StringTableEntryDef>;
}

interface State {
  animationHandle: ListenerHandle;
}

type Props = ReactProps & InjectedProps;

// The dots, labels and markers are painted into one canvas. Moving page elements makes the engine redo
// layout on every change; repainting a canvas doesn't.
class ACompass extends React.Component<Props, State> {
  private heading: number = 0;
  private lastDrawTime: number = -Infinity;
  private friendlyBearing: number = NaN;
  private enemyBearing: number = NaN;
  private personalMarkerBearing: number = NaN;
  private canvasRef = React.createRef<HTMLCanvasElement>();
  private imagesByURL: Record<string, HTMLImageElement> = {};
  private labelFont: string = '';

  constructor(props: Props) {
    super(props);
    this.state = {
      animationHandle: clientAPI.startAnimation(this.animate.bind(this))
    };
  }

  render(): JSX.Element {
    const factionData = getFactionData(this.props.uiFactionID);
    const endImage = factionData.compassEndImage;
    // FactionBorder draws its border over its children, so the end caps and canvas sit outside it.
    return (
      <div className={Root} style={{ width: `${getWindowWidthVmin(this.props.widthPercent)}vmin` }}>
        <FactionBorder className={Frame} type={BorderType.Secondary} background={BorderBackground.PatternSmall}>
          <div className={CenterIndicator} style={{ backgroundColor: factionData.borderColor }} />
        </FactionBorder>
        <img className={`${EndCap} left`} src={endImage} />
        <img className={`${EndCap} right`} src={endImage} />
        <img className={`${EndCap} top`} src={endImage} />
        <img className={`${EndCap} bottom`} src={endImage} />
        <canvas
          ref={this.canvasRef}
          className={Canvas}
          width={Math.round(this.getWindowWidthPx())}
          height={Math.round(CANVAS_HEIGHT_VMIN * this.props.pxPerVmin)}
        />
      </div>
    );
  }

  componentDidMount(): void {
    this.refreshLabelFont();
    this.draw();
  }

  // Renders only happen when a prop changes, and resizing the canvas clears it, so always repaint.
  componentDidUpdate(): void {
    this.refreshLabelFont();
    this.draw();
  }

  componentWillUnmount(): void {
    this.state.animationHandle.close();
  }

  private getWindowWidthPx(): number {
    return Math.max(getWindowWidthVmin(this.props.widthPercent) * this.props.pxPerVmin, MIN_WINDOW_WIDTH_PX);
  }

  private refreshLabelFont(): void {
    this.labelFont = `${LABEL_FONT_SIZE_VMIN * this.props.pxPerVmin}px ${LABEL_FONT_FAMILY}`;
  }

  // Returns the image once it has loaded; until then it's skipped, and its load repaints the compass.
  private getLoadedImage(url: string): HTMLImageElement | null {
    let image = this.imagesByURL[url];
    if (!image) {
      image = new Image();
      image.onload = this.draw.bind(this);
      image.src = url;
      this.imagesByURL[url] = image;
    }
    return image.complete && image.naturalWidth > 0 ? image : null;
  }

  private getCanvasX(degrees: number, canvasWidth: number): number {
    return (0.5 + normalizeDelta(degrees - this.heading) / FOV_DEGREES) * canvasWidth;
  }

  private draw(): void {
    const canvas = this.canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) {
      return;
    }
    const { width, height } = canvas;
    const centerY = height / 2;
    const pxPerVmin = this.props.pxPerVmin;
    context.clearRect(0, 0, width, height);

    context.fillStyle = TICK_COLOR;
    const dotRadius = DOT_RADIUS_VMIN * pxPerVmin;
    for (let i = 0; i < DIRECTION_STRING_IDS.length; i++) {
      const x = this.getCanvasX(i * DIRECTION_INTERVAL_DEGREES + DIRECTION_INTERVAL_DEGREES / 2, width);
      context.beginPath();
      context.arc(x, centerY, dotRadius, 0, FULL_CIRCLE_RADIANS);
      context.fill();
    }

    const markerSize = MARKER_SIZE_VMIN * pxPerVmin;
    this.drawTargetMarker(
      context,
      this.props.friendlyTargetID,
      this.props.friendlyTargetFaction,
      this.props.friendlyTargetInnerIconURL,
      this.friendlyBearing,
      width,
      centerY,
      markerSize
    );
    this.drawTargetMarker(
      context,
      this.props.enemyTargetID,
      this.props.enemyTargetFaction,
      this.props.enemyTargetInnerIconURL,
      this.enemyBearing,
      width,
      centerY,
      markerSize
    );
    if (!isNaN(this.personalMarkerBearing)) {
      const image = this.getLoadedImage(getFactionData(this.props.uiFactionID).personalMarkerCompassImage);
      drawImageContained(context, image, this.getCanvasX(this.personalMarkerBearing, width), centerY, markerSize);
    }

    // After the markers, so the direction labels paint over any marker that reaches them.
    context.fillStyle = TICK_COLOR;
    context.font = this.labelFont;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    for (let i = 0; i < DIRECTION_STRING_IDS.length; i++) {
      const label = getStringTableValue(DIRECTION_STRING_IDS[i], this.props.stringTable);
      context.fillText(label, this.getCanvasX(i * DIRECTION_INTERVAL_DEGREES, width), centerY);
    }
  }

  private drawTargetMarker(
    context: CanvasRenderingContext2D,
    targetID: string | null,
    faction: Faction | null,
    innerIconURL: string | null,
    bearing: number,
    canvasWidth: number,
    centerY: number,
    markerSize: number
  ): void {
    if (isNaN(bearing) || !targetID || targetID === this.props.selfID || faction === null) {
      return;
    }
    const frameURL = innerIconURL
      ? FactionlessMarkerFrameURL
      : getFactionData(this.props.factions[Faction[faction]]?.id).compassIconImage;
    const x = this.getCanvasX(bearing, canvasWidth);
    drawImageContained(context, this.getLoadedImage(frameURL), x, centerY, markerSize);
    if (innerIconURL) {
      drawImageContained(context, this.getLoadedImage(innerIconURL), x, centerY, markerSize * MARKER_INNER_ICON_SCALE);
    }
  }

  private computePersonalMarkerBearing(data: AnimationData): number {
    const marker = this.props.personalMarker;
    if (!marker || !this.props.personalMapMarkerVisible || isNaN(data.playerX) || isNaN(data.playerY)) {
      return NaN;
    }
    // atan2 measures from east, counterclockwise, the same as game yaw.
    const markerYaw = Math.atan2(marker.y - data.playerY, marker.x - data.playerX) * DEGREES_PER_RADIAN;
    return yawToCompassBearing(markerYaw);
  }

  private animate(data: AnimationData, timestamp: DOMHighResTimeStamp): void {
    if (timestamp - this.lastDrawTime < MIN_UPDATE_INTERVAL_MS) {
      return;
    }
    const cameraHeading = yawToCompassBearing(data.cameraYaw);
    // playerYaw is NaN while nothing is controlled.
    const followCharacter = this.props.headingSource === CompassHeadingSource.Character && !isNaN(data.playerYaw);
    const degreesPerPixel = FOV_DEGREES / this.getWindowWidthPx();
    const heading = snapToPixel(followCharacter ? yawToCompassBearing(data.playerYaw) : cameraHeading, degreesPerPixel);
    // Target bearings arrive relative to the camera; adding the camera heading makes them absolute.
    const friendlyBearing = this.props.friendlyTargetID
      ? snapToPixel(cameraHeading + data.friendlyTargetBearing, degreesPerPixel)
      : NaN;
    const enemyBearing = this.props.enemyTargetID
      ? snapToPixel(cameraHeading + data.enemyTargetBearing, degreesPerPixel)
      : NaN;
    const personalMarkerBearing = snapToPixel(this.computePersonalMarkerBearing(data), degreesPerPixel);

    if (
      heading === this.heading &&
      bearingEquals(friendlyBearing, this.friendlyBearing) &&
      bearingEquals(enemyBearing, this.enemyBearing) &&
      bearingEquals(personalMarkerBearing, this.personalMarkerBearing)
    ) {
      return;
    }
    this.heading = heading;
    this.friendlyBearing = friendlyBearing;
    this.enemyBearing = enemyBearing;
    this.personalMarkerBearing = personalMarkerBearing;
    this.lastDrawTime = timestamp;
    this.draw();
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { friendlyTarget, enemyTarget } = state.entities;
  const { tagAffixIDByStringID } = state.gameDefs;
  const compassState = state.hud.widgets[WIDGET_ID_COMPASS]?.state;
  const scale = (compassState?.scale ?? 1) * state.hud.uiScale;
  return {
    ...ownProps,
    uiFactionID: state.hud.uiFactionID,
    factions: state.gameDefs.factions,
    selfID: state.entities.selfID,
    friendlyTargetID: state.entities.friendlyTargetID,
    friendlyTargetFaction: friendlyTarget?.faction ?? null,
    friendlyTargetInnerIconURL: getTargetInnerIconURL(friendlyTarget, tagAffixIDByStringID),
    enemyTargetID: state.entities.enemyTargetID,
    enemyTargetFaction: enemyTarget?.faction ?? null,
    enemyTargetInnerIconURL: getTargetInnerIconURL(enemyTarget, tagAffixIDByStringID),
    personalMarker: state.hud.personalMapMarkers[state.loading.zoneID] ?? null,
    personalMapMarkerVisible: state.hud.personalMapMarkerVisible,
    widthPercent: compassState?.compassWidth ?? CompassWidthDefault,
    pxPerVmin: state.hud.vminPx * scale,
    headingSource: compassState?.compassHeadingSource ?? CompassHeadingSourceDefault,
    stringTable: state.stringTable.stringTable
  };
};

const Compass = connect(mapStateToProps)(ACompass);

export const WIDGET_ID_COMPASS = 'Compass';
export const compassRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_COMPASS,
  nameStringID: 'HUDEditorWidgetNameCompass',
  // Centered under the mini map at the default UI scale, overlapping its bottom rim.
  defaults: {
    xAnchor: HUDHorizontalAnchor.Right,
    yAnchor: HUDVerticalAnchor.Top,
    xOffset: 6.9,
    yOffset: 20,
    layerOffset: 1
  },
  requiresGameDefsLoaded: true,
  layer: HUDLayer.HUD,
  render: (isDragCopy: boolean) => {
    return <Compass isDragCopy={isDragCopy} />;
  }
};
