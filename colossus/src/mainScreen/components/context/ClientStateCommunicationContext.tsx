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
import { updateUsingGamepad, updateNPCCount, updateIsAutoRunning } from '../../redux/baseGameSlice';
import {
  addOrUpdateFriend,
  addOrUpdateBoss,
  addOrUpdateObjective,
  clearFriends,
  clearBosses,
  removeEntity,
  setEntityContext
} from '../../redux/entitiesSlice';
import { updateRunes, RunesState, hideRuneAlert } from '../../redux/runesSlice';
import {
  IDLookupTable,
  updateConsumables,
  updateObjectiveDetails,
  ObjectiveDetailsList,
  removeObjectiveDetails,
  updatePlayerDirections,
  removePlayerDirections,
  updateEntityDirections,
  removeEntityDirections,
  updateClassDefs,
  updateRaceDefs
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
  BaseEntityState,
  isPlayer,
  PlayerEntityState
} from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { CharacterKind } from '@csegames/library/dist/hordetest/game/types/CharacterKind';
import { AnnouncementType, RuneType } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Keybind } from '@csegames/library/dist/_baseGame/types/Keybind';
import { ObjectiveDetailCategory, ObjectiveDetailMessageState } from '@csegames/library/dist/_baseGame/types/Objective';
import { ConsumableItemsState } from '@csegames/library/dist/hordetest/game/GameClientModels/ConsumableItemsState';
import { cloneDeep } from '@csegames/library/dist/_baseGame/utils/objectUtils';
import { updateVoiceChatMember, removeVoiceChatMember, updateVoiceChatScope } from '../../redux/voiceChatSlice';
import { EntityDirection } from '@csegames/library/dist/hordetest/game/types/EntityDirection';
import { updateSystemMessageReceived } from '../../redux/chatSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { updateAbility, updateAbilityActivated } from '../../redux/abilitySlice';
import { AbilityStatus } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit';
import { GameOptionIDs, updateGameOption } from '../../redux/gameOptionsSlice';
import { GameOption } from '@csegames/library/dist/_baseGame/types/Options';
import { VoiceChatMemberSettings } from '@csegames/library/dist/_baseGame/types/VoiceChatMemberSettings';
import { EntityContext } from '@csegames/library/dist/_baseGame/types/EntityContext';
import { EntityID } from '@csegames/library/dist/_baseGame/types/localDefinitions';

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
      abilityStatus: clientAPI.bindAbilityStatusUpdatedListener(this.handleAbilityStatus.bind(this)),
      announcementsState: clientAPI.bindAnnouncementListener(this.handleAnnouncement.bind(this)),
      characterClassDefs: clientAPI.bindCharacterClassDefsListener(this.handleClassDefsLoaded.bind(this)),
      characterRaceDefs: clientAPI.bindCharacterRaceDefsListener(this.handleRaceDefsLoaded.bind(this)),
      consumableState: clientAPI.bindConsumeablesListener(this.handleConsumables.bind(this)),
      setEntityContext: clientAPI.bindEntityContextListener(this.handleEntityContext.bind(this)),
      entityUpdated: clientAPI.bindEntityUpdatedListener(this.handleEntityUpdated.bind(this)),
      entityRemoved: clientAPI.bindEntityRemovedListener(this.handleEntityRemoved.bind(this)),
      gamepad: game.usingGamepadState.onUpdated(game)(this.handleUsingGamepadStateUpdate.bind(this)),
      isAutoRunning: game.isAutoRunningState.onUpdated(game)(this.handleIsAutoRunning.bind(this)),
      keybinds: game.onKeybindChanged(this.handleKeybindChanged.bind(this)),
      options: game.onGameOptionChanged(this.handleGameOptionChanged.bind(this)),
      objectiveDetails: hordetest.game.onObjectiveDetailsUpdate(this.handleObjectiveDetailsUpdate.bind(this)),
      runes: hordetest.game.onCollectedRunesUpdate(this.handleCollectedRunesUpdated.bind(this)),
      scenarioRoundEnded: hordetest.game.onScenarioRoundEnded(this.handleRoundEnded.bind(this)),
      ui: game.onReady(this.handleUIInitialized.bind(this)),
      onVoiceChatMemberUpdate: clientAPI.bindVoiceChatMemberUpdatedListener(
        this.handleVoiceChatMemberUpdated.bind(this)
      ),
      onVoiceChatMemberRemoved: clientAPI.bindVoiceChatMemberRemovedListener(
        this.handleVoiceChatMemberRemoved.bind(this)
      ),
      onVoiceChatScopeUpdated: clientAPI.bindVoiceChatScopeUpdateListener(this.handleVoiceChatScopeUpdated.bind(this)),
      entityDirection: clientAPI.bindEntityDirectionListener(this.handleEntityDirectionUpdate.bind(this))
    };

    this.intervals = [window.setInterval(this.handleNPCCountUpdate.bind(this, 200))];
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

  private handleEntityContext(entityID: EntityID, context: EntityContext) {
    this.props.dispatch(setEntityContext({ context, entityID }));
  }

  private handleEntityUpdated(newEntityState: BaseEntityState): void {
    if (newEntityState.objective) {
      this.props.dispatch(addOrUpdateObjective(newEntityState));
    }
    if (isPlayer(newEntityState)) {
      switch (newEntityState['characterKind']) {
        case CharacterKind.User:
          this.props.dispatch(addOrUpdateFriend(newEntityState));
          break;
        case CharacterKind.BossNPC:
        case CharacterKind.EliteNPC:
          this.props.dispatch(addOrUpdateBoss(newEntityState));
          break;
      }
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

  // Begin Ability Update Checking Functions
  private handleAbilityStatus(status: AbilityStatus): void {
    this.props.dispatch(updateAbility(status));
  }

  private handleAbilityActivated(id: number): void {
    this.props.dispatch(updateAbilityActivated({ id, timestamp: new Date() }));
  }
  // End Ability Update Checking Functions

  private handleEntityRemoved(entityID: string): void {
    this.props.dispatch(removeEntity(entityID));
  }

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

  private handleVoiceChatScopeUpdated(scope: string) {
    this.props.dispatch(updateVoiceChatScope(scope));
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

  private handleConsumables(consumeableItemsState: ConsumableItemsState) {
    this.props.dispatch(updateConsumables(consumeableItemsState));
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

  private async tryPlayNextDialogueMessage() {
    if (
      this.pendingDialogueMessages.length === 0 ||
      this.currentDialogueSoundTimeout !== null ||
      this.activeDialogueMessageCount >= DIALOGUE_MAX_NUM_MESSAGES_ON_SCREEN
    ) {
      return;
    }

    const playMessageSoundAndGetDurationInMilliseconds = async (soundID?: number): Promise<number> => {
      return (await clientAPI.startGameSound(soundID)) * 1000 + DIALOGUE_TIME_BETWEEN_SOUNDS_MS;
    };

    // pop the first message in the queue
    const message: PendingDialogueMessage = this.pendingDialogueMessages[0];
    this.pendingDialogueMessages = this.pendingDialogueMessages.slice(1);

    // play it and set up the completion callback
    const messageSoundDurationMS: number = await playMessageSoundAndGetDurationInMilliseconds(message.soundID);
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

      if (entityID in this.stateMirror.entities.bosses) {
        return;
      }

      //this is if entitydirections include data for corpses.  This allows us to reference 'friend' entities
      // to ensure we're only showing the information for the friend's active entity.
      const friend: PlayerEntityState = Object.values(this.stateMirror.entities.friends).find((curFriend) => {
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
