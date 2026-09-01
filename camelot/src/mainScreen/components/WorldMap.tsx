/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import GroupPOIPartyMemberURL from '../../images/warband/map-icon-party-member-factionless.png';
import GroupPOIWarbandMemberURL from '../../images/warband/map-icon-warband-member-factionless.png';
import GroupPOIWarbandLeaderURL from '../../images/warband/map-icon-warband-leader-factionless.png';
import GroupPOIWarbandDeputyURL from '../../images/warband/map-icon-warband-deputy-factionless.png';

import * as React from 'react';
import { connect } from 'react-redux';
import {
  addConditionalWidgetExiting,
  hideGroupPOIType,
  hidePOIType,
  HUDLayer,
  HUDWidget,
  HUDWidgetRegistration,
  showGroupPOIType,
  showPOIType,
  updateWorldMapSelection,
  WorldMapSelection
} from '../redux/hudSlice';
import { AddDispatch, RootState } from '../redux/store';
import {
  GroupPOIType,
  HUDHorizontalAnchor,
  HUDVerticalAnchor
} from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { Faction, ZoneInfo } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import Escapable from './Escapable';
import { WorldMapController } from './WorldMapController';
import { handleHUDWidgetResizeEvent, toggleMaximizeWidget } from './BaseHUDWidget';
import { WorldMapIcons } from './WorldMapIcons';
import { BorderBackground, FactionBorder, BorderType } from './FactionBorder';
import { CornerButtonType, FactionCornerButton } from './FactionCornerButton';
import {
  allMapDetails,
  allMapRegions,
  getMapDataTypesForCategory,
  getMapDetails,
  isMapVisibleToFaction,
  MAP_REGION_WORLD,
  MapDisplayCategory
} from '../helpers/mapHelpers';
import { BaseHUDWidgetDraggableHandle } from './BaseHUDWidgetDraggableHandle';
import { FactionDivider } from './FactionDivider';
import { MapDataType } from '@csegames/library/dist/_baseGame/GameClientModels/AnimationData';
import { getFactionData } from '../gameData/factionData';
import { FactionCheckbox } from './FactionCheckbox';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { getStringTableValue, StringIDGeneralUnnamed } from '../helpers/stringTableHelpers';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import { FactionSlidingPanel } from './FactionSlidingPanel';
import { typedObjectKeys } from '@csegames/library/dist/_baseGame/utils/objectUtils';
import { FactionComboBox } from './FactionComboBox';
import { requestAddImagesToCache } from '../dataSources/imageCacheService';
import { WorldMapFullView } from './WorldMapFullView';
import TooltipSource from './TooltipSource';

export const mapGroupIconImages: Record<GroupPOIType, string> = {
  [GroupPOIType.PartyMember]: GroupPOIPartyMemberURL,
  [GroupPOIType.WarbandMember]: GroupPOIWarbandMemberURL,
  [GroupPOIType.WarbandLeader]: GroupPOIWarbandLeaderURL,
  [GroupPOIType.WarbandDeputy]: GroupPOIWarbandDeputyURL
};

const ERROR_ZONE: ZoneInfo = {
  ID: '',
  Name: '',
  Address: '',
  RestrictToFaction: Faction.Factionless,
  Bounds: '-4500,-3375 - 4500,3375'
};

const StringIDPrefixMapPOIName = 'MapPOIName_';
const StringIDPrefixMapGroupPOIName = 'MapGroupPOIName_';
const StringIDMapLegendSliderButton = 'MapLegendSliderButton';
const StringIDWidgetNameWorldMap = 'HUDEditorWidgetNameWorldMap';

// CSS classes
const Root = 'HUD-WorldMap-Root';
const ContentRow = 'HUD-WorldMap-ContentRow';
const MapSection = 'HUD-WorldMap-MapSection';
const Header = 'HUD-WorldMap-Header';
const HeaderContent = 'HUD-WorldMap-HeaderContent';
const SelectorBox = 'HUD-WorldMap-SelectorBox';
const MapContainer = 'HUD-WorldMap-MapContainer';
const SideBarContainer = 'HUD-WorldMap-SideBarContainer';
const WorldMapImage = 'HUD-WorldMap-Image';
const Handle = 'HUD-FancyBorder-HeaderHandle';
const POIRow = 'HUD-WorldMap-POIRow';
const CheckboxContainer = 'HUD-WorldMap-CheckboxContainer';
const POICheckbox = 'HUD-WorldMap-POICheckbox';
const POIIcon = 'HUD-WorldMap-POIIcon';
const POILabel = 'HUD-WorldMap-POILabel';
const LegendSlider = 'HUD-WorldMap-LegendSlider';
const LegendSliderContent = 'HUD-WorldMap-LegendSliderContent';
const LegendSliderSection = 'HUD-WorldMap-LegendSliderSection';
const LegendSliderColumn = 'HUD-WorldMap-LegendSliderColumn';
const LegendSliderDivider = 'HUD-WorldMap-LegendSliderDivider';
const GlobeButton = 'HUD-WorldMap-GlobeButton';

