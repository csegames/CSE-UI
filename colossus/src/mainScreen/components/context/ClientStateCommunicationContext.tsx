/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * @FIXME @TODO - In order to get this file working with the (much needed) improvements to the library,
 * typesafety-breaking reflection syntax is no longer valid.   To get this working again in the short term,
 * I had to add lots of explicit casts to 'any' which is a "Bad Thing" (TM).  Eventually these casts, and all the others
 * need to be replaced with proper use of accessor methods on classes built around interface types.  --DM
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, Store, Unsubscribe } from 'redux';

import { RootState } from '../../redux/store';
import { updatePlayerDelta } from '../../redux/playerSlice';
import {
  updateUIFPS,
  updateUsingGamepad,
  updateWorldTime,
  updateNPCCount,
  updateIsAutoRunning
} from '../../redux/baseGameSlice';
import {
  addFriend,
  addBoss,
  addObjective,
  clearFriends,
  clearBosses,
  FriendsList,
  EntityList,
  ObjectivesList,
  removeFriend,
  removeBoss,
  removeObjective,
  updateFriend,
  updateBoss,
  updateObjective,
  updatePositions
} from '../../redux/entitiesSlice';
import { updateRunes, RunesState, hideRuneAlert } from '../../redux/runesSlice';
import {
  IDLookupTable,
  updateConsumables,
  updateObjectiveDetails,
  createDefaultItem,
  ObjectiveDetailsList,
  removeObjectiveDetails,
  updatePlayerDirections,
  removePlayerDirections,
  updateEntityDirections,
  removeEntityDirections,
  updateClassDefs,
  updateRaceDefs,
  updateAbilityDisplayDefs
} from '../../redux/gameSlice';
import {
  addDialogueEntry,
  removeDialogueEntryWithID,
  clearDialogueQueue,
  DialogueSoundState
} from '../../redux/announcementsSlice';
import { updateKeybinds, KeybindIDs } from '../../redux/keybindsSlice';
import { hordetest } from '@csegames/library/dist/hordetest';
import { game } from '@csegames/library/dist/_baseGame';
import { UsingGamepadState } from '@csegames/library/dist/_baseGame/GameClientModels/UsingGamepadState';
import { CharacterClassDef, CharacterRaceDef } from '@csegames/library/dist/hordetest/game/types/CharacterDef';
import {
  BaseEntityStateModel,
  EntityPositionMapModel,
  isPlayer,
  PlayerEntityStateModel
} from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { CharacterKind } from '@csegames/library/dist/hordetest/game/types/CharacterKind';
import {
  AnnouncementType,
  RuneType,
  ScenarioRoundState,
  Vec3f
} from '@csegames/library/dist/hordetest/webAPI/definitions';
import { ArrayMap, Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Status } from '@csegames/library/dist/hordetest/game/types/Status';
import { EntityResource } from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { Keybind } from '@csegames/library/dist/_baseGame/types/Keybind';
import { ObjectiveDetailCategory, ObjectiveDetailMessageState } from '@csegames/library/dist/_baseGame/types/Objective';
import { ConsumableItemsStateModel } from '@csegames/library/dist/hordetest/game/GameClientModels/ConsumableItemsState';
import { cloneDeep } from '@csegames/library/dist/_baseGame/utils/objectUtils';
import { updateVoiceChatMember, removeVoiceChatMember } from '../../redux/voiceChatSlice';
import { EntityDirection } from '@csegames/library/dist/hordetest/game/types/EntityDirection';
import { updateSystemMessageReceived } from '../../redux/chatSlice';
import { ItemEntityStateModel, isItem } from '@csegames/library/dist/hordetest/game/GameClientModels/ItemEntityState';
import { LifeState } from '@csegames/library/dist/hordetest/game/types/LifeState';
import {
  Facing2fDegrees,
  SelfPlayerStateModel
} from '@csegames/library/dist/_baseGame/GameClientModels/SelfPlayerState';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { updateAbility, updateAbilityActivated } from '../../redux/abilitySlice';
import { AbilityDisplayDef, AbilityStatus } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit';
import { GameOptionIDs, updateGameOption } from '../../redux/gameOptionsSlice';
import { GameOption } from '@csegames/library/dist/_baseGame/types/Options';
import { VoiceChatMemberSettings } from '@csegames/library/dist/_baseGame/types/VoiceChatMemberSettings';
import { networkConfigurationState } from '../../dataSources/networkConfiguration';

///////////////////////////////////////////////////////////////////

const DIALOGUE_MAX_NUM_MESSAGES_ON_SCREEN = 6;
const DIALOGUE_TIME_BETWEEN_SOUNDS_MS = 500;
const DIALOGUE_MIN_DISPLAY_TIME_MS = 8000;
const RuneAlertDisplayTimeSeconds = 6.0;

interface PendingDialogueMessage {
  id: number;
  dialogueText: string;
  speakerName: string;
  speakerIcon: string;
  soundID: number;
}

interface Props {
  dispatch: Dispatch;
  state?: RootState;
  store?: Store;
}

export const ClientStateCommunicationContext = React.createContext({} /* DefaultClientCommunicationState */);

export class ClientStateCommunicationContextProvider extends React.Component<Props, {}> {
  private eventHandles: { [key: string]: ListenerHandle };
  private intervals: any[] = [];
  private store: Store;
  private stateMirror: RootState;
  private stateChangeUnsubscribe: Unsubscribe;

  // dialogue messages that are not ready to play yet (another one is playing, there are too many currently on screen, etc.)
  private pendingDialogueMessages: PendingDialogueMessage[];
  private activeDialogueMessageCount: number;
  private currentDialogueSoundTimeout: any;
  private nextDialogueMessageID: number;

  constructor(props: Props) {
    super(props);

    this.store = this.props.store;
    this.stateMirror = this.store.getState();

    this.pendingDialogueMessages = [];
    this.activeDialogueMessageCount = 0;
    this.currentDialogueSoundTimeout = null;
    this.nextDialogueMessageID = 1;
  }

  public render(): JSX.Element {
    return null;
  }

