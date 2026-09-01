import { EmbedHandler } from '@csegames/library/dist/chat/EmbedHandler';
import { EmbedRecord } from '@csegames/library/dist/chat/generated/uce-chat-v3';

export class EmoteHandler implements EmbedHandler<React.ReactChild> {
  public readonly name = 'emote';

  render(embed: EmbedRecord): React.ReactChild | null {
    return `:${embed.data['name']}:`;
  }
}
