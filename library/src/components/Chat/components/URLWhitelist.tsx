/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// tslint:disable
const whitelist = [
 	/twimg.com$/,
 	/fbcdn.net$/,
 	/imgur.com$/,
 	/trillian.im$/,
 	/imageshack.com$/,
 	/postimage.org$/,
 	/staticflickr.com$/,
 	/tinypic.com$/,
 	/photobucket.com$/,
 	/cdninstagram.com$/,
 	/deviantart.net$/,
 	/imagebam.com$/,
 	/dropboxusercontent.com$/,
 	/whicdn.com$/,
 	/smugmug.com$/,
  /s3.amazonaws.com$/,
  /camelotunchained.com$/,
  /citystateentertainment.com$/
];

function ok(text: string) {
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
	return text.split('?')[0].match(/\.jpg$|\.jpeg$|\.png$|\.gif$/);
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

function isVine(text: string) {
	let vineURL: RegExpMatchArray = text.match(/^http[s]?:\/\/(?:www\.)?vine\.co\/v\/([A-Za-z0-9]+)$/);
	if (vineURL) {
		return "https://vine.co/v/" + vineURL[1] + "/embed/simple";
	}
}

export default {
	ok,
	isImage,
	isVideo,
	isVine,
};
