import { AbilityFunctions, AbilityMocks, impl as abf } from '../_baseGame/clientFunctions/AbilityFunctions';
import { AnimationFunctions, AnimationMocks, impl as ani } from '../_baseGame/clientFunctions/AnimationFunctions';
import {
  AnnouncementFunctions,
  AnnouncementMocks,
  impl as anf
} from '../_baseGame/clientFunctions/AnnouncementFunctions';
import { AnyEntityStateModel } from './game/GameClientModels/EntityState';
import { AudioFunctions, AudioMocks, impl as audf } from '../_baseGame/clientFunctions/AudioFunctions';
import { AuthFunctions, AuthMocks, impl as auth } from '../_baseGame/clientFunctions/AuthFunctions';
import { BuildModeFunctions, BuildModeMocks, impl as bmf } from '../_baseGame/clientFunctions/BuildModeFunctions';
import { ChatFunctions, ChatMocks, impl as chf } from '../camelotunchained/clientFunctions/ChatFunctions';
import { CombatFunctions, CombatMocks, impl as cof } from './clientFunctions/CombatFunctions';
import { CraftingFunctions, CraftingMocks, impl as cf } from '../camelotunchained/clientFunctions/CraftingFunctions';
import { DebugHintFunctions, impl as dhf } from '../_baseGame/clientFunctions/DebugHintFunctions';
import { DefFunctions, DefMocks, impl as df } from '../_baseGame/clientFunctions/DefFunctions';
import { EntityFunctions, create } from '../_baseGame/clientFunctions/EntityFunctions';
import { GuildFunctions, GuildMocks, impl as gf } from './clientFunctions/GuildFunctions';
import { HUDFunctions, impl as hf } from './clientFunctions/HUDFunctions';
import { InventoryFunctions, InventoryMocks, impl as ivf } from './clientFunctions/InventoryFunctions';
import { KeybindsFunctions, KeybindsMocks, impl as kbf } from './clientFunctions/KeybindsFunctions';
import { NetworkEventMocks, NetworkFunctions, impl as nf } from '../_baseGame/clientFunctions/NetworkFunctions';
import { PartyFunctions, PartyMocks, impl as pf } from './clientFunctions/PartyFunctions';
import { ProgressionFunctions, impl as progf } from '../_baseGame/clientFunctions/ProgressionFunctions';
import {
  PerformanceWarningsFunctions,
  PerformanceWarningsMocks,
  impl as pwf
} from '../_baseGame/clientFunctions/PerformanceWarningsFunctions';
import { QuestFunctions, QuestMocks, impl as qf } from './clientFunctions/QuestFunctions';
import { SceneRenderFunctions, impl as srf } from '../_baseGame/clientFunctions/SceneRenderFunctions';
import { TradeFunctions, TradeMocks, impl as stf } from './clientFunctions/TradeFunctions';
import { SystemFunctions, impl as sysf } from '../_baseGame/clientFunctions/SystemFunctions';
import { ViewFunctions, ViewEventMocks, impl as vf } from '../_baseGame/clientFunctions/ViewFunctions';
import { WarbandFunctions, WarbandMocks, impl as wf } from './clientFunctions/WarbandFunctions';

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
  AnimationFunctions &
  AnnouncementFunctions &
  AudioFunctions &
  AuthFunctions &
  BuildModeFunctions &
  ChatFunctions &
  CombatFunctions &
  CraftingFunctions &
  DebugHintFunctions &
  DefFunctions &
  EntityFunctions<AnyEntityStateModel> &
  GuildFunctions &
  HUDFunctions &
  InventoryFunctions &
  KeybindsFunctions &
  NetworkFunctions &
  PartyFunctions &
  PerformanceWarningsFunctions &
  ProgressionFunctions &
  QuestFunctions &
  SceneRenderFunctions &
  TradeFunctions &
  SystemFunctions &
  ViewFunctions &
  WarbandFunctions;

