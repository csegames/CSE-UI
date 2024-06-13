import { AbilityFunctions, AbilityMocks, impl as abf } from '../_baseGame/clientFunctions/AbilityFunctions';
import {
  AnnouncementFunctions,
  AnnouncementMocks,
  impl as anf
} from '../_baseGame/clientFunctions/AnnouncementFunctions';
import { AssetFunctions, impl as af } from '../_baseGame/clientFunctions/AssetFunctions';
import { BuildModeFunctions, BuildModeMocks, impl as bmf } from '../_baseGame/clientFunctions/BuildModeFunctions';
import {
  WarningIconsFunctions,
  WarningIconsMocks,
  impl as cf
} from '../_baseGame/clientFunctions/WarningIconsFunctions';
import { DefFunctions, DefMocks, impl as df } from '../_baseGame/clientFunctions/DefFunctions';
import { HUDFunctions, impl as hf } from './clientFunctions/HUDFunctions';
import { LoadingScreenFunctions, impl as lf } from '../_baseGame/clientFunctions/LoadingScreenFunctions';
import { EntityFunctions, create } from '../_baseGame/clientFunctions/EntityFunctions';
import { SelfPlayerFunctions, impl as spf } from '../_baseGame/clientFunctions/SelfPlayerFunctions';
import { ViewFunctions, ViewEventMocks, impl as vf } from '../_baseGame/clientFunctions/ViewFunctions';
import { AnyEntityStateModel } from './game/GameClientModels/EntityState';
import { AudioFunctions, AudioMocks, impl as audf } from '../_baseGame/clientFunctions/AudioFunctions';
import { SystemFunctions, SystemMocks, impl as sysf } from '../_baseGame/clientFunctions/SystemFunctions';

/**
 * ClientAPI is intended to serve as an abstraction layer such that only the Library has to know
 * about and interact with Coherent directly.
 *
 * As such, only these API functions should directly touch the Coherent `engine` object.
 *
 * This also makes it easier for us to gate access to the client for modders.
 */

const ef = create<AnyEntityStateModel>();

export type MainScreenClientAPI = AbilityFunctions &
  AudioFunctions &
  AnnouncementFunctions &
  AssetFunctions &
  AudioFunctions &
  BuildModeFunctions &
  DefFunctions &
  EntityFunctions<AnyEntityStateModel> &
  HUDFunctions &
  LoadingScreenFunctions &
  SelfPlayerFunctions &
  SystemFunctions &
  ViewFunctions &
  WarningIconsFunctions;

export type MainScreenClientMocks = AbilityMocks &
  AudioMocks &
  AnnouncementMocks &
  BuildModeMocks &
  DefMocks &
  SystemMocks &
  ViewEventMocks &
  WarningIconsMocks;

