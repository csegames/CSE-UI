// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { EmbedHandler } from './EmbedHandler';
import { ReceivedResponse } from './generated/uce-chat-v3';
import { MessageRendererOptions } from './MessageRendererOptions';

export interface MessageRenderer<T> {
  addHandler(handler: EmbedHandler<T>): void;
  render(message: ReceivedResponse): T[];
}

export class MessageRenderer<T> {
  static create<U>(options: MessageRendererOptions<U>): MessageRenderer<U> {
    return new MessageRenderImpl(options);
  }
}

class MessageRenderImpl<T> implements MessageRenderer<T> {
  private readonly handlers: Map<string, EmbedHandler<T>> = new Map();

  constructor(readonly options: MessageRendererOptions<T>) {}

  addHandler(handler: EmbedHandler<T>): void {
    this.handlers.set(handler.name, handler);
  }

  render(message: ReceivedResponse): T[] {
    var pos = 0;
    var result: T[] = [];
    for (const embed of message.embeds) {
      const handler = this.handlers.get(embed.handler);
      if (embed.offset > pos) {
        result.push(this.options.renderText(message.content.substring(pos, embed.offset)));
        pos = embed.offset;
      }
      result.push(handler?.render(embed) ?? this.options.renderMissing(embed.handler));
    }
    if (pos < message.content.length) {
      result.push(this.options.renderText(message.content.substring(pos, message.content.length)));
    }
    return result;
  }
}