export type MainScreenClientMocks = AbilityMocks &
  AnimationMocks &
  AudioMocks &
  AuthMocks &
  AnnouncementMocks &
  BuildModeMocks &
  ChatMocks &
  CombatMocks &
  CraftingMocks &
  DefMocks &
  GuildMocks &
  InventoryMocks &
  KeybindsMocks &
  NetworkEventMocks &
  PartyMocks &
  PerformanceWarningsMocks &
  QuestMocks &
  TradeMocks &
  ViewEventMocks &
  WarbandMocks;

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
  // Animation
  startAnimation: ani.startAnimation.bind(ani),
  // Announcement
  bindAnnouncementListener: anf.bindAnnouncementListener.bind(anf),
  // Audio
  playGameSound: audf.playGameSound.bind(audf),
  playVolumeFeedback: audf.playVolumeFeedback.bind(audf),
  setUIClassState: audf.setUIClassState.bind(audf),
  setUIFactionState: audf.setUIFactionState.bind(audf),
  setUIGenderState: audf.setUIGenderState.bind(audf),
  setUIRaceState: audf.setUIRaceState.bind(audf),
  startGameSound: audf.startGameSound.bind(audf),
  // Auth
  bindCharacterUpdatedListener: auth.bindCharacterUpdatedListener.bind(auth),
  setCharacter: auth.setCharacter.bind(auth),
  // BuildMode
  bindBuildingModeChangedListener: bmf.bindBuildingModeChangedListener.bind(bmf),
  bindItemPlacementModeChangedListener: bmf.bindItemPlacementModeChangedListener.bind(bmf),
  bindItemPlacementCommitListener: bmf.bindItemPlacementCommitListener.bind(bmf),
  // Chat
  bindBeginChatListener: chf.bindBeginChatListener.bind(chf),
  bindEndChatListener: chf.bindEndChatListener.bind(chf),
  bindTabsUpdatedListener: chf.bindTabsUpdatedListener.bind(chf),
  getChatTabs: chf.getChatTabs.bind(chf),
  updateChatTab: chf.updateChatTab.bind(chf),
  removeChatTab: chf.removeChatTab.bind(chf),
  // Combat
  bindCombatEventListener: cof.bindCombatEventListener.bind(cof),
  // Crafting
  bindCraftingErrorListener: cf.bindCraftingErrorListener.bind(cf),
  bindCraftingUpdatedListener: cf.bindCraftingUpdatedListener.bind(cf),
  bindCraftingOpenedListener: cf.bindCraftingOpenedListener.bind(cf),
  startCraftingJob: cf.startCraftingJob.bind(hf),
  collectCraftingJob: cf.collectCraftingJob.bind(hf),
  // DebugHintFunctions
  getDebugHints: dhf.getDebugHints.bind(dhf),
  // Defs
  bindCharacterClassDefsListener: df.bindCharacterClassDefsListener.bind(df),
  bindCharacterRaceDefsListener: df.bindCharacterRaceDefsListener.bind(df),
  bindManifestDefsListener: df.bindManifestDefsListener.bind(df),
  // Entity
  bindEntityContextListener: ef.bindEntityContextListener.bind(ef),
  bindEntityRemovedListener: ef.bindEntityRemovedListener.bind(ef),
  bindEntityUpdatedListener: ef.bindEntityUpdatedListener.bind(ef),
  bindEntityShowItemActionsListener: ef.bindEntityShowItemActionsListener.bind(ef),
  removeStatus: ef.removeStatus.bind(ef),
  requestEnemyTarget: ef.requestEnemyTarget.bind(ef),
  requestFriendlyTarget: ef.requestFriendlyTarget.bind(ef),
  respawn: ef.respawn.bind(ef),
  // Guild
  bindGuildListener: gf.bindGuildListener.bind(gf),
  // HUD
  // todo : reorganize, this became the lazy place to put everything rather than a category
  bindAnchorVisibilityChangedListener: hf.bindAnchorVisibilityChangedListener.bind(hf),
  bindKeyActionsUpdateListener: hf.bindKeyActionsUpdateListener.bind(hf),
  bindToggleHUDEditorListener: hf.bindToggleHUDEditorListener.bind(hf),
  getWidgets: hf.getWidgets.bind(hf),
  updateWidgetState: hf.updateWidgetState.bind(hf),
  clearWidgetState: hf.clearWidgetState.bind(hf),
  clearAllWidgetStates: hf.clearAllWidgetStates.bind(hf),
  getHUDEditorOffset: hf.getHUDEditorOffset.bind(hf),
  setHUDEditorOffset: hf.setHUDEditorOffset.bind(hf),
  getPOIsToHide: hf.getPOIsToHide.bind(hf),
  setPOITypeVisibility: hf.setPOITypeVisibility.bind(hf),
  getGroupPOIsToHide: hf.getGroupPOIsToHide.bind(hf),
  setGroupPOITypeVisibility: hf.setGroupPOITypeVisibility.bind(hf),
  getMinimapState: hf.getMinimapState.bind(hf),
  setMinimapState: hf.setMinimapState.bind(hf),
  getNameplateStyle: hf.getNameplateStyle.bind(hf),
  setNameplateStyle: hf.setNameplateStyle.bind(hf),
  getPartyLayout: hf.getPartyLayout.bind(hf),
  setPartyLayout: hf.setPartyLayout.bind(hf),
  getUIScale: hf.getUIScale.bind(hf),
  setUIScale: hf.setUIScale.bind(hf),
  getShowGameInfoAtStartup: hf.getShowGameInfoAtStartup.bind(hf),
  setShowGameInfoAtStartup: hf.setShowGameInfoAtStartup.bind(hf),
  bindPartyLayoutChangedListener: hf.bindPartyLayoutChangedListener.bind(hf),
  bindUIScaleChangedListener: hf.bindUIScaleChangedListener.bind(hf),
  setCursorOverrideURL: hf.setCursorOverrideURL.bind(hf),
  // Inventory
  bindInventoryUpdatedListener: ivf.bindInventoryUpdatedListener.bind(ivf),
  performItemAction: ivf.performItemAction.bind(ivf),
  useInventoryItem: ivf.useInventoryItem.bind(ivf),
  moveItem: ivf.moveItem.bind(ivf),
  setContainerColor: ivf.setContainerColor.bind(ivf),
  // Keybinds
  getKeybindSetIDs: kbf.getKeybindSetIDs.bind(kbf),
  setKeybindSetIDs: kbf.setKeybindSetIDs.bind(kbf),
  getKeybindSet: kbf.getKeybindSet.bind(kbf),
  removeKeybindSet: kbf.removeKeybindSet.bind(kbf),
  setKeybindSet: kbf.setKeybindSet.bind(kbf),
  getKeybindSetKey: kbf.getKeybindSetKey.bind(kbf),
  // NetworkFunctions
  bindConnectionStatusListener: nf.bindConnectionStatusListener.bind(nf),
  bindConnectionTargetsListener: nf.bindConnectionTargetsListener.bind(nf),
  bindLoadingPhaseListener: nf.bindLoadingPhaseListener.bind(nf),
  bindNetworkFailureListener: nf.bindNetworkFailureListener.bind(nf),
  isOfflineMode: nf.isOfflineMode.bind(nf),
  connect: nf.connect.bind(nf),
  disconnect: nf.disconnect.bind(nf),
  // Party
  bindPartyListener: pf.bindPartyListener.bind(pf),
  // PerformanceWarnings
  bindPerformanceWarningsListener: pwf.bindPerformanceWarningsListener.bind(pwf),
  // Progression
  applySpecAllocation: progf.applySpecAllocation.bind(progf),
  // Quests
  bindQuestsUpdatedListener: qf.bindQuestsUpdatedListener.bind(qf),
  turnInQuest: qf.turnInQuest.bind(qf),
  getLoggedQuestIDs: qf.getLoggedQuestIDs.bind(qf),
  addLoggedQuestID: qf.addLoggedQuestID.bind(qf),
  removeLoggedQuestID: qf.removeLoggedQuestID.bind(qf),
  getTrackedQuestIDs: qf.getTrackedQuestIDs.bind(qf),
  addTrackedQuestID: qf.addTrackedQuestID.bind(qf),
  removeTrackedQuestID: qf.removeTrackedQuestID.bind(qf),
  getAutoTrackedQuestIDs: qf.getAutoTrackedQuestIDs.bind(qf),
  addAutoTrackedQuestID: qf.addAutoTrackedQuestID.bind(qf),
  removeAutoTrackedQuestID: qf.removeAutoTrackedQuestID.bind(qf),
  // Render
  renderPaperDoll: srf.renderPaperDoll.bind(srf),
  deletePaperDoll: srf.deletePaperDoll.bind(srf),
  pauseAllPaperDollExcept: srf.pauseAllPaperDollExcept.bind(srf),
  // Trade
  bindTradeInviteAddedListener: stf.bindTradeInviteAddedListener.bind(stf),
  bindTradeInviteRemovedListener: stf.bindTradeInviteRemovedListener.bind(stf),
  bindTradeErrorListener: stf.bindTradeErrorListener.bind(stf),
  bindTradeSuccessListener: stf.bindTradeSuccessListener.bind(stf),
  bindTradeCanceledListener: stf.bindTradeCanceledListener.bind(stf),
  bindTradeTargetLeftListener: stf.bindTradeTargetLeftListener.bind(stf),
  bindTradeUpdatedListener: stf.bindTradeUpdatedListener.bind(stf),
  sendTradeInvite: stf.sendTradeInvite.bind(stf),
  revokeTradeInvite: stf.revokeTradeInvite.bind(stf),
  acceptTradeInvite: stf.acceptTradeInvite.bind(stf),
  rejectTradeInvite: stf.rejectTradeInvite.bind(stf),
  moveTradeItem: stf.moveTradeItem.bind(stf),
  confirmTradeItems: stf.confirmTradeItems.bind(stf),
  cancelTrade: stf.cancelTrade.bind(stf),
  // System
  openBrowser: sysf.openBrowser.bind(sysf),
  quit: sysf.quit.bind(sysf),
  reloadUI: sysf.reloadUI.bind(sysf),
  requestAddImageToCache: sysf.requestAddImageToCache.bind(sysf),
  requestRemoveImageFromCache: sysf.requestRemoveImageFromCache.bind(sysf),
  // View
  setInitializationComplete: vf.setInitializationComplete.bind(vf),
  bindShowWidgetListener: vf.bindShowWidgetListener.bind(vf),
  bindHideWidgetListener: vf.bindHideWidgetListener.bind(vf),
  bindToggleWidgetListener: vf.bindToggleWidgetListener.bind(vf),
  requestTextInput: vf.requestTextInput.bind(vf),
  // Warband
  bindWarbandListener: wf.bindWarbandListener.bind(wf)
};

