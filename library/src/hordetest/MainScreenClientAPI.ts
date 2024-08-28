/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AbilityFunctions, AbilityMocks, impl as abf } from '../_baseGame/clientFunctions/AbilityFunctions';
import {
  AnnouncementFunctions,
  AnnouncementMocks,
  impl as af
} from '../_baseGame/clientFunctions/AnnouncementFunctions';
import {
  DebugSessionFunctions,
  DebugSessionMocks,
  impl as dsf
} from '../_baseGame/clientFunctions/DebugSessionFunctions';
import { DefFunctions, DefMocks, impl as df } from '../_baseGame/clientFunctions/DefFunctions';
import { EntityFunctions, EntityMocks, create } from '../_baseGame/clientFunctions/EntityFunctions';
import { LoadingScreenFunctions, impl as lf } from '../_baseGame/clientFunctions/LoadingScreenFunctions';
import {
  ObjectiveDetailFunctions,
  ObjectiveDetailMocks,
  impl as odf
} from '../_baseGame/clientFunctions/ObjectiveDetailFunctions';
import { SelfPlayerFunctions, impl as spf } from '../_baseGame/clientFunctions/SelfPlayerFunctions';
import {
  EntityDirectionFunctions,
  EntityDirectionMocks,
  impl as pdf
} from './clientFunctions/EntityDirectionFunctions';
import { ViewFunctions, ViewEventMocks, impl as vf } from '../_baseGame/clientFunctions/ViewFunctions';
import { BaseEntityStateModel } from './game/GameClientModels/EntityState';
import {
  WarningIconsFunctions,
  WarningIconsMocks,
  impl as cf
} from '../_baseGame/clientFunctions/WarningIconsFunctions';
import { MatchFunctions, MatchMocks, impl as mf } from './clientFunctions/MatchFunctions';
import { VersionFunctions, impl as ver } from '../_baseGame/clientFunctions/VersionFunctions';
import { VoiceChatFunctions, VoiceChatMocks, impl as vc } from '../_baseGame/clientFunctions/VoiceChatFunctions';
import { NetworkFunctions, NetworkEventMocks, impl as nf } from '../_baseGame/clientFunctions/NetworkFunctions';
import { AudioFunctions, AudioMocks, impl as audf } from '../_baseGame/clientFunctions/AudioFunctions';
import { SystemFunctions, SystemMocks, impl as sysf } from '../_baseGame/clientFunctions/SystemFunctions';
import { BattlePassFunctions, BattlePassMocks, impl as bpf } from './clientFunctions/BattlePassFunctions';
import { StoreFunctions, StoreMocks, impl as sf } from './clientFunctions/StoreFunctions';
import { LobbyFunctions, LobbyMocks, impl as lbf } from './clientFunctions/LobbyFunctions';
import { RuneModsFunctions, RuneModsMocks, impl as rmf } from './clientFunctions/RuneModsFunctions';
import { ProgressionFunctions, ProgressionMocks, impl as progf } from './clientFunctions/ProgressionFunctions';

const abilityUnsupported = () => console.warn('Ability requests are not currently supported in Final Stand: Ragnarok');
const createUnsupported = () => {
  console.warn('Ability requests are not currently supported in Final Stand: Ragnarok');
  return Promise.resolve(0);
};

const ef = create<BaseEntityStateModel>();

export type MainScreenClientAPI = AbilityFunctions &
  AudioFunctions &
  AnnouncementFunctions &
  BattlePassFunctions &
  DebugSessionFunctions &
  DefFunctions &
  EntityFunctions<BaseEntityStateModel> &
  EntityDirectionFunctions &
  LoadingScreenFunctions &
  LobbyFunctions &
  MatchFunctions &
  NetworkFunctions &
  ObjectiveDetailFunctions &
  ProgressionFunctions &
  RuneModsFunctions &
  SelfPlayerFunctions &
  StoreFunctions &
  SystemFunctions &
  VersionFunctions &
  ViewFunctions &
  VoiceChatFunctions &
  WarningIconsFunctions;

