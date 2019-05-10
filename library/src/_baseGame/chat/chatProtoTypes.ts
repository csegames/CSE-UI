/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  enum RoomActionResponse_ActionType {
    CREATE = 0,
    DELETE = 1,
    RENAME = 2,
    JOIN = 3,
    LEAVE = 4,
    CREATEROLE = 5,
    UPDATEROLE = 6,
    DELETEROLE = 7,
    ASSIGNROLE = 8,
    INVITE = 9,
    KICKUSER = 10,
    BANUSER = 11,
    MUTEUSER = 12,
    TRANSFEROWNERSHIP = 13
  }

  interface RoomActionResponse {
    action: RoomActionResponse_ActionType;
    success: boolean;
    message: string;
  }

  enum RoomInfo_RoomCategory {
    GENERAL = 0,
    WARBAND = 1,
    ORDER = 2,
    CAMPAIGN = 3,
    CUSTOM = 4
  }

  interface RoomInfo_RoomRole {
    name: string;
    permissions: number;
  }

  interface RoomInfo {
    roomID: string;
    name: string;
    category: RoomInfo_RoomCategory;
    roles: RoomInfo_RoomRole[];
  }

  interface RoomJoined {
    roomID: string;
    userID: string;
    name: string;
    role: string;
  }

  interface RoomLeft {
    roomID: string;
    userID: string;
    name: string;
  }

  interface RoomRenamed {
    roomID: string;
    name: string;
  }

  interface RoomRoleAdded {
    roomID: string;
    name: string;
    permissions: number;
  }

  interface RoomRoleUpdated {
    roomID;
    string;
    name: string;
    permissions: number;
  }

  interface RoomRoleRemoved {
    roomID: string;
    name: string;
  }

  interface RoomRoleAssigned {
    roomID: string;
    roleName: string;
    userID: string;
  }

  interface RoomInviteReceived {
    roomID: string;
    roomName: string;
  }

  interface RoomKickReceived {
    roomID: string;
  }

  interface RoomMuteReceived {
    roomID: string;
    expiration: any;
  }

  interface RoomBanReceived {
    roomID: string;
    expiration: any;
  }

  interface RoomOwnerChanged {
    roomID: string;
    userID: string;
  }

  interface RoomsDirectory {
    rooms: RoomInfo[];
  }

  enum ChatMessage_MessageTypes {
    Error = 0,
    Direct = 1,
    Room = 2,
    Announcement = 3
  }

  enum ChatMessage_SenderFlag {
    PLAYER = 0,
    CSE = 1
  }

  interface ProtoChatMessage {
    type: ChatMessage_MessageTypes;
    content: string;
    senderFlag: ChatMessage_SenderFlag;
    senderID?: string;
    senderName?: string;
    targetID?: string;
    targetName?: string;
  }

  interface ChatMessage extends ProtoChatMessage {
    when: Date;
  }

  interface PingPongMessage {
    ping: boolean;
  }

  enum ChatClientUnionMessage_MessageTypes {
    NONE = 0,
    CHATMESSAGE = 1,
    PINGPONGMESSAGE = 2,
    ROOMACTION = 4,
    ROOMINFO = 5,
    JOINED = 6,
    LEFT = 7,
    RENAMED = 8,
    ROLEADDED = 9,
    ROLEUPDATED = 10,
    ROLEREMOVED = 11,
    ROLEASSIGNED = 12,
    INVITERECEIVED = 13,
    KICKED = 14,
    BANNED = 15,
    MUTED = 16,
    OWNERCHANGED = 17,
    DIRECTORY = 18,
  }

  interface ChatClientUnionMessage {
    type: ChatClientUnionMessage_MessageTypes;
    chat?: ProtoChatMessage;
    pingPong?: PingPongMessage;
    roomAction?: RoomActionResponse;
    info?: RoomInfo;
    joined?: RoomJoined;
    left?: RoomLeft;
    renamed?: RoomRenamed;
    roleAdded?: RoomRoleAdded;
    roleUpdated?: RoomRoleUpdated;
    roleRemoved?: RoomRoleRemoved;
    roleAssigned?: RoomRoleAssigned;
    invited?: RoomInviteReceived;
    kicked?: RoomKickReceived;
    muted?: RoomMuteReceived;
    banned?: RoomBanReceived;
    ownerChanged?: RoomOwnerChanged;
  }

  interface Window {
    RoomActionResponse_ActionType: typeof RoomActionResponse_ActionType;
    RoomInfo_RoomCategory: typeof RoomInfo_RoomCategory;
    ChatMessage_MessageTypes: typeof ChatMessage_MessageTypes;
    ChatMessage_SenderFlag: typeof ChatMessage_SenderFlag;
    ChatClientUnionMessage_MessageTypes: typeof ChatClientUnionMessage_MessageTypes;
  }
}
enum RoomActionResponse_ActionType {
  CREATE = 0,
  DELETE = 1,
  RENAME = 2,
  JOIN = 3,
  LEAVE = 4,
  CREATEROLE = 5,
  UPDATEROLE = 6,
  DELETEROLE = 7,
  ASSIGNROLE = 8,
  INVITE = 9,
  KICKUSER = 10,
  BANUSER = 11,
  MUTEUSER = 12,
  TRANSFEROWNERSHIP = 13
}
window.RoomActionResponse_ActionType = RoomActionResponse_ActionType;

enum RoomInfo_RoomCategory {
  GENERAL = 0,
  WARBAND = 1,
  ORDER = 2,
  CAMPAIGN = 3,
  CUSTOM = 4
}
window.RoomInfo_RoomCategory = RoomInfo_RoomCategory;

enum ChatMessage_MessageTypes {
  Error = 0,
  Direct = 1,
  Room = 2,
  Announcement = 3
}
window.ChatMessage_MessageTypes = ChatMessage_MessageTypes;

enum ChatMessage_SenderFlag {
  PLAYER = 0,
  CSE = 1
}
window.ChatMessage_SenderFlag = ChatMessage_SenderFlag;

enum ChatClientUnionMessage_MessageTypes {
  NONE = 0,
  CHATMESSAGE = 1,
  PINGPONGMESSAGE = 2,
  ROOMACTION = 4,
  ROOMINFO = 5,
  JOINED = 6,
  LEFT = 7,
  RENAMED = 8,
  ROLEADDED = 9,
  ROLEUPDATED = 10,
  ROLEREMOVED = 11,
  ROLEASSIGNED = 12,
  INVITERECEIVED = 13,
  KICKED = 14,
  BANNED = 15,
  MUTED = 16,
  OWNERCHANGED = 17,
  DIRECTORY = 18,
}
window.ChatClientUnionMessage_MessageTypes = ChatClientUnionMessage_MessageTypes;