  public componentDidMount(): void {
    this.stateChangeUnsubscribe = this.store.subscribe(() => {
      this.stateMirror = this.store.getState();
    });

    this.eventHandles = {
      abilityActivated: clientAPI.bindAbilityActivatedListener(this.handleAbilityActivated.bind(this)),
      abilityDisplayDefs: clientAPI.bindAbilityDisplayDefsListener(this.handleDisplayDefsLoaded.bind(this)),
      abilityStatus: clientAPI.bindAbilityStatusUpdatedListener(this.handleAbilityStatus.bind(this)),
      announcementsState: clientAPI.bindAnnouncementListener(this.handleAnnouncement.bind(this)),
      characterClassDefs: clientAPI.bindCharacterClassDefsListener(this.handleClassDefsLoaded.bind(this)),
      characterRaceDefs: clientAPI.bindCharacterRaceDefsListener(this.handleRaceDefsLoaded.bind(this)),
      consumableState: hordetest.game.consumableItemsState.onUpdated(game)(this.handleConsumableItemsUpdate.bind(this)),
      entityUpdated: hordetest.game.onEntityUpdated(this.handleEntityUpdated.bind(this)),
      entityPositionMapUpdated: clientAPI.bindEntityPositionMapUpdatedListener(
        this.handleEntityPositionMapUpdated.bind(this)
      ),
      entityRemoved: hordetest.game.onEntityRemoved(this.handleEntityRemoved.bind(this)),
      gamepad: game.usingGamepadState.onUpdated(game)(this.handleUsingGamepadStateUpdate.bind(this)),
      isAutoRunning: game.isAutoRunningState.onUpdated(game)(this.handleIsAutoRunning.bind(this)),
      keybinds: game.onKeybindChanged(this.handleKeybindChanged.bind(this)),
      options: game.onGameOptionChanged(this.handleGameOptionChanged.bind(this)),
      objectiveDetails: hordetest.game.onObjectiveDetailsUpdate(this.handleObjectiveDetailsUpdate.bind(this)),
      runes: hordetest.game.onCollectedRunesUpdate(this.handleCollectedRunesUpdated.bind(this)),
      scenarioRoundEnded: hordetest.game.onScenarioRoundEnded(this.handleRoundEnded.bind(this)),
      selfPlayerState: hordetest.game.selfPlayerState.onUpdated(game)(this.handleSelfPlayerStateUpdate.bind(this)),
      ui: game.onReady(this.handleUIInitialized.bind(this)),
      onVoiceChatMemberUpdate: clientAPI.bindVoiceChatMemberUpdatedListener(
        this.handleVoiceChatMemberUpdated.bind(this)
      ),
      onVoiceChatMemberRemoved: clientAPI.bindVoiceChatMemberRemovedListener(
        this.handleVoiceChatMemberRemoved.bind(this)
      ),
      entityDirection: hordetest.game.onEntityDirectionUpdate(this.handleEntityDirectionUpdate.bind(this))
    };

    this.intervals = [
      window.setInterval(this.handleWorldTimeUpdate.bind(this), 66),
      window.setInterval(this.handleUIFPSUpdate.bind(this), 200),
      window.setInterval(this.handleNPCCountUpdate.bind(this, 200))
    ];
  }

  /**
   * @FIXME @TODO
   * somehow, for some reason, this is getting called at a point when the game is first loading.
   * WHYYYYY?  --DM
   */
  public componentWillUnmount(): void {
    this.stateChangeUnsubscribe();
    for (let i in this.eventHandles) {
      if (this.eventHandles[i]) {
        this.eventHandles[i].close();
      }
    }

    this.intervals.forEach((curInterval) => clearInterval(curInterval));
  }

  //unlike the other state updates, this one is pure client side to track changes(ticks) to the world clock portion of the game state.
  // how often this is checked can be modified in the interval created within componentDidMount
  private handleWorldTimeUpdate(): void {
    if (game.worldTime > -Infinity) {
      this.props.dispatch(updateWorldTime(game.worldTime));
    }
  }

  private handleUIFPSUpdate(): void {
    this.props.dispatch(updateUIFPS(game.fps));
  }

  private handleNPCCountUpdate(): void {
    if (game.npcCount != this.stateMirror.baseGame.npcCount) {
      this.props.dispatch(updateNPCCount(game.npcCount));
    }
  }

  private handleIsAutoRunning(): void {
    if (game.isAutoRunning != this.stateMirror.baseGame.isAutoRunning) {
      this.props.dispatch(updateIsAutoRunning(game.isAutoRunning));
    }
  }

  // End Timer based update methods.
  private handleUIInitialized(): void {
    this.handleKeybindChanged();
    this.handleGameOptionChanged();
    this.handleUsingGamepadStateUpdate(game.usingGamepadState);
  }

  private handleDisplayDefsLoaded(defs: AbilityDisplayDef[]) {
    const abilityDisplayDefs: IDLookupTable<AbilityDisplayDef> = {};
    defs.forEach((abilityDisplayDef: AbilityDisplayDef) => {
      abilityDisplayDefs[abilityDisplayDef.id] = abilityDisplayDef;
    });
    this.props.dispatch(updateAbilityDisplayDefs(abilityDisplayDefs));
  }

  private handleClassDefsLoaded(defs: CharacterClassDef[]) {
    const characterClassDefs: IDLookupTable<CharacterClassDef> = {};
    defs.forEach((curCharacterDef: CharacterClassDef) => {
      characterClassDefs[curCharacterDef.id] = curCharacterDef;
    });
    this.props.dispatch(updateClassDefs(characterClassDefs));
  }

  private handleRaceDefsLoaded(defs: CharacterRaceDef[]) {
    const characterRaceDefs: IDLookupTable<CharacterRaceDef> = {};
    defs.forEach((curRaceDef: CharacterRaceDef) => {
      characterRaceDefs[curRaceDef.id] = curRaceDef;
    });
    this.props.dispatch(updateRaceDefs(characterRaceDefs));
  }

  private handleSystemMessageReceived(message: string) {
    this.props.dispatch(updateSystemMessageReceived(message));
  }

  private handleSelfPlayerStateUpdate(newPlayerState: SelfPlayerStateModel): void {
    /* 
        if the new state involves an undefined view bearing, ignore the update.
        Otherwise the thousands of useless updates sent before the game actually starts
        causing React to just give up, pick up its toys, and go home.  
        (Actually it throws https://reactjs.org/docs/error-decoder.html/?invariant=185)
        */
    if (newPlayerState.viewBearing === undefined) {
      return;
    }

    const playerDelta: Partial<SelfPlayerStateModel> = {};

    this.checkPlayerShardIDUpdated(newPlayerState.shardID, playerDelta);
    this.checkPlayerEntityIDUpdated(newPlayerState.entityID, playerDelta);
    this.checkFacingUpdated(newPlayerState.facing, playerDelta);
    this.checkViewBearingUpdated(newPlayerState.viewBearing, playerDelta);
    this.checkViewOriginUpdated(newPlayerState.viewOrigin, playerDelta);
    this.checkPlayerAccountIDUpdated(newPlayerState.accountID, playerDelta);

    this.props.dispatch(updatePlayerDelta(playerDelta));

    if (playerDelta.shardID) {
      networkConfigurationState.shardID = playerDelta.shardID;
    }
  }

  private handleEntityUpdated(newEntityState: BaseEntityStateModel): void {
    if (newEntityState.objective) {
      this.checkObjectiveUpdated(newEntityState);
    }

    if (isPlayer(newEntityState)) {
      this.handlePlayerEntityUpdated(newEntityState);
    } else if (!isItem(newEntityState)) {
      console.error('handleEntityUpdated() - received unhandled entity type.', newEntityState.type);
    }
  }

  private handleEntityPositionMapUpdated(newState: EntityPositionMapModel): void {
    this.props.dispatch(updatePositions(newState));
  }

