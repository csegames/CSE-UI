import * as React from 'react';
import { ChatLine } from '../ChatLine';
import { ChatScopes } from '@csegames/library/dist/camelotunchained/game/types/ChatTypes';

const ChatNotice = 'HUD-Chat-Notice';

export class ChatLineNotice extends ChatLine {
  constructor(readonly text: string) {
    super(ChatScopes.Console);
  }

  render(): React.ReactChild {
    return (
      <div key={this.id} className={ChatNotice}>
        <span>{this.text}</span>
      </div>
    );
  }
}
