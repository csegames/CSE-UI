import * as React from 'react';
import { ChatLine } from '../ChatLine';
import { ChatScope } from '@csegames/library/dist/camelotunchained/game/types/ChatTypes';
import { getCSSProperties } from '../ChatScopes';

export class ChatLineSimple extends ChatLine {
  constructor(scope: ChatScope, readonly text: string) {
    super(scope);
  }

  render(): React.ReactChild {
    return (
      <div key={this.id} style={getCSSProperties(this.scope)}>
        <span>{this.text}</span>
      </div>
    );
  }
}