  private handlePlayerEntityUpdated(newEntityState: PlayerEntityStateModel) {
    if (newEntityState.entityID === hordetest.game.selfPlayerState.entityID) {
      /* 
        If the new state involves an undefined scenarioRoundState, ignore the update.
        Otherwise the thousands of useless updates sent before the game actually starts
        causing React to just give up, pick up its toys, and go home.  
        (Actually it throws https://reactjs.org/docs/error-decoder.html/?invariant=185)
        */
      if (newEntityState.scenarioRoundState === undefined) {
        return;
      }

      const playerDelta: Partial<PlayerEntityStateModel> = {};

      this.checkPlayerClassIDUpdated(newEntityState.classID, playerDelta);
      this.checkPlayerAccountIDUpdated(newEntityState.accountID, playerDelta);
      this.checkStatusesUpdated(newEntityState.statuses, playerDelta);
      this.checkScenarioIDUpdated(newEntityState.scenarioID, playerDelta);
      this.checkScenarioRoundStateUpdated(newEntityState.scenarioRoundState, playerDelta);
      this.checkScenarioRoundStartTimeUpdated(newEntityState.scenarioRoundStateStartTime, playerDelta);
      this.checkScenarioRoundEndTimeUpdated(newEntityState.scenarioRoundStateEndTime, playerDelta);
      this.checkPlayerTotalKillsUpdated(newEntityState.totalKills, playerDelta);
      this.checkPlayerTeamKillsUpdated(newEntityState.teamKills, playerDelta);
      this.checkAliveUpdated(newEntityState.isAlive, playerDelta);
      this.checkLifeStateUpdated(newEntityState.lifeState, playerDelta);
      this.checkPlayerResourcesUpdated(newEntityState.resources, playerDelta);
      this.checkPlayerRaceUpdated(newEntityState.race, playerDelta);
      this.checkPlayerNameUpdated(newEntityState.name, playerDelta);
      this.checkPlayerPortraitUpdated(newEntityState.portraitURL, playerDelta);
      this.checkSurvivedTimeUpdated(newEntityState.survivedTime, playerDelta);
      this.checkDownedStateEndTime(newEntityState.downedStateEndTime, playerDelta);
      this.checkDeathStartTime(newEntityState.deathStartTime, playerDelta);
      this.checkKillersRaceUpdated(newEntityState.killersRace, playerDelta);
      this.checkKillersNameUpdated(newEntityState.killersName, playerDelta);
      this.checkMaxDeathsUpdated(newEntityState.maxDeaths, playerDelta);
      this.checkCurrentDeathsUpdated(newEntityState.currentDeaths, playerDelta);
      this.checkPlayerFactionUpdated(newEntityState.faction, playerDelta);
      this.checkPlayerRank(newEntityState.rank, playerDelta);

      this.props.dispatch(updatePlayerDelta(playerDelta));
      // We are deliberately NOT returning here.  The behavior is that the local user will get
      // added to the "friends" list by checkFriendsUpdated().
    }

    if (
      newEntityState['characterKind'] === CharacterKind.BossNPC ||
      newEntityState['characterKind'] === CharacterKind.MiniBossNPC
    ) {
      this.checkBossUpdated(newEntityState);
      return;
    }

    if (newEntityState['characterKind'] === CharacterKind.User) {
      this.checkFriendsUpdated(newEntityState);
      return;
    }
  }

  private handleRoundEnded(scenarioID: string, roundID: string, didEnd: boolean): void {
    console.log('handling end of round!!!', scenarioID, roundID, didEnd);
    if (didEnd) {
      this.props.dispatch(clearFriends());
      this.props.dispatch(clearBosses());
      this.props.dispatch(clearDialogueQueue());
    }
  }

  // Player State Update Checking Functions

  private checkPlayerShardIDUpdated(shardID: number, playerDelta: Partial<SelfPlayerStateModel>): void {
    if (!shardID) {
      return;
    }

    if (shardID != this.stateMirror.player.shardID) {
      playerDelta.shardID = shardID;
    }
  }

  private checkPlayerEntityIDUpdated(entityID: string, playerDelta: Partial<SelfPlayerStateModel>): void {
    if (!entityID) {
      return;
    }

    if (entityID != this.stateMirror.player.entityID) {
      playerDelta.entityID = entityID;
    }
  }

  private checkPlayerClassIDUpdated(classID: number, playerDelta: Partial<PlayerEntityStateModel>): void {
    if (classID == undefined) {
      return;
    }

    if (classID != this.stateMirror.player.classID) {
      playerDelta.classID = classID;
    }
  }

  private checkPlayerAccountIDUpdated(accountID: string, playerDelta: Partial<SelfPlayerStateModel>): void {
    if (!accountID) {
      return;
    }

    if (accountID != this.stateMirror.player.accountID) {
      playerDelta.accountID = accountID;
    }
  }

  private checkFacingUpdated(newFacing: Facing2fDegrees, playerDelta: Partial<SelfPlayerStateModel>): void {
    if (
      newFacing.pitch != this.stateMirror.player.facing.pitch ||
      newFacing.yaw != this.stateMirror.player.facing.yaw
    ) {
      playerDelta.facing = newFacing;
    }
  }

  private checkViewBearingUpdated(newBearing: number, playerDelta: Partial<SelfPlayerStateModel>): void {
    if (newBearing != this.stateMirror.player.viewBearing) {
      playerDelta.viewBearing = newBearing;
    }
  }

  private checkViewOriginUpdated(newViewOrigin: Vec3f, playerDelta: Partial<SelfPlayerStateModel>): void {
    if (!newViewOrigin) {
      return;
    }
    if (
      this.stateMirror.player.viewOrigin.x != newViewOrigin.x ||
      this.stateMirror.player.viewOrigin.y != newViewOrigin.y ||
      this.stateMirror.player.viewOrigin.z != newViewOrigin.z
    ) {
      playerDelta.viewOrigin = newViewOrigin;
    }
  }

  private checkStatusesUpdated(statusList: ArrayMap<Status>, playerDelta: Partial<PlayerEntityStateModel>): void {
    if (!statusList) {
      return;
    }

    //check the array intersaction of the keys of the status lists incoming and already in state.
    //if the length of the intersection is not equal to the length of the statuses in the current state,
    //the statuses list has changed.
    const stateStatusKeys = Object.keys(this.stateMirror.player.statuses);
    const newStatusKeys = Object.keys(statusList);

    const intersectionLength = stateStatusKeys.filter((key) => {
      const status = statusList[key];
      if (!status) {
        return false;
      }

      //a status can have its duration and/or starttime information messed with
      //depending on the StatusDurationModification value of the status' stacking rule
      const oldStatus = this.stateMirror.player.statuses[key];
      return status.duration == oldStatus.duration && status.startTime == oldStatus.startTime;
    }).length;

    // Have to be super explicit about this check due to bugs that arose when the statusKeys.length (old or new) is zero.
    if (intersectionLength != newStatusKeys.length || intersectionLength != stateStatusKeys.length) {
      playerDelta.statuses = statusList;
    }
  }

