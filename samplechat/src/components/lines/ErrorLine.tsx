import React from 'react';
import { Line } from '../Line';
import { ErroredResponse } from '@csegames/library/dist/chat/generated/uce-chat-v3';

import './ErrorLine.css';

export class ErrorLine extends Line {
  constructor(readonly error: ErroredResponse, numConnections: number, timestamp: number) {
    super(numConnections, timestamp);
  }

  render(): React.ReactChild {
    return <div className='errorLine'>[error] {this.error.error.type}</div>;
  }
}
