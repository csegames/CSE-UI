// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { ErroredResponse, ReceivedResponse, RoomRecord } from './generated/uce-chat-v3';

export interface ChatServiceListener {
  readonly onJoined: (room: RoomRecord) => void;
  readonly onLeft: (room: RoomRecord) => void;
  readonly onReceived: (message: ReceivedResponse) => void;
  readonly onError: (error: ErroredResponse) => void;
  readonly onConnected: () => void;
  readonly onConnectionFailure: (reconnecting: boolean) => void;
  readonly onDisconnected: (reconnecting: boolean) => void;
}
