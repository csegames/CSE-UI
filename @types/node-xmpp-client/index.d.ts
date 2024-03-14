// Type definitions for node-xmpp-client v2.1

declare module 'node-xmpp-client' {
  import { Element } from 'ltx';
  import * as EventEmitter from 'events';

  export interface SessionParams {
    // This is an incomplete list.
    websocket: { url: string };
    loginToken: boolean;
    access_token: string;
  }

  export interface ClientParams extends SessionParams {
    jid: string;
    password?: string;
    host?: string;
    port?: number;
    reconnect?: boolean;
    autostart?: boolean;
    register?: boolean;
    legacySSL?: boolean;
    credentials?: { [key: string]: any };
    actAs?: string;
    disallowTLS?: boolean;
    preferred?: string;
    ['bosh.url']?: string;
    ['bosh.prebind']?: (error: string, data: any) => void;
  }

  export class Session extends EventEmitter {
    public pause(): void;
    public resume(): void;
    public send(element: Element): void;
    public end(): void;

    public jid: JID;
  }

  export class Client extends Session {
    constructor(params: ClientParams);

    public reconnect: boolean;
  }

  export class JID {
    local: string;
    domain: string;
    resource: string;

    constructor(local: string, domain?: string, resource?: string);

    parseJID(jid: string): void;
    toString(unescape?: any): string;
    bare(): JID;
    equals(other: JID): boolean;
    setLocal(local: string, escape?: any): void;
    getLocal(unescape?: any): string;
    setDomain(value: string): void;
    getDomain(): string;
    setResource(value: string): void;
    getResource(): string;
  }

  export class Stanza extends Element {
    from: string;
    to: string;
    id: string;
    type: string;

    constructor(name: string, attrs?: any);
  }
}
