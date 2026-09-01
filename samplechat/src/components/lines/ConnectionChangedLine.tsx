import React from 'react';
import { Line } from '../Line';

import './ConnectionChangedLine.css';

export class ConnectionChangedLine extends Line {
  constructor(readonly isConnect: boolean, numConnections: number, timestamp: number, readonly server: URL | null) {
    super(numConnections, timestamp);
  }

  render(): React.ReactChild {
    return (
      <div className='connectionLine'>
        You {this.isConnect ? 'connected to' : 'disconnected from'} {this.server?.toString() ?? ' <unspecified server>'}
      </div>
    );
  }
}