  private checkScenarioIDUpdated(newScenarioID: string, playerDelta: Partial<PlayerEntityStateModel>): void {
    if (this.stateMirror.player.scenarioID != newScenarioID) {
      playerDelta.scenarioID = newScenarioID;
    }
  }

  private checkScenarioRoundStateUpdated(
    newScenarioRoundState: ScenarioRoundState,
    playerDelta: Partial<PlayerEntityStateModel>
  ): void {
    if (this.stateMirror.player.scenarioRoundState != newScenarioRoundState) {
      playerDelta.scenarioRoundState = newScenarioRoundState;
    }
  }

  private checkScenarioRoundStartTimeUpdated(newStartTime: number, playerDelta: Partial<PlayerEntityStateModel>): void {
    if (this.stateMirror.player.scenarioRoundStateStartTime != newStartTime) {
      playerDelta.scenarioRoundStateStartTime = newStartTime;
    }
  }

  private checkScenarioRoundEndTimeUpdated(newEndTime: number, playerDelta: Partial<PlayerEntityStateModel>): void {
    if (this.stateMirror.player.scenarioRoundStateEndTime != newEndTime) {
      playerDelta.scenarioRoundStateEndTime = newEndTime;
    }
  }

  private checkPlayerTotalKillsUpdated(newTotalKills: number, playerDelta: Partial<PlayerEntityStateModel>): void {
    if (this.stateMirror.player.totalKills != newTotalKills) {
      playerDelta.totalKills = newTotalKills;
    }
  }

  private checkPlayerFactionUpdated(newFaction: number, playerDelta: Partial<PlayerEntityStateModel>): void {
    if (this.stateMirror.player.faction != newFaction) {
      playerDelta.faction = newFaction;
    }
  }

  private checkPlayerRank(newRank: number, playerDelta: Partial<PlayerEntityStateModel>): void {
    if (this.stateMirror.player.rank != newRank) {
      playerDelta.rank = newRank;
    }
  }

  private checkPlayerTeamKillsUpdated(newTeamKills: number, playerDelta: Partial<PlayerEntityStateModel>): void {
    if (this.stateMirror.player.teamKills != newTeamKills) {
      playerDelta.teamKills = newTeamKills;
    }
  }

  private checkAliveUpdated(isAlive: boolean, playerDelta: Partial<PlayerEntityStateModel>): void {
    if (this.stateMirror.player.isAlive != isAlive) {
      playerDelta.isAlive = isAlive;
    }
  }

  private checkLifeStateUpdated(lifeState: LifeState, playerDelta: Partial<PlayerEntityStateModel>): void {
    if (this.stateMirror.player.lifeState != lifeState) {
      playerDelta.lifeState = lifeState;
    }
  }

  private checkSurvivedTimeUpdated(survivedTime: number, playerDelta: Partial<PlayerEntityStateModel>): void {
    if (this.stateMirror.player.survivedTime != survivedTime) {
      playerDelta.survivedTime = survivedTime;
    }
  }

  private checkDownedStateEndTime(downedStateEndTime: number, playerDelta: Partial<PlayerEntityStateModel>): void {
    if (this.stateMirror.player.downedStateEndTime != downedStateEndTime) {
      playerDelta.downedStateEndTime = downedStateEndTime;
    }
  }

  private checkDeathStartTime(deathStartTime: number, playerDelta: Partial<PlayerEntityStateModel>): void {
    if (this.stateMirror.player.deathStartTime !== deathStartTime) {
      playerDelta.deathStartTime = deathStartTime;
    }
  }

  private checkKillersRaceUpdated(killersRace: number, playerDelta: Partial<PlayerEntityStateModel>): void {
    if (this.stateMirror.player.killersRace != killersRace) {
      playerDelta.killersRace = killersRace;
    }
  }

  private checkKillersNameUpdated(killersName: string, playerDelta: Partial<PlayerEntityStateModel>): void {
    if (this.stateMirror.player.killersName != killersName) {
      playerDelta.killersName = killersName;
    }
  }

  private checkMaxDeathsUpdated(maxDeaths: number, playerDelta: Partial<PlayerEntityStateModel>): void {
    if (this.stateMirror.player.maxDeaths != maxDeaths) {
      playerDelta.maxDeaths = maxDeaths;
    }
  }

  private checkCurrentDeathsUpdated(currentDeaths: number, playerDelta: Partial<PlayerEntityStateModel>): void {
    if (this.stateMirror.player.currentDeaths != currentDeaths) {
      playerDelta.currentDeaths = currentDeaths;
    }
  }

  private checkPlayerResourcesUpdated(
    newResources: ArrayMap<EntityResource>,
    playerDelta: Partial<PlayerEntityStateModel>
  ): void {
    this.checkEntityResourcesUpdated(newResources, this.stateMirror.player.resources, playerDelta);
  }

  private checkEntityResourcesUpdated(
    newResources: ArrayMap<EntityResource>,
    oldResources: ArrayMap<EntityResource>,
    playerDelta: Partial<BaseEntityStateModel>
  ): void {
    if (!newResources) {
      return;
    }

    //check the array intersaction of the keys of the resource lists incoming and already in state.
    //if the length of the intersection is not equal to the length of the resources in the current state,
    //the resources list has changed.
    const stateResourceKeys = Object.keys(oldResources);
    const newResourceKeys = Object.keys(newResources);

    const intersectionLength = stateResourceKeys.filter((key) => {
      const resource = newResources[key];
      if (!resource) {
        return false;
      }

      const oldResource = oldResources[key];
      return (
        resource.max == oldResource.max && resource.current == oldResource.current && resource.id == oldResource.id
      );
    }).length;

    if (intersectionLength != newResourceKeys.length || intersectionLength != stateResourceKeys.length) {
      playerDelta.resources = cloneDeep(newResources); // HACK [FSR-2399] - clone this structure, if a reference is passed on it could be modified in by upstream coherent code and confused the redux layer
    }
  }

  private checkPlayerRaceUpdated(newRace: number, playerDelta: Partial<PlayerEntityStateModel>): void {
    if (!newRace) {
      return;
    }

    if (newRace != this.stateMirror.player.race) {
      playerDelta.race = newRace;
    }
  }

  private checkPlayerNameUpdated(newName: string, playerDelta: Partial<PlayerEntityStateModel>): void {
    if (!newName) {
      return;
    }

    if (newName != this.stateMirror.player.name) {
      playerDelta.name = newName;
    }
  }

  private checkPlayerPortraitUpdated(newPortrait: string, playerDelta: Partial<PlayerEntityStateModel>): void {
    if (!newPortrait) {
      return;
    }

    if (newPortrait != this.stateMirror.player.portraitURL) {
      playerDelta.portraitURL = newPortrait;
    }
  }

  // End Player State Update Checking Functions

  // Begin Ability Update Checking Functions
  private handleAbilityStatus(status: AbilityStatus): void {
    this.props.dispatch(updateAbility(status));
  }

  private handleAbilityActivated(id: number): void {
    this.props.dispatch(updateAbilityActivated({ id, timestamp: new Date() }));
  }

