/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AbilityFunctions, AbilityMocks, impl as abf } from '../_baseGame/clientFunctions/AbilityFunctions';
import { AnimationFunctions, AnimationMocks, impl as ani } from '../_baseGame/clientFunctions/AnimationFunctions';
import {
  AnnouncementFunctions,
  AnnouncementMocks,
  impl as af
} from '../_baseGame/clientFunctions/AnnouncementFunctions';
import { DebugHintFunctions, impl as dhf } from '../_baseGame/clientFunctions/DebugHintFunctions';
import {
  DebugSessionFunctions,
  DebugSessionMocks,
  impl as dsf
} from '../_baseGame/clientFunctions/DebugSessionFunctions';
import { DefFunctions, DefMocks, impl as df } from '../_baseGame/clientFunctions/DefFunctions';
import { EntityFunctions, EntityMocks, create } from '../_baseGame/clientFunctions/EntityFunctions';
import {
  ObjectiveDetailFunctions,
  ObjectiveDetailMocks,
  impl as odf
} from '../_baseGame/clientFunctions/ObjectiveDetailFunctions';
import { ViewFunctions, ViewEventMocks, impl as vf } from '../_baseGame/clientFunctions/ViewFunctions';
import { BaseEntityState } from './game/GameClientModels/EntityState';
import {
  PerformanceWarningsFunctions,
  PerformanceWarningsMocks,
  impl as pwf
} from '../_baseGame/clientFunctions/PerformanceWarningsFunctions';
import { MatchFunctions, MatchMocks, impl as mf } from './clientFunctions/MatchFunctions';
import { VersionFunctions, impl as ver } from '../_baseGame/clientFunctions/VersionFunctions';
import { VoiceChatFunctions, VoiceChatMocks, impl as vc } from '../_baseGame/clientFunctions/VoiceChatFunctions';
import { NetworkFunctions, NetworkEventMocks, impl as nf } from '../_baseGame/clientFunctions/NetworkFunctions';
import { AudioFunctions, AudioMocks, impl as audf } from '../_baseGame/clientFunctions/AudioFunctions';
import { SystemFunctions, impl as sysf } from '../_baseGame/clientFunctions/SystemFunctions';
import { BattlePassFunctions, BattlePassMocks, impl as bpf } from './clientFunctions/BattlePassFunctions';
import { StoreFunctions, StoreMocks, impl as sf } from './clientFunctions/StoreFunctions';
import { LobbyFunctions, LobbyMocks, impl as lbf } from './clientFunctions/LobbyFunctions';
import { RuneModsFunctions, RuneModsMocks, impl as rmf } from './clientFunctions/RuneModsFunctions';
import { ProgressionFunctions, ProgressionMocks, impl as progf } from './clientFunctions/ProgressionFunctions';
import { TempEntityFunctions, TempEntityMocks, impl as tef } from './clientFunctions/TempEntityFunctions';

const abilityUnsupported = () => console.warn('Ability requests are not currently supported in Final Stand: Ragnarok');
const createUnsupported = () => {
  console.warn('Ability requests are not currently supported in Final Stand: Ragnarok');
  return Promise.resolve(0);
};

const ef = create<BaseEntityState>();

export type MainScreenClientAPI = AbilityFunctions &
  AnimationFunctions &
  AudioFunctions &
  AnnouncementFunctions &
  BattlePassFunctions &
  DebugHintFunctions &
  DebugSessionFunctions &
  DefFunctions &
  EntityFunctions<BaseEntityState> &
  LobbyFunctions &
  MatchFunctions &
  NetworkFunctions &
  ObjectiveDetailFunctions &
  PerformanceWarningsFunctions &
  ProgressionFunctions &
  RuneModsFunctions &
  StoreFunctions &
  SystemFunctions &
  TempEntityFunctions &
  VersionFunctions &
  ViewFunctions &
  VoiceChatFunctions;

export type MainScreenClientMocks = AbilityMocks &
  AnimationMocks &
  AudioMocks &
  AnnouncementMocks &
  BattlePassMocks &
  DebugSessionMocks &
  DefMocks &
  EntityMocks<BaseEntityState> &
  LobbyMocks &
  MatchMocks &
  NetworkEventMocks &
  ObjectiveDetailMocks &
  PerformanceWarningsMocks &
  ProgressionMocks &
  RuneModsMocks &
  StoreMocks &
  TempEntityMocks &
  ViewEventMocks &
  VoiceChatMocks;

