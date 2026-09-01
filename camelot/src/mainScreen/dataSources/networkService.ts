/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { NetworkFailure } from '@csegames/library/dist/_baseGame/types/NetworkFailure';
import { getStringTableValue } from '../helpers/stringTableHelpers';
import { addErrorNotice } from '../redux/errorNoticesSlice';
import { ExternalDataSource } from '../redux/externalDataSource';

// String IDs
const StringIDNetworkFailureBadCharacter = 'NetworkFailureBadCharacter';
const StringIDNetworkFailureBanned = 'NetworkFailureBanned';
const StringIDNetworkFailureConnectFailed = 'NetworkFailureConnectFailed';
const StringIDNetworkFailureDisconnected = 'NetworkFailureDisconnected';
const StringIDNetworkFailureException = 'NetworkFailureException';
const StringIDNetworkFailureFailedPermission = 'NetworkFailureFailedPermission';
const StringIDNetworkFailureHasNewerConnection = 'NetworkFailureHasNewerConnection';
const StringIDNetworkFailureInvalidAccessToken = 'NetworkFailureInvalidAccessToken';
const StringIDNetworkFailureInvalidIPForAccessToken = 'NetworkFailureInvalidIPForAccessToken';
const StringIDNetworkFailureInvalidUser = 'NetworkFailureInvalidUser';
const StringIDNetworkFailureKicked = 'NetworkFailureKicked';
const StringIDNetworkFailureNoAccessToken = 'NetworkFailureNoAccessToken';
const StringIDNetworkFailurePrivacyFailure = 'NetworkFailurePrivacyFailure';
const StringIDNetworkFailureServerIsFull = 'NetworkFailureServerIsFull';
const StringIDNetworkFailureServerNotReady = 'NetworkFailureServerNotReady';
const StringIDNetworkFailureShutdown = 'NetworkFailureShutdown';
const StringIDNetworkFailureWrongPlayTime = 'NetworkFailureWrongPlayTime';
const StringIDNetworkFailureWrongVersion = 'NetworkFailureWrongVersion';
const StringIDNetworkFailureZombie = 'NetworkFailureZombie';

export class NetworkService extends ExternalDataSource {
  protected bind(): Promise<ListenerHandle[]> {
    const handles = Promise.resolve([clientAPI.bindNetworkFailureListener(this.handleNetworkFailure.bind(this))]);
    return handles;
  }

  private handleNetworkFailure(type: NetworkFailure): void {
    const string = this.getNetworkFailureString(type);
    if (string) {
      this.dispatch(addErrorNotice(getStringTableValue(string, this.reduxState.stringTable.stringTable)));
    }
  }

  private getNetworkFailureString(type: NetworkFailure): string | null {
    switch (type) {
      case NetworkFailure.BadCharacter:
        return StringIDNetworkFailureBadCharacter;
      case NetworkFailure.Banned:
        return StringIDNetworkFailureBanned;
      case NetworkFailure.ConnectFailed:
        return StringIDNetworkFailureConnectFailed;
      case NetworkFailure.Disconnected:
        return StringIDNetworkFailureDisconnected;
      case NetworkFailure.Exception:
        return StringIDNetworkFailureException;
      case NetworkFailure.FailedPermission:
        return StringIDNetworkFailureFailedPermission;
      case NetworkFailure.HasNewerConnection:
        return StringIDNetworkFailureHasNewerConnection;
      case NetworkFailure.InvalidAccessToken:
        return StringIDNetworkFailureInvalidAccessToken;
      case NetworkFailure.InvalidIPForAccessToken:
        return StringIDNetworkFailureInvalidIPForAccessToken;
      case NetworkFailure.InvalidUser:
        return StringIDNetworkFailureInvalidUser;
      case NetworkFailure.Kicked:
        return StringIDNetworkFailureKicked;
      case NetworkFailure.NoAccessToken:
        return StringIDNetworkFailureNoAccessToken;
      case NetworkFailure.PrivacyFailure:
        return StringIDNetworkFailurePrivacyFailure;
      case NetworkFailure.ServerIsFull:
        return StringIDNetworkFailureServerIsFull;
      case NetworkFailure.ServerNotReady:
        return StringIDNetworkFailureServerNotReady;
      case NetworkFailure.Shutdown:
        return StringIDNetworkFailureShutdown;
      case NetworkFailure.WrongPlayTime:
        return StringIDNetworkFailureWrongPlayTime;
      case NetworkFailure.WrongVersion:
        return StringIDNetworkFailureWrongVersion;
      case NetworkFailure.Zombie:
        return StringIDNetworkFailureZombie;
    }
    return null;
  }
}