  // End Ability Update Checking Functions

  // Begin Entity State Update Checking Functions

  private checkFriendsUpdated(newPlayerState: PlayerEntityStateModel): void {
    //if the entityState is the active player, bail.
    if (
      newPlayerState.name == this.stateMirror.player.name ||
      newPlayerState.faction != this.stateMirror.player.faction
    ) {
      return;
    }

    const friendsList: FriendsList = this.stateMirror.entities.friends;

    if (!friendsList[newPlayerState.name]) {
      this.props.dispatch(addFriend(cloneDeep(newPlayerState)));
    } else {
      //get the delta between the new playerState and the existing player state.
      const updatedFriendData = this.diffFriendData(newPlayerState);

      if (Object.keys(updatedFriendData).length > 0) {
        //console.log("updating the friend!", updatedFriendData);
        this.props.dispatch(updateFriend({ name: newPlayerState.name, delta: updatedFriendData }));
      }
    }
  }

  private diffFriendData(newPlayerState: PlayerEntityStateModel): Partial<PlayerEntityStateModel> {
    const friendStateDelta: Partial<PlayerEntityStateModel> = {};

    if (!newPlayerState) {
      console.warn('Detected attempt to diff friend data with undefined new state data.');
      return friendStateDelta;
    }

    const existingFriendData: PlayerEntityStateModel = this.stateMirror.entities.friends[newPlayerState.name];

    // if the new state and old state point to different entities
    // keep the one that is alive, the other is the corpse of a revived character and we want to prioritize the alive character
    if (
      existingFriendData.entityID != newPlayerState.entityID &&
      existingFriendData.isAlive &&
      !newPlayerState.isAlive
    ) {
      return friendStateDelta;
    }

    const importantScalarFields = ['classID', 'currentDeaths', 'entityID', 'isAlive', 'maxDeaths'];

    for (let fieldNameString in existingFriendData) {
      const fieldName = fieldNameString as keyof PlayerEntityStateModel;
      if (
        importantScalarFields.indexOf(fieldNameString) != -1 &&
        existingFriendData[fieldName] != newPlayerState[fieldName]
      ) {
        // Shouldn't have to do this typecast, but you can't index into partials, as converting something to a Partial
        // almost always produces a 'never' field, which can't be matched.
        (friendStateDelta as any)[fieldName] = newPlayerState[fieldName];
      } else if (fieldName == 'resources') {
        const resources: ArrayMap<EntityResource> = newPlayerState[fieldName];
        this.checkEntityResourcesUpdated(resources, existingFriendData.resources, friendStateDelta);
      } else if (fieldName == 'lifeState') {
        if (existingFriendData[fieldName] != newPlayerState[fieldName]) {
          friendStateDelta[fieldName] = newPlayerState[fieldName];
        }
      } else if (fieldName == 'downedStateEndTime') {
        if (existingFriendData[fieldName] != newPlayerState[fieldName] && newPlayerState[fieldName] != 0) {
          friendStateDelta[fieldName] = newPlayerState[fieldName];
        }
      } else if (fieldName == 'deathStartTime') {
        if (existingFriendData[fieldName] != newPlayerState[fieldName] && newPlayerState[fieldName] != 0) {
          friendStateDelta[fieldName] = newPlayerState[fieldName];
        }
      }
    }

    return friendStateDelta;
  }

  private checkBossUpdated(newPlayerState: PlayerEntityStateModel): void {
    const trackedBosses: EntityList = this.stateMirror.entities.bosses;

    if (!trackedBosses[newPlayerState.entityID]) {
      this.props.dispatch(addBoss(cloneDeep(newPlayerState)));
    } else {
      // get the delta between the new playerState and the existing player state.
      const updatedBossData = this.diffBossData(newPlayerState);

      if (Object.keys(updatedBossData).length > 0) {
        this.props.dispatch(updateBoss({ entityID: newPlayerState.entityID, delta: updatedBossData }));
      }
    }
  }

  private diffBossData(newBossState: PlayerEntityStateModel): Partial<PlayerEntityStateModel> {
    const bossStateDelta: Partial<PlayerEntityStateModel> = {};

    if (!newBossState) {
      console.warn('Detected attempt to diff boss data with undefined new state data.');
      return bossStateDelta;
    }

    const existingBossData: PlayerEntityStateModel = this.stateMirror.entities.bosses[newBossState.entityID];

    if (existingBossData.entityID != newBossState.entityID) {
      console.warn('Detected attempt to update one boss NPC with data from another boss NPC');
      return bossStateDelta;
    }

    if (existingBossData.iconClass != newBossState.iconClass) {
      bossStateDelta.iconClass = newBossState.iconClass;
    }

    if (existingBossData.isShielded != newBossState.isShielded) {
      bossStateDelta.isShielded = newBossState.isShielded;
    }

    if (existingBossData.isAlive != newBossState.isAlive) {
      bossStateDelta.isAlive = newBossState.isAlive;
    }

    this.checkEntityResourcesUpdated(newBossState.resources, existingBossData.resources, bossStateDelta);

    return bossStateDelta;
  }

  /**
   *  This function only takes an entityID.  The game client doesn't really give two hoots
   * about the type of entity that was removed, which is ok.  this code will be more intelligent
   * about it here.
   */
  private handleEntityRemoved(entityID: string): void {
    if (entityID in this.stateMirror.entities.bosses) {
      this.props.dispatch(removeBoss(entityID));
      return;
    }

    /**
     * So, in the 'add' and 'update' entity functions relating to players, I rekeyed the dictionary
     * to name.  Which means we need to search through the limited set of friends the hard way to find the entityID.
     */
    const mappedFriendName: string = Object.keys(this.stateMirror.entities.friends).find((curFriendName: string) => {
      return this.stateMirror.entities.friends[curFriendName].entityID === entityID;
    });

    if (mappedFriendName != undefined) {
      this.props.dispatch(removeFriend(mappedFriendName));
      return;
    }

    /**
     * Thankfully, trying to remove an objective is a lot easier than removing a friend.  Since we keep the entityID for
     * those as the key.
     */
    if (this.stateMirror.entities.objectives[entityID] != undefined) {
      this.props.dispatch(removeObjective(entityID));
    }
  }

  private checkObjectiveUpdated(newEntityState: BaseEntityStateModel): void {
    const curObjectives: ObjectivesList = this.stateMirror.entities.objectives;
    const newEntityID = newEntityState.entityID;

    if (!curObjectives[newEntityID]) {
      //console.log("adding a new objective!", newEntityState);
      this.props.dispatch(addObjective(cloneDeep(newEntityState)));
    } else {
      const updatedObjectiveData: Partial<BaseEntityStateModel> = this.diffObjectiveData(newEntityState);

      if (Object.keys(updatedObjectiveData).length > 0) {
        //console.log("updating the objective!", updatedObjectiveData);
        this.props.dispatch(updateObjective({ entityID: newEntityState.entityID, delta: updatedObjectiveData }));
      }
    }
  }

