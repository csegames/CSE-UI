import { EmbedRecord } from './generated/uce-chat-v3';

export interface EmbedHandler<T> {
  readonly name: string;
  render(embed: EmbedRecord): T | null;
}