export const clientAPI: MainScreenClientAPI = {
  // Ability
  bindAbilityActivatedListener: abf.bindAbilityActivatedListener.bind(abf),
  bindAbilityEditStatusListener: abf.bindAbilityEditStatusListener.bind(abf),
  bindAbilityGroupUpdatedListener: abf.bindAbilityGroupUpdatedListener.bind(abf),
  bindAbilityGroupDeletedListener: abf.bindAbilityGroupDeletedListener.bind(abf),
  bindAbilityStatusUpdatedListener: abf.bindAbilityStatusUpdatedListener.bind(abf),
  bindButtonLayoutUpdatedListener: abf.bindButtonLayoutUpdatedListener.bind(abf),
  bindButtonLayoutDeletedListener: abf.bindButtonLayoutDeletedListener.bind(abf),
  requestEditMode: abilityUnsupported,
  resetAllAbilitiesToDefaults: abilityUnsupported,
  createAbilityLayout: createUnsupported,
  deleteAbilityLayout: abilityUnsupported,
  selectAbilityLayoutGroup: abilityUnsupported,
  selectAbilityLayoutGroupCycle: abilityUnsupported,
  selectNextAbilityLayoutGroup: abilityUnsupported,
  selectPrevAbilityLayoutGroup: abilityUnsupported,
  createAbilityGroup: createUnsupported,
  deleteAbilityGroup: abilityUnsupported,
  renameAbilityGroup: abilityUnsupported,
  setVisibleAbilitySlots: abilityUnsupported,
  clearAbility: abilityUnsupported,
  executeAbility: abf.executeAbility.bind(abf),
  moveAbility: abilityUnsupported,
  setAbility: abilityUnsupported,
  // Animation
  startAnimation: ani.startAnimation.bind(ani),
  // Audio
  playGameSound: audf.playGameSound.bind(audf),
  playVolumeFeedback: audf.playVolumeFeedback.bind(audf),
  setUIClassState: audf.setUIClassState.bind(audf),
  setUIFactionState: audf.setUIFactionState.bind(audf),
  setUIGenderState: audf.setUIGenderState.bind(audf),
  setUIRaceState: audf.setUIRaceState.bind(audf),
  startGameSound: audf.startGameSound.bind(audf),
  // Announcement
  bindAnnouncementListener: af.bindAnnouncementListener.bind(af),
  // Battle Pass
  getLastSplashedBattlePassID: bpf.getLastSplashedBattlePassID.bind(bpf),
  getLastEndedBattlePassID: bpf.getLastEndedBattlePassID.bind(bpf),
  setLastSplashedBattlePassID: bpf.setLastSplashedBattlePassID.bind(bpf),
  setLastEndedBattlePassID: bpf.setLastEndedBattlePassID.bind(bpf),
  getLastSeenFreeBattlePassID: bpf.getLastSeenFreeBattlePassID.bind(bpf),
  setLastSeenFreeBattlePassID: bpf.setLastSeenFreeBattlePassID.bind(bpf),
  getLastSeenBattlePassID: bpf.getLastSeenBattlePassID.bind(bpf),
  setLastSeenBattlePassID: bpf.setLastSeenBattlePassID.bind(bpf),
  // DebugHintFunctions
  getDebugHints: dhf.getDebugHints.bind(dhf),
  // DebugSession
  bindDebugSessionConfigListener: dsf.bindDebugSessionConfigListener.bind(dsf),
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
  // Lobby
  getHasClickedInvite: lbf.getHasClickedInvite.bind(lbf),
  setHasClickedInvite: lbf.setHasClickedInvite.bind(lbf),
  getSeenMOTDs: lbf.getSeenMOTDs.bind(lbf),
  setSeenMOTD: lbf.setSeenMOTD.bind(lbf),
  // Match
  bindDefaultQueueListener: mf.bindDefaultQueueListener.bind(mf),
  // Network
  bindConnectionStatusListener: nf.bindConnectionStatusListener.bind(nf),
  bindConnectionTargetsListener: nf.bindConnectionTargetsListener.bind(nf),
  bindLoadingPhaseListener: nf.bindLoadingPhaseListener.bind(nf),
  bindNetworkFailureListener: nf.bindNetworkFailureListener.bind(nf),
  isOfflineMode: nf.isOfflineMode.bind(nf),
  connect: nf.connect.bind(nf),
  disconnect: nf.disconnect.bind(nf),
  // ObjectiveDetails
  bindObjectiveDetailListener: odf.bindObjectiveDetailListener.bind(odf),
  // PerformanceWarnings
  bindPerformanceWarningsListener: pwf.bindPerformanceWarningsListener.bind(pwf),
  // Progression
  getSeenProgressionNodesForChampion: progf.getSeenProgressionNodesForChampion.bind(progf),
  setSeenProgressionNodesForChampion: progf.setSeenProgressionNodesForChampion.bind(progf),
  getUnseenUnlockedProgressionNodesForChampion: progf.getUnseenUnlockedProgressionNodesForChampion.bind(progf),
  setUnseenUnlockedProgressionNodesForChampion: progf.setUnseenUnlockedProgressionNodesForChampion.bind(progf),
  // RuneMods
  getHasSeenRuneModsTutorial: rmf.getHasSeenRuneModsTutorial.bind(rmf),
  setHasSeenRuneModsTutorial: rmf.setHasSeenRuneModsTutorial.bind(rmf),
  // Store
  getUnseenEquipment: sf.getUnseenEquipment.bind(sf),
  setUnseenEquipment: sf.setUnseenEquipment.bind(sf),
  getSeenPurchases: sf.getSeenPurchases.bind(sf),
  setSeenPurchases: sf.setSeenPurchases.bind(sf),
  getTextChatBlocks: sf.getTextChatBlocks.bind(sf),
  setTextChatBlocks: sf.setTextChatBlocks.bind(sf),
  // System
  openBrowser: sysf.openBrowser.bind(sysf),
  quit: sysf.quit.bind(sysf),
  reloadUI: sysf.reloadUI.bind(sysf),
  requestAddImageToCache: sysf.requestAddImageToCache.bind(sysf),
  requestRemoveImageFromCache: sysf.requestRemoveImageFromCache.bind(sysf),
  // TempEntity
  bindConsumeablesListener: tef.bindConsumeablesListener.bind(tef),
  bindEntityDirectionListener: tef.bindEntityDirectionListener.bind(tef),
  // Version
  getBuildNumber: ver.getBuildNumber.bind(ver),
  // View
  bindShowWidgetListener: vf.bindShowWidgetListener.bind(vf),
  bindHideWidgetListener: vf.bindHideWidgetListener.bind(vf),
  bindToggleWidgetListener: vf.bindToggleWidgetListener.bind(vf),
  setInitializationComplete: vf.setInitializationComplete.bind(vf),
  requestTextInput: vf.requestTextInput.bind(vf),
  // VoiceChat
  bindVoiceChatMemberUpdatedListener: vc.bindVoiceChatMemberUpdatedListener.bind(vc),
  bindVoiceChatMemberRemovedListener: vc.bindVoiceChatMemberRemovedListener.bind(vc),
  bindVoiceChatScopeUpdateListener: vc.bindVoiceChatScopeUpdateListener.bind(vc),
  setVoiceChatMemberMuted: vc.setVoiceChatMemberMuted.bind(vc),
  setVoiceChannel: vc.setVoiceChannel.bind(vc)
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
  triggerAnnouncement: af.triggerAnnouncement.bind(af),
  // DebugSession
  triggerDebugSessionConfigUpdated: dsf.triggerDebugSessionConfigUpdated.bind(dsf),
  // Defs
  triggerCharacterClassDefsLoaded: df.triggerCharacterClassDefsLoaded.bind(df),
  triggerCharacterRaceDefsLoaded: df.triggerCharacterRaceDefsLoaded.bind(df),
  triggerManifestDefsLoaded: df.triggerManifestDefsLoaded.bind(df),
  // Entity
  triggerEntityContext: ef.triggerEntityContext.bind(ef),
  triggerEntityRemoved: ef.triggerEntityRemoved.bind(ef),
  triggerEntityUpdated: ef.triggerEntityUpdated.bind(ef),
  // MatchDetails
  triggerDefaultQueue: mf.triggerDefaultQueue.bind(mf),
  // Network
  triggerConnectionStatus: nf.triggerConnectionStatus.bind(nf),
  triggerConnectionTargets: nf.triggerConnectionTargets.bind(nf),
  triggerLoadingPhase: nf.triggerLoadingPhase.bind(nf),
  triggerNetworkFailure: nf.triggerNetworkFailure.bind(nf),
  // ObjectiveDetails
  triggerObjectiveDetails: odf.triggerObjectiveDetails.bind(odf),
  // PerformanceWarnings
  triggerPerformanceWarnings: pwf.triggerPerformanceWarnings.bind(pwf),
  // TempEntity
  triggerConsumables: tef.triggerConsumables.bind(tef),
  triggerEntityDirections: tef.triggerEntityDirections.bind(tef),
  // View
  triggerShowWidget: vf.triggerShowWidget.bind(vf),
  triggerHideWidget: vf.triggerHideWidget.bind(vf),
  triggerToggleWidget: vf.triggerToggleWidget.bind(vf),
  // VoiceChat
  triggerVoiceChatMemberUpdated: vc.triggerVoiceChatMemberUpdated.bind(vc),
  triggerVoiceChatMemberRemoved: vc.triggerVoiceChatMemberRemoved.bind(vc)
};
