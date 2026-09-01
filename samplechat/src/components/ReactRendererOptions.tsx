import * as React from 'react';
import { MessageRendererOptions } from '@csegames/library/dist/chat/messageRendererOptions';
import { htmlEscape } from '@csegames/library/dist/chat/htmlRendererOptions';

export class ReactRendererOptions implements MessageRendererOptions<React.ReactChild> {
  public static Instance: ReactRendererOptions = new ReactRendererOptions();

  renderText(text: string): React.ReactChild {
    return text;
  }
  renderMissing(handler: string): React.ReactChild {
    return `{${handler}:???}`;
  }
}
