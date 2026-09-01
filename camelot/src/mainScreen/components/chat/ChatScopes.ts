import { ChatScope, ChatScopes } from '@csegames/library/dist/camelotunchained/game/types/ChatTypes';

export const SelectionType = {
  Hidden: 'hidden', // always present in system, never in list
  Visible: 'visible',
  PinnedVisible: 'pinnedVisible' // always present in system, optional elsewhere
} as const;

export type SelectionType = (typeof SelectionType)[keyof typeof SelectionType];

export interface ChatScopeDisplayData {
  nameStringID: string;
  descriptionStringID: string;
  missingStringID: string; // console message to display if scope isn't available on attempted switch
  joinedStringID?: string; // optional joined message
  leftStringID?: string; // optional left message
  color: string;
  selectionType: SelectionType;
}

export const allChatScopeDisplayData: Record<ChatScope, ChatScopeDisplayData> = {
  [ChatScopes.Combat]: {
    nameStringID: 'ChatScopeNameCombat',
    descriptionStringID: 'ChatScopeDescriptionCombat',
    missingStringID: 'ChatScopeMissingCombat',
    color: '#808080',
    selectionType: SelectionType.Visible
  },
  [ChatScopes.Console]: {
    nameStringID: 'ChatScopeNameConsole',
    descriptionStringID: 'ChatScopeDescriptionConsole',
    missingStringID: 'ChatScopeMissingConsole',
    color: '#b3b3b3',
    selectionType: SelectionType.PinnedVisible
  },
  [ChatScopes.Error]: {
    nameStringID: 'ChatScopeNameError',
    descriptionStringID: 'ChatScopeDescriptionError',
    missingStringID: 'ChatScopeMissingError',
    color: '#ef0e0e',
    selectionType: SelectionType.PinnedVisible
  },
  [ChatScopes.Global]: {
    nameStringID: 'ChatScopeNameGlobal',
    descriptionStringID: 'ChatScopeDescriptionGlobal',
    missingStringID: 'ChatScopeMissingGlobal',
    color: '#ecec00',
    selectionType: SelectionType.Visible
  },
  [ChatScopes.Guild]: {
    nameStringID: 'ChatScopeNameGuild',
    descriptionStringID: 'ChatScopeDescriptionGuild',
    missingStringID: 'ChatScopeMissingGuild',
    joinedStringID: 'ChatScopeJoinedGuild',
    leftStringID: 'ChatScopeLeftGuild',
    color: '#1fcd2b',
    selectionType: SelectionType.Visible
  },
  [ChatScopes.Local]: {
    nameStringID: 'ChatScopeNameLocal',
    descriptionStringID: 'ChatScopeDescriptionLocal',
    missingStringID: 'ChatScopeMissingLocal',
    color: '#b3b3b3',
    selectionType: SelectionType.Visible
  },
  [ChatScopes.Loopback]: {
    nameStringID: 'ChatScopeNameLoopback',
    descriptionStringID: 'ChatScopeDescriptionLoopback',
    missingStringID: 'ChatScopeMissingLooopback',
    color: '#b3b3b3',
    selectionType: SelectionType.Hidden
  },
  [ChatScopes.Officer]: {
    nameStringID: 'ChatScopeNameOfficer',
    descriptionStringID: 'ChatScopeDescriptionOfficer',
    missingStringID: 'ChatScopeMissingOfficer',
    joinedStringID: 'ChatScopeJoinedOfficer',
    leftStringID: 'ChatScopeLeftOfficer',
    color: '#c885e0',
    selectionType: SelectionType.Visible
  },
  [ChatScopes.Party]: {
    nameStringID: 'ChatScopeNameParty',
    descriptionStringID: 'ChatScopeDescriptionParty',
    missingStringID: 'ChatScopeMissingParty',
    joinedStringID: 'ChatScopeJoinedParty',
    leftStringID: 'ChatScopeLeftParty',
    color: '#fcba05',
    selectionType: SelectionType.Visible
  },
  [ChatScopes.Shout]: {
    nameStringID: 'ChatScopeNameShout',
    descriptionStringID: 'ChatScopeDescriptionShout',
    missingStringID: 'ChatScopeMissingShout',
    color: '#d92e8e',
    selectionType: SelectionType.Visible
  },
  [ChatScopes.Trade]: {
    nameStringID: 'ChatScopeNameTrade',
    descriptionStringID: 'ChatScopeDescriptionTrade',
    missingStringID: 'ChatScopeMissingTrade',
    color: '#6257ff',
    selectionType: SelectionType.Visible
  },
  [ChatScopes.Warband]: {
    nameStringID: 'ChatScopeNameWarband',
    descriptionStringID: 'ChatScopeDescriptionWarband',
    missingStringID: 'ChatScopeMissingWarband',
    joinedStringID: 'ChatScopeJoinedWarband',
    leftStringID: 'ChatScopeLeftWarband',
    color: '#ff6000',
    selectionType: SelectionType.Visible
  },
  [ChatScopes.Whisper]: {
    nameStringID: 'ChatScopeNameWhisper',
    descriptionStringID: 'ChatScopeDescriptionWhisper',
    missingStringID: 'ChatScopeMissingWhisper',
    color: '#46bff1',
    selectionType: SelectionType.Visible
  },
  [ChatScopes.Zone]: {
    nameStringID: 'ChatScopeNameZone',
    descriptionStringID: 'ChatScopeDescriptionZone',
    missingStringID: 'ChatScopeMissingZone',
    color: '#00c59a',
    selectionType: SelectionType.Visible
  }
} as const;

