/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

// This function will capitalize the beginning of each word and put a space between them.
// Ex.) forearmLeft -> Forearm Left
export function toTitleCase(obj: any): string {
  return obj
    .toString()
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str: string) => {
      return str.toUpperCase();
    });
}

export function toSentenceCase(obj: any): string {
  return obj
    .toString()
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .replace(/^./, (str: string) => {
      return str.toUpperCase();
    });
}

export function addCommasToNumber(num: number | string): string {
  const asString = typeof num === 'string' ? num : num.toString();

  return asString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Formats a number in seconds as a string in the form "HH:MM:SS", with leading zeroes on all three fields if needed
export function formatDurationSeconds(seconds: number): string {
  if (seconds < 0) {
    seconds = 0;
  }

  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  // helper for zero-padding single-digit numbers
  let zpad = (s: number): string => {
    return s >= 0 && s < 10 ? '0' + Math.floor(s) : '' + Math.floor(s);
  };

  return hours > 0 ? zpad(hours) + ':' + zpad(minutes) + ':' + zpad(seconds) : zpad(minutes) + ':' + zpad(seconds);
}

export function randomString(length: number): string {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function filterDirtyWords(text: string): string {
  return text.replace(
    /14 *88|\(\(\( *[a-zA-Z0-9]+ *\)\)\)|[a4][b8][e3][e3]d|[a4][b8][i!1]d|[a4]d[o0][l1]f|[a4][sz5][sz5] *h[o0][l1][e3]|[a4]u[sz5]chw[i!1][t7][z2]|[a4]u[t7][i!1][sz5][t7]|[a4]u[t7][i!1][sz5][t7][i!1]c|[a4]u[t7][t7][i!1][e3]|[b8][e3]+[a4]?n[e3]r|[b8][o0][l1][l1]uck[sz5]|[b8]uch[e3]nw[a4][l1]d|[b8]u[s5][s5]y|c[a4]m[e3][l1] *j[o0]ck[e3]y|c[a4]rp[e3][t7] *[b8][a4][g69][g69][e3]r|ch[i!1]n[a4] *m[a4]n|chr[i!1][sz5][t7] *k[i!1][l1][l1][e3]r|c[o0]ck|c[o0]mm[i!1][e3]|c[o0]mm[i!1][t7] *[sz5]u[i!1]c[i!1]d[e3]|c[o0][t7][t7][o0]n *p[i!1]ck[e3]r|cr[a4]ck[a4]|cuck|cun[t7]|d[a4]ch[a4]u|d[a4][g69][o0]|d[a4]rk[i!1][e3]|d[e3][g69][e3]n[e3]r[a4][t7][e3]|d[i!1]ndu *nuff[i!1]n|d[i!1][sz5]h *w[a4][sz5]h[e3]r|[e3][i!1]n[sz5][a4][t7][sz5][g69]rupp[e3]n|f[a@4]+[g69]+|f[a4][t7] *[a4][sz5][sz5]|f[a4][t7][t7][i!1][e3]|f[i!1][e3][l1]d *[sz5][l1][a4]v[e3]|fu[ck]{2,}|fud[g69][e3] *p[a4]ck[e3]r|[g69][l1][o0]w[i!1][e3]|[g69][o0][e3][b8][b8][e3][l1][sz5]|[g69][o0][l1][l1][i!1]w[o0][g69]|[g69][o0]{2,}k|[g69][o0]r[i!1]n[g69]|[g69]r[o0][o0]m[e3]r|[g69]u[sz5][a4]n[o0]|h[a4]d?j+[i!1]|h[a4]k[e3]nkr[e3]u[z2]|h[i!1]mm[l1][e3]r|h[i!1][t7][l1][e3]r|h[o0][l1][o0]c[a4]u[sz5][t7]|h[o0]m[o0]|h[o0]m[o0][sz5][e3]xu[a4][l1]|h[o0]u[sz5][e3] *[sz5][l1][a4]v[e3]|j[i!1][g69][g69][e3]r|j[i!1]h[a4]d[i!1]|jun[g69][l1][e3] *[b8]unny|k[a4]f+[i!1]r|k[a4]p[o0]|k[i!1y]k[e3]|k[i!1][l1][l1] *y[o0]ur[sz5][e3][l1]f|k[i!1][t7]ch[e3]n *wh[o0]r[e3]|ky[s5]|[l1][a4]rd *[a4][sz5][sz5]|[l1][i!1][b8][t7][a4]rd|[l1][i!1]mp *d[i!1]ck|m[e3]n[g69][e3][l1][e3]|m[o0][t7]h[e3]r *fuck[e3]r|n[a4][z2][i!1]|n[e3]ck *y[o0]ur[sz5][e3][l1]f|n[i!1][g69] n[o0][g69]|n[1i!]+[g69]+[e3a4uo0]+[rh]*|n[1i!]+[g69]{2,}r[e3]|n[i!1]+[g69]+[l1][e3][t7]|num[b8] *d[i!1][g69][g69][e3]r|p[a4]k[i!1]+|p[e3]ck[e3]rw[o0][o0]d|p[i!1]ck[a4]n[i!1]nny|p[o0][l1]+[a4o0][ck]+|p[o0]rch *m[o0]nk[e3]y|pu[sz5][sz5]y|qu[i!1]m|r[a4][g69] *h[e3][a4]d|r[a4]p[e3]|r[e3]d[sz5]k[i!1]n|r[o0]mm[e3][l1]|[sz5][a4]m[b8][o0]|[sz5]chu[t7][z2][sz5][t7][a4]ff[e3][l1]|[sz5]h[e3]m[a4][l1][e3]|[sz5]h[i!1][t7] *h[e3][a4]d|[sz5]hv[a4]r[t7][z2][e3]|[sz5]hy[l1][o0]ck|[sz5][l1][a4]n[t7] *[e3]y[e3]|[sz5][l1]u[t7]|[sz5]p[a4][z2]|[sz5]p[e3][a4]r *chuck[e3]r|[sz5]p[e3][e3]r|[sz5]p[e3]r[g69]|[sz5]p[i!1]ck|[sz5]p[i!1][g69]|[sz5]qu[a4]w|[sz5][t7][a4][l1][i!1]n|[sz5]w[a4][sz5][t7][i!1]k[a4]|[t7][a4]r *[b8][a4][b8]y|[t7][i!1][t7][sz5]|[t7][o0]w[e3][l1] *h[e3][a4]d|[t7]r[a4]n{2,}(y|ie)|[t7]r[o0]{2,}n+|[t7]w[a4][t7]|unc[l1][e3] *[t7][o0]m|un[t7][e3]rm[e3]n[sz5]ch|w[a4]ff[e3]n|w[a4]ff[e3]n *[sz5][sz5]|w[a4][g69][o0]n *[b8]urn[e3]r|w[e3][l1]f[a4]r[e3] *qu[e3][e3]n|w[e3][t7][b8][a4]ck|wh[o0]r[e3]|w[i!1][g69][g69][e3]r|w[o0][g69]|[z2]hyd|[z2][i!1][o0]n[i!1][sz5]m|[z2][i!1][o0]n[i!1][sz5][t7]/gi,
    '*****'
  );
}