export type MainScreenClientMocks = AbilityMocks &
  AudioMocks &
  AnnouncementMocks &
  BattlePassMocks &
  DebugSessionMocks &
  DefMocks &
  EntityMocks<BaseEntityStateModel> &
  EntityDirectionMocks &
  LobbyMocks &
  MatchMocks &
  NetworkEventMocks &
  ObjectiveDetailMocks &
  ProgressionMocks &
  RuneModsMocks &
  StoreMocks &
  SystemMocks &
  ViewEventMocks &
  VoiceChatMocks &
  WarningIconsMocks;

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
  // Audio
  playGameSound: audf.playGameSound.bind(audf),
  playVolumeFeedback: audf.playVolumeFeedback.bind(audf),
  setUIRaceState: audf.setUIRaceState.bind(audf),
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
  // DebugSession
  bindDebugSessionConfigListener: dsf.bindDebugSessionConfigListener.bind(dsf),
  // Defs
  bindAbilityDisplayDefsListener: df.bindAbilityDisplayDefsListener.bind(df),
  bindCharacterClassDefsListener: df.bindCharacterClassDefsListener.bind(df),
  bindCharacterRaceDefsListener: df.bindCharacterRaceDefsListener.bind(df),
  bindManifestDefsListener: df.bindManifestDefsListener.bind(df),
  // Entity
  bindEntityContextListener: ef.bindEntityContextListener.bind(ef),
  bindEntityRemovedListener: ef.bindEntityRemovedListener.bind(ef),
  bindEntityUpdatedListener: ef.bindEntityUpdatedListener.bind(ef),
  bindEntityPositionMapUpdatedListener: ef.bindEntityPositionMapUpdatedListener.bind(ef),
  bindEntityShowItemActionsListener: ef.bindEntityShowItemActionsListener.bind(ef),
  // EntityDirection
  bindEntityDirectionListener: pdf.bindEntityDirectionListener.bind(pdf),
  // LoadingScreen
  bindLoadingScreenListener: lf.bindLoadingScreenListener.bind(lf),
  clearManualLoadingScreen: lf.clearManualLoadingScreen.bind(lf),
  setLoadingScreenManually: lf.setLoadingScreenManually.bind(lf),
  // Lobby
  getHasClickedInvite: lbf.getHasClickedInvite.bind(lbf),
  setHasClickedInvite: lbf.setHasClickedInvite.bind(lbf),
  getSeenMOTDs: lbf.getSeenMOTDs.bind(lbf),
  setSeenMOTD: lbf.setSeenMOTD.bind(lbf),
  // Match
  bindDefaultQueueListener: mf.bindDefaultQueueListener.bind(mf),
  // Network
  bindNetworkFailureListener: nf.bindNetworkFailureListener.bind(nf),
  // ObjectiveDetails
  bindObjectiveDetailListener: odf.bindObjectiveDetailListener.bind(odf),
  // Progression
  getSeenProgressionNodesForChampion: progf.getSeenProgressionNodesForChampion.bind(progf),
  setSeenProgressionNodesForChampion: progf.setSeenProgressionNodesForChampion.bind(progf),
  getUnseenUnlockedProgressionNodesForChampion: progf.getUnseenUnlockedProgressionNodesForChampion.bind(progf),
  setUnseenUnlockedProgressionNodesForChampion: progf.setUnseenUnlockedProgressionNodesForChampion.bind(progf),
  // RuneMods
  getHasSeenRuneModsTutorial: rmf.getHasSeenRuneModsTutorial.bind(rmf),
  setHasSeenRuneModsTutorial: rmf.setHasSeenRuneModsTutorial.bind(rmf),
  // SelfPlayer
  bindSelfPlayerStateListener: spf.bindSelfPlayerStateListener.bind(spf),
  // Store
  getUnseenEquipment: sf.getUnseenEquipment.bind(sf),
  setUnseenEquipment: sf.setUnseenEquipment.bind(sf),
  getSeenPurchases: sf.getSeenPurchases.bind(sf),
  setSeenPurchases: sf.setSeenPurchases.bind(sf),
  getTextChatBlocks: sf.getTextChatBlocks.bind(sf),
  setTextChatBlocks: sf.setTextChatBlocks.bind(sf),
  // System
  openBrowser: sysf.openBrowser.bind(sysf),
  // Version
  getBuildNumber: ver.getBuildNumber.bind(ver),
  // View
  bindNavigateListener: vf.bindNavigateListener.bind(vf),
  setInitializationComplete: vf.setInitializationComplete.bind(vf),
  // VoiceChat
  bindVoiceChatMemberUpdatedListener: vc.bindVoiceChatMemberUpdatedListener.bind(vc),
  bindVoiceChatMemberRemovedListener: vc.bindVoiceChatMemberRemovedListener.bind(vc),
  setVoiceChatMemberMuted: vc.setVoiceChatMemberMuted.bind(vc),
  setVoiceChannel: vc.setVoiceChannel.bind(vc),
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
  triggerAnnouncement: af.triggerAnnouncement.bind(af),
  // DebugSession
  triggerDebugSessionConfigUpdated: dsf.triggerDebugSessionConfigUpdated.bind(dsf),
  // Defs
  triggerAbilityDisplayDefsLoaded: df.triggerAbilityDisplayDefsLoaded.bind(df),
  triggerCharacterClassDefsLoaded: df.triggerCharacterClassDefsLoaded.bind(df),
  triggerCharacterRaceDefsLoaded: df.triggerCharacterRaceDefsLoaded.bind(df),
  triggerManifestDefsLoaded: df.triggerManifestDefsLoaded.bind(df),
  // Entity
  triggerEntityContext: ef.triggerEntityContext.bind(ef),
  triggerEntityRemoved: ef.triggerEntityRemoved.bind(ef),
  triggerEntityUpdated: ef.triggerEntityUpdated.bind(ef),
  triggerEntityPositionMapUpdated: ef.triggerEntityPositionMapUpdated.bind(ef),
  // EntityDirection
  triggerEntityDirections: pdf.triggerEntityDirections.bind(pdf),
  // MatchDetails
  triggerDefaultQueue: mf.triggerDefaultQueue.bind(mf),
  // NetworkFailure
  triggerNetworkFailure: nf.triggerNetworkFailure.bind(nf),
  // ObjectiveDetails
  triggerObjectiveDetails: odf.triggerObjectiveDetails.bind(odf),
  // View
  triggerNavigate: vf.triggerNavigate.bind(vf),
  // VoiceChat
  triggerVoiceChatMemberUpdated: vc.triggerVoiceChatMemberUpdated.bind(vc),
  triggerVoiceChatMemberRemoved: vc.triggerVoiceChatMemberRemoved.bind(vc),
  // WarningIcons
  triggerWarningIcons: cf.triggerWarningIcons.bind(cf)
};