  private diffObjectiveData(newEntityState: BaseEntityStateModel): Partial<BaseEntityStateModel> {
    const entityStateDelta: Partial<ItemEntityStateModel> = {};

    if (!newEntityState) {
      console.warn('Detected attempt to diff objective data with undefined new state data.');
      return entityStateDelta;
    }

    const existingObjectiveData = this.stateMirror.entities.objectives[newEntityState.entityID];

    if (isItem(newEntityState) && isItem(existingObjectiveData)) {
      if (newEntityState.iconClass != existingObjectiveData.iconClass) {
        entityStateDelta.iconClass = newEntityState.iconClass;
      }
      if (newEntityState.type != existingObjectiveData.type) {
        entityStateDelta.type = newEntityState.type;
      }
      if (newEntityState.itemDefID != existingObjectiveData.itemDefID) {
        entityStateDelta.itemDefID = newEntityState.itemDefID;
      }
    }

    type ObjectiveData = typeof existingObjectiveData.objective;
    const objectiveDelta: Partial<ObjectiveData> = {};

    for (let keyString in newEntityState.objective) {
      const key = keyString as keyof ObjectiveData;
      if (existingObjectiveData.objective[key] != newEntityState.objective[key]) {
        // Shouldn't have to do this typecast, but you can't index into partials, as converting something to a Partial
        // almost always produces a 'never' field, which can't be matched.
        (objectiveDelta as any)[key] = newEntityState.objective[key];
      }
    }

    if (Object.keys(objectiveDelta).length > 0) {
      entityStateDelta.objective = {
        ...newEntityState.objective,
        ...objectiveDelta
      };
    }

    this.checkEntityResourcesUpdated(newEntityState.resources, existingObjectiveData.resources, entityStateDelta);

    return entityStateDelta;
  }

  // End Entity State Update Checking Functions

  private handleCollectedRunesUpdated(
    runes: { [key in RuneType]: number },
    runeBonuses: { [key in RuneType]: number },
    maxRunesAllowed: { [key in RuneType]: number }
  ): void {
    if (!runes) {
      return;
    }

    const runesDelta: Partial<RunesState> = {};
    const prevState: RunesState = this.stateMirror.runes;

    let runeCountChanged: boolean = false;

    for (let keyStr in runes) {
      const key: RuneType = +keyStr as RuneType;
      if (prevState.collectedRunes[key] != runes[key]) {
        runesDelta.collectedRunes = runes;
        runeCountChanged = true;
      }

      if (prevState.runeBonuses[key] != runeBonuses[key]) {
        runesDelta.runeBonuses = runeBonuses;
      }

      if (prevState.maxRunesAllowed[key] != maxRunesAllowed[key]) {
        runesDelta.maxRunesAllowed = maxRunesAllowed;
      }
    }

    if (runeCountChanged) {
      runesDelta.alertBoxes = cloneDeep(prevState.alertBoxes);

      for (let keyStr in runes) {
        const key: RuneType = +keyStr as RuneType;
        const runeCountDelta = runes[key] - prevState.collectedRunes[key];

        if (runeCountDelta != 0 && prevState.alertBoxes[key].visibleTimeout) {
          clearTimeout(prevState.alertBoxes[key].visibleTimeout);
        }

        if (runeCountDelta > 0) {
          const runeBonusDelta = runeBonuses[key] - prevState.runeBonuses[key];
          const newCount = prevState.alertBoxes[key].visibleTimeout
            ? prevState.alertBoxes[key].newCount + runeCountDelta
            : runeCountDelta;
          const newBonus = prevState.alertBoxes[key].visibleTimeout
            ? prevState.alertBoxes[key].newBonus + runeBonusDelta
            : runeBonusDelta;

          const visibleTimeout = window.setTimeout(() => {
            this.props.dispatch(hideRuneAlert(key));
          }, RuneAlertDisplayTimeSeconds * 1000);

          runesDelta.alertBoxes[key] = {
            newCount: newCount,
            newBonus: newBonus,
            visibleTimeout: visibleTimeout
          };
        } else if (runeCountDelta < 0) {
          runesDelta.alertBoxes[key] = {
            newCount: 0,
            newBonus: 0,
            visibleTimeout: null
          };
        }
      }
    }

    if (Object.keys(runesDelta).length > 0) {
      this.props.dispatch(updateRunes(runesDelta));
    }
  }

  private handleUsingGamepadStateUpdate(usingGamepadState: UsingGamepadState) {
    if (!usingGamepadState) {
      return;
    }

    if (this.stateMirror.baseGame.usingGamepad != usingGamepadState.usingGamepad) {
      this.props.dispatch(updateUsingGamepad(usingGamepadState.usingGamepad));
    }
  }

  private handleGameOptionChanged(): void {
    Object.values(GameOptionIDs).forEach((option) => {
      const oldOption = this.stateMirror.gameOptions.gameOptions[option];
      if (oldOption) {
        const newOption = Object.values(game.options).find((o) => o.name === oldOption.name);
        if (this.dispatchGameOptionUpdate(oldOption, newOption)) {
          this.props.dispatch(updateGameOption(newOption));
        }
      }
    });
  }

  private dispatchGameOptionUpdate(oldOption: GameOption, newOption: GameOption): boolean {
    if (oldOption && newOption) {
      if (oldOption.value != newOption.value) {
        return true;
      }
    }

    return false;
  }

  private handleKeybindChanged(): void {
    for (let keybindID in KeybindIDs) {
      const oldKeybind = this.stateMirror.keybinds[keybindID];
      if (oldKeybind) {
        const newKeybind = Object.values(game.keybinds).find(
          (k) => k.description === oldKeybind.description
        ) as Keybind;
        if (this.dispatchKeybindUpdate(oldKeybind, newKeybind)) {
          this.props.dispatch(updateKeybinds({ key: keybindID, keybind: newKeybind }));
        }
      }
    }
  }

  private dispatchKeybindUpdate(keybindA: Keybind, keybindB: Keybind): boolean {
    if (keybindA && keybindB) {
      // if these ids do not match it means that the keybind was never fully
      // initialzed from the gamestate.  Treat them as different
      if (keybindA.id != keybindB.id) {
        return true;
      }

      const bindCount = keybindA.binds.length;
      for (let i = 0; i < bindCount; ++i) {
        if (
          keybindA.binds[i].name != keybindB.binds[i].name ||
          keybindA.binds[i].value != keybindB.binds[i].value ||
          keybindA.binds[i].iconClass != keybindB.binds[i].iconClass
        ) {
          return true;
        }
      }
    }

    return false;
  }

  private handleVoiceChatMemberUpdated(accountID: string, settings: VoiceChatMemberSettings) {
    this.props.dispatch(updateVoiceChatMember({ accountID, settings }));
  }

  private handleVoiceChatMemberRemoved(participantName: string) {
    this.props.dispatch(removeVoiceChatMember(participantName));
  }