interface State {
  isLegendOpen: boolean;
}

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  zoneID: string;
  zones: Record<string, ZoneInfo>;
  widgets: Record<string, HUDWidget>;
  vminPx: number;
  poisToHide: MapDataType[];
  groupPOIsToHide: GroupPOIType[];
  uiFactionID: string;
  stringTable: Record<string, StringTableEntryDef>;
  worldMapSelection: WorldMapSelection;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class AWorldMap extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isLegendOpen: false };
  }

  componentDidMount(): void {
    // Only the real widget resets the selection on open; the drag copy inherits the shared one.
    if (!this.props.isDragCopy) {
      this.props.dispatch(updateWorldMapSelection(this.getDefaultSelection()));
    }
  }

  // Auto-selects the map for the current zone, defaulting to the specific realm region (not World).
  private getDefaultSelection(): WorldMapSelection {
    const zone = this.props.zones[this.props.zoneID] ?? ERROR_ZONE;
    const regionID =
      typedObjectKeys(allMapRegions).find((regionID: string) => {
        return regionID !== MAP_REGION_WORLD && allMapRegions[regionID].includes(zone.Name);
      }) ?? '';
    return { regionID, mapID: zone.Name, isWorldView: false };
  }

  // Falls back to the default until the first selection has been dispatched (e.g. the first render).
  private getSelection(): WorldMapSelection {
    const selection = this.props.worldMapSelection;
    return selection.mapID || selection.regionID || selection.isWorldView ? selection : this.getDefaultSelection();
  }

  private getDisplayedZone(): ZoneInfo {
    const { mapID } = this.getSelection();
    // Prefer the player's actual zone instance; a by-Name search can find a different
    // instance of the same map, whose ID won't match the animation data's zone IDs.
    const currentZone = this.props.zones[this.props.zoneID];
    if (currentZone?.Name === mapID) return currentZone;
    return Object.values(this.props.zones).find((z) => z.Name === mapID) ?? ERROR_ZONE;
  }

  render(): React.ReactNode {
    const selection = this.getSelection();
    const zone = this.getDisplayedZone();

    const selfWidget = this.props.widgets[WIDGET_ID_WORLD_MAP];
    const isMaximized = !!selfWidget?.state?.resizable?.isMaximized;

    const alphySort = (a: MapDataType, b: MapDataType) => {
      const aName = getStringTableValue(StringIDPrefixMapPOIName + MapDataType[a], this.props.stringTable);
      const bName = getStringTableValue(StringIDPrefixMapPOIName + MapDataType[b], this.props.stringTable);
      return aName.localeCompare(bName);
    };

    const poisStructures = getMapDataTypesForCategory(MapDisplayCategory.Structures).sort(alphySort);
    const poisResourceNodes = getMapDataTypesForCategory(MapDisplayCategory.ResourceNodes).sort(alphySort);
    const poisCraftingStations = getMapDataTypesForCategory(MapDisplayCategory.CraftingStations).sort(alphySort);

    const availableMapNames = this.getAvailableMapNames();

    return (
      <div className={Root}>
        {!isMaximized && (
          <FactionSlidingPanel
            className={LegendSlider}
            titleText={getStringTableValue(StringIDMapLegendSliderButton, this.props.stringTable)}
            isOpen={this.state.isLegendOpen}
            onToggleClicked={() => {
              this.setState({ isLegendOpen: !this.state.isLegendOpen });
            }}
            isBadged={false}
          >
            {this.renderLegendSliderContent(poisStructures, poisResourceNodes, poisCraftingStations)}
          </FactionSlidingPanel>
        )}
        <FactionBorder
          className={Root}
          type={BorderType.FancyHeader}
          background={BorderBackground.PatternLarge}
          titleText={getStringTableValue(StringIDWidgetNameWorldMap, this.props.stringTable)}
          cornerButtons={[
            <FactionCornerButton
              type={isMaximized ? CornerButtonType.Windowed : CornerButtonType.Maximize}
              onClick={() => {
                this.toggleMaximizeSelf();
              }}
            />,
            <FactionCornerButton
              type={CornerButtonType.Close}
              onClick={() => {
                this.closeSelf();
              }}
            />
          ]}
          resizing={
            isMaximized
              ? undefined
              : {
                  onSizeChanged: (dt: number, dr: number, db: number, dl: number) =>
                    handleHUDWidgetResizeEvent(
                      selfWidget,
                      false,
                      this.props.vminPx,
                      this.props.dispatch,
                      dt,
                      dr,
                      db,
                      dl
                    ),
                  onSizeFinalized: (dt: number, dr: number, db: number, dl: number) =>
                    handleHUDWidgetResizeEvent(selfWidget, true, this.props.vminPx, this.props.dispatch, dt, dr, db, dl)
                }
          }
        >
          {!this.props.isDragCopy && <Escapable escapeID={WIDGET_ID_WORLD_MAP} onEscape={this.closeSelf.bind(this)} />}
          <div className={ContentRow}>
            {isMaximized && (
              <FactionBorder
                className={SideBarContainer}
                type={BorderType.Primary}
                background={BorderBackground.Leather}
                includeTop={false}
                includeBottom={false}
                includeLeft={false}
              >
                <FactionDivider />
                {this.renderSelfPOIRow()}
                <FactionDivider />
                {this.renderGroupPOIRow(GroupPOIType.PartyMember)}
                {this.renderGroupPOIRow(GroupPOIType.WarbandMember)}
                {this.renderGroupPOIRow(GroupPOIType.WarbandLeader)}
                {this.renderGroupPOIRow(GroupPOIType.WarbandDeputy)}
                <FactionDivider />
                {poisStructures.map(this.renderPOIRow.bind(this))}
                {poisStructures.length > 0 && <FactionDivider />}
              </FactionBorder>
            )}
            <div className={MapSection}>
              <div className={MapContainer}>
                {selection.isWorldView ? (
                  <WorldMapFullView onContinentClick={this.onContinentClick.bind(this)} />
                ) : (
                  <>
                    <WorldMapController
                      displayedZoneID={selection.mapID}
                      map={<img className={WorldMapImage} src={allMapDetails[selection.mapID]?.mapURL ?? getMapDetails(zone).mapURL} />}
                      overlays={<WorldMapIcons zone={zone} />}
                      onMouseDown={(e) => { if (e.button === 2) this.props.dispatch(updateWorldMapSelection({ isWorldView: true, regionID: MAP_REGION_WORLD })); }}
                    />
                    <TooltipSource
                      className={GlobeButton}
                      tooltipID='worldmap-globe-button'
                      positionType='mouse'
                      content={() => (
                        <div className='HUD-WorldMapIcons-POITooltip'>
                          <div className='HUD-WorldMapIcons-POITooltipName'>
                            {getStringTableValue(MAP_REGION_WORLD, this.props.stringTable)}
                          </div>
                        </div>
                      )}
                      onClick={() => this.props.dispatch(updateWorldMapSelection({ isWorldView: true, regionID: MAP_REGION_WORLD }))}
                    >
                      <img src={getFactionData(this.props.uiFactionID).mapGlobeImage} draggable={false} />
                    </TooltipSource>
                  </>
                )}
              </div>
              <FactionBorder
                className={Header}
                type={BorderType.Decorative}
                background={BorderBackground.Leather}
                includeLeft={false}
                includeRight={false}
                includeTop={false}
              >
                <div className={HeaderContent}>
                  <FactionComboBox
                    className={SelectorBox}
                    options={this.getAvailableRegionNames()}
                    selectedOption={this.getSelectedRegionName()}
                    onSelectionChanged={this.onRegionSelected.bind(this)}
                  />
                  <FactionComboBox
                    className={SelectorBox}
                    disabled={!selection.isWorldView && availableMapNames.length < 1}
                    options={selection.isWorldView ? this.getAllAvailableMapNames() : availableMapNames}
                    selectedOption={selection.isWorldView ? '' : this.getSelectedMapName()}
                    onSelectionChanged={this.onMapSelected.bind(this)}
                  />
                </div>
              </FactionBorder>
            </div>
            {isMaximized && (
              <FactionBorder
                className={SideBarContainer}
                type={BorderType.Primary}
                background={BorderBackground.Leather}
                includeTop={false}
                includeRight={false}
                includeBottom={false}
              >
                <FactionDivider />
                {poisResourceNodes.map(this.renderPOIRow.bind(this))}
                <FactionDivider />
                {poisCraftingStations.map(this.renderPOIRow.bind(this))}
                {poisCraftingStations.length > 0 && <FactionDivider />}
              </FactionBorder>
            )}
          </div>
          <BaseHUDWidgetDraggableHandle className={Handle} widgetID={WIDGET_ID_WORLD_MAP} />
        </FactionBorder>
      </div>
    );
  }

  componentDidUpdate(): void {
    // If we were in an error state, recover as soon as valid data becomes available
    if (!this.props.isDragCopy && this.getDisplayedZone().ID === ERROR_ZONE.ID && !!this.props.zones[this.props.zoneID]) {
      this.props.dispatch(updateWorldMapSelection(this.getDefaultSelection()));
    }
  }

  private getAvailableRegionNames(): string[] {
    const names: string[] = typedObjectKeys(allMapRegions).map((regionStringID: string) =>
      getStringTableValue(regionStringID, this.props.stringTable)
    );
    names.sort();

    return names;
  }

  private getSelectedRegionName(): string {
    return getStringTableValue(this.getSelection().regionID, this.props.stringTable);
  }

  private onRegionSelected(regionName: string): void {
    const regionID =
      typedObjectKeys(allMapRegions).find(
        (id: string) => getStringTableValue(id, this.props.stringTable) === regionName
      ) ?? '';

    if (regionID === MAP_REGION_WORLD) {
      this.props.dispatch(updateWorldMapSelection({ regionID, isWorldView: true }));
      return;
    }

    this.props.dispatch(updateWorldMapSelection({ regionID, isWorldView: false }));

    // Auto-select the first accessible map in the region, skipping other realms' home islands.
    const firstMap =
      (allMapRegions[regionID] ?? []).find((mapID) => isMapVisibleToFaction(mapID, this.props.uiFactionID)) ?? '';
    this.selectMap(firstMap);
  }

  private getAvailableMapNames(): string[] {
    const names: string[] = (allMapRegions[this.getSelection().regionID] ?? [])
      // Hide other realms' home islands; you can never travel to them.
      .filter((mapID: string) => isMapVisibleToFaction(mapID, this.props.uiFactionID))
      .map((mapID: string) => {
        return getStringTableValue(
          allMapDetails[mapID]?.nameStringID ?? StringIDGeneralUnnamed,
          this.props.stringTable
        );
      });

    names.sort();

    return names;
  }

  private getSelectedMapName(): string {
    return getStringTableValue(
      allMapDetails[this.getSelection().mapID]?.nameStringID ?? StringIDGeneralUnnamed,
      this.props.stringTable
    );
  }

  private getAllAvailableMapNames(): string[] {
    const seen = new Set<string>();
    const names: string[] = [];
    for (const regionID of typedObjectKeys(allMapRegions)) {
      if (regionID === MAP_REGION_WORLD) continue;
      for (const mapID of allMapRegions[regionID]) {
        if (seen.has(mapID)) continue;
        seen.add(mapID);
        const details = allMapDetails[mapID];
        if (!details) continue;
        if (!isMapVisibleToFaction(mapID, this.props.uiFactionID)) continue;
        names.push(getStringTableValue(details.nameStringID ?? StringIDGeneralUnnamed, this.props.stringTable));
      }
    }
    names.sort();
    return names;
  }

  private onMapSelected(mapName: string): void {
    const mapID =
      typedObjectKeys(allMapDetails).find(
        (id: string) => getStringTableValue(allMapDetails[id].nameStringID, this.props.stringTable) === mapName
      ) ?? '';

    if (this.getSelection().isWorldView) {
      const regionID =
        typedObjectKeys(allMapRegions).find(
          (id: string) => id !== MAP_REGION_WORLD && allMapRegions[id].includes(mapID)
        ) ?? '';
      this.props.dispatch(updateWorldMapSelection({ regionID, isWorldView: false }));
    }

    this.selectMap(mapID);
  }

  private selectMap(mapName: string): void {
    const imageURL = allMapDetails[mapName]?.mapURL;
    const apply = () => this.props.dispatch(updateWorldMapSelection({ mapID: mapName }));
    if (imageURL) {
      const img = new Image();
      img.onload = apply;
      img.onerror = apply;
      img.src = imageURL;
    } else {
      apply();
    }
  }

  private renderSelfPOIRow(): React.ReactNode {
    const selfWidget = this.props.widgets[WIDGET_ID_WORLD_MAP];
    const isMaximized = !!selfWidget?.state?.resizable?.isMaximized;
    const sizeClass = isMaximized ? '' : ' small';
    const factionData = getFactionData(this.props.uiFactionID);
    return (
      <div className={POIRow}>
        <div className={CheckboxContainer}>{/** No checkbox because Self is always shown. */}</div>
        <img className={`${POIIcon}${sizeClass}`} src={factionData.mapIconImages[MapDataType.Self]} />
        <div className={`${POILabel}${sizeClass}`}>
          {getStringTableValue(StringIDPrefixMapPOIName + MapDataType[MapDataType.Self], this.props.stringTable)}
        </div>
      </div>
    );
  }

  private renderLegendSliderContent(
    poisStructures: MapDataType[],
    poisResourceNodes: MapDataType[],
    poisCraftingStations: MapDataType[]
  ): React.ReactNode {
    // Helper to split each POI list into two columns,
    const split = (a: MapDataType[]) => {
      const center = Math.ceil(a.length / 2);
      return [a.slice(0, center), a.slice(center)];
    };

    // Self always goes first, so we place it manually.
    const [structuresLeft, structuresRight] = split(poisStructures);
    const [resourceNodesLeft, resourceNodesRight] = split(poisResourceNodes);
    const [craftingStationsLeft, craftingStationsRight] = split(poisCraftingStations);

    return (
      <div className={LegendSliderContent}>
        <div className={LegendSliderSection}>
          <div className={LegendSliderColumn}>{this.renderSelfPOIRow()}</div>
        </div>
        <FactionDivider className={LegendSliderDivider} />
        <div className={LegendSliderSection}>
          <div className={LegendSliderColumn}>
            {this.renderGroupPOIRow(GroupPOIType.PartyMember)}
            {this.renderGroupPOIRow(GroupPOIType.WarbandMember)}
          </div>
          <div className={LegendSliderColumn}>
            {this.renderGroupPOIRow(GroupPOIType.WarbandLeader)}
            {this.renderGroupPOIRow(GroupPOIType.WarbandDeputy)}
          </div>
        </div>
        <FactionDivider className={LegendSliderDivider} />
        <div className={LegendSliderSection}>
          <div className={LegendSliderColumn}>{structuresLeft.map(this.renderPOIRow.bind(this))}</div>
          <div className={LegendSliderColumn}>{structuresRight.map(this.renderPOIRow.bind(this))}</div>
        </div>
        {structuresLeft.length > 0 && <FactionDivider className={LegendSliderDivider} />}
        <div className={LegendSliderSection}>
          <div className={LegendSliderColumn}>{resourceNodesLeft.map(this.renderPOIRow.bind(this))}</div>
          <div className={LegendSliderColumn}>{resourceNodesRight.map(this.renderPOIRow.bind(this))}</div>
        </div>
        {resourceNodesLeft.length > 0 && <FactionDivider className={LegendSliderDivider} />}
        <div className={LegendSliderSection}>
          <div className={LegendSliderColumn}>{craftingStationsLeft.map(this.renderPOIRow.bind(this))}</div>
          <div className={LegendSliderColumn}>{craftingStationsRight.map(this.renderPOIRow.bind(this))}</div>
        </div>
      </div>
    );
  }

  private renderPOIRow(type: MapDataType): React.ReactNode {
    if (type === MapDataType.Self) {
      return null;
    }
    const selfWidget = this.props.widgets[WIDGET_ID_WORLD_MAP];
    const isMaximized = !!selfWidget?.state?.resizable?.isMaximized;
    const sizeClass = isMaximized ? '' : ' small';
    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <div className={POIRow} key={`POI_${MapDataType[type]}`}>
        <div className={CheckboxContainer}>
          <FactionCheckbox
            className={POICheckbox}
            isChecked={!this.props.poisToHide.includes(type)}
            onCheckedChanged={(isChecked) => {
              // Persistent update.
              clientAPI.setPOITypeVisibility(type, isChecked);
              // Redux update.
              this.props.dispatch(isChecked ? showPOIType(type) : hidePOIType(type));
            }}
          />
        </div>
        <img className={`${POIIcon}${sizeClass}`} src={factionData.mapIconImages[type]} />
        <div className={`${POILabel}${sizeClass}`}>
          {getStringTableValue(StringIDPrefixMapPOIName + MapDataType[type], this.props.stringTable)}
        </div>
      </div>
    );
  }

  private renderGroupPOIRow(type: GroupPOIType): React.ReactNode {
    const selfWidget = this.props.widgets[WIDGET_ID_WORLD_MAP];
    const isMaximized = !!selfWidget?.state?.resizable?.isMaximized;
    const sizeClass = isMaximized ? '' : ' small';

    return (
      <div className={POIRow} key={`POI_${GroupPOIType[type]}`}>
        <div className={CheckboxContainer}>
          <FactionCheckbox
            className={POICheckbox}
            isChecked={!this.props.groupPOIsToHide.includes(type)}
            onCheckedChanged={(isChecked) => {
              // Persistent update.
              clientAPI.setGroupPOITypeVisibility(type, isChecked);
              // Redux update.
              this.props.dispatch(isChecked ? showGroupPOIType(type) : hideGroupPOIType(type));
            }}
          />
        </div>
        <img className={`${POIIcon}${sizeClass}`} src={mapGroupIconImages[type]} />
        <div className={`${POILabel}${sizeClass}`}>
          {getStringTableValue(StringIDPrefixMapGroupPOIName + GroupPOIType[type], this.props.stringTable)}
        </div>
      </div>
    );
  }

  private onContinentClick(mapID: string): void {
    // Block home islands belonging to other realms, same rule as the dropdown filter.
    if (!isMapVisibleToFaction(mapID, this.props.uiFactionID)) return;

    const regionID =
      typedObjectKeys(allMapRegions).find(
        (id) => id !== MAP_REGION_WORLD && allMapRegions[id].includes(mapID)
      ) ?? '';

    const imageURL = allMapDetails[mapID]?.mapURL;
    const navigate = () => {
      this.props.dispatch(updateWorldMapSelection({ regionID, mapID, isWorldView: false }));
    };
    if (imageURL) {
      const img = new Image();
      img.onload = navigate;
      img.onerror = navigate;
      img.src = imageURL;
    } else {
      navigate();
    }
  }

  private closeSelf(): void {
    this.props.dispatch(addConditionalWidgetExiting(WIDGET_ID_WORLD_MAP));
  }

  private toggleMaximizeSelf(): void {
    toggleMaximizeWidget(WIDGET_ID_WORLD_MAP, this.props.widgets, this.props.dispatch);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  return {
    ...ownProps,
    zoneID: state.loading.zoneID,
    zones: state.zones.zones,
    widgets: state.hud.widgets,
    vminPx: state.hud.vminPx,
    poisToHide: state.hud.poisToHide,
    groupPOIsToHide: state.hud.groupPOIsToHide,
    uiFactionID: state.hud.uiFactionID,
    stringTable: state.stringTable.stringTable,
    worldMapSelection: state.hud.worldMapSelection
  };
};

const WorldMap = connect(mapStateToProps)(AWorldMap);

export const WIDGET_ID_WORLD_MAP = 'World Map';
export const worldMapRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_WORLD_MAP,
  nameStringID: StringIDWidgetNameWorldMap,
  nativeWidgetID: 'map',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Top,
    yOffset: 6,
    resizable: {
      widthVmin: 92,
      heightVmin: 69,
      minWidthVmin: 45,
      minHeightVmin: 45,
      isMaximized: false
    }
  },
  requiresGameDefsLoaded: true,
  layer: HUDLayer.Menus,
  isConditional: true,
  render: (isDragCopy: boolean) => {
    return <WorldMap isDragCopy={isDragCopy} />;
  }
};

requestAddImagesToCache(WIDGET_ID_WORLD_MAP, [
  GroupPOIPartyMemberURL,
  GroupPOIWarbandMemberURL,
  GroupPOIWarbandLeaderURL,
  GroupPOIWarbandDeputyURL
]);
