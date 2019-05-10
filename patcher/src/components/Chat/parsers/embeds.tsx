/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { OptionsState } from '../state/optionsState';
import { Parser } from './parseText';
import { createUrlRegExp } from './urlRegExp';

function fixupLink(url: string): string {
  if (!url.match(/^http[s]?:\/\/.+/)) {
    return 'http://' + url;
  }
  return url;
}

function triggerAutoScroll() {
  const event = new Event('auto-scroll');
  window.dispatchEvent(event);
}

function isWhitelisted(text: string, whitelist: RegExp[]) {
  const re: RegExp = /http[s]*:\/\/([^/]*)/;
  let i: number;
  let match: RegExpExecArray = re.exec(text);
  if (match) {
    for (i = 0; i < whitelist.length; i++) {
      if (whitelist[i].exec(match[1])) {
        return true;
      }
    }
  }
}

function isImage(text: string) {
  return text.split('?')[0].match(/\.jpg$|\.jpeg$|\.png$/);
}

function isGif(text: string) {
  return text.split('?')[0].match(/\.gif$/);
}

function isVideo(text: string) {
  let youtubeURL: RegExpMatchArray = text.match(/^http[s]?:\/\/(?:www\.)?youtu(?:be\.com|\.be)\//);
  let vimeoURL: RegExpMatchArray = text.match(/^http[s]?:\/\/(?:www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
  let twitchURL: RegExpMatchArray = text.match(/^http[s]?:\/\/(?:www\.)?twitch\.tv\//);
  if (youtubeURL) {
    let youtubeMatch: RegExpMatchArray = text.match(/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/);
    if (youtubeMatch) {
      return "https://www.youtube.com/embed/" + youtubeMatch[1];
    }
  } else if (vimeoURL) {
    return "https://player.vimeo.com/video/" + vimeoURL[1];
  } else if (twitchURL) {
    let twitchMatch: RegExpMatchArray = text.match(/^.*twitch\.tv\/(\w+)\/?(?:v\/([0-9]+))?$/);
    if (twitchMatch && twitchMatch[2]) {
      return "http://player.twitch.tv/?video=v" + twitchMatch[2] + "&!autoplay";
    } else if (twitchMatch) {
      return "http://player.twitch.tv/?channel=" + twitchMatch[1] + "&!autoplay";
    }
  }
}

export function parseEmbeds(text: string, opts: OptionsState, next: Parser): [string, JSX.Element] {
  const regex = createUrlRegExp();
  const match = regex.exec(text);
  if (!match) {
    return [text, null];
  }

  const url = fixupLink(match[0]);
  const before = text.substr(0, match.index);
  const after = text.substr(match.index).replace(url, '');

  const video = isVideo(url);
  const whitelisted = isWhitelisted(url, opts.parsing.embed._urlWhitelistRegExp);
  
  if (isImage(url)) {
    if (!opts.parsing.embed.image || !whitelisted) {
      return [text, null];
    }
    return [
      before,
      (
        <>
          <a key={genID()} target='_blank' href={url}>{url}</a>
          {next(after, opts, next)}
          <a key={genID()} target='_blank' href={url}>
            <img onLoad={triggerAutoScroll} src={url} title={url}/>
          </a>
        </>
      )
    ];
  } else if (isGif(url)) {
    if (!opts.parsing.embed.gif) {
      return [text, null];
    }
    return [
      before,
      (
        <>
          <a key={genID()} target='_blank' href={url}>{url}</a>
          {next(after, opts, next)}
          <a key={genID()} target='_blank' href={url}>
            <img onLoad={triggerAutoScroll} src={url} title={url}/>
          </a>
        </>
      )
    ];
  } else if (video) {
    if (!opts.parsing.embed.video) {
      return [text, null];
    }
    return [
      before,
      (
        <>
          <a key={genID()} target='_blank' href={url}>{url}</a>
          {next(after, opts, next)}
          <a key={genID()} className='chat-line-message' target='_blank' href={url}>
            <iframe className='chat-line-video' src={video} allowFullScreen></iframe>
          </a>
        </>
      )
    ];
  } else if (!opts.parsing.embed.links && whitelisted) {
    return [
      before,
      (
        <>
          <a key={genID()} target='_blank' href={url}>{url}</a>
          {next(after, opts, next)}
        </>
      )
    ];
  }
  return [text, null];
}
