import { MessageRenderer } from '@csegames/library/dist/chat/MessageRenderer';
import { LoggingListener } from '@csegames/library/dist/chat/LoggingListener';
import { ChatService } from '@csegames/library/dist/chat/ChatService';
import { game } from '@csegames/library/dist/_baseGame';
import { ChatMessageRendererOptions } from './ChatMessageRendererOptions';
import { PresenceAPI, ChatServerRecord } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { webConf } from '../../redux/networkConfiguration';
import { registerGeneralSlashCommands } from '../../slashCommands/generalCommands';
import { registerClientSlashCommands } from '../../slashCommands/clientCommands';
import { registerUISlashCommands } from '../../slashCommands/uiCommands';
import { registerPartySlashCommands } from '../../slashCommands/partyCommands';
import { SlashCommandRegistry } from '@csegames/library/dist/_baseGame/slashCommandRegistry';
import { AppDispatch, RootState, store } from '../../redux/store';

// one-time setup that shouldn't be tied to react lifecycles
export const slashCommands = new SlashCommandRegistry<RootState, AppDispatch>(() => store.getState(), store.dispatch);
const handles = registerClientSlashCommands(slashCommands);
handles.push(...registerGeneralSlashCommands(slashCommands));
handles.push(...registerUISlashCommands(slashCommands));
handles.push(...registerPartySlashCommands(slashCommands));

export const chatRenderer = MessageRenderer.create(ChatMessageRendererOptions.Instance);
export const chatLogging = new LoggingListener();
chatLogging.enabled = false;

export const chatService = ChatService.create({
  scrollbackSize: 1, // not actively using this here
  getBearerToken: () => game?.accessToken ?? null,
  getServiceUrl: async () => {
    const response = await PresenceAPI.GetChatServer(webConf);
    if (!response.ok) return null;
    const data = response.json<ChatServerRecord>();
    if (data.transport != 'uce-chat-v3' || !data.address) return null;
    try {
      return new URL(data.address);
    } catch (e) {
      console.error(`Could not parse chat url ${e}`);
      return null;
    }
  }
});
chatService.addListener(chatLogging);
