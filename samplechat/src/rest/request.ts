import { store } from '../redux/store';

export type HttpMethod = string;
export type RequestConfig = () => {
  url: string;
  headers: Record<string, string>;
};

export interface RequestResult {
  ok: boolean;
  status: number;
  statusText: string;
  data: string;
  json: <T>() => T | null;
  headers: Record<string, string>;
}

function buildParamString(params: Record<string, any>) {
  return Object.keys(params)
    .map((k) => {
      const stringParam = typeof params[k] !== 'string' ? JSON.stringify(params[k]) : params[k];
      return encodeURIComponent(k) + '=' + encodeURIComponent(stringParam);
    })
    .join('&');
}

function appendParams(url: string, params: Record<string, any>) {
  const queryString = buildParamString(params);
  if (queryString) {
    return url + (url.indexOf('?') === -1 ? '?' : '&') + queryString;
  }
  return url;
}

function parseHeaders(xhr: XMLHttpRequest): Record<string, string> {
  const headers: Record<string, string> = {};
  const raw = xhr
    .getAllResponseHeaders()
    .trim()
    .split(/[\r\n]+/);
  for (const header of raw) {
    const parts = header.split(': ');
    const firstPart = parts.shift();
    if (firstPart) {
      headers[firstPart] = parts.join(': ');
    }
  }
  return headers;
}

export function request(
  method: HttpMethod,
  url: string,
  headers: Record<string, string>,
  queryParams: Record<string, any>,
  body: any | null
): Promise<RequestResult> {
  return new Promise<RequestResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, appendParams(url, queryParams));

    Object.keys(headers).forEach((key) => xhr.setRequestHeader(key, headers[key] as string));

    xhr.onload = (evt) =>
      resolve({
        ok: xhr.status >= 200 && xhr.status < 300,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr),
        data: xhr.responseText,
        json: <T>() => JSON.parse(xhr.responseText) as T
      });

    xhr.onerror = (evt) => {
      resolve({
        ok: false,
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr),
        data: 'Request failed',
        json: <T>() => null
      });
    };

    if (method !== 'get' && body) {
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(body));
    } else {
      xhr.send();
    }
  });
}

export const requestConfig = (host: string): RequestConfig => {
  return () => {
    const headers: Record<string, string> = {};
    const { credentials } = store.getState().auth;
    if (credentials) {
      headers['Authorization'] = `Bearer ${credentials.accessToken}`;
    }
    return {
      headers,
      url: `${host}/`
    };
  };
};
