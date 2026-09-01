// Should map to the Scopes enum in Scopes.cs (CSEverything.sln)
export const ChatScopesServer = {
  Guild: 'guild',
  Global: 'global',
  Local: 'say',
  Loopback: 'loopback',
  Party: 'party',
  Officer: 'officer',
  Shout: 'shout',
  Trade: 'trade',
  Warband: 'warband',
  Whisper: 'whisper',
  Zone: 'zone'
} as const;

export const ChatScopesLocal = {
  Combat: 'combat',
  Console: 'console',
  Error: 'error'
} as const;

export const ChatScopes = { ...ChatScopesServer, ...ChatScopesLocal } as const;
export type ChatScope = (typeof ChatScopes)[keyof typeof ChatScopes];

const chatScopeValues: string[] = Object.values(ChatScopes);
export function isChatScope(value: unknown): value is ChatScope {
  return typeof value === 'string' && chatScopeValues.includes(value);
}

export interface ChatTab {
  name: string;
  // Every "scope" corresponds to a single Room that you might be in.
  scopes: ChatScope[];
}

export const CHAT_TAB_NAME_MAIN = 'ChatTabNameMain';
export const systemChatTabNameStringIDs: string[] = [CHAT_TAB_NAME_MAIN];
export function isSystemChatTab(tabName: string): boolean {
  return systemChatTabNameStringIDs.includes(tabName);
}
