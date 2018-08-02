/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import Whitelist from './URLWhitelist';
import URLRegExp from './URLRegExp';
import { chatConfig } from './ChatConfig';

function fixupLink(url: string) : string {
  let newUrl = url;
  if (url.indexOf('www.') === 0) {
    newUrl = 'http://' + url;
  }
  return newUrl;
}

function triggerAutoScroll() {
  const event = new Event('auto-scroll');
  window.dispatchEvent(event);
}

// tslint:disable
function fromText(text: string, keygen:() => number) : JSX.Element[] {

  const videoMatch: string = chatConfig.EMBED_VIDEOS ? Whitelist.isVideo(text) : null;
  const vineMatch: string = chatConfig.EMBED_VIDEOS ? Whitelist.isVine(text) : null;
  const href : string = fixupLink(text);

  // Video link (youtube)
  if (videoMatch) {
    return [
      <a key={keygen()} className='chat-line-message' target='_blank' href={href}>
        <iframe className='chat-line-video' src={videoMatch} allowFullScreen></iframe>
      </a>,
    ];
  } else if (vineMatch) { // Vine link (vine)
    return [
      <a key={keygen()} className='chat-line-message' target='_blank' href={href}>
        <iframe className='chat-line-vine' src={vineMatch}></iframe>
        <script src='https://platform.vine.co/static/scripts/embed.js'></script>
      </a>,
    ];
  } else if (chatConfig.EMBED_IMAGES && Whitelist.isImage(text) && Whitelist.ok(text)) { // Image link (whitelisted)
    return [
      <a key={keygen()} className='chat-line-message' target='_blank' href={href}>
        <img className='chat-line-image' onLoad={triggerAutoScroll} src={text} title={text}/>
      </a>,
    ];
  } 

  // all other links
  return [<a key={keygen()} className='chat-line-message' target='_blank' href={href}>{text}</a>];
}

function createRegExp() : RegExp {
  return URLRegExp.create();
}

export default {
  fromText,
  createRegExp,
};
