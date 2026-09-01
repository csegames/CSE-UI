import { RoomRecord } from '@csegames/library/dist/chat/generated/uce-chat-v3';
import React from 'react';
import { Line } from '../Line';

import './RoomChangedLine.css';

export class RoomChangedLine extends Line {
  constructor(readonly room: RoomRecord, numConnections: number, timestamp: number, readonly isJoin: boolean) {
    super(numConnections, timestamp);
  }

  render(): React.ReactChild {
    return (
      <div className='roomLine'>
        You {this.isJoin ? 'joined' : 'left'} {this.room.scope} ({this.room.id})
      </div>
    );
  }
}
