import * as React from 'react';
import { MessageRendererOptions } from '@csegames/library/dist/chat/messageRendererOptions';

export class ChatMessageRendererOptions implements MessageRendererOptions<React.ReactChild> {
  public static Instance: ChatMessageRendererOptions = new ChatMessageRendererOptions();

  renderText(text: string): React.ReactChild {
    return text;
  }
  renderMissing(handler: string): React.ReactChild {
    return `{${handler}:???}`;
  }
}