  private handleObjectiveDetailsUpdate(newObjectiveDetails: ObjectiveDetailMessageState[]) {
    const newPrimaryObjectiveDetails: ObjectiveDetailMessageState[] = [];
    const newQuestObjectiveDetails: ObjectiveDetailMessageState[] = [];
    for (let objIdx = 0; objIdx < newObjectiveDetails.length; objIdx++) {
      const objDetail = newObjectiveDetails[objIdx];
      if (objDetail.category == ObjectiveDetailCategory.Primary) {
        newPrimaryObjectiveDetails.push(objDetail);
      } else {
        newQuestObjectiveDetails.push(objDetail);
      }
    }

    this.handleObjectiveDetailsUpdateGroup(newPrimaryObjectiveDetails, this.stateMirror.game.objectiveDetailsPrimary);
    this.handleObjectiveDetailsUpdateGroup(newQuestObjectiveDetails, this.stateMirror.game.objectiveDetailsQuest);
  }

  private handleObjectiveDetailsUpdateGroup(
    newObjectiveDetails: ObjectiveDetailMessageState[],
    existingObjectiveDetails: ObjectiveDetailsList
  ) {
    const objectiveDetailsListDelta: ObjectiveDetailsList = {};

    const newMessageIdsList: ObjectiveDetailsList = {};

    // add new objectiveDetails if there are any.
    for (let counter = 0; counter < newObjectiveDetails.length; counter++) {
      const curNewDetails = newObjectiveDetails[counter];
      //adding the messageID to list for later...  *
      newMessageIdsList[curNewDetails.messageID] = curNewDetails;

      if (!existingObjectiveDetails[curNewDetails.messageID]) {
        objectiveDetailsListDelta[curNewDetails.messageID] = curNewDetails;
      }
    }

    //get list of messages to be removed, and/or update ones that have changed.
    const objectiveDetailsToBeRemoved: string[] = [];
    for (let curMessageID in existingObjectiveDetails) {
      const newObjectiveState: ObjectiveDetailMessageState = newMessageIdsList[curMessageID];

      if (!newObjectiveState) {
        objectiveDetailsToBeRemoved.push(curMessageID);
        continue;
      }

      const curObjectiveState: ObjectiveDetailMessageState = existingObjectiveDetails[curMessageID];
      const objectiveDelta: Partial<ObjectiveDetailMessageState> = this.diffObjectiveDetails(
        curObjectiveState,
        newObjectiveState
      );

      if (Object.keys(objectiveDelta).length > 0) {
        objectiveDetailsListDelta[curMessageID] = {
          ...curObjectiveState,
          ...objectiveDelta
        };
      }
    }

    if (objectiveDetailsToBeRemoved.length > 0) {
      this.props.dispatch(removeObjectiveDetails(objectiveDetailsToBeRemoved));
    }

    if (Object.keys(objectiveDetailsListDelta).length > 0) {
      this.props.dispatch(updateObjectiveDetails(objectiveDetailsListDelta));
    }
  }

  private diffObjectiveDetails(
    existingObjectiveDetailsState: ObjectiveDetailMessageState,
    newObjectiveDetailsState: ObjectiveDetailMessageState
  ): Partial<ObjectiveDetailMessageState> {
    const objectiveDetailsDelta: Partial<ObjectiveDetailMessageState> = {};

    if (newObjectiveDetailsState == undefined) {
      console.warn("attempted to 'diff' with non-existent objective.  was one removed?");
      return objectiveDetailsDelta;
    }

    for (let curFieldNameString in existingObjectiveDetailsState) {
      const curFieldName = curFieldNameString as keyof ObjectiveDetailMessageState;
      if (existingObjectiveDetailsState[curFieldName] != newObjectiveDetailsState[curFieldName]) {
        // Shouldn't have to do this typecast, but you can't index into partials, as converting something to a Partial
        // almost always produces a 'never' field, which can't be matched.
        (objectiveDetailsDelta as any)[curFieldName] = newObjectiveDetailsState[curFieldName];
      }
    }

    return objectiveDetailsDelta;
  }

  private handleConsumableItemsUpdate(newConsumableItemsState: ConsumableItemsStateModel) {
    const consumableItemsStateDelta: Partial<ConsumableItemsStateModel> = {};
    const existingConsumableStateRef: ConsumableItemsStateModel = this.stateMirror.game.consumableItemsState;

    // check if active index has changed.
    if (newConsumableItemsState.activeIndex != existingConsumableStateRef.activeIndex) {
      consumableItemsStateDelta.activeIndex = newConsumableItemsState.activeIndex;
    }

    // Check if we need to fire the event anyway, using a timestamp to throttle it.
    // We do this because we need the next/prev item events to fire to trigger showing item descriptions,
    // and we need this to happen even if the player has exactly one item (which means no data is changing).
    const currentTimestamp = Math.floor(game.worldTime);
    if (currentTimestamp != existingConsumableStateRef.timestamp) {
      consumableItemsStateDelta.timestamp = currentTimestamp;
    }

    const existingConsumableItemIds = Object.keys(existingConsumableStateRef.items);

    for (let itemIndex = 0; itemIndex < existingConsumableItemIds.length; itemIndex = itemIndex + 1) {
      const currentID = existingConsumableItemIds[itemIndex];
      let curNewConsumableItem = newConsumableItemsState.items[currentID];
      const curExistingConsumableItem = existingConsumableStateRef.items[currentID];

      if (curNewConsumableItem == undefined) {
        curNewConsumableItem = createDefaultItem(+currentID);
      }

      if (
        curNewConsumableItem.iconClass != curExistingConsumableItem.iconClass ||
        curNewConsumableItem.iconUrl != curExistingConsumableItem.iconUrl ||
        curNewConsumableItem.name != curExistingConsumableItem.name
      ) {
        if (consumableItemsStateDelta.items == undefined) {
          consumableItemsStateDelta.items = {};
        }

        consumableItemsStateDelta.items[currentID] = {
          iconClass: curNewConsumableItem.iconClass,
          iconUrl: curNewConsumableItem.iconUrl,
          name: curNewConsumableItem.name,
          description: curNewConsumableItem.description,
          gameplayType: curNewConsumableItem.gameplayType
        };
      }
    }
    if (Object.keys(consumableItemsStateDelta).length > 0) {
      this.props.dispatch(updateConsumables(consumableItemsStateDelta));
    }
  }

  private handleAnnouncement(
    type: AnnouncementType,
    dialogueText: string,
    speakerName: string,
    speakerIcon: string,
    soundID: number
  ) {
    switch (type) {
      case AnnouncementType.Dialogue: //formerly handled by "type & AnnouncementType.Dialogue) !== 0".  Keeping this comment here in case I need to bring that logic back.
        this.handleDialogueMessage({ id: this.nextDialogueMessageID, dialogueText, speakerName, speakerIcon, soundID });
        this.nextDialogueMessageID += 1;
        break;
      case AnnouncementType.Text: // formerly handled by onSystemMessage
        this.handleSystemMessageReceived(dialogueText);
        break;
      default:
        return;
    }
  }

