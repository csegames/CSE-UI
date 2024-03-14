/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export type AlertMessageVar = { key: string; value: string };
export type AlertMessageFormatterFunc = (value: any) => string;
export type AlertMessageFormatters = { [key: string]: AlertMessageFormatterFunc };

// clamps a numeric value to the specified range
function clamp(val: number, min: number, max: number): number {
  if (val < min) return min;
  if (val > max) return max;
  return val;
}

// Formats a duration in seconds like "1day 10hrs 18min".
// Clamps inputs to the range 0 seconds -> 1 year.
export function formatTimeDeltaForAlertMessage(totalSeconds: number): string {
  if (totalSeconds < 0) {
    // just show 0 for negative time deltas
    return '&lt; 0min';
  } else if (totalSeconds > 60 * 60 * 24 * 365) {
    // no need to support time deltas greater than a year
    return '&gt; 1year';
  }

  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  totalSeconds -= days * (60 * 60 * 24);
  const hours = clamp(Math.floor(totalSeconds / (60 * 60)), 0, 24);
  totalSeconds -= hours * (60 * 60);
  const minutes = clamp(Math.round(totalSeconds / 60), 0, 59);

  let parts = [];
  if (days > 0) {
    parts.push(days + (days == 1 ? 'day' : 'days'));
  }
  if (days > 0 || hours > 0) {
    parts.push(hours + (hours == 1 ? 'hr' : 'hrs'));
  }
  parts.push(minutes + 'min');
  return parts.join(' ');
}

// formats a js Date object like "Thursday 11/5 at 12:43 PM"
export function formatDateForAlertMessage(date: Date): string {
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
  const month = date.getMonth() + 1; // month is 0-indexed
  const dayOfMonth = date.getDate();
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${dayOfWeek} ${month}/${dayOfMonth} at ${timeStr}`;
}

// Defines the default formatters, used in alert messages with the syntax "some text {var_name:formatter} some text".
// If the formatter string is in this object, the function will be called on the variable's contents.
// If no such variable exists but the formatter is valid, the formatter will be called with data === null
// so that it can handle default/error cases cleanly.
const defaultFormatters: AlertMessageFormatters = {
  '': (data: string) => {
    // default case - no formatter specified
    return data;
  },

  show: (data: string) => {
    // show the timestamp directly
    if (data) {
      const ts = parseInt(data);
      if (!isNaN(ts)) {
        return formatDateForAlertMessage(new Date(ts * 1000));
      }
    }

    return '';
  },

  countdown: (data: string) => {
    if (data) {
      // treat as future or past timestamp and show the difference between then and now
      const ts = parseInt(data);
      if (!isNaN(ts)) {
        const now: Date = new Date();
        const date: Date = new Date(ts * 1000);
        const timeDeltaSeconds = (date.getTime() - now.getTime()) / 1000;
        if (Math.round(timeDeltaSeconds) == 0) {
          return 'now';
        } else if (timeDeltaSeconds > 0) {
          // timestamp is in the future
          return formatTimeDeltaForAlertMessage(timeDeltaSeconds);
        } else {
          // timestamp is in the past
          return formatTimeDeltaForAlertMessage(0);
          //return formatTimeDeltaForAlertMessage(-timeDeltaSeconds);
        }
      }
    }

    return '';
  }
};

interface TokenizerResult {
  tokens: string[];
  error: string | null;
}

// tokenize an alert message, splitting on any tokens surrounded by curly braces.
// returns { tokens: [], error: errorMessage }. error will be null on success.
function tokenize(msg: string): TokenizerResult {
  let tokens = [''];
  let braceDepth = 0;

  let i = 0;
  for (const ch of msg) {
    if (ch == '{') {
      if (braceDepth == 0) {
        tokens.push('');
      }
      braceDepth += 1;
    }

    tokens[tokens.length - 1] += ch;

    if (ch == '}') {
      if (braceDepth == 0) {
        return { tokens: tokens, error: `unexpected '}' character near '${msg.substring(0, i + 1)}'` };
      }

      braceDepth -= 1;
      if (braceDepth == 0) {
        tokens.push('');
      }
    }

    i += 1;
  }

  if (braceDepth != 0) {
    return { tokens: tokens, error: `unmatched '{' character in '${msg}'` };
  }

  // remove any empty strings or empty tokens
  tokens = tokens.filter((a) => {
    return a !== '' && a !== '{}';
  });

  return { tokens: tokens, error: null };
}

interface ParserResult {
  result: string;
  errors: string[];
}

function parse(tokens: string[], vars: AlertMessageVar[], formatterFuncs: AlertMessageFormatters): ParserResult {
  let parsedResult: string[] = [];
  let errors: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    let tok: string = tokens[i];
    if (tok.length >= 3 && tok[0] == '{' && tok[tok.length - 1] == '}') {
      // remove braces, then trim any whitespace
      tok = tok.substring(1, tok.length - 1).trim();

      // find the formatter component (":whatever" suffix) if any
      let formatterName = '';
      const formatterIdx = tok.indexOf(':');
      if (formatterIdx >= 0 && formatterIdx < tok.length) {
        formatterName = tok.substring(formatterIdx + 1, tok.length).trim();
      }

      let varValue = null;

      const varName = formatterIdx < 0 ? tok : tok.substring(0, formatterIdx).trim();
      for (const varData of vars) {
        if (varData.key == varName) {
          varValue = varData.value;
          break;
        }
      }

      if (varValue !== null) {
        let formatterFn: AlertMessageFormatterFunc = (data: any): string => {
          return '' + data;
        };
        if (formatterName in formatterFuncs) {
          formatterFn = formatterFuncs[formatterName];
        } else {
          errors.push('unknown formatter ' + formatterName);
        }

        parsedResult.push(formatterFn(varValue));
      } else {
        errors.push('unknown var name ' + varName);
        parsedResult.push('');
      }
    } else {
      // token must just be a text fragment
      parsedResult.push(tok);
    }
  }

  return { result: parsedResult.join(''), errors: errors };
}

export function parseAlertMessage(
  inputMessage: string,
  inputVars: AlertMessageVar[],
  customFormatters: AlertMessageFormatters = null
): string {
  let formatterFuncs: AlertMessageFormatters = {};
  for (let key in defaultFormatters) {
    formatterFuncs[key] = defaultFormatters[key];
  }

  // add custom formatters to the formatters object
  if (customFormatters) {
    for (let key in customFormatters) {
      formatterFuncs[key] = customFormatters[key];
    }
  }

  const tokens = tokenize(inputMessage);
  if (tokens.error || !tokens.tokens) {
    console.error(`parseAlertMessage failed to tokenize alert message '${inputMessage}': ${tokens.error}`);
    return '';
  }

  const result = parse(tokens.tokens, inputVars, formatterFuncs);
  for (let err of result.errors) {
    console.warn(`Error parsing alert message '${inputMessage}': ${err}`);
  }

  return result.result;
}