const DEFAULT_CHAT_COLOR = '#b3b3b3';
export function getCSSProperties(scope: ChatScope): React.CSSProperties {
  return { color: allChatScopeDisplayData[scope]?.color ?? DEFAULT_CHAT_COLOR };
}

export const optionalScopes = Object.entries(allChatScopeDisplayData)
  .filter(([k, v]) => v.selectionType !== SelectionType.Hidden)
  .map(([k]) => k as ChatScope);

export const optionalSystemScopes = Object.entries(allChatScopeDisplayData)
  .filter(([k, v]) => v.selectionType === SelectionType.Visible)
  .map(([k]) => k as ChatScope);

export const allScopes = optionalScopes;
export const allSystemScopes = Object.entries(allChatScopeDisplayData).map(([k]) => k as ChatScope);

export const requiredScopes: ChatScope[] = [];
export const requiredSystemScopes = Object.entries(allChatScopeDisplayData)
  .filter(([k, v]) => v.selectionType !== SelectionType.Visible) // keep pinned + hidden scopes
  .map(([k]) => k as ChatScope);

export const selectors: Map<string, ChatScope> = new Map([
  ['global', ChatScopes.Global],
  ['guild', ChatScopes.Guild],
  ['g', ChatScopes.Guild],
  ['say', ChatScopes.Local],
  ['s', ChatScopes.Local],
  ['loopback', ChatScopes.Loopback],
  ['o', ChatScopes.Officer],
  ['officer', ChatScopes.Officer],
  ['p', ChatScopes.Party],
  ['party', ChatScopes.Party],
  ['r', ChatScopes.Whisper],
  ['t', ChatScopes.Trade],
  ['trade', ChatScopes.Trade],
  ['w', ChatScopes.Whisper], // requires name
  ['wb', ChatScopes.Warband],
  ['warband', ChatScopes.Warband],
  ['whisper', ChatScopes.Whisper],
  ['y', ChatScopes.Shout],
  ['yell', ChatScopes.Shout],
  ['zone', ChatScopes.Zone],
  ['z', ChatScopes.Zone]
]);

export function isResponseSelector(text: string): boolean {
  return text === 'r';
}

export function getChatScopeFromSlashSelector(slash?: string): ChatScope | undefined {
  if (!slash) return undefined;
  return selectors.get(slash.toLocaleLowerCase());
}
