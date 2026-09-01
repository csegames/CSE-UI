import React from 'react';
import { Line } from '../Line';

import './ConnectionFailedLine.css';

export class ConnectionFailedLine extends Line {
  constructor(readonly isConnect: boolean, numConnections: number, timestamp: number, readonly server: URL | null) {
    super(numConnections, timestamp);
  }

  render(): React.ReactChild {
    return (
      <div className='failureLine'>You failed to connect to {this.server?.toString() ?? ' <unspecified server>'}</div>
    );
  }
}
