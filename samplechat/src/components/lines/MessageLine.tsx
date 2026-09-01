import React from 'react';
import { Line } from '../Line';
import { ReceivedResponse } from '@csegames/library/dist/chat/generated/uce-chat-v3';

import './MessageLine.css';

export class MessageLine extends Line {
  constructor(numConnections: number, readonly message: ReceivedResponse, readonly segments: React.ReactChild[]) {
    super(numConnections, message.sentAt);
  }

  render(): React.ReactChild {
    const { scope } = this.message.room;
    return (
      <div className='messageLine'>
        [<span className={`scope ${scope}`}>{scope}</span>]{' '}
        <span className={`sender ${scope}`}>{this.message.senderName}</span>:
        <span className={scope}> {this.segments}</span>
      </div>
    );
  }
}
