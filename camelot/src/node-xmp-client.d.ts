/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

declare module xmpp {
  interface Stanza {
    attrs: {
      [key: string]: unknown;
    };
    children: (Stanza | string)[];
    name: string;
  }
  class Client {
    jid: {
      _local: string;
    };
    constructor(options: unknown);
    on(id: 'error', callback: (error: unknown) => void): void;
    on(id: 'online', callback: () => void): void;
    on(id: 'stanza', callback: (stanza: Stanza) => void): void;
    registerSaslMechanism(mechanism: Function): void;
    removeAllListeners(id: string): void;
    send(element: Element): void;
  }
  class Element {
    constructor(
      id: string,
      data: {
        to: string;
        type?: string;
      }
    );
    c(id: string, data?: unknown): Element;
    t(message: string): Element;
  }
}

declare module 'node-xmpp-client' {
  export = xmpp;
}
