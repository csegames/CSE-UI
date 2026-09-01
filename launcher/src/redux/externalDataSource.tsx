/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import * as React from 'react';
import { AppDispatch, RootState, store } from './store';
import { ListenerHandle } from '../lib/ListenerHandle';

/**
 * This is a base class that provides ready access to dispatch and reduxState.
 * Inheritors should be added to render functions describing their lifecycle,
 * such as inside the "SharedContextProviders' render function for always
 * on connections.
 */
export class ExternalDataSource<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {
  private handles: ListenerHandle[] = [];
  private isMounted: boolean = false;

  protected get dispatch(): AppDispatch {
    return store.dispatch;
  }
  protected get reduxState(): RootState {
    return store.getState();
  }

  protected bind(): Promise<ListenerHandle[]> {
    return Promise.resolve([]);
  }

  render() {
    return <></>;
  }

  componentDidMount(): void {
    this.isMounted = true;
    this.bind().then(
      (value) => {
        // if we unmounted before this connection completed, immediately disconnect
        if (this.isMounted) {
          this.rebind(value);
        } else {
          for (const handle of value) {
            handle.close();
          }
        }
      },
      (error) => console.error(`network connection failed: ${error}`)
    );
  }

  componentWillUnmount(): void {
    for (const handle of this.handles) {
      handle.close();
    }
    this.handles = [];
    this.isMounted = false;
  }

  protected rebind(handles: ListenerHandle[]): void {
    for (const handle of this.handles) {
      if (handles.indexOf(handle) < 0) {
        handle.close();
      }
    }
    this.handles = handles;
  }
}
