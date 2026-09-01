import { MessageRenderer } from '@csegames/library/dist/chat/MessageRenderer';
import { ReactRendererOptions } from './ReactRendererOptions';
import { LoggingListener } from '@csegames/library/dist/chat/LoggingListener';
import { ChatService } from '@csegames/library/dist/chat/ChatService';
import { store } from '../redux/store';
import { EmoteHandler } from './handlers/EmoteHandler';

// one-time setup that shouldn't be tied to react lifecycles
export const chatRenderer = MessageRenderer.create(ReactRendererOptions.Instance);
chatRenderer.addHandler(new EmoteHandler());

export const chatLogging = new LoggingListener();
chatLogging.enabled = false;

export const chatService = ChatService.create({
  scrollbackSize: 100,
  getBearerToken: () => store.getState().auth?.credentials?.accessToken ?? null,
  getServiceUrl: () => Promise.resolve(new URL(process.env.SERVICE_URL ?? 'http://localhost:7080/socket'))
});
chatService.addListener(chatLogging);
