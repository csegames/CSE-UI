/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as randomString from 'randomstring';
import { Client, Element } from 'node-xmpp-client';
import Config from './Config';
import EventEmitter from './EventEmitter';
import Message from './Message';
import Sender from './Sender';
import messageType from './messageType';

const NS_DISCO_ITEMS: string = 'http://jabber.org/protocol/disco#items';

interface Room {
  name: string;
  jid: string;
}

function cseLoginTokenMechanism() {}
cseLoginTokenMechanism.prototype.name = 'CSELOGINTOKEN';
cseLoginTokenMechanism.prototype.authAttrs = function() {
  return {};
};
cseLoginTokenMechanism.prototype.auth = function() {
  return this.access_token;
};
cseLoginTokenMechanism.prototype.match = function(options: any) {
  if (options.loginToken) {
    return true;
  }
  return false;
};

function debounce(func: any, wait: number, immediate: boolean) {
  let timeout = null;
  return function() {
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}

class CSEChat  {
  public client: Client;
  public config: Config;
  public eventEmitter: EventEmitter = new EventEmitter();
  private _reconnect: boolean = true;
  private _idCounter: number = 0;
  private _iqc: number = 0;
  private _msgs: any = {};
  private _inFlight: number = 0;
  private _pings: any = {};
  private _pingsInFlight: number = 0;
  private _pinger: any;
  private _recvQueue: Element[] = [];
  private messageHandlerTimeout: any = null;

  constructor(config = <Config> {}) {
    this.config = config;
  }

  public connect() {
    if (this.client) return;
    this.config.init();
    this.client = new Client({
      websocket: { url: this.config.websocketUrl },
      jid: `none@chat.camelotunchained.com/${randomString.generate(7)}`,
      loginToken: true,
      access_token: this.config.getPassword(),
    });
    this.client.registerSaslMechanism(cseLoginTokenMechanism);
    this.initializeEvents();
    return this.client;
  }

  public disconnect() {
    if (!this.client) return;
    if (this._pinger) {
      clearInterval(this._pinger);
      this._pinger = null;
    }
    this._reconnect = false;
    this.client.reconnect = false;
    this.client.removeAllListeners('disconnect');
    this.client.removeAllListeners('online');
    this.client.removeAllListeners('stanza');
    this.client.end();
    this.client = null;
  }

  public sendMessageToRoom(message: string, roomName: string) {
    if (!this.client) return;
    this.client.send(new Element('message', {
      to: roomName + '@' + this.config.service + '.' + this.config.address,
      type: 'groupchat',
    }).c('body').t(message));
  }

  public sendMessageToUser(message: string, userName: string) {
    if (!this.client) return;
    this.client.send(new Element('message', {
      to: userName + '@' + this.config.address,
      type: 'chat',
    }).c('body').t(message));
  }

  public joinRoom(roomName: string) {
    if (!this.client) return;
    this.client.send(new Element('presence', {
      to: roomName + '/' + this.client.jid._local,
    }).c('x', { xmlns: 'http://jabber.org/protocol/muc' }));
  }

  public leaveRoom(roomName: string) {
    if (!this.client) return;
    this.client.send(new Element('presence', {
      from: this.client.jid._,
      to: roomName + '/' + this.client.jid._local,
      type: 'unavailable',
    }));
  }

  public getRooms() {
    if (!this.client) return;
    const id: string = this.nextId('room');
    this.client.send(new Element('iq', {
      id,
      from: this.client.jid.toString(),
      to: this.config.serviceAddress.substr(1),
      type: 'get',
    }).c('query', { xmlns: NS_DISCO_ITEMS }));
    this._msgs[id] = { id, type: 'rooms', now: Date.now() };
    this._inFlight ++;
  }

  // alias eventEmitter
  public on(event: string, callback: (data: any) => void): any {
    return this.eventEmitter.on(event, callback);
  }

  public once(event: string, callback: (data: any) => void): any {
    return this.eventEmitter.listenOnce(event, callback);
  }

  public removeListener(event: any): void {
    this.eventEmitter.removeListener(event);
  }

  // PRIVATE METHODS (as private as they can be)

  // generate an id using an id generator
  private nextId(prefix: string): string {
    return prefix + (this._iqc++);
  }

  private initializeEvents() {
    if (!this.client) throw new Error('No connection to initialize');

    this.client.on('error', (error) => {
      switch (error.code) {
        case 'EADDRNOTAVAIL':
        case 'ENOTFOUND':
          this.eventEmitter.emit('error', 'Unable to connect to server at' + this.config.address);
          break;
        case 'ETIMEOUT':
          this.eventEmitter.emit('error', 'Connection timed out.');
          break;
        default:
          this.eventEmitter.emit('error', error);
          break;
      }
    });

    this.client.on('online', () => {
      // handle server assigned resource
      this.config.resource = this.client.jid._resource;
      // this.config.jid = this.client.jid.toString();

      this.eventEmitter.emit('online');
      // send global presence
      this.client.send(new Element('presence', { type: 'available' }).c('show').t('chat'));
      this.keepalive();
    }, this);

    this.client.on('disconnect', () => {
      this.client = null;
      this.eventEmitter.emit('disconnect', this._reconnect);
      if (this._reconnect) this.connect();
    });

    this.client.on('stanza', stanza => this.recvStanza(stanza));
  }

  private recvStanza(stanza: Element) {
    if (stanza.is('presence')) {
      this._recvQueue.push(stanza);
      if (this.messageHandlerTimeout) return;
      this.messageHandlerTimeout = setTimeout(() => this.messageHandler(), 1);
    } else {
      this.processStanza(stanza);
    }
  }

  private messageHandler() {
    const stanza = this._recvQueue.shift();
    this.processStanza(stanza);
    if (this._recvQueue.length === 0) {
      this.messageHandlerTimeout = null;
      return;
    }
    this.messageHandlerTimeout = setTimeout(() => this.messageHandler(), 2);
  }

  // called when we connect.  Initialise the ping response map, the inflight count
  // and if the interval time is not running, start the interval timer.
  private keepalive() {
    this._pings = {};
    this._pingsInFlight = 0;
    if (!this._pinger) {
      this._pinger = setInterval(() => {
        // every 10 seconds, send a ping stanza
        this.ping((ping: any) => {
          delete ping.pong; // dont pass handler to listener
          this.eventEmitter.emit('ping', ping);
        });
      }, 10000);
    }
  }

  private ping(pong: (ping: any) => void) {
    if (!pong) {
      console.error('ping without pong');
      debugger;
    }

    // If inflight is not 0, then we have a ping that was not responded to
    // so decide what to do (atm we disconnect)
    // if (this._pingsInFlight > 0) {

    //   // not got response to last ping, disconnect, stop ping timer
    //   // and trigger an error condition.
    //   this.disconnect();
    //   clearInterval(this._pinger);
    //   this._pinger = null;
    //   this.eventEmitter.emit('error', 'Ping timed out');
    //   return;
    // }

    // Create a new ping message
    const id: string = this.nextId('ping');
    this.client.send(new Element('iq', {
      id,
      from: this.client.jid.toString(),
      to: this.config.serviceAddress.substr(1),
      type: 'get',
    }).c('ping', { xmlns: 'urn:xmpp:ping' }));

    // register this ping and callback, and count inflight pings
    // so we can tell if we have any outstanding
    this._pings[id] = { id, pong, now: Date.now() };
    this._pingsInFlight ++;
  }

  // handle the ping response.  Lookup the ping in the ping map, if there
  // then decrement inflight count (this ping just landed) and call the pong
  // handler, finally remove the ping from the ping map.
  private pong(stanza: Element) {
    const id = stanza.attrs.id;
    const ping = this._pings[id];
    if (ping) {
      this._pingsInFlight --;
      if (ping.pong) {
        ping.pong(ping);
      } else {
        console.warn('ping lost its pong ' + JSON.stringify(ping));
      }
      delete this._pings[id];    // reclaim memory
    }
  }

  // #########################################################################

  private processStanza(stanza: Element) {
    // if error?
    if (stanza.attrs.type === 'error') {
      return;
    }

    if (stanza.is('message')) {
      switch (stanza.attrs.type) {
        case 'groupchat':
          this.eventEmitter.emit('groupmessage', this.parseMessageGroup(stanza));
          break;
        case 'chat':
          this.eventEmitter.emit('message', this.parseMessageChat(stanza));
          break;
      }
      return;
    }

    if (stanza.is('presence')) {
      const x = stanza.getChild('x');
      if (!x) return;
      const status = x.getChild('status');
      if (status) return;
      this.eventEmitter.emit('presence', this.parsePresence(stanza));
      return;
    }

    if (stanza.is('iq')) {
      if (stanza.attrs.type === 'result') {
        const bind = stanza.getChild('bind');
        if (bind) {
          const jid = bind.getChild('jid');
          // const jidString = jid
        }

        const ping = stanza.getChild('ping');
        if (ping) {
          this.pong(stanza);
        }
        const query = stanza.getChild('query');
        if (query) {
          if (query.attrs.xmlns === NS_DISCO_ITEMS) {
            this.gotRooms(stanza.attrs.id, query);
          }
        }
      }
    }

  }

  private gotRooms(id: string, stanza: Element): void {
    const items: Element[] = stanza.getChildren('item');
    const info: any = this._msgs[id];
    if (info) {
      this._inFlight --;
      delete this._msgs[id];
      const rooms: Room[] = [];
      items.forEach((item: Element) => {
        rooms.push({ name: item.attrs['name'], jid: item.attrs['jid'] });
      });
      this.eventEmitter.emit('rooms', rooms);
    }
  }

  private parseMessageGroup(stanza: Element) {
    const body = stanza.getChild('body');
    const message = body ? body.getText() : '';
    const nick = stanza.getChild('nick');
    const cseflags = stanza.getChild('cseflags');
    const isCSE = cseflags ? cseflags.attrs.cse : false;

    const fromArr = stanza.attrs.from.split('/');
    const roomName = fromArr[0].split('@')[0];
    const sender = fromArr[1];
    const senderName = nick ? nick.getText() : sender;

    const s = new Sender(0, sender, senderName, isCSE);
    return new Message(this._idCounter++, new Date(), message, roomName, messageType.MESSAGE_GROUP, s);
  }

  private parseMessageChat(stanza: Element) {
    const body = stanza.getChild('body');
    const message = body ? body.getText() : '';
    const nick = stanza.getChild('nick');
    const sender = stanza.from.split('@')[0];
    const senderName = nick ? nick.getText() : sender;
    const cseflags = stanza.getChild('cseflags');
    const isCSE = cseflags ? cseflags.attrs.cse : false;

    const s = new Sender(0, sender, senderName, isCSE);
    return new Message(this._idCounter++, new Date(), message, sender, messageType.MESSAGE_CHAT, s);
  }

  private parsePresence(stanza: Element) {
    const x = stanza.getChild('x');
    const status = x.getChild('status');
    const role = x.getChild('item').attrs.role;

    const fromArr = stanza.attrs.from.split('/');
    const room = fromArr[0];
    const roomName = room.split('@')[0];
    const sender = fromArr[1];
    const senderName = sender.split('@')[0];

    const cseflags = stanza.getChild('cseflags');

    // Kludge since presence stanzas don't currently set cseflags
    const isCSE = cseflags ? cseflags.attrs.cse : senderName.slice(0,3) === 'cse';

    const s = new Sender(0, sender, senderName, isCSE);

    if (stanza.attrs.type === 'unavailable') {
      return new Message(this._idCounter++, new Date(), '', roomName, messageType.UNAVAILIBLE, s);
    }
    return new Message(this._idCounter++, new Date(), '', roomName, messageType.AVAILIBLE, s);
  }
}

export {
  Config,
  CSEChat,
  Room,
};

export default CSEChat;