// exposure of implementation
export const clientAPI: MainScreenClientAPI = {
  // Ability
  bindAbilityActivatedListener: abf.bindAbilityActivatedListener.bind(abf),
  bindAbilityEditStatusListener: abf.bindAbilityEditStatusListener.bind(abf),
  bindAbilityGroupUpdatedListener: abf.bindAbilityGroupUpdatedListener.bind(abf),
  bindAbilityGroupDeletedListener: abf.bindAbilityGroupDeletedListener.bind(abf),
  bindAbilityStatusUpdatedListener: abf.bindAbilityStatusUpdatedListener.bind(abf),
  bindButtonLayoutUpdatedListener: abf.bindButtonLayoutUpdatedListener.bind(abf),
  bindButtonLayoutDeletedListener: abf.bindButtonLayoutDeletedListener.bind(abf),
  requestEditMode: abf.requestEditMode.bind(abf),
  resetAllAbilitiesToDefaults: abf.resetAllAbilitiesToDefaults.bind(abf),
  createAbilityLayout: abf.createAbilityLayout.bind(abf),
  deleteAbilityLayout: abf.deleteAbilityLayout.bind(abf),
  selectAbilityLayoutGroup: abf.selectAbilityLayoutGroup.bind(abf),
  selectAbilityLayoutGroupCycle: abf.selectAbilityLayoutGroupCycle.bind(abf),
  selectNextAbilityLayoutGroup: abf.selectNextAbilityLayoutGroup.bind(abf),
  selectPrevAbilityLayoutGroup: abf.selectPrevAbilityLayoutGroup.bind(abf),
  createAbilityGroup: abf.createAbilityGroup.bind(abf),
  deleteAbilityGroup: abf.deleteAbilityGroup.bind(abf),
  renameAbilityGroup: abf.renameAbilityGroup.bind(abf),
  setVisibleAbilitySlots: abf.setVisibleAbilitySlots.bind(abf),
  clearAbility: abf.clearAbility.bind(abf),
  executeAbility: abf.executeAbility.bind(abf),
  moveAbility: abf.moveAbility.bind(abf),
  setAbility: abf.setAbility.bind(abf),
  // Audio
  playGameSound: audf.playGameSound.bind(audf),
  playVolumeFeedback: audf.playVolumeFeedback.bind(audf),
  setUIRaceState: audf.setUIRaceState.bind(audf),
  // Announcement
  bindAnnouncementListener: anf.bindAnnouncementListener.bind(anf),
  // Asset
  getAbilityBookTabsData: af.getAbilityBookTabsData.bind(af),
  getAbilityNetworksData: af.getAbilityNetworksData.bind(af),
  getFactionsData: af.getFactionsData.bind(af),
  getSystemAbilityData: af.getSystemAbilityData.bind(af),
  getUserClassesData: af.getUserClassesData.bind(af),
  // BuildMode
  bindBuildingModeChangedListener: bmf.bindBuildingModeChangedListener.bind(bmf),
  bindItemPlacementModeChangedListener: bmf.bindItemPlacementModeChangedListener.bind(bmf),
  bindItemPlacementCommitListener: bmf.bindItemPlacementCommitListener.bind(bmf),
  // Defs
  bindAbilityDisplayDefsListener: df.bindAbilityDisplayDefsListener.bind(df),
  bindCharacterClassDefsListener: df.bindCharacterClassDefsListener.bind(df),
  bindCharacterRaceDefsListener: df.bindCharacterRaceDefsListener.bind(df),
  bindStatusDefsListener: df.bindStatusDefsListener.bind(df),
  // Entity
  bindEntityContextListener: ef.bindEntityContextListener.bind(ef),
  bindEntityRemovedListener: ef.bindEntityRemovedListener.bind(ef),
  bindEntityUpdatedListener: ef.bindEntityUpdatedListener.bind(ef),
  bindEntityPositionMapUpdatedListener: ef.bindEntityPositionMapUpdatedListener.bind(ef),
  bindEntityShowItemActionsListener: ef.bindEntityShowItemActionsListener.bind(ef),
  // HUD
  bindAnchorVisibilityChangedListener: hf.bindAnchorVisibilityChangedListener.bind(hf),
  bindKeyActionsUpdateListener: hf.bindKeyActionsUpdateListener.bind(hf),
  bindToggleHUDEditorListener: hf.bindToggleHUDEditorListener.bind(hf),
  performItemAction: hf.performItemAction.bind(hf),
  moveItem: hf.moveItem.bind(hf),
  // LoadingScreenFunctions
  bindLoadingScreenListener: lf.bindLoadingScreenListener.bind(lf),
  clearManualLoadingScreen: lf.clearManualLoadingScreen.bind(lf),
  setLoadingScreenManually: lf.setLoadingScreenManually.bind(lf),
  // SelfPlayer
  bindSelfPlayerStateListener: spf.bindSelfPlayerStateListener.bind(spf),
  // System
  openBrowser: sysf.openBrowser.bind(sysf),
  // View
  setInitializationComplete: vf.setInitializationComplete.bind(vf),
  bindNavigateListener: vf.bindNavigateListener.bind(vf),
  // WarningIcons
  bindWarningIconsListener: cf.bindWarningIconsListener.bind(cf)
};

export const mockEvents: MainScreenClientMocks = {
  // Ability
  triggerAbilityActivated: abf.triggerAbilityActivated.bind(abf),
  triggerAbilityEditStatus: abf.triggerAbilityEditStatus.bind(abf),
  triggerAbilityGroupUpdated: abf.triggerAbilityGroupUpdated.bind(abf),
  triggerAbilityStatusUpdated: abf.triggerAbilityStatusUpdated.bind(abf),
  triggerButtonLayoutUpdated: abf.triggerButtonLayoutUpdated.bind(abf),
  // Announcement
  triggerAnnouncement: anf.triggerAnnouncement.bind(anf),
  // BuildMode
  triggerBuildingModeChanged: bmf.triggerBuildingModeChanged.bind(bmf),
  triggerItemPlacementModeChanged: bmf.triggerItemPlacementModeChanged.bind(bmf),
  triggerItemPlacementCommit: bmf.triggerItemPlacementCommit.bind(bmf),
  // Defs
  triggerAbilityDisplayDefsLoaded: df.triggerAbilityDisplayDefsLoaded.bind(df),
  triggerCharacterClassDefsLoaded: df.triggerCharacterClassDefsLoaded.bind(df),
  triggerCharacterRaceDefsLoaded: df.triggerCharacterRaceDefsLoaded.bind(df),
  triggerStatusDefsLoaded: df.triggerStatusDefsLoaded.bind(df),
  // View
  triggerNavigate: vf.triggerNavigate.bind(vf),
  // WarningIcons
  triggerWarningIcons: cf.triggerWarningIcons.bind(cf)
};