  private handleDialogueMessage(message: PendingDialogueMessage): void {
    // Managing dialogue messages requires careful timing - you don't want to let the messages build up and play all at once,
    // you don't want them to stay on screen for too long, and you don't want them to fall off the screen too fast.
    // We handle all timing here instead of in the rendering component - otherwise if we stop rendering these for whatever reason
    // (maybe we've switched to a fullscreen UI), then we can't control the timing properly. This also allows multiple render
    // components if needed.

    this.pendingDialogueMessages.push(message);

    // If we already have a sound playing or waiting to play, this will eventually play automatically.
    // If that's not the case, we need to start that process now.
    if (this.currentDialogueSoundTimeout === null) {
      this.tryPlayNextDialogueMessage();
    }
  }

  private tryPlayNextDialogueMessage() {
    if (
      this.pendingDialogueMessages.length === 0 ||
      this.currentDialogueSoundTimeout !== null ||
      this.activeDialogueMessageCount >= DIALOGUE_MAX_NUM_MESSAGES_ON_SCREEN
    ) {
      return;
    }

    const playMessageSoundAndGetDurationInMilliseconds = (soundID?: number): number => {
      let soundDurationSeconds: number = 0;
      if (soundID) {
        soundDurationSeconds = Math.max(0, game.playGameSound(soundID));
      }
      return soundDurationSeconds * 1000 + DIALOGUE_TIME_BETWEEN_SOUNDS_MS;
    };

    // pop the first message in the queue
    const message: PendingDialogueMessage = this.pendingDialogueMessages[0];
    this.pendingDialogueMessages = this.pendingDialogueMessages.slice(1);

    // play it and set up the completion callback
    const messageSoundDurationMS: number = playMessageSoundAndGetDurationInMilliseconds(message.soundID);
    this.activeDialogueMessageCount += 1;
    this.props.dispatch(
      addDialogueEntry({
        messageID: message.id,
        soundID: message.soundID,
        soundState: DialogueSoundState.PendingPlay,
        speakerName: message.speakerName,
        speakerIcon: message.speakerIcon,
        text: message.dialogueText,
        type: AnnouncementType.Dialogue
      })
    );
    this.currentDialogueSoundTimeout = window.setTimeout(() => {
      this.currentDialogueSoundTimeout = null;
      this.onDialogueMessageFinishedPlaying(message.id, messageSoundDurationMS);
    }, messageSoundDurationMS);
  }

  private onDialogueMessageFinishedPlaying(messageID: number, messageSoundDurationMS: number) {
    const removeDialogueMessage = () => {
      this.activeDialogueMessageCount -= 1;
      this.props.dispatch(removeDialogueEntryWithID(messageID));

      // try playing the next message if one was queued up
      this.tryPlayNextDialogueMessage();
    };

    // let the message hang around a bit after the sound finishes playing so the player can actually read it
    const timeUntilRemoveMessageMS = Math.max(0, DIALOGUE_MIN_DISPLAY_TIME_MS - messageSoundDurationMS);
    if (timeUntilRemoveMessageMS < 50) {
      removeDialogueMessage();
    } else {
      window.setTimeout(removeDialogueMessage, timeUntilRemoveMessageMS);

      // The sound is finished playing, so we can try to trigger the next message if we have one,
      // even if the old message sticks around a bit longer.
      this.tryPlayNextDialogueMessage();
    }
  }

  private handleEntityDirectionUpdate(entityDirections: EntityDirection[]): void {
    if (!entityDirections || !entityDirections.length) {
      // We have existing directions, and the client just told us we have none. Remove all existing entries.
      if (Object.keys(this.stateMirror.game.playerDirections).length > 0) {
        this.props.dispatch(removePlayerDirections(Object.keys(this.stateMirror.game.playerDirections)));
      }

      if (Object.keys(this.stateMirror.game.entityDirections).length > 0) {
        this.props.dispatch(removeEntityDirections(Object.keys(this.stateMirror.game.entityDirections)));
      }
      return;
    }

    const newPlayerDirectionsDict: Dictionary<EntityDirection> = {};
    const newEntityDirectionsDict: Dictionary<EntityDirection> = {};

    entityDirections.forEach((curEntityDirection: EntityDirection) => {
      const entityID: string = curEntityDirection.id + '';

      newEntityDirectionsDict[entityID] = curEntityDirection;

      //this makes an assumption that the entityDirectionID is the entityID belonging to that player.
      if (entityID == this.stateMirror.player.entityID) {
        return;
      }

      if (entityID in this.stateMirror.entities.bosses) {
        return;
      }

      //this is if entitydirections include data for corpses.  This allows us to reference 'friend' entities
      // to ensure we're only showing the information for the friend's active entity.
      const friend: PlayerEntityStateModel = Object.values(this.stateMirror.entities.friends).find((curFriend) => {
        return curFriend.entityID == entityID;
      });

      if (!friend) {
        return;
      }

      newPlayerDirectionsDict[friend.name] = curEntityDirection;
    });

    this.updateEntityDirectionsDelta(
      newPlayerDirectionsDict,
      this.stateMirror.game.playerDirections,
      updatePlayerDirections,
      removePlayerDirections
    );
    this.updateEntityDirectionsDelta(
      newEntityDirectionsDict,
      this.stateMirror.game.entityDirections,
      updateEntityDirections,
      removeEntityDirections
    );
  }

  private updateEntityDirectionsDelta(
    newDirections: Dictionary<EntityDirection>,
    currentDirections: Dictionary<EntityDirection>,
    updateDirections: ActionCreatorWithOptionalPayload<IDLookupTable<EntityDirection>, string>,
    removeDirections: ActionCreatorWithOptionalPayload<string[], string>
  ): void {
    const directionsDelta: Dictionary<EntityDirection> = {};

    //@TODO compare newDirections with currentDirections and create a delta.
    for (let key in newDirections) {
      if (!newDirections[key].screenPos) {
        console.error('Player direction data provided with no screenPos Vector.');
        continue;
      }
      //if key doesn't exist in currentdirections
      if (!currentDirections[key]) {
        directionsDelta[key] = {
          id: +key,
          screenPos: {
            x: newDirections[key].screenPos.x,
            y: newDirections[key].screenPos.y
          },
          angle: NaN,
          scale: NaN
        } as EntityDirection;
      }
      //make sure their position has actually changed
      else if (
        newDirections[key].screenPos.x != currentDirections[key].screenPos.x ||
        newDirections[key].screenPos.y != currentDirections[key].screenPos.y
      ) {
        directionsDelta[key] = newDirections[key];
      }
    }

    if (Object.keys(directionsDelta).length > 0) {
      this.props.dispatch(updateDirections(directionsDelta));
    }

    const directionsToRemove: string[] = [];

    Object.keys(currentDirections).forEach((curKey) => {
      if (!newDirections[curKey]) {
        directionsToRemove.push(curKey);
      }
    });

    if (directionsToRemove.length > 0) {
      this.props.dispatch(removeDirections(directionsToRemove));
    }
  }
}

export default connect()(ClientStateCommunicationContextProvider);
