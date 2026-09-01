import { ChatScope } from '@csegames/library/dist/camelotunchained/game/types/ChatTypes';

// Messages from the server may arrive out of order, so they must be sorted by timestamp; local
// messages should be given the greatest timestamp seen to this point so that they can be
// properly inserted at the bottom of the current chat.
let greatestTimestamp = 0;

// Each time the client connects to a chat service, it will potentially be dealing with a
// different server time, so we override timestamp sorting by the number of connection resets
// we have seen as each connection lifetime can be reliably sorted as a single block.
let numChatConnections = 0;

// A global, incrementing ID used as the Key for whatever we actually render helps React reuse
// the render output instead of forcing lots of widget destruction and re-creation. It is also
// the finest grain sort key since messages with identical timestamps will be created in id
// ordering.
let nextId = 1;

export function incrementChatConnections() {
  numChatConnections++;
  greatestTimestamp = 0;
}

export abstract class ChatLine {
  public readonly id: number;
  public readonly numConnections: number;
  public readonly timestamp: number;

  // These constructor params automatically become accessible props on each class instance.
  constructor(public readonly scope: ChatScope, timestamp?: number) {
    this.numConnections = numChatConnections;
    this.timestamp = timestamp ?? greatestTimestamp;
    this.id = ++nextId;
    greatestTimestamp = Math.max(this.timestamp, greatestTimestamp);
  }

  public abstract render(): React.ReactChild;
}