export const mockEvents: MainScreenClientMocks = {
  // Ability
  triggerAbilityActivated: abf.triggerAbilityActivated.bind(abf),
  triggerAbilityEditStatus: abf.triggerAbilityEditStatus.bind(abf),
  triggerAbilityGroupUpdated: abf.triggerAbilityGroupUpdated.bind(abf),
  triggerAbilityStatusUpdated: abf.triggerAbilityStatusUpdated.bind(abf),
  triggerButtonLayoutUpdated: abf.triggerButtonLayoutUpdated.bind(abf),
  // Animation
  clearMockAnimationData: ani.clearMockAnimationData.bind(ani),
  setMockAnimationData: ani.setMockAnimationData.bind(ani),
  // Announcement
  triggerAnnouncement: anf.triggerAnnouncement.bind(anf),
  // Auth
  triggerCharacterUpdated: auth.triggerCharacterUpdated.bind(auth),
  // BuildMode
  triggerBuildingModeChanged: bmf.triggerBuildingModeChanged.bind(bmf),
  triggerItemPlacementModeChanged: bmf.triggerItemPlacementModeChanged.bind(bmf),
  triggerItemPlacementCommit: bmf.triggerItemPlacementCommit.bind(bmf),
  // Crafting
  triggerCraftingError: cf.triggerCraftingError.bind(cf),
  triggerCraftingUpdated: cf.triggerCraftingUpdated.bind(cf),
  triggerCraftingOpened: cf.triggerCraftingOpened.bind(cf),
  // Defs
  triggerCharacterClassDefsLoaded: df.triggerCharacterClassDefsLoaded.bind(df),
  triggerCharacterRaceDefsLoaded: df.triggerCharacterRaceDefsLoaded.bind(df),
  triggerManifestDefsLoaded: df.triggerManifestDefsLoaded.bind(df),
  // Guild
  triggerGuildUpdated: gf.triggerGuildUpdated.bind(gf),
  // Inventory
  triggerInventoryUpdated: ivf.triggerInventoryUpdated.bind(ivf),
  // Network
  triggerConnectionStatus: nf.triggerConnectionStatus.bind(nf),
  triggerConnectionTargets: nf.triggerConnectionTargets.bind(nf),
  triggerLoadingPhase: nf.triggerLoadingPhase.bind(nf),
  triggerNetworkFailure: nf.triggerNetworkFailure.bind(nf),
  // Party
  triggerPartyUpdated: pf.triggerPartyUpdated.bind(pf),
  // PerformanceWarnings
  triggerPerformanceWarnings: pwf.triggerPerformanceWarnings.bind(pwf),
  // Quests
  triggerQuestsUpdated: qf.triggerQuestsUpdated.bind(qf),
  // Trade
  triggerTradeInviteAdded: stf.triggerTradeInviteAdded.bind(stf),
  triggerTradeInviteRemoved: stf.triggerTradeInviteRemoved.bind(stf),
  triggerTradeError: stf.triggerTradeError.bind(stf),
  triggerTradeSuccess: stf.triggerTradeSuccess.bind(stf),
  triggerTradeCanceled: stf.triggerTradeCanceled.bind(stf),
  triggerTradeTargetLeft: stf.triggerTradeTargetLeft.bind(stf),
  triggerTradeUpdated: stf.triggerTradeUpdated.bind(stf),
  // View
  triggerShowWidget: vf.triggerShowWidget.bind(vf),
  triggerHideWidget: vf.triggerHideWidget.bind(vf),
  triggerToggleWidget: vf.triggerToggleWidget.bind(vf),
  // Warband
  triggerWarbandUpdated: wf.triggerWarbandUpdated.bind(wf)
};
