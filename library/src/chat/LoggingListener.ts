// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { ChatServiceListener } from './ChatServiceListener';
import { ErroredResponse, ReceivedResponse, RoomRecord } from './generated/uce-chat-v3';

export class LoggingListener implements ChatServiceListener {
  public enabled: boolean = true;

  onJoined(room: RoomRecord) {
    if (this.enabled) console.log('joined room', JSON.stringify(room));
  }
  onLeft(room: RoomRecord) {
    if (this.enabled) console.log('left room', JSON.stringify(room));
  }
  onReceived(message: ReceivedResponse) {
    if (this.enabled) console.log('chat message', JSON.stringify(message));
  }
  onError(error: ErroredResponse) {
    if (this.enabled) console.log('chat error', JSON.stringify(error));
  }
  onConnected() {
    if (this.enabled) console.log('connected to chat');
  }
  onConnectionFailure(reconnecting: boolean) {
    if (this.enabled) console.log('failed to connect to chat', reconnecting);
  }
  onDisconnected(reconnecting: boolean) {
    if (this.enabled) console.log('disconnected from chat', reconnecting);
  }
}
