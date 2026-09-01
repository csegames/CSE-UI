/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export function getServerTimeMS(serverTimeDeltaMS: number): number {
  return Date.now() + serverTimeDeltaMS;
}

export function getServerDate(serverTimeDeltaMS: number): Date {
  return new Date(getServerTimeMS(serverTimeDeltaMS));
}

export function convertServerTimeToLocalTime(serverTimeMS: number, serverTimeDeltaMS: number): number {
  return serverTimeMS - serverTimeDeltaMS;
}

export function convertLocalTimeToServerTime(localTimeMS: number, serverTimeDeltaMS: number): number {
  return localTimeMS + serverTimeDeltaMS;
}

const zeroPad = (num: number, places: number) => String(num).padStart(places, '0');

export function formatDuration(totalSeconds: number, alwaysShowHours?: boolean): string {
  // Make sure we're dealing with integer seconds, else the seconds display will be weird.
  totalSeconds = Math.floor(totalSeconds);

  const hours = zeroPad(Math.floor(totalSeconds / 3600), alwaysShowHours ? 2 : 1);
  const minutes = zeroPad(Math.floor(totalSeconds / 60) % 60, 2);
  const seconds = zeroPad(Math.floor(totalSeconds) % 60, 2);
  if (totalSeconds >= 3600 || alwaysShowHours) {
    return `${hours}:${minutes}:${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

/**
 *
 * @param timeString String in "hh:mm:ss" format.
 * @returns Duration of the indicated time in milliseconds.
 */
export function timeStringToMs(timeString: string): number {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);

  return hours * 3600000 + minutes * 60000 + seconds * 1000;
}
