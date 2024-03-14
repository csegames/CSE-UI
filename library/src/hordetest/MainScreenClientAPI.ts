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
  ClientPerformanceFunctions,
  ClientPerformanceMocks,
  impl as cf
} from '../_baseGame/clientFunctions/PerformanceFunctions';
import { MatchFunctions, MatchMocks, impl as mf } from './clientFunctions/MatchFunctions';
import { VersionFunctions, impl as ver } from '../_baseGame/clientFunctions/VersionFunctions';
import { VoiceChatFunctions, VoiceChatMocks, impl as vc } from '../_baseGame/clientFunctions/VoiceChatFunctions';
import { NetworkFunctions, NetworkEventMocks, impl as nf } from '../_baseGame/clientFunctions/NetworkFunctions';

const abilityUnsupported = () => console.warn('Ability requests are not currently supported in Final Stand: Ragnarok');
const createUnsupported = () => {
  console.warn('Ability requests are not currently supported in Final Stand: Ragnarok');
  return Promise.resolve(0);
};

const ef = create<BaseEntityStateModel>();

export type MainScreenClientAPI = AbilityFunctions &
  AnnouncementFunctions &
  ClientPerformanceFunctions &
  DebugSessionFunctions &
  DefFunctions &
  EntityFunctions<BaseEntityStateModel> &
  EntityDirectionFunctions &
  LoadingScreenFunctions &
  MatchFunctions &
  NetworkFunctions &
  ObjectiveDetailFunctions &
  SelfPlayerFunctions &
  VersionFunctions &
  ViewFunctions &
  VoiceChatFunctions;

export type MainScreenClientMocks = AbilityMocks &
  AnnouncementMocks &
  ClientPerformanceMocks &
  DebugSessionMocks &
  DefMocks &
  EntityMocks<BaseEntityStateModel> &
  EntityDirectionMocks &
  MatchMocks &
  NetworkEventMocks &
  ObjectiveDetailMocks &
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
  // Announcement
  bindAnnouncementListener: af.bindAnnouncementListener.bind(af),
  // ClientPerformance
  bindClientPerformanceListener: cf.bindClientPerformanceListener.bind(cf),
  // DebugSession
  bindDebugSessionConfigListener: dsf.bindDebugSessionConfigListener.bind(dsf),
  // Defs
  bindAbilityDisplayDefsListener: df.bindAbilityDisplayDefsListener.bind(df),
  bindCharacterClassDefsListener: df.bindCharacterClassDefsListener.bind(df),
  bindCharacterRaceDefsListener: df.bindCharacterRaceDefsListener.bind(df),
  bindStatusDefsListener: df.bindStatusDefsListener.bind(df),
  // Entity
  bindEntityContextListener: ef.bindEntityContextListener.bind(ef),
  bindEntityRemovedListener: ef.bindEntityRemovedListener.bind(ef),
  bindEntityUpdatedListener: ef.bindEntityUpdatedListener.bind(ef),
  bindEntityShowItemActionsListener: ef.bindEntityShowItemActionsListener.bind(ef),
  // EntityDirection
  bindEntityDirectionListener: pdf.bindEntityDirectionListener.bind(pdf),
  // LoadingScreen
  bindLoadingScreenListener: lf.bindLoadingScreenListener.bind(lf),
  clearManualLoadingScreen: lf.clearManualLoadingScreen.bind(lf),
  setLoadingScreenManually: lf.setLoadingScreenManually.bind(lf),
  // Match
  bindDefaultQueueListener: mf.bindDefaultQueueListener.bind(mf),
  // Network
  bindNetworkFailureListener: nf.bindNetworkFailureListener.bind(nf),
  // ObjectiveDetails
  bindObjectiveDetailListener: odf.bindObjectiveDetailListener.bind(odf),
  // SelfPlayer
  bindSelfPlayerStateListener: spf.bindSelfPlayerStateListener.bind(spf),
  // Version
  getBuildNumber: ver.getBuildNumber.bind(ver),
  // View
  bindNavigateListener: vf.bindNavigateListener.bind(vf),
  setInitializationComplete: vf.setInitializationComplete.bind(vf),
  // VoiceChat
  bindVoiceChatMemberUpdatedListener: vc.bindVoiceChatMemberUpdatedListener.bind(vc),
  bindVoiceChatMemberRemovedListener: vc.bindVoiceChatMemberRemovedListener.bind(vc),
  setVoiceChatMemberMuted: vc.setVoiceChatMemberMuted.bind(vc)
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
  // ClientPerformance
  triggerClientPerformanceStats: cf.triggerClientPerformanceStats.bind(cf),
  // DebugSession
  triggerDebugSessionConfigUpdated: dsf.triggerDebugSessionConfigUpdated.bind(dsf),
  // Defs
  triggerAbilityDisplayDefsLoaded: df.triggerAbilityDisplayDefsLoaded.bind(df),
  triggerCharacterClassDefsLoaded: df.triggerCharacterClassDefsLoaded.bind(df),
  triggerCharacterRaceDefsLoaded: df.triggerCharacterRaceDefsLoaded.bind(df),
  triggerStatusDefsLoaded: df.triggerStatusDefsLoaded.bind(df),
  // Entity
  triggerEntityContext: ef.triggerEntityContext.bind(ef),
  triggerEntityRemoved: ef.triggerEntityRemoved.bind(ef),
  triggerEntityUpdated: ef.triggerEntityUpdated.bind(ef),
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
  triggerVoiceChatMemberRemoved: vc.triggerVoiceChatMemberRemoved.bind(vc)
};
